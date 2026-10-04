/* ================================================================
   CURSORS.JS
   Academic mode → pen_icon.png cursor + ink drawing on drag
   Art mode      → brush_icon.png cursor + color splash on click

================================================================ */

const PEN_CURSOR_URL   = `url('images/pen_icon.png') 2 54, auto`;
const BRUSH_CURSOR_URL = `url('images/brush_icon.png') 4 28, crosshair`;
const SPLASH_SRC       = 'images/color_splash.webp';
const SPLASH_SIZES     = [60, 80, 100, 120, 140, 90, 70, 110];

let splashClickListener = null;
let currentMode = 'academic';

/* ── Safari detection ────────────────────────── */
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

/* ── Fake cursor for Safari (hotspot workaround) ─────────────
   Safari ignores the hotspot values in url() cursor declarations,
   always treating the top-left corner as the hotspot. We hide the
   native cursor and follow the pointer with a positioned <img>
   instead, offsetting it so the visual tip lands at the hotspot.
──────────────────────────────────────────────────────────────── */
let fakeCursorEl = null;
let fakeCursorMoveHandler = null;

function showFakeCursor(hotspotX, hotspotY, imgSrc) {
  hideFakeCursor();

  document.body.style.cursor = 'none';

  fakeCursorEl = document.createElement('img');
  fakeCursorEl.src = imgSrc;
  Object.assign(fakeCursorEl.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    width:         '32px',
    height:        '32px',
    pointerEvents: 'none',
    cursor:        'none',
    zIndex:        '999999',
    transform:     `translate(-${hotspotX}px, -${hotspotY}px)`,
  });
  document.body.appendChild(fakeCursorEl);

  fakeCursorMoveHandler = e => {
    if (fakeCursorEl) {
      fakeCursorEl.style.left = e.clientX + 'px';
      fakeCursorEl.style.top  = e.clientY + 'px';
    }
  };
  document.addEventListener('mousemove', fakeCursorMoveHandler);
}

function hideFakeCursor() {
  if (fakeCursorEl) {
    fakeCursorEl.remove();
    fakeCursorEl = null;
  }
  if (fakeCursorMoveHandler) {
    document.removeEventListener('mousemove', fakeCursorMoveHandler);
    fakeCursorMoveHandler = null;
  }
  document.body.style.cursor = '';
}

/* ── Ink canvas setup ────────────────────────── */
const inkCanvas = document.getElementById('inkCanvas');
const inkCtx    = inkCanvas ? inkCanvas.getContext('2d') : null;
let   isDrawing = false;
let   inkStrokes = [];  // each stroke: { points[], opacity, timer, rafId }

/* Tags / classes that should NOT start an ink stroke */
const SKIP_SELECTORS = [
  'a', 'button', 'input', 'textarea', 'select', 'label',
  'img', '.gallery-item', '.course-card', '.skill-pill',
  '.floating-toggle', '.nav-links', '.modal', '.lightbox',
  '.course-modal-overlay', '[onclick]',
];

function isInteractiveTarget(el) {
  if (!el) return false;
  for (const sel of SKIP_SELECTORS) {
    if (el.closest(sel)) return true;
  }
  return false;
}

function resizeInkCanvas() {
  if (!inkCanvas) return;
  const saved = inkStrokes.slice();
  inkCanvas.width  = window.innerWidth;
  inkCanvas.height = window.innerHeight;
  inkStrokes = saved;
  redrawInk();
}

function redrawInk() {
  if (!inkCtx || !inkCanvas) return;
  inkCtx.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
  inkStrokes.forEach(stroke => {
    if (stroke.points.length < 2) return;
    inkCtx.beginPath();
    inkCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      inkCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    const alpha = 0.92 * (stroke.opacity !== undefined ? stroke.opacity : 1);
    inkCtx.strokeStyle = `rgba(230, 210, 160, ${alpha})`;
    inkCtx.lineWidth   = 2.2;
    inkCtx.lineCap     = 'round';
    inkCtx.lineJoin    = 'round';
    inkCtx.stroke();
  });
}

function fadeOutStroke(stroke, duration) {
  const startTime = performance.now();
  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    stroke.opacity = 1 - progress;
    redrawInk();
    if (progress < 1) {
      stroke.rafId = requestAnimationFrame(step);
    } else {
      inkStrokes = inkStrokes.filter(s => s !== stroke);
      redrawInk();
    }
  }
  stroke.rafId = requestAnimationFrame(step);
}

/* ── Pointer-event handlers (replaces mouse events) ─────────── */
function onPointerDown(e) {
  if (currentMode !== 'academic') return;
  if (e.pointerType === 'touch') return;   /* ignore touch — let the browser scroll normally */
  /* Skip if the real target under the cursor is interactive */
  const realTarget = document.elementFromPoint(e.clientX, e.clientY);
  if (isInteractiveTarget(realTarget)) return;

  isDrawing = true;
  /* Capture the pointer so pointermove/pointerup always fire here
     even when the cursor moves over images, iframes, etc.          */
  try { inkCanvas.setPointerCapture(e.pointerId); } catch (_) {}

  document.body.style.userSelect       = 'none';
  document.body.style.webkitUserSelect = 'none';

  const stroke = { points: [{ x: e.clientX, y: e.clientY }], opacity: 1, timer: null, rafId: null };
  inkStrokes.push(stroke);
}

function onPointerMove(e) {
  if (!isDrawing || currentMode !== 'academic') return;
  if (e.pointerType === 'touch') return;   /* ignore touch — let the browser scroll normally */
  const stroke = inkStrokes[inkStrokes.length - 1];
  if (!stroke) return;
  stroke.points.push({ x: e.clientX, y: e.clientY });
  redrawInk();
}

function onPointerUp(e) {
  if (!isDrawing) return;
  isDrawing = false;
  document.body.style.userSelect       = '';
  document.body.style.webkitUserSelect = '';
  try { inkCanvas.releasePointerCapture(e.pointerId); } catch (_) {}

  const stroke = inkStrokes[inkStrokes.length - 1];
  if (!stroke || stroke.points.length < 2) {
    /* Remove empty/single-point strokes immediately */
    inkStrokes = inkStrokes.filter(s => s !== stroke);
    return;
  }
  /* Hold 3 s, then fade out over 2 s */
  stroke.timer = setTimeout(() => fadeOutStroke(stroke, 2000), 3000);
}

function onPointerCancel(e) {
  /* Treat a cancelled pointer (e.g. browser gesture takeover) same as pointerup */
  onPointerUp(e);
}

function clearAllInk() {
  inkStrokes.forEach(s => {
    if (s.timer) clearTimeout(s.timer);
    if (s.rafId) cancelAnimationFrame(s.rafId);
  });
  inkStrokes = [];
  redrawInk();
}

function initInkCanvas() {
  if (!inkCanvas || !inkCtx) return;
  resizeInkCanvas();
  window.addEventListener('resize', resizeInkCanvas);

  /* canvas is pointer-events:none by default so it doesn't eat
     regular clicks — we listen on document instead               */
  document.addEventListener('pointerdown',   onPointerDown);
  document.addEventListener('pointermove',   onPointerMove);
  document.addEventListener('pointerup',     onPointerUp);
  document.addEventListener('pointercancel', onPointerCancel);
}

/* ── Cursor application ──────────────────────── */
function applyAcademicCursor() {
  currentMode = 'academic';
  document.body.classList.remove('art-mode');
  if (isSafari) {
    showFakeCursor(2, 27, 'images/pen_icon.png');
  } else {
    document.body.style.cursor = PEN_CURSOR_URL;
  }
  /* Explicitly set pen cursor on interactive elements so macOS
     doesn't override with its native hand cursor */
  setInteractiveCursor(isSafari ? 'none' : PEN_CURSOR_URL);
  removeSplashListener();
  if (inkCanvas) inkCanvas.style.pointerEvents = 'none';
}

function applyArtCursor() {
  currentMode = 'art';
  document.body.classList.add('art-mode');
  if (isSafari) {
    /* body.style.cursor = 'none' so all children inherit 'none' via CSS,
       but some elements may have stale inline cursor styles — clear them. */
    setInteractiveCursor('');
    showFakeCursor(4, 28, 'images/brush_icon.png');
  } else {
    document.body.style.cursor = BRUSH_CURSOR_URL;
    /* Don't call setInteractiveCursor here — the CSS rule
       body.art-mode * { cursor: inherit !important } handles everything,
       and inline styles would fight it on dynamically-created elements. */
  }
  addSplashListener();
  clearAllInk();
}

function setInteractiveCursor(value) {
  const selectors = ['a','button','[onclick]','.gallery-item','.floating-toggle',
                     '.course-card','.skill-pill','.nav-links a','.btn'];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => { el.style.cursor = value; });
  });
}

function addSplashListener() {
  removeSplashListener();
  splashClickListener = e => spawnSplash(e.clientX, e.clientY);
  document.addEventListener('click', splashClickListener);
}

function removeSplashListener() {
  if (splashClickListener) {
    document.removeEventListener('click', splashClickListener);
    splashClickListener = null;
  }
}

function spawnSplash(x, y) {
  const size     = SPLASH_SIZES[Math.floor(Math.random() * SPLASH_SIZES.length)];
  const rotation = Math.floor(Math.random() * 360);
  const img = document.createElement('img');
  img.src = SPLASH_SRC;
  Object.assign(img.style, {
    position: 'fixed', left: (x - size/2)+'px', top: (y - size/2)+'px',
    width: size+'px', height: size+'px', pointerEvents: 'none',
    zIndex: '9999', transform: `rotate(${rotation}deg)`,
    opacity: '1', transition: 'opacity 2s ease-out', borderRadius: '50%',
  });
  document.body.appendChild(img);
  requestAnimationFrame(() => requestAnimationFrame(() => { img.style.opacity = '0'; }));
  setTimeout(() => img.remove(), 2100);
}

function updateCursorForMode(mode) {
  if (mode === 'art') applyArtCursor();
  else                applyAcademicCursor();
}

function refreshCursor() {
  /* In art mode the CSS body.art-mode* rule handles everything —
     re-running applyArtCursor on every click would fight it.
     Only refresh in academic mode (keeps pen cursor after nav clicks). */
  if (currentMode === 'academic') updateCursorForMode('academic');
}

document.addEventListener('DOMContentLoaded', function() {
  initInkCanvas();
  applyAcademicCursor();
  document.addEventListener('click', () => setTimeout(refreshCursor, 50));
});
