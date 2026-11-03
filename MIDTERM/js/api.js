(function (ATLAnac) {
  'use strict';

  const { splitEntries } = ATLAnac.lists;

  const API_BASE = 'https://last-airbender-api.fly.dev/api/v1/characters';
  const LIST_CACHE_KEY = 'atlanac:characters:v1';
  const DETAIL_CACHE_PREFIX = 'atlanac:character:v1:';
  const REQUEST_TIMEOUT_MS = 20000;

  const NATIONS = [
    { key: 'water', label: 'Water Tribe', patterns: ['water tribe'] },
    { key: 'earth', label: 'Earth Kingdom', patterns: ['earth kingdom'] },
    { key: 'fire', label: 'Fire Nation', patterns: ['fire nation'] },
    { key: 'air', label: 'Air Nomads', patterns: ['air nomad', 'air nation'] },
  ];

  const FILTERS = [
    { key: 'all', label: 'All Characters' },
    ...NATIONS.map(({ key, label }) => ({ key, label })),
    { key: 'team-avatar', label: 'Team Avatar' },
    { key: 'other', label: 'Other Affiliations' },
  ];

  class ApiError extends Error {
    constructor(message, { notFound = false } = {}) {
      super(message);
      this.name = 'ApiError';
      this.notFound = notFound;
    }
  }

  async function requestJson(url, timeout = REQUEST_TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new ApiError(`The archive responded with status ${response.status}.`);
      }
      const body = await response.text();
      return body ? JSON.parse(body) : null;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error.name === 'AbortError') {
        throw new ApiError('The archive took too long to respond.');
      }
      throw new ApiError('The archive could not be reached. Check your connection and try again.');
    } finally {
      clearTimeout(timer);
    }
  }

  function readCache(key) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeCache(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  }

  function cleanText(value) {
    if (typeof value !== 'string') return '';
    const text = value
      .replace(/\[\d+\]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[,;:]+$/, '');
    return /^["'\s—-]*$/.test(text) ? '' : text;
  }

  function cleanList(values) {
    if (!Array.isArray(values)) return [];
    const seen = new Set();
    return values.map(cleanText).filter((name) => {
      const key = name.toLowerCase();
      if (!name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function titleCase(value) {
    const minorWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'nor', 'of', 'on', 'or', 'over', 'the', 'to', 'with']);
    const words = cleanText(value).split(' ');
    return words.map((word, index) => {
      if (/^(?:[A-Z]{2,}|[IVXLCDM]+)$/.test(word)) return word;
      const lower = word.toLowerCase();
      if (index > 0 && index < words.length - 1 && minorWords.has(lower)) return lower;
      return lower.replace(/(^|[-/])([\p{L}])/gu, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
    }).join(' ');
  }

  function titleCaseList(values) {
    return values.map(titleCase);
  }

  function cleanUrl(value) {
    return typeof value === 'string' && /^https?:\/\//i.test(value.trim()) ? value.trim() : '';
  }

  function getNationKeys(affiliation) {
    const text = (affiliation || '').toLowerCase();
    return NATIONS.filter((nation) => nation.patterns.some((p) => text.includes(p))).map((n) => n.key);
  }

  function isTeamAvatar(affiliation) {
    return (affiliation || '').toLowerCase().includes('team avatar');
  }

  function getTheme(nations) {
    return nations.length === 1 ? nations[0] : 'neutral';
  }

  async function addMissingPortraits(characters) {
    const missing = characters.filter((character) => !character.photoUrl);
    if (!missing.length) return characters;

    try {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        formatversion: '2',
        origin: '*',
        redirects: '1',
        prop: 'pageimages',
        piprop: 'thumbnail',
        pithumbsize: '600',
        titles: [...new Set(missing.map((character) => character.sourceName))].join('|'),
      });
      const data = await requestJson(`https://avatar.fandom.com/api.php?${params}`, 5000);
      const portraits = new Map(
        (data?.query?.pages || [])
          .filter((page) => page.thumbnail?.source)
          .map((page) => [normalizeName(page.title), cleanUrl(page.thumbnail.source)]),
      );
      return characters.map((character) => character.photoUrl
        ? character
        : { ...character, photoUrl: portraits.get(normalizeName(character.sourceName)) || '' });
    } catch {
      return characters;
    }
  }

  function normalizeCharacter(raw) {
    const affiliation = cleanText(raw.affiliation);
    const nations = getNationKeys(affiliation);
    return {
      id: String(raw._id),
      sourceName: cleanText(raw.name),
      name: titleCase(raw.name) || 'Unnamed Character',
      photoUrl: cleanUrl(raw.photoUrl),
      affiliation,
      allies: titleCaseList(cleanList(raw.allies)),
      enemies: titleCaseList(cleanList(raw.enemies)),
      affiliations: titleCaseList(splitEntries(affiliation, 'groups')),
      professions: titleCaseList(splitEntries(cleanText(raw.profession))),
      weapons: titleCaseList(splitEntries(cleanText(raw.weapon))),
      positions: titleCaseList(splitEntries(cleanText(raw.position))),
      nations,
      teamAvatar: isTeamAvatar(affiliation),
      theme: getTheme(nations),
    };
  }

  let listPromise = null;
  const detailPromises = new Map();
  function fetchAllCharacters({ force = false } = {}) {
    if (force) listPromise = null;
    if (listPromise) return listPromise;

    const cached = force ? null : readCache(LIST_CACHE_KEY);
    if (Array.isArray(cached) && cached.length) {
      listPromise = addMissingPortraits(cached.map(normalizeCharacter));
      return listPromise;
    }

    listPromise = requestJson(`${API_BASE}?perPage=1000`)
      .then((data) => {
        if (!Array.isArray(data)) throw new ApiError('The archive returned an unexpected response.');
        const records = data.filter((item) => item && item._id);
        writeCache(LIST_CACHE_KEY, records);
        return addMissingPortraits(records.map(normalizeCharacter));
      })
      .catch((error) => {
        listPromise = null;
        throw error;
      });
    return listPromise;
  }

  function fetchCharacterById(id, { force = false } = {}) {
    if (!id) return Promise.reject(new ApiError('No character was selected.', { notFound: true }));
    if (!/^[a-f0-9]{24}$/i.test(id)) {
      return Promise.reject(new ApiError('This character record does not exist in the archive.', { notFound: true }));
    }
    if (force) detailPromises.delete(id);
    if (detailPromises.has(id)) return detailPromises.get(id);

    const cacheKey = DETAIL_CACHE_PREFIX + id;
    const cached = force ? null : readCache(cacheKey);
    if (cached && cached._id) {
      const promise = addMissingPortraits([normalizeCharacter(cached)]).then(([character]) => character);
      detailPromises.set(id, promise);
      return promise;
    }

    const promise = requestJson(`${API_BASE}/${encodeURIComponent(id)}`)
      .then((data) => {
        if (!data || !data._id) {
          throw new ApiError('This character record does not exist in the archive.', { notFound: true });
        }
        writeCache(cacheKey, data);
        return addMissingPortraits([normalizeCharacter(data)]).then(([character]) => character);
      })
      .catch((error) => {
        detailPromises.delete(id);
        throw error;
      });
    detailPromises.set(id, promise);
    return promise;
  }

  function matchesFilter(character, filterKey) {
    switch (filterKey) {
      case 'all':
        return true;
      case 'team-avatar':
        return character.teamAvatar;
      case 'other':
        return character.nations.length === 0 && !character.teamAvatar;
      default:
        return character.nations.includes(filterKey);
    }
  }

  function matchesSearch(character, query) {
    const term = query.trim().toLowerCase();
    return !term || character.name.toLowerCase().includes(term);
  }

  function getNation(key) {
    return NATIONS.find((nation) => nation.key === key) || null;
  }

  const normalizeName = (name) => name.toLowerCase().replace(/\s+/g, ' ').trim();

  const AMBIGUOUS_WORDS = new Set([
    'the', 'his', 'her', 'their', 'general', 'aunt', 'uncle', 'mayor', 'lord', 'lady', 'king',
    'queen', 'prince', 'princess', 'captain', 'commander', 'admiral', 'master', 'chief', 'colonel',
    'lieutenant', 'sergeant', 'warden', 'governor', 'earth', 'fire', 'water', 'air',
  ]);

  function findCharacterByName(name, characters) {
    const target = normalizeName(name);
    const exact = characters.find((c) => normalizeName(c.name) === target);
    if (exact) return exact;
    if (target.length < 3 || AMBIGUOUS_WORDS.has(target)) return null;

    const prefixed = characters.filter((c) => {
      const candidate = normalizeName(c.name);
      return candidate.startsWith(`${target} `);
    });
    return prefixed.length === 1 ? prefixed[0] : null;
  }

  function resolveRelations(names, characters) {
    return names.map((name) => ({ name, character: findCharacterByName(name, characters) }));
  }

  ATLAnac.api = {
    NATIONS,
    FILTERS,
    ApiError,
    cleanText,
    getNationKeys,
    fetchAllCharacters,
    fetchCharacterById,
    matchesFilter,
    matchesSearch,
    getNation,
    resolveRelations,
  };
})((window.ATLAnac = window.ATLAnac || {}));
