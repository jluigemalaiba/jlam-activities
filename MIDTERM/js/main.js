(function (ATLAnac) {
  'use strict';

  const { FILTERS, NATIONS, fetchAllCharacters, fetchCharacterById, matchesFilter, matchesSearch } = ATLAnac.api;
  const { applyMotionPreference, emblemHtml, emptyHtml, errorHtml, escapeHtml, inlineEntriesHtml, installImageFallback, loadingHtml, portraitHtml, primaryAffiliationLabel, viewUrl } = ATLAnac.ui;

  const PER_PAGE = 12;
  const SEARCH_DEBOUNCE_MS = 220;
  const LIST_STATE_KEY = 'atlanac:listState';

  const NATION_LORE = {
    water: 'Healers and warriors of the poles, bending the push and pull of the tides.',
    earth: 'A vast, enduring kingdom whose people stand firm like the stone they shape.',
    fire: 'A proud nation of ambition and inner flame, born of the sun warriors.',
    air: 'Peaceful monks of the temples, free as the wind that carries them.',
  };

  const state = {
    characters: [],
    query: '',
    filter: 'all',
    page: 1,
    renderToken: 0,
  };

  const el = {
    searchForm: document.getElementById('searchForm'),
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    filterChips: document.getElementById('filterChips'),
    list: document.getElementById('characterList'),
    scrollBody: document.getElementById('scrollBody'),
    pagination: document.getElementById('pagination'),
    resultSummary: document.getElementById('resultSummary'),
    pageSummary: document.getElementById('pageSummary'),
    nationCards: document.getElementById('nationCards'),
    collection: document.getElementById('characters'),
  };

  function readStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('nation');
    state.query = (params.get('q') || '').slice(0, 60);
    state.filter = FILTERS.some((f) => f.key === filter) ? filter : 'all';
    state.page = Math.max(1, parseInt(params.get('page'), 10) || 1);
  }

  function writeStateToUrl() {
    const params = new URLSearchParams();
    if (state.query) params.set('q', state.query);
    if (state.filter !== 'all') params.set('nation', state.filter);
    if (state.page > 1) params.set('page', String(state.page));
    const search = params.toString() ? `?${params}` : '';
    history.replaceState(null, '', `${window.location.pathname}${search}${window.location.hash}`);
    sessionStorage.setItem(LIST_STATE_KEY, search);
  }

  function getVisibleCharacters() {
    return state.characters.filter((c) => matchesFilter(c, state.filter) && matchesSearch(c, state.query));
  }

  function countByFilter(characters) {
    return Object.fromEntries(FILTERS.map((f) => [f.key, characters.filter((c) => matchesFilter(c, f.key)).length]));
  }

  function filterIconHtml(key) {
    if (NATIONS.some((n) => n.key === key)) return emblemHtml(key, 'emblem-chip');
    if (key === 'team-avatar') return emblemHtml('four', 'emblem-chip');
    const icon = key === 'all' ? 'bi-journal-bookmark-fill' : 'bi-compass';
    return `<i class="bi ${icon}" aria-hidden="true"></i>`;
  }

  function renderFilterChips() {
    const pool = state.characters.filter((c) => matchesSearch(c, state.query));
    const counts = countByFilter(pool);
    el.filterChips.innerHTML = FILTERS.map((filter) => {
      const active = filter.key === state.filter;
      return `
        <button type="button" class="filter-tile${active ? ' active' : ''}" role="radio"
          aria-checked="${active}" data-filter="${filter.key}">
          <span class="filter-tile-top">
            <span class="filter-tile-icon">${filterIconHtml(filter.key)}</span>
            <span class="filter-tile-count">${counts[filter.key]}</span>
          </span>
          <span class="filter-tile-label">${escapeHtml(filter.label)}</span>
        </button>`;
    }).join('');
  }

  function metaRowHtml({ icon, entries, label }) {
    const title = entries.length ? ` title="${escapeHtml(entries.join(' • '))}"` : '';
    return `
      <span class="record-meta"${title}>
        <i class="bi ${icon}" aria-hidden="true"></i><span class="visually-hidden">${label}: </span>${
          entries.length ? inlineEntriesHtml(entries) : '<span class="entry-inline">Affiliation not recorded</span>'
        }
      </span>`;
  }

  function characterCardHtml(character) {
    const seal = character.theme === 'neutral' ? 'four' : character.theme;
    return `
      <li class="col-12 col-xl-6">
        <a class="record record-${character.theme}" href="${viewUrl(character.id)}"
          aria-label="View details for ${escapeHtml(character.name)}">
          <span class="record-portrait">${portraitHtml(character, { width: 200 })}</span>
          <span class="record-body">
            <span class="record-label">${escapeHtml(primaryAffiliationLabel(character))}</span>
            <span class="record-name">${escapeHtml(character.name)}</span>
            ${metaRowHtml({ icon: 'bi-flag', label: 'Affiliation', entries: character.affiliations })}
            <span class="record-meta record-profession is-loading" data-profession="${escapeHtml(character.id)}">
              <i class="bi bi-briefcase" aria-hidden="true"></i><span class="entry-inline">Consulting the archive&hellip;</span>
            </span>
            <span class="record-cta">View details <i class="bi bi-arrow-right" aria-hidden="true"></i></span>
          </span>
          <span class="record-seal d-none d-sm-inline-block" aria-hidden="true">${emblemHtml(seal)}</span>
        </a>
      </li>`;
  }

  function renderSummary(total, totalPages) {
    const scope = FILTERS.find((f) => f.key === state.filter).label;
    const query = state.query ? ` matching &ldquo;${escapeHtml(state.query)}&rdquo;` : '';
    const noun = total === 1 ? 'record' : 'records';
    el.resultSummary.innerHTML = `<strong>${total}</strong> ${noun} in <em>${escapeHtml(scope)}</em>${query}`;
    el.pageSummary.textContent = total ? `Page ${state.page} of ${totalPages}` : '';
  }

  function renderList() {
    const visible = getVisibleCharacters();
    const totalPages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
    state.page = Math.min(state.page, totalPages);

    const start = (state.page - 1) * PER_PAGE;
    const pageItems = visible.slice(start, start + PER_PAGE);

    renderSummary(visible.length, totalPages);
    renderFilterChips();

    if (!pageItems.length) {
      el.list.innerHTML = emptyHtml(
        'No matching characters found',
        'Try another name or choose a different affiliation.',
      );
    } else {
      el.list.innerHTML = `<ul class="row g-3 list-unstyled mb-0">${pageItems.map(characterCardHtml).join('')}</ul>`;
    }

    renderPagination(visible.length ? totalPages : 0);
    writeStateToUrl();
    hydrateProfessions(pageItems, ++state.renderToken);
  }

  function getPageNumbers(current, total) {
    const pages = new Set([1, total, current - 1, current, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    return sorted.flatMap((page, i) => (i > 0 && page - sorted[i - 1] > 1 ? ['gap', page] : [page]));
  }

  function pageItemHtml({ label, page, disabled = false, active = false, ariaLabel }) {
    const classes = ['page-item', disabled && 'disabled', active && 'active'].filter(Boolean).join(' ');
    return `
      <li class="${classes}">
        <button type="button" class="page-link" data-page="${page}" ${disabled ? 'disabled' : ''}
          ${active ? 'aria-current="page"' : ''} ${ariaLabel ? `aria-label="${ariaLabel}"` : ''}>${label}</button>
      </li>`;
  }

  function renderPagination(totalPages) {
    if (!totalPages) {
      el.pagination.innerHTML = '';
      return;
    }
    const current = state.page;
    const numbers = getPageNumbers(current, totalPages)
      .map((page) =>
        page === 'gap'
          ? '<li class="page-item disabled"><span class="page-link page-gap">&hellip;</span></li>'
          : pageItemHtml({ label: page, page, active: page === current, ariaLabel: `Page ${page}` }),
      )
      .join('');

    el.pagination.innerHTML = [
      pageItemHtml({
        label: '<i class="bi bi-chevron-left" aria-hidden="true"></i><span class="ms-1">Previous</span>',
        page: current - 1,
        disabled: current === 1,
        ariaLabel: 'Previous page',
      }),
      numbers,
      pageItemHtml({
        label: '<span class="me-1">Next</span><i class="bi bi-chevron-right" aria-hidden="true"></i>',
        page: current + 1,
        disabled: current === totalPages,
        ariaLabel: 'Next page',
      }),
    ].join('');
  }

  function hydrateProfessions(characters, token) {
    characters.forEach((character) => {
      fetchCharacterById(character.id)
        .then((detail) => detail.professions)
        .catch(() => [])
        .then((professions) => {
          if (token !== state.renderToken) return;
          const slot = el.list.querySelector(`[data-profession="${CSS.escape(character.id)}"]`);
          if (!slot) return;
          if (!professions.length) {
            slot.remove();
            return;
          }
          slot.outerHTML = metaRowHtml({ icon: 'bi-briefcase', label: 'Profession', entries: professions });
        });
    });
  }

  function renderNationCards() {
    const counts = countByFilter(state.characters);
    el.nationCards.innerHTML = NATIONS.map(
      (nation) => `
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="nation-banner">
            <article class="nation-card nation-card-${nation.key}">
              ${emblemHtml(nation.key, 'emblem-lg')}
              <h3 class="nation-card-title">${escapeHtml(nation.label)}</h3>
              <p class="nation-card-text">${escapeHtml(NATION_LORE[nation.key])}</p>
              <p class="nation-card-count"><strong>${counts[nation.key]}</strong> characters</p>
              <a href="#characters" class="btn btn-seal btn-sm" data-filter-link="${nation.key}">
                Browse ${escapeHtml(nation.label)} <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>
              </a>
            </article>
          </div>
        </div>`,
    ).join('');
  }

  function scrollToCollectionTop() {
    el.scrollBody.scrollTop = 0;
    const top = el.collection.getBoundingClientRect().top;
    if (top < 0) el.collection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setQuery(query) {
    const next = query.trim().slice(0, 60);
    el.clearSearch.classList.toggle('d-none', !query);
    if (next === state.query) return;
    state.query = next;
    state.page = 1;
    renderList();
  }

  function setFilter(filter) {
    if (!FILTERS.some((f) => f.key === filter)) return;
    state.filter = filter;
    state.page = 1;
    renderList();
  }

  function setPage(page) {
    if (!Number.isFinite(page) || page < 1 || page === state.page) return;
    state.page = page;
    renderList();
    scrollToCollectionTop();
  }

  function debounce(fn, wait) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  function bindEvents() {
    const debouncedSearch = debounce(setQuery, SEARCH_DEBOUNCE_MS);

    el.searchInput.addEventListener('input', (event) => {
      el.clearSearch.classList.toggle('d-none', !event.target.value);
      debouncedSearch(event.target.value);
    });

    el.searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      setQuery(el.searchInput.value);
    });

    el.clearSearch.addEventListener('click', () => {
      el.searchInput.value = '';
      setQuery('');
      el.searchInput.focus();
    });

    el.filterChips.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-filter]');
      if (chip) setFilter(chip.dataset.filter);
    });

    el.pagination.addEventListener('click', (event) => {
      const button = event.target.closest('[data-page]');
      if (button && !button.disabled) setPage(parseInt(button.dataset.page, 10));
    });

    document.addEventListener('click', (event) => {
      const link = event.target.closest('[data-filter-link]');
      if (!link) return;
      event.preventDefault();
      setFilter(link.dataset.filterLink);
      el.collection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    el.list.addEventListener('click', (event) => {
      if (event.target.closest('[data-action="retry"]')) loadCharacters({ force: true });
    });

    document.querySelectorAll('#mainNav .nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        const menu = document.getElementById('mainNav');
        if (menu.classList.contains('show')) window.bootstrap?.Collapse.getOrCreateInstance(menu).hide();
      });
    });

    const nav = document.querySelector('.archive-nav');
    const updateNav = () => nav?.classList.toggle('is-scrolled', window.scrollY > 56);
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });

    const footer = document.querySelector('.archive-footer');
    if (footer && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        footer.classList.toggle('is-open', entry.isIntersecting);
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' }).observe(footer);
    } else {
      footer?.classList.add('is-open');
    }
  }

  async function loadCharacters({ force = false } = {}) {
    el.list.innerHTML = loadingHtml('Unrolling the scroll of characters…');
    el.pagination.innerHTML = '';
    el.resultSummary.innerHTML = '&nbsp;';
    el.pageSummary.textContent = '';

    try {
      state.characters = await fetchAllCharacters({ force });
      renderNationCards();
      renderList();
    } catch (error) {
      el.list.innerHTML = errorHtml(error.message);
      el.filterChips.innerHTML = '';
      el.nationCards.innerHTML = `<div class="col-12">${errorHtml(error.message)}</div>`;
    }
  }

  function init() {
    applyMotionPreference();
    installImageFallback();
    readStateFromUrl();
    el.searchInput.value = state.query;
    el.clearSearch.classList.toggle('d-none', !state.query);
    bindEvents();
    el.nationCards.addEventListener('click', (event) => {
      if (event.target.closest('[data-action="retry"]')) loadCharacters({ force: true });
    });
    loadCharacters();
  }

  init();
})((window.ATLAnac = window.ATLAnac || {}));
