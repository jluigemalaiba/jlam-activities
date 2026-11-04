(function (ATLAnac) {
  'use strict';

  const { getNation } = ATLAnac.api;

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function portraitUrl(url, width) {
    if (!url) return '';
    return url;
  }

  const FALLBACK_AVATAR = '<span class="portrait-fallback" aria-hidden="true"><i class="bi bi-person-fill"></i></span>';

  function portraitHtml(character, { width = 240, eager = false } = {}) {
    if (!character || !character.photoUrl) return FALLBACK_AVATAR;
    return `<img src="${escapeHtml(portraitUrl(character.photoUrl, width))}" alt="Portrait of ${escapeHtml(character.name)}"
      loading="${eager ? 'eager' : 'lazy'}" decoding="async" data-portrait
      data-source-name="${escapeHtml(character.sourceName || character.name)}" data-portrait-width="${width}">`;
  }

  function fallbackAvatarHtml() {
    return FALLBACK_AVATAR;
  }

  function installImageFallback() {
    document.addEventListener(
      'error',
      async (event) => {
        const img = event.target;
        if (img instanceof HTMLImageElement && img.hasAttribute('data-portrait')) {
          if (!img.dataset.portraitRetry) {
            img.dataset.portraitRetry = 'true';
            const sourceName = img.dataset.sourceName || img.alt.replace(/^Portrait of /, '');
            const fallbackUrl = await ATLAnac.api?.fetchPortraitByName?.(sourceName);
            if (fallbackUrl && fallbackUrl !== img.currentSrc) {
              img.src = portraitUrl(fallbackUrl, Number(img.dataset.portraitWidth) || 240);
              return;
            }
          }
          img.insertAdjacentHTML('afterend', FALLBACK_AVATAR);
          img.remove();
        }
      },
      true,
    );
  }

  const QUAD_ORDER = ['air', 'earth', 'fire', 'water'];

  function emblemHtml(key, extraClass = '') {
    if (key === 'four') {
      const parts = QUAD_ORDER.map((k) => `<span class="emblem emblem-${k}"></span>`).join('');
      return `<span class="emblem-quad ${extraClass}" role="img" aria-label="Four Nations emblem">${parts}</span>`;
    }
    const nation = getNation(key);
    const label = nation ? `${nation.label} emblem` : 'Four Nations emblem';
    return `<span class="emblem emblem-${escapeHtml(key)} ${extraClass}" role="img" aria-label="${escapeHtml(label)}"></span>`;
  }

  function loadingHtml(message) {
    return `
      <div class="archive-state" role="status">
        <div class="archive-spinner" aria-hidden="true"></div>
        <p class="archive-state-text mb-0">${escapeHtml(message)}</p>
      </div>`;
  }

  function errorHtml(message, { retry = true } = {}) {
    const action = retry
      ? `<button type="button" class="btn btn-seal" data-action="retry">
          <i class="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>Try again
        </button>`
      : `<a class="btn btn-seal" href="index.html#characters" data-back-link>
          <i class="bi bi-arrow-left me-2" aria-hidden="true"></i>Back to Characters
        </a>`;
    return `
      <div class="archive-state" role="alert">
        <i class="bi bi-exclamation-diamond archive-state-icon" aria-hidden="true"></i>
        <p class="archive-state-title mb-1">The scroll could not be unrolled</p>
        <p class="archive-state-text">${escapeHtml(message)}</p>
        ${action}
      </div>`;
  }

  function emptyHtml(title, message) {
    return `
      <div class="archive-state">
        <i class="bi bi-journal-x archive-state-icon" aria-hidden="true"></i>
        <p class="archive-state-title mb-1">${escapeHtml(title)}</p>
        <p class="archive-state-text mb-0">${escapeHtml(message)}</p>
      </div>`;
  }

  function primaryAffiliationLabel(character) {
    if (character.nations.length === 1) return getNation(character.nations[0]).label;
    if (character.nations.length > 1) return 'Multiple Nations';
    if (character.teamAvatar) return 'Team Avatar';
    return character.affiliation ? 'Other Affiliation' : 'Unaffiliated';
  }

  function inlineEntriesHtml(entries, max = 2) {
    const shown = entries.slice(0, max);
    const extra = entries.length - shown.length;
    const items = shown.map((entry) => `<span class="entry-inline-item">${escapeHtml(entry)}</span>`).join('');
    const more = extra > 0 ? `<span class="entry-more">+${extra} more</span>` : '';
    return `<span class="entry-inline">${items}${more}</span>`;
  }

  function applyMotionPreference() {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const apply = () => document.documentElement.classList.toggle('motion-reduced', query.matches);
    apply();
    query.addEventListener?.('change', apply);
  }

  function viewUrl(id) {
    return `view.html?id=${encodeURIComponent(id)}`;
  }

  ATLAnac.ui = {
    escapeHtml,
    portraitUrl,
    portraitHtml,
    fallbackAvatarHtml,
    installImageFallback,
    emblemHtml,
    loadingHtml,
    errorHtml,
    emptyHtml,
    primaryAffiliationLabel,
    inlineEntriesHtml,
    applyMotionPreference,
    viewUrl,
  };
})((window.ATLAnac = window.ATLAnac || {}));
