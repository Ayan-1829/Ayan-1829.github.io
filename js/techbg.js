/* ================================================================
   TECHBG.JS — a very light network behind the academic profile

   Faint nodes drift slowly and link up with thin lines when they come
   near each other. Nodes close to the pointer reach out to it and lean
   gently towards it. A click sends out a ring, a "ping", in a random
   accent colour that lights up the nodes it passes for a moment.
   It runs only while the academic profile is showing, pauses in a
   background tab, and stays off for visitors who prefer reduced motion.
   ================================================================ */

(function () {
  const LINK = 130;          /* px: nodes closer than this are linked */
  const REACH = 170;         /* px: nodes closer than this link to the pointer */
  const COLOURS = [[225, 201, 85], [74, 144, 217], [64, 200, 190], [160, 120, 255], [240, 120, 90]];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let canvas, ctx, W = 0, H = 0, nodes = [], pings = [];
  let mouse = { x: 0, y: 0, on: false };
  let running = false, raf = 0;

  function setup() {
    canvas = document.createElement('canvas');
    canvas.id = 'techCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    ctx = canvas.getContext('2d');
    resize();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = e.pointerType !== 'touch'; }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { mouse.on = false; });
    window.addEventListener('pointerdown', e => {
      if (running) pings.push({ x: e.clientX, y: e.clientY, r: 0, c: COLOURS[Math.floor(Math.random() * COLOURS.length)] });
    }, { passive: true });
    document.addEventListener('visibilitychange', sync);
    reduceMotion.addEventListener?.('change', sync);
    /* Profile switches toggle body.art-mode (toggle.js:applyMode) */
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    sync();
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(110, Math.max(24, (W * H) / 14000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 1.3, heat: 0, c: COLOURS[1],
    }));
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    ctx.clearRect(0, 0, W, H);

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
      if (mouse.on) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
        if (d < REACH && d > 1) { n.x += dx / d * 0.25; n.y += dy / d * 0.25; }
      }
      n.heat *= 0.96;
    }

    /* Pings: expanding rings that light up the nodes they cross */
    for (let k = pings.length - 1; k >= 0; k--) {
      const p = pings[k];
      p.r += 6;
      const life = 1 - p.r / 520;
      if (life <= 0) { pings.splice(k, 1); continue; }
      ctx.strokeStyle = `rgba(${p.c[0]}, ${p.c[1]}, ${p.c[2]}, ${0.45 * life})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
      for (const n of nodes) {
        if (Math.abs(Math.hypot(n.x - p.x, n.y - p.y) - p.r) < 8) { n.heat = 1; n.c = p.c; }
      }
    }

    /* Links between nearby nodes, tinted by any node that is lit */
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > LINK) continue;
        const hot = a.heat > b.heat ? a : b;
        const c = hot.heat > 0.05 ? hot.c : COLOURS[1];
        ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${(1 - d / LINK) * (0.22 + hot.heat * 0.5)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }

    /* Nodes near the pointer reach out to it */
    if (mouse.on) {
      for (const n of nodes) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        if (d > REACH) continue;
        ctx.strokeStyle = `rgba(225, 201, 85, ${(1 - d / REACH) * 0.35})`;
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }

    for (const n of nodes) {
      const c = n.heat > 0.05 ? n.c : [140, 180, 235];
      ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.4 + n.heat * 0.6})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r + n.heat * 1.5, 0, Math.PI * 2); ctx.fill();
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
      pings = [];
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
