(function (ATLAnac) {
  'use strict';

  const { fetchAllCharacters, fetchCharacterById, getNation, resolveRelations } = ATLAnac.api;
  const { applyMotionPreference, emblemHtml, errorHtml, escapeHtml, fallbackAvatarHtml, installImageFallback, loadingHtml, portraitHtml, primaryAffiliationLabel, viewUrl } = ATLAnac.ui;

  const LIST_STATE_KEY = 'atlanac:listState';
  const THEMES = ['water', 'earth', 'fire', 'air', 'neutral'];

  const el = {
    root: document.getElementById('recordRoot'),
    breadcrumb: document.getElementById('viewBreadcrumb'),
  };

  const characterId = new URLSearchParams(window.location.search).get('id');

  function restoreBackLinks() {
    let saved = '';
    try {
      saved = sessionStorage.getItem(LIST_STATE_KEY) || '';
    } catch {
      saved = '';
    }
    const href = `index.html${saved.startsWith('?') ? saved : ''}#characters`;
    document.querySelectorAll('[data-back-link]').forEach((link) => {
      link.href = href;
    });
  }

  function applyTheme(theme) {
    document.body.classList.remove(...THEMES.map((t) => `theme-${t}`));
    document.body.classList.add(`theme-${theme}`);
  }

  function factHtml({ icon, label, entries }) {
    const content = entries.length === 1 && entries[0] === 'Not recorded in the archive'
      ? '<span class="fact-missing">Not recorded in the archive</span>'
      : entries.length
      ? `<ul class="fact-list">${entries.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}</ul>`
      : '<span class="fact-missing">Not recorded in the archive</span>';
    return `
      <div class="col-12 col-sm-6">
        <div class="fact">
          <dt class="fact-label"><i class="bi ${icon}" aria-hidden="true"></i>${escapeHtml(label)}</dt>
          <dd class="fact-value mb-0">${content}</dd>
        </div>
      </div>`;
  }

  function factsHtml(character) {
    const facts = [
      { icon: 'bi-person-vcard', label: 'Physical Appearance', entries: character.appearance },
      { icon: 'bi-gender-ambiguous', label: 'Gender', entries: character.gender ? [character.gender] : [] },
      { icon: 'bi-flag', label: 'Nation / Affiliation', entries: character.affiliations },
      { icon: 'bi-briefcase', label: 'Profession', entries: character.professions },
      { icon: 'bi-shield-shaded', label: 'Weapon', entries: character.weapons },
      { icon: 'bi-heart', label: 'Love', entries: character.loves },
      { icon: 'bi-arrow-counterclockwise', label: 'Predecessor', entries: [character.predecessor || 'Not recorded in the archive'] },
    ];
    if (character.positions.length) facts.push({ icon: 'bi-award', label: 'Position', entries: character.positions });
    return `<dl class="row g-3 mb-0">${facts.map(factHtml).join('')}</dl>`;
  }

  function nationTagsHtml(character) {
    const tags = character.nations.map((key) => `${emblemHtml(key, 'emblem-chip')}${escapeHtml(getNation(key).label)}`);
    if (character.teamAvatar) tags.push(`${emblemHtml('four', 'emblem-chip')}Team Avatar`);
    if (!tags.length) return '';
    return `<ul class="nation-tags list-unstyled d-flex flex-wrap gap-2 mb-0">${tags
      .map((tag) => `<li class="nation-tag">${tag}</li>`)
      .join('')}</ul>`;
  }

  function relationHtml({ name, character }) {
    if (character) {
      return `
        <li class="relation-item">
          <a class="relation" href="${viewUrl(character.id)}" data-bs-toggle="tooltip"
            data-bs-title="Open ${escapeHtml(character.name)}&rsquo;s record" aria-label="Open ${escapeHtml(character.name)}'s record">
            <span class="relation-portrait relation-${character.theme}">${portraitHtml(character, { width: 160 })}</span>
            <span class="relation-name">${escapeHtml(character.name)}</span>
          </a>
        </li>`;
    }
    return `
      <li class="relation-item">
        <span class="relation relation-unmatched" tabindex="0" data-bs-toggle="tooltip"
          data-bs-title="No archive record found for ${escapeHtml(name)}">
          <span class="relation-portrait">${fallbackAvatarHtml()}</span>
          <span class="relation-name">${escapeHtml(name)}</span>
          <span class="relation-note">Not in the archive</span>
        </span>
      </li>`;
  }

  function relationGroupHtml({ title, icon, emblem, relations, emptyText }) {
    const body = relations.length
      ? `<ul class="relation-grid list-unstyled mb-0">${relations.map(relationHtml).join('')}</ul>`
      : `<p class="relation-empty mb-0"><i class="bi bi-dash-circle me-2" aria-hidden="true"></i>${escapeHtml(emptyText)}</p>`;
    return `
      <section class="relation-group" aria-labelledby="rel-${title.toLowerCase()}">
        <header class="relation-heading">
          ${emblemHtml(emblem, 'emblem-sm')}
          <h2 id="rel-${title.toLowerCase()}" class="relation-title">
            <i class="bi ${icon}" aria-hidden="true"></i>${escapeHtml(title)}
          </h2>
          <span class="relation-count">${relations.length}</span>
        </header>
        ${body}
      </section>`;
  }

  function relationshipsHtml(character, allCharacters) {
    const allies = resolveRelations(character.allies, allCharacters);
    const enemies = resolveRelations(character.enemies, allCharacters);
    const allyEmblem = character.theme === 'neutral' ? 'air' : character.theme;
    return `
      <div class="relations">
        <div class="text-center mb-4">
          <p class="eyebrow eyebrow-dark justify-content-center mb-1">Bonds &amp; Rivalries</p>
          <h2 class="relations-title">Relationship Gallery</h2>
        </div>
        <div class="row g-4 align-items-stretch">
          <div class="col-12 col-lg">
            ${relationGroupHtml({ title: 'Allies', icon: 'bi-people', emblem: allyEmblem, relations: allies, emptyText: 'No known allies' })}
          </div>
          <div class="col-12 col-lg-auto">
            <div class="relation-divider relation-divider-vertical d-none d-lg-flex" aria-hidden="true">
              <span class="relation-divider-line"></span>${emblemHtml('four', 'emblem-xs')}<span class="relation-divider-line"></span>
            </div>
            <div class="ornament d-lg-none" aria-hidden="true">
              <span class="ornament-line"></span>${emblemHtml('four', 'emblem-xs')}<span class="ornament-line"></span>
            </div>
          </div>
          <div class="col-12 col-lg">
            ${relationGroupHtml({ title: 'Enemies', icon: 'bi-lightning', emblem: 'fire', relations: enemies, emptyText: 'No known enemies' })}
          </div>
        </div>
      </div>`;
  }

  function recordHtml(character, allCharacters) {
    const seal = character.theme === 'neutral' ? 'four' : character.theme;
    return `
      <article class="dossier dossier-${character.theme}">
        <div class="dossier-medallion">${emblemHtml(seal, 'emblem-lg')}</div>
        <div class="row g-4 g-lg-5 align-items-center">
          <div class="col-12 col-md-5">
            <figure class="dossier-portrait mb-0">
              ${portraitHtml(character, { width: 600, eager: true })}
            </figure>
          </div>
          <div class="col-12 col-md-7">
            <p class="eyebrow eyebrow-dark mb-2 justify-content-center justify-content-md-start">Character Record</p>
            <h1 class="dossier-name text-center text-md-start">${escapeHtml(character.name)}</h1>
            <div class="ribbon mb-3 mx-auto mx-md-0"><span>${escapeHtml(primaryAffiliationLabel(character))}</span></div>
            <div class="d-flex justify-content-center justify-content-md-start mb-4">${nationTagsHtml(character)}</div>
            ${factsHtml(character)}
          </div>
        </div>
        <div class="ornament my-4 my-lg-5" aria-hidden="true">
          <span class="ornament-line"></span>${emblemHtml(seal, 'emblem-xs')}<span class="ornament-line"></span>
        </div>
        ${relationshipsHtml(character, allCharacters)}
      </article>`;
  }

  function initTooltips() {
    const Tooltip = window.bootstrap?.Tooltip;
    if (!Tooltip) return;
    el.root.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((node) => Tooltip.getOrCreateInstance(node));
  }

  function showError(message, { allowRetry = true } = {}) {
    applyTheme('neutral');
    el.breadcrumb.textContent = 'Record unavailable';
    el.root.innerHTML = `<div class="dossier dossier-neutral">${errorHtml(message, { retry: allowRetry })}</div>`;
    restoreBackLinks();
  }

  async function loadRecord({ force = false } = {}) {
    if (!characterId) {
      showError('No character was selected. Choose one from the character scroll.', { allowRetry: false });
      return;
    }

    el.root.innerHTML = `<div class="dossier dossier-neutral">${loadingHtml('Retrieving the character record…')}</div>`;

    try {
      const [character, allCharacters] = await Promise.all([
        fetchCharacterById(characterId, { force }),
        fetchAllCharacters({ force }),
      ]);
      applyTheme(character.theme);
      document.title = `${character.name} — ATLAnac`;
      el.breadcrumb.textContent = `Record of ${character.name}`;
      el.root.innerHTML = recordHtml(character, allCharacters);
      initTooltips();
      window.scrollTo({ top: 0 });
    } catch (error) {
      showError(error.message, { allowRetry: !error.notFound });
    }
  }

  function init() {
    applyMotionPreference();
    installImageFallback();
    restoreBackLinks();
    const nav = document.querySelector('.archive-nav');
    const updateNav = () => nav?.classList.toggle('is-scrolled', window.scrollY > 56);
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    const navLinks = document.querySelectorAll('#mainNav .nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.forEach((item) => {
          const isActive = item === link;
          item.classList.toggle('active', isActive);
          if (isActive) item.setAttribute('aria-current', 'page');
          else item.removeAttribute('aria-current');
        });
        const menu = document.getElementById('mainNav');
        if (menu?.classList.contains('show')) window.bootstrap?.Collapse.getOrCreateInstance(menu).hide();
      });
    });
    const footer = document.querySelector('.archive-footer');
    if (footer && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        footer.classList.toggle('is-open', entry.isIntersecting);
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' }).observe(footer);
    } else {
      footer?.classList.add('is-open');
    }
    el.root.addEventListener('click', (event) => {
      if (event.target.closest('[data-action="retry"]')) loadRecord({ force: true });
    });
    loadRecord();
  }

  init();
})((window.ATLAnac = window.ATLAnac || {}));
