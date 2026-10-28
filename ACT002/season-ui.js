(function () {
  'use strict';
  const E = window.DRSeason;
  const LABELS = { relationships: 'Connections', mini: 'Mini', maxi: 'Maxi', runway: 'Runway', untucked: 'Untucked', judging: 'Judging', lipsync: 'Lip sync', outcome: 'Results', track: 'Track record', return: 'Return', qualification: 'Qualification', finalists: 'Finalists', crowning: 'Crowning', summary: 'Season summary' };
  const badge = status => `<span class="sim-status is-${String(status).toLowerCase()}"${status === 'LOW' ? ' title="Negative critiques, but safe from the bottom two"' : ''}>${status === 'RUNNERUP' ? 'RUNNER-UP' : status === 'GUEST' ? 'GUEST' : esc(status)}</span>`;
  function steps(ep) {
    if (ep.kind === 'return') return ['return', 'untucked', ...(ep.lipSyncs.length ? ['lipsync'] : []), 'outcome', 'track'];
    if (ep.kind === 'qualifier') return ['untucked', 'qualification', 'outcome', 'track'];
    if (ep.kind === 'finale') return [...(ep.mini ? ['mini'] : []), 'runway', 'untucked', 'finalists', 'lipsync', 'crowning', 'track', 'summary'];
    return ['mini', 'maxi', 'runway', 'untucked', 'judging', 'lipsync', 'outcome', 'track'];
  }
  function saveSeason(s) {
    try { localStorage.setItem('drph-season', JSON.stringify(s)); return true; }
    catch { return false; }
  }
  function loadSeason() {
    try {
      const s = JSON.parse(localStorage.getItem('drph-season'));
      return s?.version === 1 && Array.isArray(s.queens) && s.queens.length >= 4 && Array.isArray(s.episodes) && s.options && s.relationships && s.stars ? s : null;
    } catch { return null; }
  }
  function launch(session, content, shell, onClose) {
    const s = session.version === 1 ? session : E.createSeason(session.cast, session.options, crypto.getRandomValues(new Uint32Array(1))[0]);
    s.introducedIds = s.introducedIds || (session.version === 1 ? s.queens.map(queen => queen.id) : [...session.arrived]);
    s.theme = s.theme || app.theme;
    document.documentElement.dataset.theme = s.theme;
    let historyIndex = null;
    shell.classList.add('is-season');
    shell.setAttribute('aria-label', 'Drag Race season simulator');
    const q = id => E.queen(s, id);
    const name = id => esc(q(id)?.name || 'Queen');
    const face = (id, classes = '') => `<span class="sim-face ${classes}">${queenArt(q(id), undefined, true)}</span>`;
    const identity = (id, detail = esc(seasonLabel(q(id)?.season || 'custom'))) => `<div class="sim-identity">${face(id)}<span><strong>${name(id)}</strong>${detail ? `<small>${detail}</small>` : ''}</span></div>`;
    const persist = () => { if (saveSeason(s)) syncStartBarSeason(); };
    const pageTitle = (eyebrow, title, description = '') => `<header class="sim-page-title"><span class="sim-eyebrow">${esc(eyebrow)}</span><h2 tabindex="-1">${esc(title)}</h2>${description ? `<p>${esc(description)}</p>` : ''}</header>`;
    const note = text => text ? `<p class="sim-note">${esc(text)}</p>` : '';
    const cards = values => `<div class="sim-card-grid">${values.join('')}</div>`;
    const connectionIds = () => s.active.filter(id => s.introducedIds.includes(id));
    function relationshipsPage() {
      const ids = connectionIds();
      return pageTitle(`BEFORE EPISODE ${s.episodes.length + 1}`, 'The connections are forming.', 'Set the connections that shape Untucked, confessionals, votes, and strategic choices.') +
        `<section class="sim-relationships" aria-label="Queen relationships"><div class="sim-matrix-toolbar d-flex flex-wrap align-items-center justify-content-between gap-3"><div><h3>Connection Map</h3><p>Hover or focus for details. Click or tap a cell to change it.</p></div><div class="d-flex flex-wrap gap-2"><button type="button" class="sim-secondary" data-relationships-reset="clear">Clear all</button><button type="button" class="sim-primary" data-relationships-reset="random">${icon('shuffle', 'icon-sm')} Randomize all</button></div></div><div class="sim-matrix-scroll table-responsive" tabindex="0" aria-label="Relationships; scroll to see every queen"><table class="sim-matrix"><caption class="visually-hidden">Mutual relationships between the queens. Row and column headers identify each pair.</caption><thead><tr><th scope="col"><span>QUEENS</span></th>${ids.map(id => `<th scope="col"><div class="sim-matrix-column" title="${name(id)}">${face(id)}<span>${name(id)}</span></div></th>`).join('')}</tr></thead><tbody>${ids.map((a, row) => `<tr><th scope="row" title="${name(a)}">${identity(a)}</th>${ids.map((b, column) => {
          if (a === b) return '<td class="sim-matrix-self"><span aria-label="Same queen">&mdash;</span></td>';
          const type = E.relationshipType(E.relationship(s, a, b));
          return `<td><button type="button" class="sim-relation is-${type.id}" data-relationship-pair="${row},${column}" tabindex="${row === 0 && column === 1 ? '0' : '-1'}" aria-haspopup="dialog" aria-label="${name(a)} and ${name(b)}: ${type.label}. Edit relationship.">${type.short}</button></td>`;
        }).join('')}</tr>`).join('')}</tbody></table></div><div class="sim-matrix-legend d-flex flex-wrap gap-2">${E.RELATIONSHIPS.map(type => `<span class="sim-relation is-${type.id}">${type.label}</span>`).join('')}</div><p class="sim-matrix-help">Relationships are mutual. Clear all sets every visible pair to Neutral. Showmances are rare when randomized.</p><p class="visually-hidden" role="status" data-relationship-status></p></section>` +
        `<div class="sim-format-strip">${optionGroups.map(([key, label]) => `<span><small>${label}</small><strong>${esc(s.options[key])}</strong></span>`).join('')}</div>`;
    }
    function bindRelationships() {
      const table = content.querySelector('.sim-matrix-scroll');
      if (!table) return;
      const ids = connectionIds();
      let popover = null, anchor = null, editing = false, skipFocus = false, popoverObserver = null;
      const hide = (restore = false) => {
        const previous = anchor;
        popoverObserver?.disconnect();
        popoverObserver = null;
        popover?.remove();
        previous?.removeAttribute('aria-describedby');
        previous?.removeAttribute('aria-expanded');
        popover = null; anchor = null; editing = false;
        if (restore && previous?.isConnected) { skipFocus = document.activeElement !== previous; previous.focus({ preventScroll: true }); }
      };
      const refresh = (selector, message = '') => {
        const left = table.scrollLeft, top = table.scrollTop;
        persist(); render(false, true);
        const nextTable = content.querySelector('.sim-matrix-scroll');
        nextTable.scrollLeft = left; nextTable.scrollTop = top;
        content.querySelector(selector)?.focus({ preventScroll: true });
        content.querySelector('[data-relationship-status]').textContent = message;
      };
      const positionPopover = () => {
        if (!popover || !anchor?.isConnected) return;
        const bounds = shell.getBoundingClientRect(), cell = anchor.getBoundingClientRect();
        const viewport = window.visualViewport;
        const screenLeft = viewport?.offsetLeft || 0, screenTop = viewport?.offsetTop || 0;
        const screenRight = screenLeft + (viewport?.width || window.innerWidth);
        const screenBottom = screenTop + (viewport?.height || window.innerHeight);
        const leftEdge = Math.max(screenLeft, bounds.left) + 12, rightEdge = Math.min(screenRight, bounds.right) - 12;
        const topEdge = Math.max(screenTop, bounds.top) + 12, bottomEdge = Math.min(screenBottom, bounds.bottom) - 12;
        popover.style.maxWidth = `${Math.max(0, rightEdge - leftEdge)}px`;
        popover.style.maxHeight = `${Math.max(0, bottomEdge - topEdge)}px`;
        const rect = popover.getBoundingClientRect();
        const preferredLeft = cell.right + 12 + rect.width <= rightEdge ? cell.right + 12 : cell.left - rect.width - 12;
        popover.style.left = `${Math.max(leftEdge, Math.min(preferredLeft, rightEdge - rect.width))}px`;
        popover.style.top = `${Math.max(topEdge, Math.min(cell.top - 12, bottomEdge - rect.height))}px`;
      };
      const show = (button, edit = false) => {
        if (editing || (!edit && popover && anchor === button)) return;
        hide();
        anchor = button; editing = edit;
        const [row, column] = button.dataset.relationshipPair.split(',').map(Number);
        const a = ids[row], b = ids[column], score = E.relationship(s, a, b), type = E.relationshipType(score);
        const signed = score > 0 ? `+${score}` : String(score);
        popover = document.createElement('div');
        popover.id = 'sim-relationship-details';
        popover.className = `sim-relationship-popover ${edit ? 'is-editing' : ''}`;
        popover.setAttribute('role', edit ? 'dialog' : 'tooltip');
        if (edit) popover.setAttribute('aria-label', `Edit ${q(a).name} and ${q(b).name}'s relationship`);
        popover.innerHTML = `<div class="sim-relationship-popover-head"><div class="sim-relationship-faces">${face(a)}${face(b)}</div><strong>${name(a)} &amp; ${name(b)}</strong>${edit ? `<button type="button" class="sim-relationship-close" aria-label="Close relationship editor">${icon('x', 'icon-sm')}</button>` : ''}</div><span class="sim-relation is-${type.id}">${type.label}</span><div class="sim-relationship-directions"><div><span>${name(a)} to ${name(b)}</span><b>${signed}</b></div><div><span>${name(b)} to ${name(a)}</span><b>${signed}</b></div></div>${edit ? `<div class="sim-relationship-options" role="group" aria-label="Relationship type">${E.RELATIONSHIPS.map(option => `<button type="button" class="sim-relation is-${option.id}" data-set-relationship="${option.id}" aria-pressed="${option.id === type.id}">${option.label}${option.id === type.id ? icon('check', 'icon-xs') : ''}</button>`).join('')}</div>` : '<p>Click or tap to change</p>'}`;
        content.querySelector('.sim-app').append(popover);
        button.setAttribute('aria-describedby', popover.id);
        if (edit) button.setAttribute('aria-expanded', 'true');
        positionPopover();
        if (typeof ResizeObserver !== 'undefined') {
          popoverObserver = new ResizeObserver(positionPopover);
          popoverObserver.observe(popover);
        }
        popover.querySelector('.sim-relationship-close')?.addEventListener('click', () => hide(true));
        popover.querySelectorAll('[data-set-relationship]').forEach(option => option.addEventListener('click', () => {
          if (!E.setRelationship(s, a, b, option.dataset.setRelationship)) return;
          refresh(`[data-relationship-pair="${row},${column}"]`, `${q(a).name} and ${q(b).name}: ${E.relationshipType(E.relationship(s, a, b)).label}.`);
        }));
        if (edit) popover.querySelector(`[data-set-relationship="${type.id}"]`).focus({ preventScroll: true });
      };
      const focusCell = button => {
        table.querySelectorAll('[data-relationship-pair]').forEach(cell => cell.tabIndex = cell === button ? 0 : -1);
      };
      table.querySelectorAll('[data-relationship-pair]').forEach(button => {
        button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') show(button); });
        button.addEventListener('pointerleave', () => { if (!editing && anchor === button) hide(); });
        button.addEventListener('focus', () => { focusCell(button); if (skipFocus) { skipFocus = false; return; } show(button); });
        button.addEventListener('blur', () => { if (!editing && anchor === button) hide(); });
        button.addEventListener('click', () => show(button, true));
        button.addEventListener('keydown', event => {
          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
          event.preventDefault();
          let [row, column] = button.dataset.relationshipPair.split(',').map(Number);
          const vertical = event.key === 'ArrowUp' || event.key === 'ArrowDown';
          const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
          do { if (vertical) row += direction; else column += direction; } while (row === column);
          const next = table.querySelector(`[data-relationship-pair="${row},${column}"]`);
          if (next) { hide(); focusCell(next); next.focus({ preventScroll: true }); next.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
        });
      });
      content.querySelectorAll('[data-relationships-reset]').forEach(button => button.addEventListener('click', () => {
        const random = button.dataset.relationshipsReset === 'random';
        const changed = random ? E.randomizeRelationships(s, ids) : E.clearRelationships(s, ids);
        if (changed) refresh(`[data-relationships-reset="${button.dataset.relationshipsReset}"]`, random ? 'Visible relationships randomized.' : 'Visible relationships cleared to Neutral.');
      }));
      const outside = event => { if (popover && !popover.contains(event.target) && !anchor?.contains(event.target)) hide(); };
      const key = event => { if (popover && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); hide(true); } };
      const dismiss = () => hide();
      table.addEventListener('scroll', dismiss, { passive: true });
      content.querySelector('.sim-page').addEventListener('scroll', dismiss, { passive: true });
      shell.addEventListener('pointerdown', outside);
      shell.addEventListener('keydown', key);
      window.addEventListener('resize', positionPopover, { passive: true });
      window.visualViewport?.addEventListener('resize', positionPopover, { passive: true });
      window.visualViewport?.addEventListener('scroll', positionPopover, { passive: true });
      shell.disposeRelationships = () => { hide(); shell.removeEventListener('pointerdown', outside); shell.removeEventListener('keydown', key); window.removeEventListener('resize', positionPopover); window.visualViewport?.removeEventListener('resize', positionPopover); window.visualViewport?.removeEventListener('scroll', positionPopover); };
    }
    function miniPage(ep) {
      const m = ep.mini;
      return pageTitle(`EPISODE ${ep.number} / WERK ROOM`, m.title, m.reading ? 'The library is now officially open!' : 'A quick Werk Room challenge before the main event.') +
        (m.reading ? cards(m.reads.map(read => `<article class="sim-panel sim-read">${identity(read.id, `Reading ${name(read.target)}`)}<blockquote>${esc(read.line)}</blockquote></article>`)) : `<div class="sim-participant-row">${ep.participants.map(id => `<div>${face(id)}<span>${name(id)}</span></div>`).join('')}</div>`) +
        `<div class="sim-spotlight-result"><span class="sim-eyebrow">MINI-CHALLENGE WINNER</span>${face(m.winner, 'is-large')}<h3>${name(m.winner)}</h3><p>A small confidence boost for tonight's maxi performance.</p></div>`;
    }
    function maxiPage(ep) {
      return pageTitle(`EPISODE ${ep.number} / ${ep.challenge.label}`, ep.title, ep.challenge.brief) +
        (ep.split ? note(`Double Premiere: group ${ep.premiere} competes in Episode ${ep.number}. The cast merges in Episode 3.`) : '') + note(ep.note) +
        (ep.challenge.id === 'girlgroup' ? `<div class="sim-team-headings">${[...new Set(ep.casting.map(row => row.role))].map(team => `<span><strong>${esc(team)}</strong><small>${ep.casting.filter(row => row.role === team).length} members</small></span>`).join('')}</div>` : '') +
        cards(ep.casting.map(row => `<article class="sim-panel sim-assignment">${identity(row.id, ep.guestIds?.includes(row.id) ? 'Encore guest / not scored' : 'Challenge assignment')}<span class="sim-chip">${esc(row.role)}</span><p>${esc(row.note)}</p></article>`));
    }
    function runwayPage(ep) {
      return pageTitle(`EPISODE ${ep.number} / MAIN STAGE`, 'Category is...', ep.runway) +
        cards(ep.participants.map(id => { const score = ep.scores?.find(row => row.id === id)?.runway; return `<article class="sim-panel sim-runway">${face(id, 'is-runway')}<h3>${name(id)}</h3><p>${score === undefined ? 'A final look that celebrates this queen\'s drag story.' : score >= 80 ? 'A polished silhouette, confident presentation, and beautiful details.' : score >= 60 ? 'A clear point of view with a few details that could be sharper.' : 'An ambitious idea with some unfinished details on the runway.'}</p></article>`; }));
    }
    function untuckedPage(ep) {
      return pageTitle(`EPISODE ${ep.number} / BACKSTAGE`, 'Untucked!', 'The challenge is over. The conversation is just beginning.') +
        `<div class="sim-dialogue-list">${ep.dialogue.scenes.map(scene => `<article class="sim-panel"><div class="sim-conversation-heading"><span class="sim-chip">${scene.tone}</span><small>Connection: ${E.relationship(s, scene.a, scene.b) > 0 ? '+' : ''}${E.relationship(s, scene.a, scene.b)}</small></div><div class="sim-dialogue">${identity(scene.a)}<blockquote>${esc(scene.lines[0])}</blockquote></div><div class="sim-dialogue is-reply">${identity(scene.b)}<blockquote>${esc(scene.lines[1])}</blockquote></div></article>`).join('')}</div>` +
        `<h3 class="sim-section-title">In the confessional</h3>` + cards(ep.dialogue.confessionals.map(c => `<article class="sim-panel sim-confessional">${identity(c.id, c.target ? `Confessional / about ${name(c.target)}` : 'Confessional')}<blockquote>${esc(c.line)}</blockquote></article>`));
    }
    function judgingPage(ep) {
      const forWin = ep.nonElimination || s.options.season !== 'Regular';
      return pageTitle(`EPISODE ${ep.number} / JUDGES' CRITIQUES`, 'The judges have spoken.', ep.challenge.id === 'lalaparuza' ? 'Tonight the survival bracket decides who stays.' : 'Challenge performance counts for 80%; runway counts for 20%. Mini-challenge wins add a small performance boost.') +
        cards(ep.scores.map(row => {
          let status = ep.placements[row.id];
          if (ep.challenge.id === 'lalaparuza') status = 'SAFE';
          else if (status === 'ELIM') status = 'BTM2';
          else if (forWin && status === 'WIN') status = 'TOP2';
          return `<article class="sim-panel sim-critique">${identity(row.id)}${badge(status)}<div class="sim-score-bars"><span>Challenge <b>${row.performance}</b></span><i style="--score:${row.performance}%"></i><span>Runway <b>${row.runway}</b></span><i style="--score:${row.runway}%"></i></div><p>${status === 'LOW' ? 'One of the weaker performances tonight. You receive negative critiques, but are safe from the bottom two.' : row.total >= 80 ? 'You commanded the assignment and made it your own.' : row.total >= 60 ? 'We see your point of view; push the details further.' : 'The idea was there, but the delivery needed more precision.'}</p></article>`;
        })) + note(ep.note);
    }
    function spotifyPlayer(track) {
      return s.playerTrack === track.spotify ? `<iframe class="sim-spotify" title="Spotify: ${esc(track.title)} by ${esc(track.artist)}" src="https://open.spotify.com/embed/track/${track.spotify}?theme=0" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe><p class="sim-player-note">Playback or preview availability is controlled by Spotify.</p>` : `<button type="button" class="sim-secondary" data-player="${track.spotify}">${icon('play')} Load Spotify player</button>`;
    }
    function matchCard(match, index, revealed, interactive = true) {
      return `<article class="sim-panel sim-match"><div class="sim-match-top"><span class="sim-chip">${esc(match.type)}</span><span class="sim-eyebrow">${String(index + 1).padStart(2, '0')}</span></div><div class="sim-versus">${match.participants.map(id => `<div>${face(id, 'is-match')}<strong>${name(id)}</strong></div>`).join('<span class="sim-vs">VS</span>')}</div><div class="sim-song"><span class="sim-record" aria-hidden="true"></span><div><strong>${esc(match.song.title)}</strong><span>${esc(match.song.artist)}</span><small>Used in ${esc(match.song.source)}</small></div><a href="https://open.spotify.com/track/${match.song.spotify}" target="_blank" rel="noopener noreferrer">Open Spotify</a></div>${spotifyPlayer(match.song)}${revealed ? `<div class="sim-match-result"><strong>${match.outcome === 'double-shantay' ? 'Double shantay!' : match.outcome === 'double-sashay' ? 'Double sashay.' : `Win: ${match.winners.map(name).join(' &amp; ')}`}</strong><span>${match.losers.length ? `Lost this lip sync: ${match.losers.map(name).join(', ')}` : 'Both queens stay.'}</span></div>` : interactive ? `<button type="button" class="sim-primary" data-reveal-match="${index}">Reveal the lip sync ${icon('check')}</button>` : ''}</article>`;
    }
    function lipSyncPage(ep) {
      const count = Math.min((s.revealedMatches || 0) + 1, ep.lipSyncs.length);
      return pageTitle(`EPISODE ${ep.number} / LIP SYNC`, ep.kind === 'finale' ? 'For the crown.' : ep.kind === 'return' ? 'One more chance.' : 'This is your moment.', 'Load the song player, enjoy the performance, then reveal each result. Winning a Legacy lip sync grants the lipstick; the eliminated queen is revealed afterward.') +
        `<div class="sim-matches">${ep.lipSyncs.slice(0, count).map((match, i) => matchCard(match, i, i < (s.revealedMatches || 0))).join('')}</div>`;
    }
    function returnPage(ep) {
      return pageTitle(`EPISODE ${ep.number} / RETURNING TWIST`, ep.title, ep.method) + note(ep.note) +
        (ep.needsChoice ? `<div class="sim-return-choices">${ep.candidates.map(id => `<label class="sim-return-choice"><input type="radio" name="returning-queen" value="${esc(id)}" ${s.returnChoice === id ? 'checked' : ''}>${face(id)}<strong>${name(id)}</strong><span>Bring her back</span></label>`).join('')}</div>` : ep.method === 'Remaining Queens Vote' ? `<div class="sim-panel"><h3>The queens cast their votes.</h3><p>The chosen returnee will be revealed after Untucked.</p><div class="sim-participant-row">${ep.votes.map(v => `<div>${face(v.voter)}<span>${name(v.voter)}</span></div>`).join('')}</div></div>` : `<div class="sim-participant-row">${ep.candidates.map(id => `<div>${face(id)}<span>${name(id)}</span></div>`).join('')}</div>`);
    }
    function qualificationPage(ep) {
      return pageTitle(`EPISODE ${ep.number} / ALL WINNERS`, 'The stars decide.', ep.note) + `<div class="sim-panel sim-qualifying-list">${ep.order.map((id, i) => `<div>${identity(id, `${s.stars[id]} stars / PPE ${E.ppe(s, id).toFixed(2)}`)}${badge(i < s.finaleSize ? 'FINALIST' : 'CUT')}</div>`).join('')}</div>`;
    }
    function finalistsPage(ep) {
      return pageTitle(`EPISODE ${ep.number} / THE GRAND FINALE`, `Your Top ${s.finaleSize}`, 'One last runway. One final lip-sync tournament. One queen will take the crown.') + `<div class="sim-finalist-row">${ep.participants.map(id => `<article>${face(id, 'is-finalist')}<h3>${name(id)}</h3><span>${E.wins(s, id)} wins / PPE ${E.ppe(s, id).toFixed(2)}</span></article>`).join('')}</div>`;
    }
    function outcomePage(ep) {
      if (ep.kind === 'return') return pageTitle(`EPISODE ${ep.number} / THE VERDICT`, ep.returned.length ? 'Welcome back!' : 'The door stays closed.', ep.note || 'One queen gets another shot at the crown.') + (ep.returned.length ? `<div class="sim-spotlight-result">${face(ep.returned[0], 'is-large')}<h3>${name(ep.returned[0])}</h3>${badge('RET')}</div>` : '') + (ep.votes?.length ? `<details class="sim-panel"><summary>See every vote</summary><div class="sim-vote-grid">${ep.votes.map(v => `<div>${name(v.voter)} <span>voted for</span> <strong>${name(v.choice)}</strong></div>`).join('')}</div></details>` : '');
      if (ep.kind === 'qualifier') return qualificationPage(ep);
      const winner = ep.participants.find(id => ep.placements[id] === 'WIN');
      return pageTitle(`EPISODE ${ep.number} / RESULTS`, ep.twist || (ep.eliminated.length ? 'Shantay, you stay.' : 'Nobody is going home.'), ep.lipstick ? `${q(ep.lipstick.chooser).name} has chosen ${q(ep.lipstick.choice).name}'s lipstick.` : ep.note || 'Another week in the competition.') +
        `<div class="sim-outcome-grid">${winner ? `<article class="sim-panel is-winning">${face(winner, 'is-large')}<span class="sim-eyebrow">CHALLENGE WINNER</span><h3>${name(winner)}</h3>${badge('WIN')}</article>` : ''}${ep.eliminated.map(id => `<article class="sim-panel">${face(id, 'is-large')}<span class="sim-eyebrow">SASHAY AWAY</span><h3>${name(id)}</h3>${badge('ELIM')}</article>`).join('')}</div>` +
        (s.options.season === 'All Winners' ? `<div class="sim-panel"><h3>Legendary stars</h3><p>${ep.starAwards.map(name).join(' &amp; ')} earn a star.${ep.deniedStar ? ` ${name(ep.deniedStar)} was blocked and could not earn a star.` : ''}</p>${ep.blocked ? `<p>Blocked for the next episode: <strong>${name(ep.blocked)}</strong>.</p>` : ''}</div>` : '');
    }
    function crownPage(ep) {
      return `<div class="sim-crowning"><div class="sim-crown-rays" aria-hidden="true"></div><span class="sim-eyebrow">YOUR NEXT DRAG SUPERSTAR</span>${face(ep.winner, 'is-crowned')}<h2>${name(ep.winner)}</h2>${badge('WINNER')}<p>Condragulations. The crown is yours.</p></div><div class="sim-panel sim-congeniality">${face(ep.missCongeniality)}<div><span class="sim-eyebrow">MISS CONGENIALITY</span><h3>${name(ep.missCongeniality)}</h3><p>Chosen by the cast. No self-votes; the season winner is ineligible.</p></div></div><details class="sim-panel"><summary>Miss Congeniality votes</summary><div class="sim-vote-grid">${ep.mcVotes.map(v => `<div>${name(v.voter)} <span>voted for</span> <strong>${name(v.choice)}</strong></div>`).join('')}</div></details>`;
    }
    function trackRecord() {
      const order = (s.status === 'complete' ? s.standings : [...s.active, ...[...s.eliminated].reverse()]).filter(id => s.introducedIds.includes(id));
      return `<div class="sim-track-help"><span>Scroll horizontally to see every episode. Select an episode heading for its recap.</span><button type="button" class="sim-secondary" data-export>Download season JSON</button></div><div class="sim-table-scroll" tabindex="0" aria-label="Season track record; scroll horizontally"><table class="sim-track"><caption>Season track record and points per episode</caption><thead><tr><th scope="col">Queen</th>${s.episodes.map((ep, i) => `<th scope="col"><button type="button" data-history="${i}" title="${esc(ep.title)}">EP ${ep.number}</button></th>`).join('')}<th scope="col">PPE</th>${s.options.season === 'All Winners' ? '<th scope="col">Stars</th>' : ''}</tr></thead><tbody>${order.map(id => `<tr><th scope="row">${identity(id)}</th>${s.episodes.map(ep => { const status = ep.placements[id]; return `<td title="${esc(ep.title)}${ep.starAwards.includes(id) ? ' / earned a star' : ''}${ep.deniedStar === id ? ' / blocked star' : ''}">${status ? badge(status) : '<span class="sim-dash">&mdash;</span>'}${ep.starAwards.includes(id) ? '<small class="sim-star">+1 star</small>' : ''}</td>`; }).join('')}<td class="sim-ppe">${E.ppe(s, id).toFixed(2)}</td>${s.options.season === 'All Winners' ? `<td class="sim-ppe">${s.stars[id]}</td>` : ''}</tr>`).join('')}</tbody></table></div><div class="sim-track-legend">${Object.keys(E.PPE).map(badge).join('')}${badge('RET')}${badge('CUT')}</div><p class="sim-fineprint">PPE = scored challenge points / scored appearances. WIN 5, TOP2 4.5, HIGH 4, SAFE 3, LOW 2, BTM2 1, ELIM 0. LOW means negative critiques, but safe from the bottom two. Premiere absences, guest spots, returns, qualification, and finale placements do not change PPE.</p>`;
    }
    function summaryPage() {
      return pageTitle('THE SEASON / COMPLETE', `${q(s.winner).name}, your superstar.`, `${s.episodes.length} episodes. ${s.queens.length} queens. A season of wins, risks, and unforgettable performances.`) +
        `<div class="sim-summary-awards"><div>${face(s.winner, 'is-large')}<span class="sim-eyebrow">WINNER</span><h3>${name(s.winner)}</h3></div><div>${face(s.missCongeniality, 'is-large')}<span class="sim-eyebrow">MISS CONGENIALITY</span><h3>${name(s.missCongeniality)}</h3></div></div>` +
        `<div class="sim-panel sim-summary-ranking"><h3>Final standings</h3>${s.standings.map((id, i) => `<div><b>${String(i + 1).padStart(2, '0')}</b>${identity(id, `${E.wins(s, id)} wins / PPE ${E.ppe(s, id).toFixed(2)}${s.options.season === 'All Winners' ? ` / ${s.stars[id]} stars` : ''}`)}${i === 0 ? badge('WINNER') : i === 1 ? badge('RUNNERUP') : ''}</div>`).join('')}</div>` +
        `<h3 class="sim-section-title">The full track record</h3>${trackRecord()}<h3 class="sim-section-title">Every lip sync</h3><div class="sim-song-history">${s.episodes.flatMap(ep => ep.lipSyncs.map((match, i) => `<details class="sim-panel"><summary>EP ${ep.number} / ${esc(match.song.title)} / ${esc(match.type)}</summary>${matchCard(match, i, true, false)}</details>`)).join('')}</div>` +
        (E.coreNotes(s).length ? `<div class="sim-panel"><h3>Challenge availability</h3>${E.coreNotes(s).map(note).join('')}</div>` : '') +
        `<div class="sim-panel"><h3>Season rules</h3>${optionGroups.map(([key, label]) => `<p>${label}: <strong>${esc(s.options[key])}</strong></p>`).join('')}<p>Double shantay: ${s.twists.usedShantay ? 'yes' : 'none'} / Double sashay: ${s.twists.usedSashay ? 'yes' : 'none'}.</p>${s.options.season === 'All Winners' ? '<p>Return options did not activate: the All Winners challenge rounds are non-elimination.</p>' : ''}</div><p class="sim-fineprint">Original fictional dialogue and randomized performances. Inspiration: <a href="https://rupaulsdragrace.fandom.com/wiki/Category:Challenges" target="_blank" rel="noopener noreferrer">Drag Race challenge categories</a>. Song history checked against <a href="https://www.wowpresentsplus.com/drag-race-philippines-lip-syncs" target="_blank" rel="noopener noreferrer">WOW Presents Plus</a>.</p>`;
    }
    function historyPage(ep) {
      return pageTitle(`EPISODE ${ep.number} / RECAP`, ep.title, ep.challenge?.label || ep.kind) + note(ep.note) +
        cards(Object.entries(ep.placements).map(([id, status]) => `<article class="sim-panel">${identity(id)}${badge(status)}</article>`)) +
        (ep.mini ? note(`Mini-challenge: ${ep.mini.title}. Winner: ${q(ep.mini.winner).name}.`) : '') +
        `<div class="sim-song-history">${ep.lipSyncs.map((match, i) => matchCard(match, i, true, false)).join('')}</div><details class="sim-panel"><summary>Untucked &amp; confessionals</summary>${untuckedPage(ep)}</details>`;
    }
    function sceneMarkup(view) {
      if (view === 'relationships' || view === 'mini' || view === 'return') return `<div class="sim-scene sim-werk" aria-hidden="true">${entranceSet()}</div>`;
      if (view === 'untucked') {
        const star = glitterStar().replaceAll('lounge-glitter', 'sim-lounge-glitter');
        const sofas = loungeSofa('', 'var(--c1)') + loungeSofa('', 'var(--c2)');
        return `<div class="sim-scene sim-lounge" aria-hidden="true">${loungeSet(sofas, star)}</div>`;
      }
      return `<div class="sim-scene sim-stage" aria-hidden="true"><div class="sim-stage-wall"><div class="led-tiles led-center"></div><div class="led-tiles led-left"></div><div class="led-tiles led-right"></div><span class="light-strip sim-stage-strip is-left"></span><span class="light-strip sim-stage-strip is-right"></span></div><span class="sim-stage-spot is-left"></span><span class="sim-stage-spot is-right"></span><div class="disco sim-stage-disco"></div><div class="sim-stage-door"><span></span><i></i><b class="sim-stage-door-seam"></b></div><div class="sim-stage-floor">${stageFloor('sim-stage-floor-fade').replace('preserveAspectRatio="none"', 'preserveAspectRatio="xMidYMin slice"')}</div><div class="sim-stage-apron"></div><div class="sim-stage-footlights d-flex justify-content-between align-items-end">${Array.from({length:7},()=>'<span class="front-light"></span>').join('')}</div></div>`;
    }
    function render(focusTitle = true, keepScroll = false) {
      shell.disposeRelationships?.();
      shell.disposeRelationships = null;
      if (s.uiStep === 'entrances') {
        shell.classList.remove('is-season');
        shell.setAttribute('aria-label', 'Episode 2: Meet the Premiere 2 queens');
        playEntranceSession(s.entranceSession, content, shell, () => {
          s.introducedIds = [...new Set([...s.introducedIds, ...s.groups[1]])];
          delete s.entranceSession;
          s.uiStep = 'relationships';
          persist();
          render();
        }, persist);
        return;
      }
      shell.classList.add('is-season');
      shell.setAttribute('aria-label', 'Drag Race season simulator');
      const oldScroll = content.querySelector('.sim-page')?.scrollTop || 0;
      const ep = s.current;
      const view = historyIndex === null ? s.uiStep : 'history';
      let body;
      if (view === 'history') body = historyPage(s.episodes[historyIndex]);
      else if (view === 'relationships') body = relationshipsPage();
      else if (view === 'mini') body = miniPage(ep);
      else if (view === 'maxi') body = maxiPage(ep);
      else if (view === 'runway') body = runwayPage(ep);
      else if (view === 'untucked') body = untuckedPage(ep);
      else if (view === 'judging') body = judgingPage(ep);
      else if (view === 'lipsync') body = lipSyncPage(ep);
      else if (view === 'return') body = returnPage(ep);
      else if (view === 'qualification') body = qualificationPage(ep);
      else if (view === 'finalists') body = finalistsPage(ep);
      else if (view === 'crowning') body = crownPage(ep);
      else if (view === 'outcome') body = outcomePage(ep);
      else if (view === 'track') body = pageTitle(`AFTER EPISODE ${ep.number}`, 'The track record.', needsPremiereTwo() ? `${s.active.filter(id => s.introducedIds.includes(id)).length} queens remain from Premiere 1. ${s.groups[1].length} new queens arrive in Episode 2.` : `${s.active.length} queens remain. ${s.options.finale} is the finale target.`) + trackRecord();
      else body = summaryPage();
      const path = s.uiStep === 'relationships' ? ['relationships'] : steps(ep);
      const stepIndex = path.indexOf(s.uiStep);
      const nextView = path[stepIndex + 1];
      let nextLabel = historyIndex !== null ? 'Back to current episode' : s.uiStep === 'relationships' ? `Begin Episode ${s.episodes.length + 1}` : s.uiStep === 'summary' ? 'Back to season setup' : s.uiStep === 'track' && ep.kind !== 'finale' ? (needsPremiereTwo() ? 'Meet Premiere 2 queens' : 'Next episode') : `Continue to ${LABELS[nextView] || 'results'}`;
      const waiting = s.uiStep === 'lipsync' && (s.revealedMatches || 0) < ep.lipSyncs.length;
      const choosing = s.uiStep === 'return' && ep.needsChoice && !s.returnChoice;
      const canTrack = s.episodes.length > 0 && view !== 'track' && view !== 'summary';
      content.innerHTML = `<div class="sim-app">${sceneMarkup(view)}<header class="sim-topbar"><div><span class="sim-eyebrow">${esc((themes.find(t => t.id === s.theme) || currentTheme()).name)}</span><strong>${s.uiStep === 'relationships' ? `Before Episode ${s.episodes.length + 1}` : s.status === 'complete' ? 'Season complete' : `Episode ${ep?.number || 1}`}</strong></div><span class="sim-live-pill"><i></i> ${s.active.filter(id => s.introducedIds.includes(id)).length} queens</span></header><nav class="sim-steps" aria-label="Episode progress">${path.map((step, i) => `<span ${step === s.uiStep ? 'aria-current="step"' : ''} class="${step === s.uiStep ? 'is-current' : i < stepIndex ? 'is-done' : ''}"><i>${i < stepIndex ? '&#10003;' : String(i + 1).padStart(2, '0')}</i>${LABELS[step]}</span>`).join('')}</nav><main class="sim-page ${view === 'summary' ? 'is-summary' : ''}">${body}</main><footer class="sim-controls"><div class="w-100">${canTrack ? '<button type="button" class="sim-secondary" data-view-track>Track record</button>' : ''}<button type="button" class="sim-primary" data-sim-next ${historyIndex === null && (waiting || choosing) ? 'disabled' : ''}>${nextLabel} ${icon('play', 'icon-sm')}</button></div></footer></div>`;
      content.querySelector('[data-sim-next]').addEventListener('click', next);
      content.querySelector('[data-view-track]')?.addEventListener('click', () => { historyIndex = -1; renderTrackView(); });
      content.querySelectorAll('[data-reveal-match]').forEach(button => button.addEventListener('click', () => { const index = Number(button.dataset.revealMatch); if (index === (s.revealedMatches || 0)) { s.revealedMatches = index + 1; persist(); render(false, true); content.querySelectorAll('.sim-match').item(index + 1)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } }));
      content.querySelectorAll('[data-player]').forEach(button => button.addEventListener('click', () => { s.playerTrack = button.dataset.player; persist(); render(false, true); }));
      content.querySelectorAll('[name="returning-queen"]').forEach(input => input.addEventListener('change', () => { s.returnChoice = input.value; persist(); content.querySelector('[data-sim-next]').disabled = false; }));
      bindExtras();
      if (view === 'relationships') bindRelationships();
      const page = content.querySelector('.sim-page');
      page.scrollTop = keepScroll ? oldScroll : 0;
      if (focusTitle) page.querySelector('h2')?.focus({ preventScroll: true });
    }
    function bindExtras() {
      content.querySelectorAll('[data-history]').forEach(button => button.addEventListener('click', () => { historyIndex = Number(button.dataset.history); render(); }));
      content.querySelectorAll('[data-export]').forEach(button => button.addEventListener('click', () => {
        const url = URL.createObjectURL(new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' }));
        const a = document.createElement('a'); a.href = url; a.download = `drag-race-season-${s.seed}.json`; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }));
    }
    function renderTrackView() {
      shell.disposeRelationships?.();
      shell.disposeRelationships = null;
      const page = content.querySelector('.sim-page');
      page.innerHTML = pageTitle('SEASON SO FAR', 'The track record.') + trackRecord();
      content.querySelector('[data-sim-next]').disabled = false;
      content.querySelector('[data-sim-next]').innerHTML = 'Back to current episode';
      content.querySelector('[data-view-track]')?.remove();
      bindExtras();
      page.scrollTop = 0;
    }
    function needsPremiereTwo() {
      return s.groups.length === 2 && s.competitionCount === 1 && !s.groups[1].every(id => s.introducedIds.includes(id));
    }
    function beginEpisode() {
      if (needsPremiereTwo()) {
        s.entranceSession = {
          options: { ...s.options },
          cast: s.queens,
          groups: s.groups.map(ids => ids.map(q)),
          groupIndex: 1,
          queenIndex: 0,
          arrived: [],
          phase: 'countdown'
        };
        s.uiStep = 'entrances';
        persist();
        render();
        return;
      }
      const ep = E.prepareEpisode(s);
      s.revealedMatches = 0; s.playerTrack = null; s.returnChoice = null; s.uiStep = steps(ep)[0]; persist(); render();
    }
    function next() {
      if (historyIndex !== null) { historyIndex = null; render(); return; }
      if (s.uiStep === 'relationships') { beginEpisode(); return; }
      if (s.uiStep === 'summary') { onClose(); return; }
      const ep = s.current;
      if (s.uiStep === 'return' && ep.needsChoice) { if (!s.returnChoice) return; E.chooseReturn(s, s.returnChoice); }
      if (s.uiStep === 'lipsync' && (s.revealedMatches || 0) < ep.lipSyncs.length) return;
      if (s.uiStep === 'track' && ep.kind !== 'finale') { beginEpisode(); return; }
      const path = steps(ep), nextStep = path[path.indexOf(s.uiStep) + 1];
      if (['outcome', 'crowning', 'track'].includes(nextStep)) E.completeEpisode(s);
      s.uiStep = nextStep || 'summary'; s.playerTrack = null; persist(); render();
    }
    persist(); render();
    return s;
  }
  function resume(trigger) {
    if (document.querySelector('.entrance-overlay')) return;
    const state = loadSeason(); if (!state) return;
    const overlay = document.createElement('div'); overlay.className = 'entrance-overlay';
    overlay.innerHTML = `<section class="entrance-shell" role="dialog" aria-modal="true" aria-label="Resume season"><button type="button" class="entrance-close options-close" aria-label="Close simulator">${icon('x')}</button><div class="entrance-content"></div><p class="visually-hidden entrance-live" aria-live="polite" aria-atomic="true"></p></section>`;
    document.body.append(overlay); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const close = () => { overlay.querySelector('.entrance-shell').disposeEntrance?.(); overlay.querySelector('.entrance-shell').disposeRelationships?.(); document.body.style.overflow = previous; document.removeEventListener('keydown', key); overlay.remove(); document.documentElement.dataset.theme = app.theme; if (trigger?.isConnected) trigger.focus({ preventScroll: true }); else document.querySelector("[data-start]")?.focus({ preventScroll: true }); };
    const key = event => { if (event.key === 'Escape') { close(); return; } if (event.key === 'Tab') { const all = [...overlay.querySelectorAll('button:not(:disabled), a[href], input, [tabindex="0"], iframe')].filter(el => el.getClientRects().length); if (event.shiftKey && document.activeElement === all[0]) { event.preventDefault(); all.at(-1)?.focus(); } else if (!event.shiftKey && document.activeElement === all.at(-1)) { event.preventDefault(); all[0]?.focus(); } } };
    document.addEventListener('keydown', key); overlay.querySelector('.entrance-close').addEventListener('click', close);
    app.race = launch(state, overlay.querySelector('.entrance-content'), overlay.querySelector('.entrance-shell'), close);
  }
  window.DRSeasonUI = { launch, resume, loadSeason };
})();
