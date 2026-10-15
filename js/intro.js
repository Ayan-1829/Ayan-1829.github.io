/* ================================================================
   INTRO.JS — first-visit split-screen intro

   On a visitor's first page view of a session (and only when they
   came to the plain address, not a shared #section/#project link),
   the site opens on two halves side by side: the educator and the
   painter. Choosing one grows it to fill the screen and opens the
   site in that profile. The nav logo brings the intro back.

   Whether it shows is decided in <head> (index.html) before the first
   paint, which adds html.intro-pending; css/intro.css has the styles.
   Numbers on the cards are counted from the data files, so they stay
   right as courses, projects and paintings are added.
   ================================================================ */

const Intro = (() => {
  const SEEN_KEY = 'introSeen';
  let el = null;
  let leaving = false;

  function counts() {
    const projects = (typeof DATA_PROJECTS !== 'undefined') ? DATA_PROJECTS : [];
    const cm = projects.find(p => p.type === 'courseMaterials');
    const sites = cm ? (cm.institutions || []).reduce((n, i) => n + (i.courses || []).length, 0) : 0;
    const taught = (typeof DATA_COURSES !== 'undefined') ? DATA_COURSES.reduce((n, u) => n + (u.courses || []).length, 0) : 0;
    const artworks = (typeof DATA_ARTWORK !== 'undefined') ? DATA_ARTWORK.length : 0;
    const wins = (typeof DATA_ART_JOURNEY !== 'undefined') ? DATA_ART_JOURNEY.filter(j => /champion/i.test(j.role || '')).length : 0;
    return { sites, taught, projects: projects.length, artworks, wins };
  }

  const stat = (n, label) => n ? `<span class="intro-stat"><b>${n}</b>${label}</span>` : '';

  /* [text, left, top, size, depth] — positions are % of the half */
  const GLYPHS = [
    ['{ }', '8%', '30%', '2.2rem', '26px'], ['</>', '62%', '16%', '1.6rem', '16px'],
    ['01',  '40%', '38%', '1.1rem', '10px'], ['λ',   '84%', '36%', '2.4rem', '30px'],
    ['∑',   '22%', '52%', '1.8rem', '20px'], ['if',  '52%', '60%', '1.2rem', '12px'],
    ['&&',  '12%', '74%', '1.3rem', '18px'], ['0x1F','74%', '27%', '1rem',   '8px'],
    ['→',   '34%', '20%', '1.5rem', '22px'], ['[ ]', '90%', '62%', '1.4rem', '14px'],
  ];
  /* [left, top, width, hue, depth] */
  const SPLASHES = [
    ['70%', '-6%', '190px', '0deg',    '22px'], ['-5%', '68%', '170px', '140deg', '16px'],
    ['90%', '22%', '100px', '200deg',  '28px'], ['44%', '84%', '110px', '300deg', '12px'],
  ];

  function markup() {
    const prof = PORTFOLIO_DATA.profile;
    const c = counts();
    const glyphs = GLYPHS.map(([t, x, y, s, d], n) =>
      `<span class="intro-glyph" style="--x:${x};--y:${y};--s:${s};--d:${d};--n:${n}">${t}</span>`).join('');
    const splashes = SPLASHES.map(([x, y, w, h, d], n) =>
      `<img class="intro-splash" src="images/color_splash.webp" alt="" style="--x:${x};--y:${y};--w:${w};--h:${h};--d:${d};--n:${n}"/>`).join('');
    return `
      <div class="intro-name" id="intro-name">
        <span class="intro-hello">Hello, I'm</span>
        <span class="intro-fullname">${prof.name}</span>
      </div>

      <button type="button" class="intro-side intro-side--acad" data-mode="academic">
        <span class="intro-bg" aria-hidden="true"><span class="intro-grid"></span>${glyphs}</span>
        <img class="intro-cutout" src="images/intro/Ayan_cutout.webp" alt=""/>
        <span class="intro-copy">
          <span class="intro-kicker"><span class="intro-num">01</span>The Educator</span>
          <span class="intro-role">Lecturer in Computer Science &amp; Engineering</span>
          <span class="intro-org"><img src="images/GUB_leaf_Logo.webp" alt=""/>${prof.academic.subtitle}</span>
          <span class="intro-tag">${prof.academic.tagline}</span>
          <span class="intro-stats">${stat(c.sites, 'interactive course sites')}${stat(c.taught, 'courses taught')}${stat(c.projects, 'projects')}</span>
          <span class="intro-cta">Enter Academic Profile <span aria-hidden="true">→</span></span>
        </span>
      </button>

      <div class="intro-seam" aria-hidden="true">
        <span class="intro-medal"><img src="images/Ayan_Logo.webp" alt=""/></span>
        <span class="intro-or">choose a side</span>
      </div>

      <button type="button" class="intro-side intro-side--art" data-mode="art">
        <span class="intro-bg" aria-hidden="true"><span class="intro-paper"></span>${splashes}</span>
        <span class="intro-frame" aria-hidden="true">
          <span class="intro-tape"></span>
          <img src="images/intro/Ayan_sketch.webp" alt=""/>
          <span class="intro-caption">self-portrait · graphite</span>
        </span>
        <span class="intro-copy">
          <span class="intro-kicker">The Painter<span class="intro-num">02</span></span>
          <span class="intro-role">${prof.art.eyebrow}<svg class="intro-stroke" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14 C 70 4, 150 18, 220 8 S 290 10, 296 6"/></svg></span>
          <span class="intro-tag">${prof.art.tagline}</span>
          <span class="intro-stats">${stat(c.artworks, 'artworks')}${stat(c.wins ? c.wins + '×' : 0, 'champion')}${stat(4, 'mediums')}</span>
          <span class="intro-cta">Enter Art Studio <span aria-hidden="true">→</span></span>
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
    el.setAttribute('aria-labelledby', 'intro-name');
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
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) {}

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
