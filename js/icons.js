/* ================================================================
   ICONS.JS
   Colored brand-mark SVG logos for social links (LinkedIn, Facebook,
   YouTube) plus a couple of outline glyphs used elsewhere in Contact.
   Used by both the Hero/Intro section and the Contact section so the
   same real, full-color app logos appear everywhere.
================================================================ */

/* Full-color brand logos — used for social links (no wrapper circle;
   the badge shape below IS the logo itself). */
const APP_ICON_COLORS = {
  linkedin: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="48" height="48" rx="9" fill="#0A66C2"/>
    <path fill="#fff" d="M14.5 19h5v15h-5V19zm2.5-2.3a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8zM22 19h4.8v2.05h.07c.67-1.2 2.3-2.46 4.74-2.46 5.07 0 6 3.34 6 7.68V34h-5v-6.86c0-1.64-.03-3.75-2.29-3.75-2.29 0-2.64 1.79-2.64 3.63V34h-5V19z"/>
  </svg>`,

  facebook: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#1877F2"/>
    <path fill="#fff" d="M27.5 24.9h3.9l.6-4.6h-4.5v-2.9c0-1.3.4-2.2 2.3-2.2h2.4v-4.1c-.4-.1-1.8-.2-3.4-.2-3.4 0-5.7 2.1-5.7 5.9v3.5h-3.8v4.6h3.8v11.8c.8.1 1.5.2 2.3.2s1.6-.1 2.3-.2V24.9z"/>
  </svg>`,

  youtube: `<svg viewBox="2 10 44 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="10" width="44" height="28" rx="8" fill="#FF0000"/>
    <path fill="#fff" d="M20 17l12 7-12 7V17z"/>
  </svg>`,
};

/* Monochrome single-color brand glyphs (currentColor) — used for the
   Intro/Hero social row, which keeps the original one-color style. */
const APP_ICON_MONO = {
  linkedin: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z"/>
  </svg>`,

  facebook: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
    <path d="M24 12.07C24 5.67 18.63.5 12 .5S0 5.67 0 12.07c0 5.79 4.39 10.6 10.13 11.43v-8.09H7.08v-3.34h3.05V9.41c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.94h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.34h-2.79v8.09C19.61 22.67 24 17.86 24 12.07z"/>
  </svg>`,

  youtube: `<svg viewBox="0 3.5 24 17" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.13-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.37.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.13 2.14C4.49 20.5 12 20.5 12 20.5s7.51 0 9.37-.55a3.02 3.02 0 0 0 2.13-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z"/>
  </svg>`,
};

/* Monochrome outline glyphs (currentColor) — used for the other
   Contact rows (Email / Institution / Faculty Profile) if needed. */
const APP_ICONS = {
  email: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2.5"/>
    <path d="M3 6.5l9 6.5 9-6.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  institution: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <path d="M12 2.5L2 8l10 5.5L22 8 12 2.5z" stroke-linejoin="round"/>
    <path d="M5 10.7V17c0 1 3 3 7 3s7-2 7-3v-6.3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  globe: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5"/>
    <path d="M2.5 12h19M12 2.5c2.7 2.6 4.2 6 4.2 9.5s-1.5 6.9-4.2 9.5c-2.7-2.6-4.2-6-4.2-9.5s1.5-6.9 4.2-9.5z" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

/* Render social links into the given container id, sourced from
   PORTFOLIO_DATA.contact.social.
   Options:
     showLabel: also print the platform name next to its logo (Contact)
     mono:      use the single-color glyph instead of the full-color
                brand logo (Intro/Hero keeps its original one-color look) */
function renderSocialIcons(containerId, opts = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const social = (PORTFOLIO_DATA.contact && PORTFOLIO_DATA.contact.social) || [];
  const showLabel = !!opts.showLabel;
  const mono = !!opts.mono;
  const iconSet = mono ? APP_ICON_MONO : APP_ICON_COLORS;

  el.innerHTML = social.map(s => `
    <a href="${s.url}" target="_blank" rel="noopener noreferrer"
       class="social-icon-link${showLabel ? ' social-icon-link--labeled' : ''}${mono ? ' social-icon-link--mono' : ''}"
       data-icon="${s.icon}"
       aria-label="${s.label}" title="${s.label}">
      <span class="social-icon-mark">${iconSet[s.icon] || APP_ICONS[s.icon] || `<span>${s.emoji || ''}</span>`}</span>
      ${showLabel ? `<span class="social-icon-label">${s.label}</span>` : ''}
    </a>`).join('');
}