const Render = {

  nav() {
    const logoText = document.querySelector('.nav-logo-text');
    if (logoText) logoText.textContent = 'Ayan Sarkar';
  },

  hero(mode = 'academic') {
    const data = PORTFOLIO_DATA.profile[mode];
    const profile = PORTFOLIO_DATA.profile;
    setText('hero-eyebrow', data.eyebrow);
    setText('hero-title',   data.subtitle);
    setText('hero-tagline', data.tagline);
    const heroSection = document.getElementById('hero-section');
    if (heroSection) heroSection.classList.toggle('hero-art', mode === 'art');
    const frame = document.getElementById('avatar-frame');
    if (frame) {
      frame.classList.toggle('avatar-frame--wide', !!data.avatarComposite);
      if (data.avatarComposite) {
        /* Layered photo: building behind, person in front, same baseline.
           Hovering the frame nudges the person forward a little. */
        frame.innerHTML = `
          <img class="avatar-backdrop" src="images/${data.avatarComposite.backdrop}" alt="${data.subtitle}"/>
          <img class="avatar-person" src="images/${data.avatarComposite.person}" alt="${profile.name}"/>`;
      } else if (data.avatarPhoto) {
        frame.innerHTML = `<img src="images/${data.avatarPhoto}" alt="${profile.name}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;display:block;"/>`;
      } else {
        frame.innerHTML = `<div style="font-size:5rem;line-height:1;">${data.avatarEmoji}</div>`;
      }
    }
    const ctaP = document.getElementById('cta-primary');
    if (ctaP) { ctaP.textContent = data.ctaPrimary.text; ctaP.href = data.ctaPrimary.href; }
    const ctaS = document.getElementById('cta-secondary');
    if (ctaS) { ctaS.textContent = data.ctaSecondary.text; }
    /* fix 6: wire CV download only for academic mode */
    if (typeof wireSecondaryBtn === 'function') wireSecondaryBtn(mode);
    /* Intro social links: YouTube / LinkedIn / Facebook — original one-color style */
    if (typeof renderSocialIcons === 'function') renderSocialIcons('hero-social', { mono: true });
  },

  about() {
    const { academic, artQuote, artBio } = PORTFOLIO_DATA.about;
    const aEl = document.querySelector('#about .academic-only');
    if (aEl) aEl.innerHTML = `<p class="about-text">${academic}</p>`;
    const artEl = document.querySelector('#about .art-only');
    if (artEl) artEl.innerHTML = `
      <p class="about-quote">${artQuote}</p>
      <p class="about-text" style="margin-top:1.5rem;">${artBio}</p>`;
  },

  experience() {
    const tl = document.querySelector('#experience .timeline');
    if (!tl) return;
    tl.innerHTML = PORTFOLIO_DATA.experience.map(job => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          ${entryHeadHTML({
            logo:  job.logo,
            scale: job.logoScale,
            title: job.organization,
            sub:   job.role,
            chips: [job.period],
          })}
          ${entryBodyHTML(job)}
        </div>
      </div>`).join('');
  },

  education() {
    const tl = document.querySelector('.edu-timeline');
    if (!tl) return;
    tl.innerHTML = PORTFOLIO_DATA.education.map(edu => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          ${entryHeadHTML({
            logo:  edu.logo,
            scale: edu.logoScale,
            title: edu.institution,
            sub:   edu.degree,
            chips: [edu.result, edu.period],
          })}
          ${entryBodyHTML(edu)}
        </div>
      </div>`).join('');
  },

  skills() {
    const c = document.querySelector('.skills-container');
    if (!c) return;
    c.innerHTML = PORTFOLIO_DATA.skills.map(group => `
      <div>
        <h3 style="font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem;">${group.label}</h3>
        <div class="skills-grid">${group.items.map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>
      </div>`).join('');
  },

  /* ── Courses: university logo + bold name, per-topic resources ── */
  courses() {
    const container = document.getElementById('courses-by-uni');
    if (!container) return;
    const groups = PORTFOLIO_DATA.coursesByUniversity || [];

    window._allCourses = [];
    groups.forEach(g => g.courses.forEach(c => window._allCourses.push(c)));

    if (!groups.length) { container.innerHTML = `<p style="color:var(--muted);">Add courses in data.js</p>`; return; }

    container.innerHTML = groups.map((group, gi) => {
      const cards = group.courses.map(course => {
        const idx = window._allCourses.indexOf(course);
        return `
          <div class="card course-card" onclick="openCourseModal(${idx})" style="cursor:pointer;">
            <div class="card-title">${course.title}</div>
            <div class="course-card-meta">
              <span class="course-card-code">${course.code}</span>
              ${courseSemesters(course).map(s => `<span class="course-card-semester">${s}</span>`).join('')}
              ${course.credits ? `<span class="course-card-credits">${course.credits} Credits</span>` : ''}
            </div>
            <div class="card-desc" style="margin-top:0.6rem;">${course.description}</div>
            <div class="course-card-footer">View Details →</div>
          </div>`;
      }).join('');

      /* Logo image with fallback, bold university name (fix 3 & 4) */
      const logoHTML = group.logo
        ? `<img src="${group.logo}" alt="${group.university}" class="uni-logo"/>`
        : '';

      /* Add a visual gap before second+ university group (fix 3) */
      const gapClass = gi > 0 ? ' uni-group--spaced' : '';

      return `
        <div class="uni-group${gapClass}">
          <div class="uni-group-header">
            ${logoHTML}
            <span class="uni-group-name">${group.university}</span>
          </div>
          <div class="cards-grid">${cards}</div>
        </div>`;
    }).join('');
  },

  artJourney() {
    const tl = document.querySelector('.art-timeline');
    if (!tl) return;
    const entries = PORTFOLIO_DATA.artJourney || [];
    tl.innerHTML = entries.map((item, i) => {
      const hasDetails = (item.achievementImages && item.achievementImages.length)
        || (item.achievementLinks && item.achievementLinks.length)
        || (item.achievementVideos && item.achievementVideos.length)
        || item.achievementImage || (item.certificateLinks && item.certificateLinks.length);
      const detailsBtn = hasDetails
        ? `<button class="topic-link" style="margin-top:0.6rem;cursor:pointer;background:none;border:1px solid var(--accent);color:var(--accent);padding:0.3rem 0.8rem;border-radius:4px;font-size:0.8rem;" onclick="openAchievementModal(${i})">🏆 View Details</button>`
        : '';
      return `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-role">${item.role}</div>
          <div class="timeline-org">${item.organization}</div>
          <div class="timeline-date">${item.period}</div>
          ${item.description ? `<div class="timeline-desc">${item.description}</div>` : ''}
          ${detailsBtn}
        </div>
      </div>`;
    }).join('');
  },

  projects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const projects = PORTFOLIO_DATA.projects || [];
    if (!projects.length) { grid.innerHTML = `<p style="color:var(--muted);">No projects added yet.</p>`; return; }
    window._allProjects = projects;
    grid.innerHTML = projects.map((p, idx) => {
      if (p.type === 'courseMaterials') return courseMaterialsCardHTML(p, idx);
      const techPills = p.tech.map(t => `<span class="skill-pill" style="font-size:0.72rem;padding:0.2rem 0.6rem;">${t}</span>`).join('');
      const bullets = p.bullets.map(b => `<li style="color:var(--muted);font-size:0.9rem;line-height:1.7;margin-bottom:0.25rem;">${b}</li>`).join('');
      /* stopPropagation so following a link doesn't also open the modal */
      const linksHTML = (p.links || []).filter(l => l.url).map(l =>
        `<a href="${l.url}" target="_blank" class="course-link-pill" onclick="event.stopPropagation()">${l.label} ↗</a>`).join('');
      const ogImageHTML = p.ogImage
        ? `<img src="images/${p.ogImage}" alt="${p.title}" style="width:100%;height:auto;max-height:350px;object-fit:contain;border-radius:8px;margin-bottom:0.8rem;"/>`
        : '';
      const iconHTML = p.icon
        ? `<img src="images/${p.icon}" alt="${p.title} icon" class="project-card-icon" style="width:2rem;height:2rem;object-fit:contain;border-radius:6px;flex-shrink:0;"/>`
        : '';
      return `
        <div class="card project-card" onclick="openProjectModal(${idx})" style="display:flex;flex-direction:column;gap:0.6rem;cursor:pointer;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
            <div class="project-card-titlewrap">${iconHTML}<div class="card-title">${p.title}</div></div>
            <span style="color:var(--muted);font-size:0.78rem;white-space:nowrap;flex-shrink:0;">${p.date}</span>
          </div>
          ${ogImageHTML}
          <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">${techPills}</div>
          <ul style="margin:0;padding-left:1.2rem;">${bullets}</ul>
          ${linksHTML ? `<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.2rem;">${linksHTML}</div>` : ''}
          <div class="course-card-footer">View Details →</div>
        </div>`;
    }).join('');
    initCmShelves(grid);
  },

  artPractice() {
    const grid = document.querySelector('.art-practice-grid');
    if (!grid) return;
    grid.innerHTML = PORTFOLIO_DATA.artPractice.map(card => `
      <div class="card card--static">
        <div class="card-icon">${card.emoji}</div>
        <div class="card-title">${card.title}</div>
        <div class="card-desc" style="margin-top:0.5rem;">${card.description}</div>
      </div>`).join('');
  },

  gallery() {
    const container = document.querySelector('.gallery-container');
    if (!container) return;
    const artworks = PORTFOLIO_DATA.artwork;
    if (!artworks || !artworks.length) { container.innerHTML = `<p style="color:var(--muted);">No artwork added yet.</p>`; return; }

    const main      = artworks.map((a, i) => ({ ...a, _i: i })).filter(a => !a.childhood);
    const childhood = artworks.map((a, i) => ({ ...a, _i: i })).filter(a =>  a.childhood);

    const renderItem = (art) => {
      const spanClass = art.span || 'normal';
      const thumb = art.file
        ? `<img src="images/artwork/${art.file}" alt="${art.title}" class="gallery-img"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
           <div class="gallery-thumb-fallback" style="display:none;background:${art.bg||'var(--surface)'};">${art.emoji||'🖼️'}</div>`
        : `<div class="gallery-thumb-fallback" style="background:${art.bg||'var(--surface)'};">${art.emoji||'🖼️'}</div>`;
      return `
        <div class="gallery-item gallery-item--${spanClass}" onclick="openLightbox(${art._i})" style="cursor:pointer;">
          ${thumb}
          <div class="gallery-hover-overlay">
            <div class="gallery-hover-title">${art.title}</div>
            <div class="gallery-hover-meta">${art.medium} · ${art.year}</div>
          </div>
        </div>`;
    };

    // Fill main grid
    const mainGrid = container.querySelector('#gallery-main-grid') || container.querySelector('.gallery-grid');
    if (mainGrid) mainGrid.innerHTML = main.map(renderItem).join('');

    // Remove old childhood block if re-rendering
    const old = container.querySelector('.gallery-childhood-block');
    if (old) old.remove();

    if (childhood.length) {
      const block = document.createElement('div');
      block.className = 'gallery-childhood-block';
      block.innerHTML = `
        <div class="gallery-subtitle-block">
          <h2 class="gallery-subtitle">Childhood Paintings</h2>
          <p class="gallery-subtitle-desc">Early works from 2008–2011</p>
        </div>
        <div class="gallery-grid gallery-grid--childhood">${childhood.map(renderItem).join('')}</div>`;
      container.appendChild(block);
    }
  },

  contact() {
    const { emails, institution, varsityUrl } = PORTFOLIO_DATA.contact;
    const eEl = document.getElementById('contact-emails');
    if (eEl) eEl.innerHTML = emails.map(e => `<a href="mailto:${e}" style="color:var(--muted);text-decoration:none;display:block;">${e}</a>`).join('');
    setHTML('contact-institution', institution);
    const vEl = document.getElementById('contact-varsity');
    if (vEl) vEl.innerHTML = `<a href="${varsityUrl}" target="_blank" style="color:var(--muted);text-decoration:none;">Ayan Sarkar ↗</a>`;
    /* Real, colored app logos (LinkedIn / Facebook / YouTube) with titles */
    if (typeof renderSocialIcons === 'function') renderSocialIcons('contact-social', { showLabel: true });
  },

  footer() {
    const y = document.getElementById('footer-year');
    const n = document.getElementById('footer-name');
    if (y) y.textContent = new Date().getFullYear();
    if (n) n.textContent = PORTFOLIO_DATA.profile.name;
  },

  all(mode = 'academic') {
    this.nav(); this.hero(mode); this.about();
    this.experience(); this.education(); this.skills();
    this.projects(); this.courses(); this.artJourney(); this.artPractice();
    this.gallery(); this.contact(); this.footer();
  },
};

/* Stop images being dragged out of the page. A single delegated
   listener covers everything — including images added later by the
   modals, gallery and lightbox — so nothing needs draggable="false"
   set on it individually. Firefox honours this where the CSS
   user-drag property isn't supported. */
document.addEventListener('dragstart', (e) => {
  if (e.target && e.target.tagName === 'IMG') e.preventDefault();
});

/* ── Shared timeline entry builders — Experience + Education ─────
   Both sections render through these two helpers, so their markup and
   type scale can never drift apart. `chips` entries that are missing
   are skipped, so an entry with no result or period just omits them. */
function entryHeadHTML({ logo, scale, title, sub, chips }) {
  const chipHTML = (chips || []).filter(Boolean)
    .map(c => `<span class="entry-chip">${c}</span>`).join('');
  return `
    <div class="entry-head">
      ${orgLogoHTML(logo, title, scale, 'entry-logo')}
      <div class="entry-head-text">
        <div class="entry-title">${title}</div>
        ${sub ? `<div class="entry-sub">${sub}</div>` : ''}
        ${chipHTML ? `<div class="entry-meta">${chipHTML}</div>` : ''}
      </div>
    </div>`;
}

/* Description + optional labelled callouts. Both run the full width of
   the entry, starting at the same left edge as the logo. */
function entryBodyHTML(item) {
  const desc = item.description
    ? `<div class="entry-desc">${item.description}</div>` : '';
  const highlights = (item.highlights || []).map(h => `
    <div class="entry-highlight">
      <span class="entry-highlight-label">${h.label}</span>
      <span class="entry-highlight-value">${h.value}</span>
    </div>`).join('');
  return desc + highlights;
}

/* ── YouTube facade ─────────────────────────────────────────────
   Embedding a real <iframe> pulls in ~1MB of YouTube player code per
   video, so a modal with six lectures was loading six players before
   showing anything. Instead we render just the thumbnail image (a few
   KB) and swap in the iframe only when the person actually clicks. */
function ytId(url) {
  const m = String(url || '').match(/(?:embed\/|v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

function videoFacadeHTML(v) {
  const id    = ytId(v.url);
  const title = (v.title || 'Video').replace(/"/g, '&quot;');
  const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
  return `
    <div class="course-video-wrap">
      <button type="button" class="video-facade" onclick="loadVideoFacade(this)"
              data-src="${v.url}" aria-label="Play ${title}"
              ${thumb ? `style="background-image:url('${thumb}')"` : ''}>
        <span class="video-facade-play" aria-hidden="true"></span>
      </button>
      ${v.title ? `<p class="course-video-title">${v.title}</p>` : ''}
    </div>`;
}

/* Replace the clicked thumbnail with the real player, autoplaying so
   the click that loaded it also starts it. */
function loadVideoFacade(btn) {
  const src = btn.dataset.src;
  if (!src) return;
  const iframe = document.createElement('iframe');
  iframe.src   = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
  iframe.title = btn.getAttribute('aria-label') || 'Video';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');
  btn.replaceWith(iframe);
}

function setText(id, v) { const e = document.getElementById(id); if (e) e.textContent = v; }
function setHTML(id, v) { const e = document.getElementById(id); if (e) e.innerHTML  = v; }

/* Turns a project title or course code into a stable, URL-safe slug
   (e.g. "CSE 203/SWE 109" -> "cse-203-swe-109") so individual projects
   and courses get shareable #project-… / #course-… links. */
function slugify(str) {
  return String(str || '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* Copies the current URL (which already points at the open modal via
   its #project-…/#course-… hash) to the clipboard, with a fallback for
   browsers/contexts without the async Clipboard API. */
function copyModalLink(btn) {
  const url = window.location.href;
  const onCopied = () => {
    if (!btn) return;
    const original = btn.dataset.label || btn.textContent;
    btn.dataset.label = original;
    btn.textContent = '✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1400);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(onCopied).catch(() => fallbackCopyText(url, onCopied));
  } else {
    fallbackCopyText(url, onCopied);
  }
}

function fallbackCopyText(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* no-op */ }
  document.body.removeChild(ta);
  if (cb) cb();
}

/* Small institution icon shown beside an organisation name in the
   Experience / Education timelines — same idea as the university icons
   in the Courses section. Missing or broken images just disappear so the
   name still lines up on its own.

   `scale` optionally shrinks/grows one logo relative to the others. Some
   crests fill their whole canvas edge-to-edge while others have built-in
   whitespace, so at an identical box size they don't read as the same
   size. Set `logoScale` in the data file to even them out — 1 = default,
   0.8 = 20% smaller.

   `cls` adds an extra class ('edu-logo' in the Education timeline, which
   uses a larger box since it sits beside two lines of text). */
function orgLogoHTML(logo, name, scale, cls) {
  if (!logo) return '';
  const style = (scale && scale !== 1) ? ` style="--org-logo-scale:${scale};"` : '';
  return `<img src="${logo}" alt="${name || ''} logo" class="org-logo${cls ? ' ' + cls : ''}"${style} loading="lazy"
            onerror="this.remove()"/>`;
}

/* A course may be taught over several semesters. `semesters` is the array
   form; a plain `semester` string (old data) is still accepted, and a
   comma-separated string is split so nothing renders as one long blob. */
function courseSemesters(course) {
  const raw = course.semesters != null ? course.semesters : course.semester;
  if (raw == null) return [];
  const list = Array.isArray(raw) ? raw : String(raw).split(',');
  return list.map(s => String(s).trim()).filter(Boolean);
}

/* ── Course Modal — with per-topic links & videos (fix 7) ─────── */
function openCourseModal(index, opts) {
  const course = (window._allCourses || [])[index];
  if (!course) return;

  // Count which course was opened (analytics.js provides trackEvent)
  if (typeof window.trackEvent === 'function') {
    window.trackEvent('course_view', [course.code, course.title].filter(Boolean).join(' '));
  }

  const modal  = document.getElementById('courseModal');
  const header = document.getElementById('courseModalHeader');
  const body   = document.getElementById('courseModalBody');
  if (!modal || !header || !body) return;

  /* Build topics — each may have links + video */
  const topicsHTML = (course.topics || []).map(t => {
    /* Support both plain string and object topics */
    if (typeof t === 'string') return `<li class="topic-item"><span class="topic-name">${t}</span></li>`;
    const linkBtns = (t.links || []).map(l =>
      l.url
        ? `<a href="${l.url}" target="_blank" class="topic-link">🔗 ${l.label}</a>`
        : `<span class="topic-link topic-link--disabled">${l.label}</span>`
    ).join('');
    /* Support both `video` (single) and `videos` (array of 0 or more) */
    const videoList = t.videos && t.videos.length
      ? t.videos
      : (t.video ? [t.video] : []);
    const videoBtns = videoList.map((v, vi) =>
      `<button class="topic-video-btn" onclick="toggleTopicVideo(this)" data-src="${v.url}" data-title="${v.title}" data-vi="${vi}">▶ ${v.title || 'Watch'}</button>`
    ).join('');
    const videoSlots = videoList.map((v, vi) =>
      `<div class="topic-video-slot" data-vi="${vi}" style="display:none;">
         <iframe src="" title="${v.title}" frameborder="0"
           allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>
       </div>`
    ).join('');
    const resources = (linkBtns || videoBtns)
      ? `<div class="topic-resources">${linkBtns}${videoBtns}</div>` : '';
    return `<li class="topic-item"><span class="topic-name">${t.name}</span>${resources}${videoSlots}</li>`;
  }).join('');

  const linksHTML  = (course.links  || []).filter(l => l.url).map(l => `<a href="${l.url}" target="_blank" class="course-link-pill">${l.label} ↗</a>`).join('');
  const videosHTML = (course.videos || []).map(videoFacadeHTML).join('');

  header.innerHTML = `
    <span class="course-modal-emoji">${course.emoji || '📘'}</span>
    <div>
      <div class="course-modal-code">${course.code}${course.credits ? ' · ' + course.credits + ' Credits' : ''}${courseSemesters(course).map(s => ' · ' + s).join('')}</div>
      <h2 class="course-modal-title">${course.title}</h2>
    </div>`;

  body.innerHTML = `
    ${topicsHTML ? `<div class="course-modal-section"><h3>Topics Covered</h3><ul class="course-topics-list">${topicsHTML}</ul></div>` : ''}
    ${linksHTML  ? `<div class="course-modal-section"><h3>Course Resources</h3><div class="course-links-row">${linksHTML}</div></div>` : ''}
    ${videosHTML ? `<div class="course-modal-section"><h3>Video Lectures</h3><div class="course-videos-grid">${videosHTML}</div></div>` : ''}`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Reflect this course in the URL so the modal state is shareable */
  const slug = slugify(course.code);
  if (slug) {
    const url = '#course-' + slug;
    if (opts && opts.replace) history.replaceState({ courseSlug: slug }, '', url);
    else history.pushState({ courseSlug: slug }, '', url);
  }

  if (typeof setDocMeta === 'function') {
    setDocMeta(`${course.title} (${course.code}) — Ayan Sarkar`, course.description);
  }
}

/* Toggle inline topic video on/off — supports multiple videos per topic */
function toggleTopicVideo(btn) {
  const vi   = btn.dataset.vi || '0';
  const item = btn.closest('.topic-item');
  const slot = item ? item.querySelector(`.topic-video-slot[data-vi="${vi}"]`) : null;
  if (!slot) return;
  const iframe = slot.querySelector('iframe');
  if (slot.style.display === 'none') {
    slot.style.display = 'block';
    iframe.src = btn.dataset.src;
    btn.textContent = '✕ ' + (btn.dataset.title || 'Close');
  } else {
    slot.style.display = 'none';
    iframe.src = '';
    btn.textContent = '▶ ' + (btn.dataset.title || 'Watch');
  }
}

function closeCourseModal(opts) {
  const modal = document.getElementById('courseModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  const header = document.getElementById('courseModalHeader');
  if (header) header.innerHTML = '';
  const body = document.getElementById('courseModalBody');
  if (body) body.innerHTML = '';

  if (!(opts && opts.skipHashUpdate) && location.hash.startsWith('#course-')) {
    history.replaceState({ section: '#courses' }, '', '#courses');
    if (typeof setDocMeta === 'function') setDocMeta();
  }
}

/* ── Lightbox ────────────────────────────────── */
let _lightboxIndex = 0;

/* Build the lightbox shell (overlay, box, nav, close, thumbnail strip)
   ONCE per open. The thumbnail strip is only ever built here — never
   rebuilt on navigate — so paging through paintings just shifts which
   thumbnail is focused instead of reloading/flickering the whole row. */
function buildLightboxShell() {
  let overlay = document.getElementById('lightbox');
  if (overlay) return overlay;

  const artworks = PORTFOLIO_DATA.artwork;
  const thumbsHTML = artworks.map((a, i) => {
    const thumbInner = a.file
      ? `<img src="images/artwork/${a.file}" alt="${a.title}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
         <span class="lightbox-thumb-fallback" style="display:none;background:${a.bg||'#333'}">${a.emoji||'🖼️'}</span>`
      : `<span class="lightbox-thumb-fallback" style="background:${a.bg||'#333'}">${a.emoji||'🖼️'}</span>`;
    return `<button class="lightbox-thumb" onclick="event.stopPropagation();jumpLightbox(${i})" aria-label="${a.title}">${thumbInner}</button>`;
  }).join('');

  overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.id = 'lightbox';
  overlay.addEventListener('click', closeLightbox);

  overlay.innerHTML = `
    <div class="lightbox-box" onclick="event.stopPropagation()">
      <button class="lightbox-close" onclick="closeLightbox()" aria-label="Close">✕</button>
      <div class="lightbox-stage">
        <button class="lightbox-nav lightbox-prev" onclick="event.stopPropagation();navigateLightbox(-1)" aria-label="Previous painting">‹</button>
        <div class="lightbox-img-wrap" id="lightbox-img-wrap">
          <div id="lightbox-img-slot"></div>
          <div class="lightbox-caption-zone"></div>
          <div class="lightbox-caption">
            <div class="lightbox-title" id="lightbox-title"></div>
            <div class="lightbox-meta" id="lightbox-meta"></div>
          </div>
        </div>
        <button class="lightbox-nav lightbox-next" onclick="event.stopPropagation();navigateLightbox(1)" aria-label="Next painting">›</button>
      </div>
      <div class="lightbox-thumbs" id="lightbox-thumbs">${thumbsHTML}</div>
    </div>`;

  document.body.appendChild(overlay);
  attachLightboxSwipe(overlay.querySelector('#lightbox-img-wrap'));
  return overlay;
}

/* Update only what actually changes when moving to another painting:
   the main image, the caption text, and which thumbnail is focused. */
function updateLightboxStage(index) {
  const artworks = PORTFOLIO_DATA.artwork;
  const total = artworks.length;
  index = ((index % total) + total) % total;
  const isFirstPaint = !document.getElementById('lightbox-title')?.textContent;
  _lightboxIndex = index;

  const art = artworks[index];
  const imgSlot = document.getElementById('lightbox-img-slot');
  if (imgSlot) {
    imgSlot.innerHTML = art.file
      ? `<img src="images/artwork/${art.file}" alt="${art.title}"
            onerror="this.style.display='none';document.getElementById('lb-fb').style.display='flex'"/>
         <div id="lb-fb" style="display:none;height:300px;align-items:center;justify-content:center;font-size:6rem;background:${art.bg||'#111'}">${art.emoji||'🖼️'}</div>`
      : `<div style="height:300px;display:flex;align-items:center;justify-content:center;font-size:6rem;background:${art.bg||'#111'}">${art.emoji||'🖼️'}</div>`;
  }

  const titleEl = document.getElementById('lightbox-title');
  const metaEl  = document.getElementById('lightbox-meta');
  if (titleEl) titleEl.textContent = art.title;
  if (metaEl)  metaEl.innerHTML = `${art.medium} · ${art.year} · <span class="lightbox-count">${index + 1} / ${total}</span>`;

  const thumbsContainer = document.getElementById('lightbox-thumbs');
  if (thumbsContainer) {
    const thumbs = thumbsContainer.querySelectorAll('.lightbox-thumb');
    thumbs.forEach((t, i) => t.classList.toggle('lightbox-thumb--active', i === index));
    const activeThumb = thumbs[index];
    if (activeThumb) activeThumb.scrollIntoView({ behavior: isFirstPaint ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  }
}

function openLightbox(index) {
  buildLightboxShell();
  updateLightboxStage(index);
  document.addEventListener('keydown', handleLightboxKey);
  document.body.style.overflow = 'hidden';
}

function navigateLightbox(dir) {
  updateLightboxStage(_lightboxIndex + dir);
}

/* Jump straight to a specific painting via the thumbnail strip */
function jumpLightbox(index) {
  updateLightboxStage(index);
}

function closeLightbox() {
  const e = document.getElementById('lightbox');
  if (e) e.remove();
  document.removeEventListener('keydown', handleLightboxKey);
  document.body.style.overflow = '';
}

function handleLightboxKey(e) {
  if (e.key === 'Escape')      closeLightbox();
  else if (e.key === 'ArrowLeft')  navigateLightbox(-1);
  else if (e.key === 'ArrowRight') navigateLightbox(1);
}

/* Swipe support — touch (phones) and mouse-drag (desktop) so
   paintings can be swiped left/right in both modes. A short tap
   (no meaningful movement) toggles the caption on touch devices,
   since the caption is hidden until hovered over the lower part of
   the image (desktop) or tapped (phones). */
function attachLightboxSwipe(el) {
  if (!el) return;
  const SWIPE_THRESHOLD = 45;
  const TAP_THRESHOLD = 10;
  let startX = 0, startY = 0, tracking = false;

  el.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    startX = t.clientX; startY = t.clientY; tracking = true;
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      navigateLightbox(dx < 0 ? 1 : -1);
    } else if (Math.abs(dx) < TAP_THRESHOLD && Math.abs(dy) < TAP_THRESHOLD) {
      /* Tap (not a drag/swipe) — toggle the caption on phones */
      el.classList.toggle('lb-caption-visible');
    }
  }, { passive: true });

  /* Mouse-drag swipe for desktop */
  el.addEventListener('mousedown', (e) => {
    startX = e.clientX; startY = e.clientY; tracking = true;
  });
  el.addEventListener('mouseup', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      navigateLightbox(dx < 0 ? 1 : -1);
    }
  });
  el.addEventListener('mouseleave', () => { tracking = false; });
}

/* ── Achievement Modal (art journey) — supports arrays of images, links, videos ── */
function openAchievementModal(index) {
  const entry = (PORTFOLIO_DATA.artJourney || [])[index];
  if (!entry) return;
  const modal  = document.getElementById('achievementModal');
  const header = document.getElementById('achievementModalHeader');
  const body   = document.getElementById('achievementModalBody');
  if (!modal || !header || !body) return;

  // Support new array format (achievementImages) AND legacy single (achievementImage)
  const images = entry.achievementImages && entry.achievementImages.length
    ? entry.achievementImages
    : (entry.achievementImage ? [{ file: entry.achievementImage, caption: '' }] : []);

  const imgsHTML = images.map(img =>
    `<figure style="margin:0 0 1rem;">
       <img src="${img.file}" alt="${img.caption || entry.role}" style="width:100%;max-height:400px;object-fit:contain;border-radius:8px;"/>
       ${img.caption ? `<figcaption style="text-align:center;color:var(--muted);font-size:0.82rem;margin-top:0.4rem;">${img.caption}</figcaption>` : ''}
     </figure>`
  ).join('');

  // Support new array (achievementLinks) AND legacy (certificateLinks)
  const links = entry.achievementLinks || entry.certificateLinks || [];
  const linksHTML = links.filter(l => l.url).map(l =>
    `<a href="${l.url}" target="_blank" class="course-link-pill">🏆 ${l.label} ↗</a>`
  ).join('');

  // Support achievementVideos array
  const videos = entry.achievementVideos || [];
  const videosHTML = videos.map(videoFacadeHTML).join('');

  modal.querySelector('.course-modal-box')?.classList.remove('course-modal-box--wide');

  header.innerHTML = `
    <div class="course-modal-code">${entry.organization} · ${entry.period}</div>
    <h2 class="course-modal-title">${entry.role}</h2>`;

  body.innerHTML = `
    ${imgsHTML ? `<div class="course-modal-section">${imgsHTML}</div>` : ''}
    ${linksHTML ? `<div class="course-modal-section"><h3>Certificates &amp; Links</h3><div class="course-links-row">${linksHTML}</div></div>` : ''}
    ${videosHTML ? `<div class="course-modal-section"><h3>Videos</h3><div class="course-videos-grid">${videosHTML}</div></div>` : ''}`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAchievementModal(opts) {
  const modal = document.getElementById('achievementModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  const header = document.getElementById('achievementModalHeader');
  if (header) header.innerHTML = '';
  const body = document.getElementById('achievementModalBody');
  if (body) body.innerHTML = '';

  if (!(opts && opts.skipHashUpdate) && location.hash.startsWith('#project-')) {
    history.replaceState({ section: '#projects' }, '', '#projects');
    if (typeof setDocMeta === 'function') setDocMeta();
  }
}

/* ── Interactive Course Materials ─────────────────────────────────
   A project of `type: 'courseMaterials'` spans both grid columns. Its
   card shows each institution's courses as a row of small cards that
   scrolls sideways when they don't all fit; the modal lists every
   course as a full card with a preview. Course links open the course
   site directly, so they stop the click from also opening the modal. */
function courseMaterialsCardHTML(p, idx) {
  const techPills = p.tech.map(t => `<span class="skill-pill" style="font-size:0.72rem;padding:0.2rem 0.6rem;">${t}</span>`).join('');
  const iconHTML = p.icon
    ? `<img src="images/${p.icon}" alt="${p.title} icon" class="project-card-icon" style="width:2rem;height:2rem;object-fit:contain;border-radius:6px;flex-shrink:0;"/>`
    : '';
  const shelves = (p.institutions || []).map(inst => {
    const items = (inst.courses || []).map(c => `
      <a href="${c.url}" target="_blank" rel="noopener" class="cm-mini" onclick="event.stopPropagation()" title="Open ${c.title}">
        <img src="${c.logo}" alt="" class="cm-mini-logo" loading="lazy"/>
        <span class="cm-mini-text">
          <span class="cm-mini-code">${c.code}</span>
          <span class="cm-mini-title">${c.title}</span>
          ${c.count ? `<span class="cm-mini-count">${c.count}</span>` : ''}
        </span>
      </a>`).join('');
    return `
      <div class="cm-inst">
        <div class="cm-inst-head">
          ${inst.logo ? `<img src="${inst.logo}" alt="" class="cm-inst-logo"/>` : ''}
          <span class="cm-inst-name">${inst.name}</span>
        </div>
        <div class="cm-shelf-wrap">
          <button type="button" class="cm-shelf-arrow cm-shelf-arrow--prev" aria-label="Scroll left" onclick="event.stopPropagation();scrollCmShelf(this,-1)">‹</button>
          <div class="cm-shelf">${items}</div>
          <button type="button" class="cm-shelf-arrow cm-shelf-arrow--next" aria-label="Scroll right" onclick="event.stopPropagation();scrollCmShelf(this,1)">›</button>
        </div>
      </div>`;
  }).join('');
  return `
    <div class="card project-card project-card--wide" onclick="openProjectModal(${idx})" style="display:flex;flex-direction:column;gap:0.6rem;cursor:pointer;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
        <div class="project-card-titlewrap">${iconHTML}<div class="card-title">${p.title}</div></div>
        <span style="color:var(--muted);font-size:0.78rem;white-space:nowrap;flex-shrink:0;">${p.date}</span>
      </div>
      ${p.bullets && p.bullets[0] ? `<div class="card-desc">${p.bullets[0]}</div>` : ''}
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">${techPills}</div>
      ${shelves}
      <div class="course-card-footer">View All Courses →</div>
    </div>`;
}

/* Full course cards for the modal, grouped under institution headings */
function courseMaterialsModalHTML(p) {
  return (p.institutions || []).map(inst => {
    const cards = (inst.courses || []).map(c => `
      <a href="${c.url}" target="_blank" rel="noopener" class="cm-card">
        ${c.preview ? `<img src="${c.preview}" alt="${c.title} — course home page" class="cm-card-preview" loading="lazy"/>` : ''}
        <div class="cm-card-body">
          <div class="cm-card-head">
            <img src="${c.logo}" alt="" class="cm-mini-logo"/>
            <div>
              <div class="cm-mini-code">${c.code}${c.count ? ` · ${c.count}` : ''}</div>
              <div class="cm-card-title">${c.title}</div>
            </div>
          </div>
          ${c.description ? `<p class="cm-card-desc">${c.description}</p>` : ''}
          <span class="cm-card-open">Open Interactive Slides ↗</span>
        </div>
      </a>`).join('');
    return `
      <div class="course-modal-section">
        <div class="cm-inst-head cm-inst-head--modal">
          ${inst.logo ? `<img src="${inst.logo}" alt="" class="cm-inst-logo"/>` : ''}
          <span class="cm-inst-name">${inst.name}</span>
        </div>
        <div class="cm-card-grid">${cards}</div>
      </div>`;
  }).join('');
}

function scrollCmShelf(btn, dir) {
  const shelf = btn.parentElement.querySelector('.cm-shelf');
  if (shelf) shelf.scrollBy({ left: dir * shelf.clientWidth * 0.8, behavior: 'smooth' });
}

/* Arrows only show when the row overflows, and each hides at its end. */
function updateCmShelf(shelf) {
  const wrap = shelf.parentElement;
  const max = shelf.scrollWidth - shelf.clientWidth;
  wrap.classList.toggle('cm-can-prev', shelf.scrollLeft > 2);
  wrap.classList.toggle('cm-can-next', shelf.scrollLeft < max - 2);
}

function initCmShelves(root) {
  const shelves = root.querySelectorAll('.cm-shelf');
  if (!shelves.length) return;
  shelves.forEach(s => {
    s.addEventListener('scroll', () => updateCmShelf(s), { passive: true });
    updateCmShelf(s);
  });
  if (!window._cmShelfResize) {
    window._cmShelfResize = true;
    window.addEventListener('resize', () =>
      document.querySelectorAll('.cm-shelf').forEach(updateCmShelf));
  }
  /* Images and fonts can change the row's width after first paint */
  window.addEventListener('load', () => shelves.forEach(updateCmShelf), { once: true });
}

/* ── Project Modal — videos + extra info ── */
function openProjectModal(index, opts) {
  const p = (window._allProjects || [])[index];
  if (!p) return;
  const modal  = document.getElementById('achievementModal');
  const header = document.getElementById('achievementModalHeader');
  const body   = document.getElementById('achievementModalBody');
  if (!modal || !header || !body) return;

  /* The course-materials modal holds a grid of cards, so it gets a wider box */
  const isCourseMaterials = p.type === 'courseMaterials';
  modal.querySelector('.course-modal-box')?.classList.toggle('course-modal-box--wide', isCourseMaterials);

  const techPills = p.tech.map(t => `<span class="skill-pill" style="font-size:0.75rem;padding:0.2rem 0.6rem;">${t}</span>`).join('');
  const linksHTML = (p.links || []).filter(l => l.url).map(l =>
    `<a href="${l.url}" target="_blank" class="course-link-pill">${l.label} ↗</a>`).join('');
  const bulletsHTML = (p.bullets || []).map(bul =>
    `<li style="color:var(--muted);font-size:0.9rem;line-height:1.7;margin-bottom:0.35rem;">${bul}</li>`).join('');
  const infoHTML = (p.info || []).map(s =>
    `<p style="color:var(--muted);font-size:0.9rem;line-height:1.7;margin:0.4rem 0;">${s}</p>`).join('');
  const videosHTML = (p.videos || []).map(videoFacadeHTML).join('');

  const modalIconHTML = p.icon
    ? `<img src="images/${p.icon}" alt="${p.title} icon" class="course-modal-icon-img" style="width:2.4rem;height:2.4rem;object-fit:contain;border-radius:6px;flex-shrink:0;"/>`
    : '';

  header.innerHTML = `
    <div class="course-modal-code">${p.date}</div>
    <div style="display:flex;align-items:center;gap:0.6rem;">${modalIconHTML}<h2 class="course-modal-title" style="margin:0;">${p.title}</h2></div>
    <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.3rem;">${techPills}</div>`;

  body.innerHTML = `
    ${bulletsHTML ? `<div class="course-modal-section"><h3>Overview</h3><ul style="margin:0;padding-left:1.2rem;">${bulletsHTML}</ul></div>` : ''}
    ${isCourseMaterials ? courseMaterialsModalHTML(p) : ''}
    ${linksHTML ? `<div class="course-modal-section"><h3>Links</h3><div class="course-links-row">${linksHTML}</div></div>` : ''}
    ${infoHTML  ? `<div class="course-modal-section"><h3>Additional Information</h3>${infoHTML}</div>` : ''}
    ${videosHTML ? `<div class="course-modal-section"><h3>Videos</h3><div class="course-videos-grid">${videosHTML}</div></div>` : ''}`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Reflect this project in the URL so the modal state is shareable */
  const slug = slugify(p.title);
  if (slug) {
    const url = '#project-' + slug;
    if (opts && opts.replace) history.replaceState({ projectSlug: slug }, '', url);
    else history.pushState({ projectSlug: slug }, '', url);
  }

  if (typeof setDocMeta === 'function') {
    setDocMeta(`${p.title} — Ayan Sarkar`, (p.bullets && p.bullets[0]) || undefined);
  }
}