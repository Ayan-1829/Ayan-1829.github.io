/* ================================================================
   TECHBG.JS — a very light circuit board behind the academic profile

   Faint traces run across the page the way they do on a printed
   circuit board: straight runs that turn at 45°, ending in small pads.
   The board itself never moves. Near the pointer the traces light up,
   and moving over them sends signals running along the nearest trace;
   a click sends a ring out and a burst of signals, in a random accent
   colour, along the traces around it. It runs only while the academic
   profile is showing, pauses in a background tab, and stays off for
   visitors who prefer reduced motion.
   ================================================================ */

(function () {
  const GRID = 22;           /* px between routing points */
  const GLOW = 150;          /* px: radius of the lit area around the pointer */
  const COLOURS = [[225, 201, 85], [74, 200, 255], [64, 220, 190], [170, 130, 255], [255, 130, 90]];
  /* 8 routing directions; a trace turns by one step (45°) at a time */
  const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let canvas, ctx, base, lit, W = 0, H = 0, dpr = 1;
  let traces = [], signals = [], pings = [];
  let mouse = { x: 0, y: 0, on: false }, lastSpawn = 0;
  let running = false, raf = 0, resizeTimer = 0;

  function setup() {
    canvas = document.createElement('canvas');
    canvas.id = 'techCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    ctx = canvas.getContext('2d');
    base = document.createElement('canvas');
    lit = document.createElement('canvas');
    build();

    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(build, 200); });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { mouse.on = false; });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('visibilitychange', sync);
    reduceMotion.addEventListener?.('change', sync);
    /* Profile switches toggle body.art-mode (toggle.js:applyMode) */
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    sync();
  }

  /* ── The board ──────────────────────────────────────────────── */
  /* Routes traces on a grid, never crossing a used point, then draws
     them once in two versions: faint (always) and bright (near the
     pointer). Each trace keeps its points and running lengths so a
     signal can find where it is along it. */
  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    for (const c of [canvas, base, lit]) { c.width = W * dpr; c.height = H * dpr; }
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.ceil(W / GRID) + 1, rows = Math.ceil(H / GRID) + 1;
    const used = new Uint8Array(cols * rows);
    const free = (c, r) => c >= 0 && r >= 0 && c < cols && r < rows && !used[r * cols + c];
    traces = [];
    const target = Math.round((cols * rows) / 18);
    for (let tries = 0; tries < target * 6 && traces.length < target; tries++) {
      let c = Math.floor(Math.random() * cols), r = Math.floor(Math.random() * rows);
      if (!free(c, r)) continue;
      let d = Math.floor(Math.random() * 8);
      const cells = [[c, r]];
      used[r * cols + c] = 1;
      const steps = 4 + Math.floor(Math.random() * 16);
      for (let s = 0; s < steps; s++) {
        if (s > 1 && Math.random() < 0.22) d = (d + (Math.random() < 0.5 ? 1 : 7)) % 8;
        const nc = c + DIRS[d][0], nr = r + DIRS[d][1];
        if (!free(nc, nr)) break;
        c = nc; r = nr;
        used[r * cols + c] = 1;
        cells.push([c, r]);
      }
      if (cells.length < 4) continue;
      /* keep only the corners as points */
      const pts = [cells[0]];
      for (let k = 1; k < cells.length - 1; k++) {
        const a = cells[k - 1], b = cells[k], n = cells[k + 1];
        if (b[0] - a[0] !== n[0] - b[0] || b[1] - a[1] !== n[1] - b[1]) pts.push(b);
      }
      pts.push(cells[cells.length - 1]);
      const p = pts.map(([x, y]) => [x * GRID + GRID / 2, y * GRID + GRID / 2]);
      const lens = [0];
      for (let k = 1; k < p.length; k++) lens.push(lens[k - 1] + Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]));
      traces.push({ p, lens, total: lens[lens.length - 1] });
    }
    /* Close to the page colour, so the board never competes with the text */
    drawBoard(base, 'rgba(70, 110, 170, 0.22)', 1);
    drawBoard(lit, 'rgba(110, 165, 230, 0.6)', 1.2);
    signals = [];
    pings = [];
  }

  function drawBoard(target, colour, width) {
    const g = target.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    g.strokeStyle = colour;
    g.fillStyle = colour;
    g.lineWidth = width;
    g.lineJoin = 'round';
    for (const t of traces) {
      g.beginPath();
      g.moveTo(t.p[0][0], t.p[0][1]);
      for (let k = 1; k < t.p.length; k++) g.lineTo(t.p[k][0], t.p[k][1]);
      g.stroke();
      /* a filled via at the start, a ring-shaped pad at the end */
      const [sx, sy] = t.p[0], [ex, ey] = t.p[t.p.length - 1];
      g.beginPath(); g.arc(sx, sy, 2.2, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(ex, ey, 3.4, 0, Math.PI * 2); g.stroke();
    }
  }

  /* ── Signals ────────────────────────────────────────────────── */
  function pointAt(t, dist) {
    dist = Math.max(0, Math.min(t.total, dist));
    let k = 1;
    while (k < t.lens.length - 1 && t.lens[k] < dist) k++;
    const f = (dist - t.lens[k - 1]) / ((t.lens[k] - t.lens[k - 1]) || 1);
    return [t.p[k - 1][0] + (t.p[k][0] - t.p[k - 1][0]) * f, t.p[k - 1][1] + (t.p[k][1] - t.p[k - 1][1]) * f];
  }

  /* How close a trace passes to a point, and how far along it that is */
  function closestOn(t, x, y) {
    let d = Infinity, at = 0;
    for (let k = 1; k < t.p.length; k++) {
      const [ax, ay] = t.p[k - 1], [bx, by] = t.p[k];
      const vx = bx - ax, vy = by - ay, len2 = vx * vx + vy * vy || 1;
      const f = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / len2));
      const dk = Math.hypot(x - (ax + vx * f), y - (ay + vy * f));
      if (dk < d) { d = dk; at = t.lens[k - 1] + Math.sqrt(len2) * f; }
    }
    return { t, d, at };
  }

  /* Traces passing within `within` px of a point, nearest first */
  function near(x, y, within) {
    return traces.map(t => closestOn(t, x, y)).filter(h => h.d < within).sort((a, b) => a.d - b.d);
  }

  function launch(t, at, colour) {
    const dir = at > t.total / 2 ? -1 : 1;   /* run towards the farther end */
    signals.push({ t, pos: at, dir, speed: 3 + Math.random() * 2, c: colour, life: 1 });
  }

  function onMove(e) {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = e.pointerType !== 'touch';
    if (!running || !mouse.on) return;
    const now = performance.now();
    if (now - lastSpawn < 140 || signals.length > 24) return;
    const [hit] = near(e.clientX, e.clientY, 60);
    if (hit) { launch(hit.t, hit.at, COLOURS[1]); lastSpawn = now; }
  }

  function onDown(e) {
    if (!running) return;
    const c = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    pings.push({ x: e.clientX, y: e.clientY, r: 0, c });
    /* signals out along up to eight traces around the click */
    near(e.clientX, e.clientY, 170).slice(0, 8).forEach(h => launch(h.t, h.at, c));
  }

  /* ── Frame ──────────────────────────────────────────────────── */
  function frame() {
    raf = requestAnimationFrame(frame);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(base, 0, 0, W, H);

    /* Light up the board around the pointer, brightest at the centre */
    if (mouse.on) {
      for (const [r, a] of [[GLOW, 0.18], [GLOW * 0.65, 0.22], [GLOW * 0.35, 0.26]]) {
        ctx.save();
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, r, 0, Math.PI * 2); ctx.clip();
        ctx.globalAlpha = a;
        ctx.drawImage(lit, 0, 0, W, H);
        ctx.restore();
      }
    }

    for (let k = pings.length - 1; k >= 0; k--) {
      const p = pings[k];
      p.r += 6;
      const life = 1 - p.r / 420;
      if (life <= 0) { pings.splice(k, 1); continue; }
      ctx.strokeStyle = `rgba(${p.c[0]}, ${p.c[1]}, ${p.c[2]}, ${0.3 * life})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
    }

    /* Each signal is a short bright streak with a glowing head */
    ctx.lineCap = 'round';
    for (let k = signals.length - 1; k >= 0; k--) {
      const s = signals[k];
      s.pos += s.dir * s.speed;
      if (s.pos < -40 || s.pos > s.t.total + 40) { signals.splice(k, 1); continue; }
      const tail = s.pos - s.dir * 34;
      const [hx, hy] = pointAt(s.t, s.pos);
      ctx.strokeStyle = `rgba(${s.c[0]}, ${s.c[1]}, ${s.c[2]}, 0.6)`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const steps = 6;
      for (let i = 0; i <= steps; i++) {
        const [x, y] = pointAt(s.t, tail + (s.pos - tail) * (i / steps));
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = `rgba(${s.c[0]}, ${s.c[1]}, ${s.c[2]}, 0.8)`;
      ctx.beginPath(); ctx.arc(hx, hy, 2, 0, Math.PI * 2); ctx.fill();
    }
  }

  function sync() {
    const want = !document.body.classList.contains('art-mode') && !document.hidden && !reduceMotion.matches;
    if (want && !running) {
      running = true;
      raf = requestAnimationFrame(frame);
    } else if (!want && running) {
      running = false;
      cancelAnimationFrame(raf);
      signals = [];
      pings = [];
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
