/* ================================================================
   SEO.JS

   Two things, both working within what a static GitHub Pages site
   can actually do (no backend, so per-item Open Graph previews for
   link-unfurling bots aren't possible — those don't execute JS):

   1. Per-item <title>/<meta description> — updated whenever a
      project/course modal opens or the Academic/Art profile switches,
      reverted on close. Helps browser history, bookmarks, screen
      readers and any crawler that does render JS (Googlebot does).

   2. Structured data (JSON-LD) for the actual projects and courses —
      generated from the same DATA_PROJECTS / DATA_COURSES already
      loaded, so it can't drift out of sync with the page content the
      way a hand-written duplicate in <head> would.
   ================================================================ */

const SEO_DEFAULT_TITLE = document.title;
const SEO_DEFAULT_DESCRIPTION = (document.querySelector('meta[name="description"]') || {}).content || '';

/* Pass null/undefined for either argument to leave it unchanged;
   call with no arguments to restore both to the page defaults. */
function setDocMeta(title, description) {
  document.title = title || SEO_DEFAULT_TITLE;
  const el = document.querySelector('meta[name="description"]');
  if (el) el.content = description || SEO_DEFAULT_DESCRIPTION;
}

/* Builds JSON-LD ItemLists for projects (CreativeWork) and courses
   (Course) from whatever Render.projects()/Render.courses() put on
   window._allProjects / window._allCourses, and injects them into
   <head>. Call once after the initial render. */
function injectStructuredData() {
  const siteUrl = 'https://ayan-1829.github.io/';

  const projects = window._allProjects || [];
  if (projects.length) {
    const projectList = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Projects by Ayan Sarkar',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'CreativeWork',
          name: p.title,
          description: (p.bullets && p.bullets[0]) || undefined,
          dateCreated: p.date,
          keywords: (p.tech || []).join(', ') || undefined,
          url: siteUrl + '#project-' + slugify(p.title),
        },
      })),
    };
    appendJsonLd(projectList);
  }

  const courses = window._allCourses || [];
  if (courses.length) {
    const courseList = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Courses taught by Ayan Sarkar',
      itemListElement: courses.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Course',
          name: c.title,
          courseCode: c.code,
          description: c.description || undefined,
          provider: {
            '@type': 'CollegeOrUniversity',
            name: 'Green University of Bangladesh',
          },
          url: siteUrl + '#course-' + slugify(c.code),
        },
      })),
    };
    appendJsonLd(courseList);
  }
}

function appendJsonLd(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}
