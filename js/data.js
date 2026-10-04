/* ================================================================
   DATA.JS — Assembly shim
   All content lives in the individual data_*.js files.
   This file just merges them into the single PORTFOLIO_DATA object
   that render.js expects.

   To edit content, open the relevant file:
     data_profile.js    — profile, about, contact
     data_experience.js — experience, education, skills
     data_courses.js    — courses by university
     data_projects.js   — academic projects
     data_art.js        — art journey, art practice, gallery
================================================================ */

const PORTFOLIO_DATA = {
  profile:             DATA_PROFILE,
  about:               DATA_ABOUT,
  contact:             DATA_CONTACT,
  experience:          DATA_EXPERIENCE,
  education:           DATA_EDUCATION,
  skills:              DATA_SKILLS,
  coursesByUniversity: DATA_COURSES,
  projects:            DATA_PROJECTS,
  artJourney:          DATA_ART_JOURNEY,
  artPractice:         DATA_ART_PRACTICE,
  artwork:             DATA_ARTWORK,
};
