/* ================================================================
   DATA_PROFILE.JS
   Profile info, About text, Contact details
================================================================ */

const DATA_PROFILE = {
  name:     "Ayan Sarkar",
  initials: "AS",
  cvFile:   "Ayan_Sarkar_CV.pdf",

  academic: {
    eyebrow:      "Lecturer · Department of CSE",
    subtitle:     "Green University of Bangladesh",
    tagline:      "Passionate about shaping future computer science professionals through teaching, research, and innovation.",
    avatarEmoji:  "👨‍💻",
    avatarPhoto:  "Ayan_Academic.jpg",
    /* Layered hero photo: GUB building behind, Ayan in front (same baseline,
       hover brings him forward). See Render.hero() in render.js. */
    avatarComposite: { person: "Ayan_hero.png", backdrop: "GUB_hero.png" },
    ctaPrimary:   { text: "Get in Touch", href: "#contact" },
    ctaSecondary: { text: "Download CV",  href: "#" },
  },

  art: {
    eyebrow:      "Painter · Visual Artist",
    subtitle:     "Art & Expression",
    tagline:      "Creating art where imagination, emotion, and color come together in every canvas.",
    avatarEmoji:  "🎨",
    avatarPhoto:  "Ayan_Art.jpg",
    ctaPrimary:   { text: "View Gallery",     href: "#gallery" },
    ctaSecondary: { text: "Artist Statement", href: "#" },
  },
};

const DATA_ABOUT = {
  academic: `I am <strong>Ayan Sarkar</strong>, a lecturer in the Department of Computer Science and Engineering at Green University of Bangladesh. With a strong foundation in engineering and a deep interest in technology, problem solving,, I strive to bridge the gap between theoretical knowledge and practical application.
    <br><br>
    My areas of interest include programming, machine learning, computer hardwares, and emerging technologies. I enjoy teaching students, guiding them through technical concepts, and helping them build practical skills for the future. Alongside academics, I also have experience in creative work through commission painting and artwork, which reflects my passion for both logic and creativity. I believe in hard work, consistency, and always exploring new ideas.`,

  artQuote: `"The purpose of art is washing the dust of daily life off our souls." — Pablo Picasso`,
  artBio: `I am Ayan Sarkar, an educator and a painter. My artworks explore texture, emotion, and the quiet stories that live between moments.
    Each canvas is a world I build away from lectures and laptops.`,
};

const DATA_CONTACT = {
  emails:      [ "ayansarkar1829@gmail.com", "ayan@cse.green.edu.bd" ],
  institution: "Department of CSE, Green University of Bangladesh",
  varsityUrl:  "https://cse.green.edu.bd/faculties/mr-ayan-sarkar",
  social: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/ayansarkar1829",   icon: "linkedin", emoji: "💼" },
    { label: "Facebook", url: "https://www.facebook.com/ayan.sarkar.1829507", icon: "facebook", emoji: "📘" },
    { label: "YouTube",  url: "https://www.youtube.com/@ayansarkar1829",      icon: "youtube",  emoji: "▶️" },
  ],
};