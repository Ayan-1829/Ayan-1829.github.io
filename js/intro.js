/* ================================================================
   INTRO.JS — first-visit split-screen intro

   Every visit to the plain address (not a shared #section/#project
   link) opens on two halves side by side: the painter on the left and
   the educator on the right, each with its text towards the middle.
   Choosing one grows it to fill the screen and opens the site in that
   profile. The nav logo brings the intro back.

   Whether it shows is decided in <head> (index.html) before the first
   paint, which adds html.intro-pending; css/intro.css has the styles.
   ================================================================ */

const Intro = (() => {
  let el = null;
  let leaving = false;

  /* [text, left, top, size, depth] — positions are % of the half */
  const GLYPHS = [
    ['{ }', '8%', '30%', '2.2rem', '26px'], ['</>', '62%', '16%', '1.6rem', '16px'],
    ['01',  '40%', '38%', '1.1rem', '10px'], ['λ',   '84%', '36%', '2.4rem', '30px'],
    ['∑',   '22%', '52%', '1.8rem', '20px'], ['if',  '52%', '60%', '1.2rem', '12px'],
    ['&&',  '12%', '74%', '1.3rem', '18px'], ['0x1F','74%', '27%', '1rem',   '8px'],
    ['→',   '34%', '20%', '1.5rem', '22px'], ['[ ]', '90%', '62%', '1.4rem', '14px'],
  ];
  /* The painting on the art half, looked up in the gallery data for its caption */
  const PAINTING = { file: 'Child_Bird.jpg', src: 'images/intro/Painting_Birds.webp' };

  function markup() {
    const prof = PORTFOLIO_DATA.profile;
    const glyphs = GLYPHS.map(([t, x, y, s, d], n) =>
      `<span class="intro-glyph" style="--x:${x};--y:${y};--s:${s};--d:${d};--n:${n}">${t}</span>`).join('');
    const art = (typeof DATA_ARTWORK !== 'undefined' && DATA_ARTWORK.find(a => a.file === PAINTING.file)) || {};
    const caption = [art.title, art.medium && art.medium.replace(/ on canvas$/i, '').toLowerCase(), art.year].filter(Boolean).join(' · ');
    /* "Ayan" sits fully on the left (art) half and "Sarkar" fully on the right */
    const [first, ...rest] = prof.name.split(' ');
    return `
      <button type="button" class="intro-side intro-side--art" data-mode="art">
        <span class="intro-bg" aria-hidden="true"><span class="intro-paper"></span><img class="intro-splash intro-splash--corner" src="images/intro/splash.webp" alt=""/></span>
        <span class="intro-word intro-word--art" aria-hidden="true">${first}</span>
        <span class="intro-frame" aria-hidden="true">
          <img class="intro-splash intro-splash--under" src="images/intro/splash.webp" alt=""/>
          <span class="intro-card">
            <span class="intro-tape"></span>
            <img class="intro-painting" src="${PAINTING.src}" alt=""/>
            <span class="intro-caption">${caption}</span>
          </span>
        </span>
        <span class="intro-copy">
          <img class="intro-splash intro-splash--top" src="images/intro/splash.webp" alt="" aria-hidden="true"/>
          <span class="intro-kicker">The Painter<span class="intro-num">01</span></span>
          <span class="intro-role">${prof.art.eyebrow}<svg class="intro-stroke" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14 C 70 4, 150 18, 220 8 S 290 10, 296 6"/></svg></span>
          <span class="intro-tag">${prof.art.tagline}</span>
          <span class="intro-cta">Enter Art Studio <span aria-hidden="true">→</span></span>
        </span>
      </button>

      <div class="intro-seam" aria-hidden="true">
        <span class="intro-or">choose a side</span>
      </div>

      <button type="button" class="intro-side intro-side--acad" data-mode="academic">
        <span class="intro-bg" aria-hidden="true"><span class="intro-grid"></span>${glyphs}</span>
        <span class="intro-word intro-word--acad" aria-hidden="true">${rest.join(' ')}</span>
        <img class="intro-cutout" src="images/intro/Ayan_cutout.webp" alt=""/>
        <span class="intro-copy">
          <span class="intro-kicker"><span class="intro-num">02</span>The Educator</span>
          <span class="intro-role">Lecturer in Computer Science &amp; Engineering</span>
          <span class="intro-org"><img src="images/GUB_leaf_Logo.webp" alt=""/>${prof.academic.subtitle}</span>
          <span class="intro-tag">${prof.academic.tagline}</span>
          <span class="intro-cta">Enter Academic Profile <span aria-hidden="true">→</span></span>
        </span>
      </button>`;
  }

  /* The mouse nudges each half's background a little (parallax) */
  function onMove(e) {
    const side = e.target.closest && e.target.closest('.intro-side');
    if (!side) return;
    const r = side.getBoundingClientRect();
    side.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    side.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  }

  function onKey(e) {
    if (!el || leaving) return;
    const sides = el.querySelectorAll('.intro-side');
    if (e.key === 'Escape') { e.preventDefault(); choose(isArtMode ? 'art' : 'academic'); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); sides[0].focus(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); sides[1].focus(); }
    else if (e.key === 'Tab') {
      /* Keep focus inside the intro while it's open */
      e.preventDefault();
      const i = [...sides].indexOf(document.activeElement);
      sides[(i + (e.shiftKey ? -1 : 1) + 2) % 2].focus();
    }
  }

  function open() {
    if (el) return;
    if (typeof closeMenu === 'function') closeMenu();
    leaving = false;
    el = document.createElement('div');
    el.className = 'intro';
    el.id = 'intro';
    el.tabIndex = -1;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', `${PORTFOLIO_DATA.profile.name}: choose a profile`);
    el.innerHTML = markup();
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    el.addEventListener('click', e => {
      const side = e.target.closest('.intro-side');
      if (side) choose(side.dataset.mode);
    });
    el.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('keydown', onKey);
    el.focus({ preventScroll: true });
    document.documentElement.classList.remove('intro-pending');
  }

  function choose(mode) {
    if (!el || leaving) return;
    leaving = true;

    el.dataset.chosen = mode;
    el.classList.add('intro--leaving');

    /* Switch the page underneath while the chosen half grows */
    const current = isArtMode ? 'art' : 'academic';
    if (mode !== current) applyMode(mode);
    if (mode === 'art') {
      history.replaceState({ mode: 'art' }, '', '#art');
      if (typeof window.trackEvent === 'function') window.trackEvent('art_profile_view');
    } else if (location.hash) {
      history.replaceState(null, '', location.pathname);
    }
    window.scrollTo(0, 0);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => el && el.classList.add('intro--gone'), reduce ? 0 : 650);
    setTimeout(close, reduce ? 50 : 1150);
  }

  function close() {
    document.removeEventListener('keydown', onKey);
    el?.remove();
    el = null;
    leaving = false;
    document.body.style.overflow = '';
    document.documentElement.classList.remove('intro-pending');
  }

  /* Called once at boot (index.html) */
  function maybeShow() {
    if (document.documentElement.classList.contains('intro-pending')) open();
  }

  return { open, maybeShow };
})();
