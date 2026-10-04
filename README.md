# Ayan Sarkar — Portfolio

🌐 **Live Site:** [ayan-1829.github.io](https://ayan-1829.github.io/)
📦 **Repository:** [Ayan-1829/Ayan-1829.github.io](https://github.com/Ayan-1829/Ayan-1829.github.io), the site root of `ayan-1829.github.io`

The old address, `ayan-1829.github.io/portfolio/` (repo [Ayan-1829/portfolio](https://github.com/Ayan-1829/portfolio)), now only redirects here.

A personal portfolio website for **Ayan Sarkar**, Lecturer in the Department of Computer Science and Engineering at Green University of Bangladesh. The site features a dual-profile design — switching seamlessly between an academic profile and an art profile.

---

## Features

- **Dual Profile Toggle** — Switch between Academic and Art profiles with a floating button
- **Academic Profile** — Experience, Education, Skills, Courses (with topic resources & video lectures), and Projects
- **Art Profile** — Gallery lightbox, Art Journey timeline with achievement images, Art Practice
- **Contact Form** — Messages are stored in a private Google Sheet, through a Cloudflare Worker that keeps the Sheet's secret out of this public code
- **Responsive Design** — Mobile-friendly layout with hamburger nav
- **Custom Cursor** — Ink/brush effects matching the profile mode
- **CV Download** — Direct download of the resume PDF

---

## Sections

### Academic
- About
- Experience
- Education
- Skills & Expertise
- Courses (with per-topic resources, links, and embedded videos)
- Projects (with GitHub links)
- Contact

### Art
- About
- Gallery
- My Journey (with achievement images and certificate links)
- My Art Practice
- Contact

---

## Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — No frameworks
- **Google Fonts** — Playfair Display, Caveat, Source Serif 4, Lora
- **Cloudflare Worker + Google Apps Script** — Contact form and cookieless analytics backend (kept out of this repo)
- **GitHub Pages** — Hosting, from the `main` branch of this repo

---

## Structure

```
Ayan-1829.github.io/
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── nav.css
│   ├── hero.css
│   └── components.css
├── js/
│   ├── data.js       ← All content lives here
│   ├── render.js
│   ├── toggle.js
│   └── cursors.js
├── images/
│   ├── artwork/      ← Painting images
│   └── ...
├── favicon.ico       ← 16/32/48 px: the icon Google Search shows for ayan-1829.github.io
└── Ayan_Sarkar_CV.pdf
```

This repo serves the root, `https://ayan-1829.github.io/`. Other repos with GitHub Pages turned on are served beside it, at `https://ayan-1829.github.io/<repo-name>/` (for example `/inside-the-computer/`), so never add a folder here with the same name as one of them.

---

## Customisation

All content is managed in `js/data.js`. No other file needs editing for content updates.

---

© 2025 Ayan Sarkar
