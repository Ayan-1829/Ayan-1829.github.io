/* ================================================================
   WATER.JS — a very light water surface behind the art profile

   A small ripple simulation (one height value per 6px cell) drawn as
   faint highlights and shadows on a canvas behind the page content.
   Moving the pointer stirs the water, and it settles back to still when
   nothing moves. Pressing drops one colour of ink (picked at random,
   and shared with the click splash in cursors.js through
   window.inkColour); holding keeps pouring it, so the pool of colour
   grows wider the longer the press lasts. Ink spreads, shimmers with
   the ripples and slowly fades. It runs only while the art profile is showing, pauses
   in a background tab, and stays off for visitors who prefer reduced
   motion. The canvas is tiny and the browser scales it up, which
   keeps it cheap and makes it soft.
   ================================================================ */

(function () {
  const CELL = 6;            /* px of screen per simulated cell */
  const DAMP = 0.975;        /* how quickly ripples die away */
  const INK_FADE = 0.992;    /* how quickly ink fades (per frame) */
  const INKS = [             /* bright paint colours, like the splashes */
    [255, 64, 140], [255, 150, 40], [255, 214, 50], [40, 196, 176],
    [124, 92, 255], [56, 158, 255], [96, 206, 96], [236, 72, 72],
  ];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let canvas, ctx, image, w = 0, h = 0;
  let cur, prev;                         /* water height now, and one step ago */
  let inkR, inkG, inkB, inkA;            /* ink: colour × amount, and amount */
  let nR, nG, nB, nA;                    /* next ink step */
  let inkLeft = 0;                       /* total ink, to skip ink work when clear */
  let running = false, raf = 0, lastX = null, lastY = null;
  let pour = null;                       /* { x, y, c, t0 } while the pointer is held down */

  function setup() {
    canvas = document.createElement('canvas');
    canvas.id = 'waterCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    ctx = canvas.getContext('2d');
    resize();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    /* Capture phase, so the colour is chosen before cursors.js draws
       the click splash in it */
    window.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    for (const type of ['pointerup', 'pointercancel', 'blur']) window.addEventListener(type, () => { pour = null; });
    document.addEventListener('visibilitychange', sync);
    reduceMotion.addEventListener?.('change', sync);
    /* Profile switches toggle body.art-mode (toggle.js:applyMode) */
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    sync();
  }

  /* One extra cell on every side keeps the edges out of view */
  function resize() {
    w = Math.ceil(window.innerWidth / CELL) + 2;
    h = Math.ceil(window.innerHeight / CELL) + 2;
    canvas.width = w;
    canvas.height = h;
    Object.assign(canvas.style, { left: -CELL + 'px', top: -CELL + 'px', width: w * CELL + 'px', height: h * CELL + 'px' });
    const n = w * h;
    cur = new Float32Array(n); prev = new Float32Array(n);
    inkR = new Float32Array(n); inkG = new Float32Array(n); inkB = new Float32Array(n); inkA = new Float32Array(n);
    nR = new Float32Array(n); nG = new Float32Array(n); nB = new Float32Array(n); nA = new Float32Array(n);
    inkLeft = 0;
    image = ctx.createImageData(w, h);
  }

  /* Calls fn(index, weight) for each cell in a soft disc around a point */
  function eachInDisc(px, py, r, fn) {
    const cx = Math.round(px / CELL) + 1, cy = Math.round(py / CELL) + 1;
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        const dist2 = x * x + y * y;
        if (dist2 > r * r) continue;
        const X = cx + x, Y = cy + y;
        if (X > 0 && X < w - 1 && Y > 0 && Y < h - 1) fn(Y * w + X, 1 - dist2 / (r * r + 1));
      }
    }
  }

  function disturb(px, py, amount, r) {
    eachInDisc(px, py, r, (i, k) => { cur[i] += amount * k; });
  }

  function pickInk() {
    const base = INKS[Math.floor(Math.random() * INKS.length)];
    return base.map(v => Math.round(Math.max(0, Math.min(255, v + (Math.random() - 0.5) * 40))));
  }

  function dropInk(px, py, c) {
    eachInDisc(px, py, 7, (i, k) => {
      const a = k * 3;  /* more than full strength at the centre, so it stays vivid while it spreads */
      inkR[i] += c[0] * a; inkG[i] += c[1] * a; inkB[i] += c[2] * a; inkA[i] += a;
      inkLeft += a;
    });
  }

  /* While held, ink keeps flowing in: the pool of colour grows from
     about 40px to about 200px across. Each cell is topped up to a
     level (not added to), so the pool widens without getting darker. */
  function pourInk(now) {
    const r = Math.min(5 + (now - pour.t0) / 45, 34);
    const c = pour.c;
    eachInDisc(pour.x, pour.y, Math.round(r), (i, k) => {
      const need = k * 2.2 - inkA[i];
      if (need <= 0) return;
      inkR[i] += c[0] * need; inkG[i] += c[1] * need; inkB[i] += c[2] * need; inkA[i] += need;
      inkLeft += need;
    });
    if (now - (pour.lastRipple || 0) > 120) { disturb(pour.x, pour.y, 70, 2); pour.lastRipple = now; }
  }

  /* The faster the pointer moves, the more it stirs the water */
  function onMove(e) {
    if (pour) { pour.x = e.clientX; pour.y = e.clientY; }
    if (!running) return;
    if (lastX !== null) {
      const speed = Math.min(Math.hypot(e.clientX - lastX, e.clientY - lastY), 40);
      if (speed > 1) disturb(e.clientX, e.clientY, speed * 4, 3);
    }
    lastX = e.clientX;
    lastY = e.clientY;
  }

  function onDown(e) {
    if (!running || e.button > 0) return;
    const c = pickInk();
    window.inkColour = c;
    disturb(e.clientX, e.clientY, 380, 3);
    dropInk(e.clientX, e.clientY, c);
    pour = { x: e.clientX, y: e.clientY, c, t0: performance.now() };
  }

  /* Classic two-buffer ripple step: each cell becomes the average of its
     neighbours now, minus where it was a step ago, slightly damped */
  function step() {
    for (let y = 1; y < h - 1; y++) {
      let i = y * w + 1;
      for (let x = 1; x < w - 1; x++, i++) {
        prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w]) * 0.5 - prev[i]) * DAMP;
      }
    }
    const t = cur; cur = prev; prev = t;
  }

  /* Ink spreads to its neighbours and fades a little each frame */
  function spreadInk() {
    let left = 0;
    for (let y = 1; y < h - 1; y++) {
      let i = y * w + 1;
      for (let x = 1; x < w - 1; x++, i++) {
        const a = inkA[i] * 0.84 + (inkA[i - 1] + inkA[i + 1] + inkA[i - w] + inkA[i + w]) * 0.04;
        if (a < 0.002) { nA[i] = nR[i] = nG[i] = nB[i] = 0; continue; }
        nA[i] = a * INK_FADE;
        nR[i] = (inkR[i] * 0.84 + (inkR[i - 1] + inkR[i + 1] + inkR[i - w] + inkR[i + w]) * 0.04) * INK_FADE;
        nG[i] = (inkG[i] * 0.84 + (inkG[i - 1] + inkG[i + 1] + inkG[i - w] + inkG[i + w]) * 0.04) * INK_FADE;
        nB[i] = (inkB[i] * 0.84 + (inkB[i - 1] + inkB[i + 1] + inkB[i - w] + inkB[i + w]) * 0.04) * INK_FADE;
        left += nA[i];
      }
    }
    let t;
    t = inkA; inkA = nA; nA = t;
    t = inkR; inkR = nR; nR = t;
    t = inkG; inkG = nG; nG = t;
    t = inkB; inkB = nB; nB = t;
    inkLeft = left;
  }

  /* Slopes facing the light (top left) are faint white highlights, the
     others a faint blue-green shade. Ink is read slightly off-centre
     along the slope, so it wobbles with the ripples like colour in water. */
  function draw() {
    const d = image.data;
    const hasInk = inkLeft > 0.05;
    for (let y = 1; y < h - 1; y++) {
      let i = y * w + 1;
      for (let x = 1; x < w - 1; x++, i++) {
        const sx = cur[i - 1] - cur[i + 1], sy = cur[i - w] - cur[i + w], s = sx + sy;
        let r, g, b, a;
        if (s > 0) { r = 255; g = 255; b = 255; a = Math.min(s * 0.6, 44) / 255; }
        else       { r = 60;  g = 120; b = 140; a = Math.min(-s * 0.6, 24) / 255; }
        if (hasInk) {
          const ox = Math.max(-2, Math.min(2, Math.round(sx * 0.02)));
          const oy = Math.max(-2, Math.min(2, Math.round(sy * 0.02)));
          let j = i + ox + oy * w;
          if (j < 0 || j >= inkA.length) j = i;
          const amt = inkA[j];
          if (amt > 0.004) {
            const ia = Math.min(amt, 1) * 0.5, inv = 1 / amt;
            /* ripple light over the ink */
            const outA = a + ia * (1 - a);
            r = (r * a + inkR[j] * inv * ia * (1 - a)) / outA;
            g = (g * a + inkG[j] * inv * ia * (1 - a)) / outA;
            b = (b * a + inkB[j] * inv * ia * (1 - a)) / outA;
            a = outA;
          }
        }
        const o = i * 4;
        d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = a * 255;
      }
    }
    ctx.putImageData(image, 0, 0);
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (pour) pourInk(now);
    step();
    if (inkLeft > 0.05) spreadInk();
    draw();
  }

  function sync() {
    const want = document.body.classList.contains('art-mode') && !document.hidden && !reduceMotion.matches;
    if (want && !running) {
      running = true;
      lastX = lastY = null;
      raf = requestAnimationFrame(frame);
    } else if (!want && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
