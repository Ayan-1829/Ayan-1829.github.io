/* ================================================================
   DATA_PROJECTS.JS
   Academic projects.

   Each project:
     title, tech[], date, bullets[]
     links:  [ { label, url } ]  — any number, fully custom labels
     videos: [ { title, url } ]  — embedded YouTube videos
     info:   [ "extra info..." ] — additional information lines
================================================================ */

const DATA_PROJECTS = [
  {
    title:   "Inside the Computer",
    icon:    "InsideTheComputer_icon.png",
    ogImage: "InsideTheComputer_og.png",
    tech:    ["HTML", "CSS", "JavaScript", "Python", "Claude AI"],
    date:    "October 2026",
    bullets: [
      "Interactive web application that visualizes the inner workings of a computer.",
      "Users can explore components like CPU, RAM, and storage, and understand their functions.",
      "Includes simulations of data flow and processing within the computer with example of 8086 microprocessor.",
    ],
    links:  [
      { label: "Explore Inside the Computer", url: "https://ayan-1829.github.io/inside-the-computer/" },
      { label: "GitHub", url: "https://github.com/ayan-1829/inside-the-computer" }
    ],
    videos: [ { title: "Inside the Computer", url: "https://www.youtube.com/embed/luX3juPvRMw" } ],
    info:   [],

  },
  {
    title:   "Gate Forge",
    icon:    "GateForge_icon.webp",
    ogImage: "GateForge_og.png",
    tech:    ["HTML", "CSS", "JavaScript", "Claude AI"],
    date:    "August 2026",
    bullets: [
      "Design and simulate digital logic circuits using basic logic gates.",
      "Practice with interactive tutorials and logic problems for hands-on learning.",
      "Built for education, helping users understand digital logic design concepts.",
    ],
    links:  [ { label: "Try Gate Forge", url: "https://gate-forge.netlify.app" } ],
    videos: [ { title: "Introduction to Gate Forge", url: "https://www.youtube.com/embed/KIAhm2HdJIc" } ],
    info:   [],
  },
  /* Shown differently from the other projects: a full-width card with a
     horizontally scrolling shelf of courses per institution, and a modal
     listing every course as a card. To add a course, add it to the right
     institution's `courses`; to add an institution, add another entry to
     `institutions` (same shape as the GUB one). Images live in
     images/courses/. `count` is the short "13 topics" style label. */
  {
    title:   "Interactive Course Materials",
    type:    "courseMaterials",
    icon:    "InteractiveCourses_icon.svg",
    tech:    ["HTML", "CSS", "JavaScript", "Python", "Claude AI"],
    date:    "September 2026",
    bullets: [
      "Interactive slide-deck websites for the courses I teach, built to be studied at the student's own pace.",
      "Each topic has live demos, step-by-step code tracers or circuit simulations, practice drills and quizzes.",
      "Free to open on any device — no sign-in, no installation.",
    ],
    institutions: [
      {
        name: "Green University of Bangladesh",
        logo: "images/GUB_leaf_Logo.webp",
        courses: [
          {
            code:        "CSE 201",
            title:       "Object Oriented Programming",
            count:       "13 topics",
            description: "Classes, objects, inheritance, polymorphism, interfaces, exceptions, threads, strings, JavaFX, JDBC and Spring — with code tracers, demos and quizzes.",
            logo:        "images/courses/OOP_logo.svg",
            preview:     "images/courses/CSE-201_preview.webp",
            url:         "https://ayan-1829.github.io/CSE-201-Object-Oriented-Programming/",
          },
          {
            code:        "CSE 202",
            title:       "Object Oriented Programming Lab",
            count:       "10 labs",
            description: "Java lab sessions from JDK setup to threads, Swing and animation: code walkthroughs, expected output, in-lab tasks, viva questions and quizzes.",
            logo:        "images/courses/OOP_logo.svg",
            preview:     "images/courses/CSE-202_preview.webp",
            url:         "https://ayan-1829.github.io/CSE-202-Object-Oriented-Programming-Lab/",
          },
          {
            code:        "CSE 203",
            title:       "Digital Logic Design",
            count:       "13 topics",
            description: "Number systems, Boolean algebra, K-maps, combinational and sequential circuits, counters, registers, memory and programmable logic.",
            logo:        "images/courses/DLD_logo.svg",
            preview:     "images/courses/CSE-203_preview.webp",
            url:         "https://ayan-1829.github.io/CSE-203-Digital-Logic-Design/",
          },
          {
            code:        "CSE 308",
            title:       "Design Project I",
            count:       "10 topics",
            description: "Project planning, LaTeX reports, IEEE SRS, SDLC models, DFDs, UML use case, sequence and class diagrams, and Figma wireframing.",
            logo:        "images/courses/DesignProject_logo.svg",
            preview:     "images/courses/CSE-308_preview.webp",
            url:         "https://ayan-1829.github.io/CSE-308-Design-Project-I/",
          },
        ],
      },
    ],
    links:  [],
    videos: [],
    info:   [],
  },
  {
    title:   "Daily Life",
    icon:    "DailyLife_icon.webp",
    tech:    ["HTML", "CSS", "JavaScript", "Firebase", "Claude AI"],
    date:    "May 2026",
    bullets: [
      "Responsive web application for task, finance, and goal management.",
      "Visualizes task progress and financial data through interactive charts.",
      "Tracks daily habits, including good and bad habits.",
    ],
    links:  [ { label: "Try for free", url: "https://daily-life-management.web.app" } ],
    videos: null,
    info:   [],
  },
  {
    title:   "CPU Design",
    tech:    ["Digital Logic Gates"],
    date:    "Apr 2024",
    bullets: [
      "5-bit CPU designed to perform fundamental operations such as addition, right rotation, and jump instructions.",
      "Built from scratch using basic logic gates, demonstrating core principles of computer architecture.",
    ],
    links:  [ { label: "GitHub", url: "https://github.com/Ayan-1829/CSE-3203-Computer-Architecture-and-Design" } ],
    videos: [ { title: "5-bit CPU", url: "https://www.youtube.com/embed/lLsZSOnPr-U" } ],
    info:   [],
  },
  {
    title:   "Shutdown Scheduler",
    icon:    "ShutdownScheduler_icon.webp",
    tech:    ["Python", "Tkinter"],
    date:    "Oct 2022",
    bullets: [
      "Allows users to schedule shutdown, restart, sign out, hibernate, and screen-off actions at a specific time or after a set duration.",
      "Monitors system activity and automatically shuts down the PC if it remains idle for a predefined period.",
    ],
    links:  [
      { label: "GitHub",   url: "https://github.com/Ayan-1829/Shutdown-Scheduler" },
      { label: "Download", url: "https://github.com/Ayan-1829/Shutdown-Scheduler/releases/download/v0.1.0/Shutdown.Scheduler.v0.1.0.setup.file.exe" },
    ],
    videos: [],
    info:   [],
  },
  {
    title:   "Personal Painting Website",
    tech:    ["Python", "Django", "HTML", "CSS"],
    date:    "Feb 2025",
    bullets: [
      "A website to showcase portraits, acrylic paintings, and sketches with a fully responsive design.",
      "Public visitors can browse the gallery; only the admin can add, edit, or delete paintings and specify mediums.",
    ],
    links:  [ { label: "GitHub", url: "https://github.com/Ayan-1829/Django-Personal-Painting-Website" } ],
    videos: [],
    info:   [],
  },
  // {
  //   title:   "FPGA-based Deflate Data Compression",
  //   tech:    ["Verilog", "FPGA", "Vivado"],
  //   date:    "Jun 2024 – Jun 2025",
  //   bullets: [
  //     "Undergraduate thesis: hardware implementation of the Deflate data compression algorithm on an FPGA.",
  //     "Explored VLSI design principles and resource-constrained computing for efficient data compression.",
  //   ],
  //   links:  [ { label: "GitHub", url: "https://github.com/ayan-1829" } ],
  //   videos: [],
  //   info:   [],
  // },
];