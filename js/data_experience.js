/* ================================================================
   DATA_EXPERIENCE.JS
   Work experience & education

   `logo` — path to the institution's icon, shown beside its name in the
   timeline (same style as the university icons in the Courses section).
   Leave it out (or set null) and the name simply renders on its own.

   `logoScale` — optional visual size tweak for one logo, since crests
   that fill their whole canvas look bigger than ones with built-in
   whitespace. 1 = default, 0.8 = 20% smaller. Omit it for no change.

   Education `degree` is the full phrase on one line ("B.Sc. in Computer
   Science & Engineering"), shown in the accent colour above the
   institution name.

   Each education entry breaks into separate fields so they can be styled
   independently, instead of one long description blob:
     result      — "CGPA: <b>3.71</b> / 4.00"  → chip beside the logo
     period      — "Jan 2020 – Jun 2025"       → chip beside the logo
     description — the paragraph, full width, starting under the logo
     highlights  — [{ label, value }] callouts (thesis, achievements…)
   Basic HTML like <b> is allowed in result, description and highlights.
================================================================ */

const DATA_EXPERIENCE = [
  {
    role:         "Lecturer, Department of CSE",
    organization: "Green University of Bangladesh",
    logo:         "images/GUB_leaf_Logo.webp",
    period:       "Oct 2025 – Present",
    description:  "Teaching core undergraduate courses in Computer Science & Engineering across both theory and laboratory sessions, covering programming fundamentals, digital hardware, intelligent systems, and data-driven analysis. Beyond the classroom I supervise student projects and industrial training placements, design course outlines and assessment rubrics, prepare lab manuals and lecture material, and contribute to departmental research and academic activities.",
    highlights: [
      { label: "Courses Taught", value: "Object Oriented Programming and its lab, Digital Logic Design Lab, Web Programming Lab, Data Communication Lab, Artificial Intelligence, Data Mining and its lab, and Industrial Training supervision." },
      { label: "Departmental Role", value: "Serving on the <b>Student Affairs Committee</b>, supporting student welfare, activities, and academic guidance across the department." },
    ],
  },
  {
    role:         "Lecturer, Department of CSE",
    organization: "Varendra University",
    logo:         "images/VU_square_Logo.webp",
    logoScale:    0.9,
    period:       "Jul 2025 – Oct 2025",
    description:  "Delivered lectures and laboratory sessions in Computer Graphics, guiding students from the underlying mathematics of rasterisation and transformation through to hands-on implementation in OpenGL. Alongside teaching I mentored students on coursework and projects, and took an active part in academic development and curriculum planning.",
    highlights: [
      { label: "Courses Taught", value: "Computer Graphics and Computer Graphics Lab — covering line and circle drawing algorithms, 2D and 3D transformations, clipping, polygon filling, and OpenGL implementation." },
    ],
  },
];

const DATA_EDUCATION = [
  {
    degree:      "B.Sc. in Computer Science & Engineering",
    institution: "Rajshahi University of Engineering & Technology",
    logo:        "images/RUET_Logo.png",
    result:      "CGPA: <b>3.71</b> / 4.00",
    period:      "Jan 2020 – Jun 2025",
    description: "Completed my undergraduate program with a strong academic record. The curriculum spanned core areas including Data Structures & Algorithms, Object Oriented Programming, Database Management Systems, Computer Networks, Operating Systems, Digital Logic Design, Microprocessors, Artificial Intelligence, Machine Learning, Computer Graphics, Data Mining, Software Engineering, and VLSI Design.",
    highlights: [
      { label: "Undergraduate Thesis", value: "\u201cFPGA-based implementation of the Deflate Data Compression Algorithm\u201d" },
    ],
  },
  {
    degree:      "Higher Secondary Certificate (HSC) — Science",
    institution: "Barishal Cadet College",
    logo:        "images/BCC_Logo.png",
    logoScale:   0.72,
    result:      "GPA: <b>5.00</b>",
    period:      "2019",
    description: "Completed Higher Secondary education with a perfect GPA, excelling in science subjects and actively participating in extracurricular activities, including art competitions and leadership roles within the cadet college community.",
    highlights: [
      { label: "Achievements", value: "Board <b>4th</b> in Science Group, Barishal Board." },
    ],
  },
  {
    degree:      "Secondary School Certificate (SSC) — Science",
    institution: "Barishal Cadet College",
    logo:        "images/BCC_Logo.png",
    logoScale:   0.72,
    result:      "GPA: <b>5.00</b>",
    period:      "2017",
    description: "Built a solid academic foundation in science alongside self-discipline and adaptability through the cadet lifestyle balancing studies, physical training, and extracurricular activities from an early age.",
    highlights: [
      { label: "Achievements", value: "Board <b>4th</b> in Science Group, Barishal Board." },
    ],
  },
];

const DATA_SKILLS = [
  { label: "Programming Languages", items: ["C", "C++", "Python", "Java", "JavaScript", "Verilog"] },
  { label: "Web & Databases",       items: ["HTML", "CSS", "Django", "MySQL", "PostgreSQL", "SQLite"] },
  { label: "Tools & Other",         items: ["Git", "LaTeX", "Vivado", "Web Scraping", "FPGA"] },
  { label: "Academic & Professional", items: ["Curriculum Design", "Research Methodology", "Academic Writing", "Student Mentoring", "Lecture Delivery", "Project Supervision"] },
];