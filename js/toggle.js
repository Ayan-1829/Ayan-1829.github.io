/* ================================================================
   TOGGLE.JS  —  Profile Switcher + hash-based routing

   Academic and Art profiles now live at their own URLs (#academic /
   #art), matching the per-section hashes already used elsewhere
   (#about, #projects, …). Shareable deep links for individual
   projects/courses (#project-…, #course-…) are also routed here so a
   pasted link reopens the exact modal, in the right profile.
   ================================================================ */

let isArtMode = false;

/* Section ids that only exist in one profile — used to infer which
   profile a shared link belongs to. */
const ART_ONLY_SECTION_IDS      = new Set(['gallery', 'art-experience']);
const ACADEMIC_ONLY_SECTION_IDS = new Set(['experience', 'education', 'projects', 'courses', 'skills']);

/* Applies all the visual/DOM side-effects of a profile switch, without
   touching browser history — used both by toggleProfile() (which does
   push a new entry) and by hash-driven navigation (which doesn't, since
   the URL already reflects the target state). */
function applyMode(mode) {
  isArtMode = (mode === 'art');

  document.body.classList.toggle('art-mode', isArtMode);

  document.querySelectorAll('.nav-academic-only').forEach(el => {
    el.style.display = isArtMode ? 'none' : 'block';
  });
  document.querySelectorAll('.nav-art-only').forEach(el => {
    el.style.display = isArtMode ? 'block' : 'none';
  });

  setFloatingIcon(isArtMode ? 'academic' : 'art');

  Render.hero(mode);

  if (typeof updateCursorForMode === 'function') {
    updateCursorForMode(mode);
  }

  if (typeof setDocMeta === 'function') {
    if (isArtMode) {
      setDocMeta('Ayan Sarkar — Visual Artist', 'Self-taught painter and visual artist — explore original paintings and the art journey behind them.');
    } else {
      setDocMeta();
    }
  }
}

function toggleProfile() {
  const newMode = isArtMode ? 'academic' : 'art';
  applyMode(newMode);

  history.pushState({ mode: newMode }, '', '#' + newMode);

  // Count art profile views (analytics.js provides trackEvent)
  if (newMode === 'art' && typeof window.trackEvent === 'function') {
    window.trackEvent('art_profile_view');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMenu();
}

/* `initialMode` lets boot (index.html) land directly in the profile a
   shared #art / #gallery / … link pointed at, instead of always
   starting academic and flashing to the right profile a moment later. */
function initToggle(initialMode = 'academic') {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  isArtMode = (initialMode === 'art');
  document.body.classList.toggle('art-mode', isArtMode);
  setFloatingIcon(isArtMode ? 'academic' : 'art');

  document.querySelectorAll('.nav-art-only').forEach(el => {
    el.style.display = isArtMode ? 'block' : 'none';
  });
  document.querySelectorAll('.nav-academic-only').forEach(el => {
    el.style.display = isArtMode ? 'none' : 'block';
  });
}

function closeMenu() {
  document.getElementById('hamburger')?.classList.remove('open');
  document.getElementById('nav-links')?.classList.remove('open');
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* Shows the icon of the profile the button will SWITCH TO. */
function setFloatingIcon(targetProfile) {
  const icon = document.getElementById('floating-icon');
  if (!icon) return;
  if (targetProfile === 'art') {
    icon.src = 'images/Art-profile Icon.webp';
    icon.alt = 'Switch to Art Profile';
  } else {
    icon.src = 'images/Academic-profile Icon.webp';
    icon.alt = 'Switch to Academic Profile';
  }
}

/* Which profile a given hash belongs to, or null if it's shared
   (#about, #contact) / unrecognised and shouldn't force a switch. */
function modeForHash(hash) {
  const h = String(hash || '').replace(/^#/, '');
  if (h === 'art' || h === 'academic') return h;
  if (ART_ONLY_SECTION_IDS.has(h)) return 'art';
  if (ACADEMIC_ONLY_SECTION_IDS.has(h)) return 'academic';
  if (h.startsWith('project-') || h.startsWith('course-')) return 'academic';
  return null;
}

/* Opens the project/course modal or scrolls to the section named by
   the current hash. `replace` is true on first load (so the initial
   render doesn't push a redundant history entry) and false for
   in-session navigation. */
function routeFromHash({ replace = false } = {}) {
  const h = window.location.hash.replace(/^#/, '');
  if (!h) return;

  if (h.startsWith('project-')) {
    const slug = h.slice('project-'.length);
    const list = window._allProjects || [];
    const idx = list.findIndex(p => slugify(p.title) === slug);
    if (idx !== -1 && typeof openProjectModal === 'function') {
      openProjectModal(idx, { replace });
      document.getElementById('projects')?.scrollIntoView({ behavior: 'auto' });
    }
    return;
  }

  if (h.startsWith('course-')) {
    const slug = h.slice('course-'.length);
    const list = window._allCourses || [];
    const idx = list.findIndex(c => slugify(c.code) === slug);
    if (idx !== -1 && typeof openCourseModal === 'function') {
      openCourseModal(idx, { replace });
      document.getElementById('courses')?.scrollIntoView({ behavior: 'auto' });
    }
    return;
  }

  if (h === 'art' || h === 'academic') return;

  document.getElementById(h)?.scrollIntoView({ behavior: 'auto' });
}

/* Back/forward navigation: close modals the new hash no longer points
   at, switch profile if the new hash belongs to the other one, then
   route to whatever the hash now names. */
function handleHashNavigation() {
  const hash = window.location.hash;
  const h = hash.replace(/^#/, '');

  if (!h.startsWith('project-')) {
    const achievementModal = document.getElementById('achievementModal');
    if (achievementModal && achievementModal.classList.contains('open') && typeof closeAchievementModal === 'function') {
      closeAchievementModal({ skipHashUpdate: true });
    }
  }
  if (!h.startsWith('course-')) {
    const courseModal = document.getElementById('courseModal');
    if (courseModal && courseModal.classList.contains('open') && typeof closeCourseModal === 'function') {
      closeCourseModal({ skipHashUpdate: true });
    }
  }

  const forcedMode = modeForHash(hash);
  if (forcedMode && forcedMode !== (isArtMode ? 'art' : 'academic')) {
    applyMode(forcedMode);
  }

  routeFromHash({ replace: true });
}
