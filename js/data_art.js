/* ================================================================
   DATA_ART.JS
   Art journey (timeline), art practice cards, and gallery artwork.

   artJourney entry optional fields:
     achievementImages: [ { file, caption } ]  — multiple photos
     achievementLinks:  [ { label, url } ]      — multiple links
     achievementVideos: [ { title, url } ]      — embedded videos

   artwork entry span values:
     'tall'   — 2 rows  (portrait / tall images)
     'both'   — 2 rows + 2 cols  (hero / large)
     'wide'   — 2 cols  (landscape)
     'normal' — standard 1×1
   Set childhood: true to place under "Childhood Paintings" subtitle.
================================================================ */

const DATA_ART_JOURNEY = [
  {
    role:         "Art School",
    organization: "Golam Mowla Sir's Studio",
    period:       "2008 – 2010",
    description:  "Started my formal art journey by learning the fundamentals of drawing, coloring, and creative expression under expert guidance.",
  },
  {
    role:         "Champion in District Level Competitions",
    organization: "Jhenaidah",
    period:       "2009 – 2010",
    description:  "Achieved top positions in district-level painting competitions, gaining early recognition for artistic talent and creativity.",
  },
  {
    role:         "Champion in Annual Painting Competitions",
    organization: "Barishal Cadet College",
    period:       "2013 – 2019",
    description:  "Won multiple annual painting competitions throughout cadet college life, consistently showcasing creativity and dedication to art.",
  },
  {
    role:         "Champion in Painting — Inter Cadet College Literature & Music Meet 2018",
    organization: "Sylhet Cadet College",
    period:       "2018",
    description:  "Champion in painting among participants from all 12 cadet colleges at the Inter Cadet College Literature & Music Meet.",
    achievementImages: [
      { file: "images/prize.jpg",                  caption: "Taking Medal from the Chief Guest" },
      { file: "images/3_positions.jpg",            caption: "Top Three Participants" },
      { file: "images/Champion_ICCLMM-2018.jpg",   caption: "The Painting" },
    ],
    achievementLinks: [
      { label: "View Painting", url: "images/artwork/ICCLMM_2018.JPG" },
    ],
    achievementVideos: [],
  },
];

const DATA_ART_PRACTICE = [
  { emoji: "🖌️", title: "Mediums",  description: "Acrylic, Watercolor, Pastel, Pencil Sketch exploring texture across multiple surfaces." },
  { emoji: "🌿", title: "Themes",   description: "Nature, Portraits, everyday stillness, and the intersection of structured thought and organic emotion." },
  // { emoji: "✨", title: "Inspiration", description: "The quiet contrast between algorithmic precision and the raw unpredictability of human creativity." },
];

/* ── Gallery ─────────────────────────────────────────────────── */
const DATA_ARTWORK = [
  { file: "ayan.jpg",                   title: "Self-Reflection in Graphite", medium: "Pencil Sketch",           year: "2020", emoji: "🖼️", bg: "linear-gradient(135deg,#f5deb3,#d4956a)",  span: "tall"   },
  { file: "Shuchi.jpg",                 title: "Colour of love",      medium: "Acrylic on Canvas",       year: "2024", emoji: "🎨", bg: "linear-gradient(135deg,#b7d9b7,#7a9e7e)",  span: "both"   },
  { file: "Atoshi.jpg",                 title: "Glazing Eyes",        medium: "Pencil Sketch",           year: "2021", emoji: "🖌️", bg: "linear-gradient(135deg,#e8c4a0,#c4622d)",  span: "both"   },
  { file: "Sir.jpg",                    title: "The Art Teacher",       medium: "Acrylic on Canvas",       year: "2024", emoji: "🌊", bg: "linear-gradient(135deg,#c8e8f0,#4a90a4)",  span: "normal" },
  { file: "Oshin.jpg",                  title: "Lady in Saree",       medium: "Watercolor with Pencil",  year: "2020", emoji: "🌊", bg: "linear-gradient(135deg,#c8e8f0,#4a90a4)",  span: "tall"   },
  { file: "sufi.jpg",                   title: "Sufi Dance",          medium: "Acrylic on Canvas",       year: "2023", emoji: "🌀", bg: "linear-gradient(135deg,#f0e8d0,#c8a870)",  span: "wide"   },
  { file: "Rahul_dada.jpg",             title: "Couple",              medium: "Acrylic on Canvas",       year: "2022", emoji: "🖼️", bg: "linear-gradient(135deg,#e8e0d0,#b0a090)",  span: "tall"   },
  { file: "Family.jpg",                 title: "Family",              medium: "Mixed Media",             year: "2021", emoji: "🏠", bg: "linear-gradient(135deg,#fde8d0,#e8a070)",  span: "both"   },
  { file: "Nobita.jpg",                 title: "Nobita Bengali Ft.",              medium: "Color Pencil",            year: "2022", emoji: "✏️", bg: "linear-gradient(135deg,#d8e8f8,#6080c0)",  span: "tall"   },
  { file: "Couple_Can.jpg",             title: "Can Couple",          medium: "Mixed Media",             year: "2021", emoji: "💑", bg: "linear-gradient(135deg,#f0d8e8,#c06080)",  span: "wide"   },
  { file: "Old Man.jpg",                title: "Old Man",             medium: "Mixed Media",             year: "2021", emoji: "✏️", bg: "linear-gradient(135deg,#d4c4e0,#8b6fa0)",  span: "tall"   },
  { file: "Lady.jpg",                   title: "Portrait",            medium: "Watercolor",              year: "2022", emoji: "🌺", bg: "linear-gradient(135deg,#f0d0e8,#c870a0)",  span: "normal" },
  { file: "Foreign_lady.jpg",           title: "Foreign Lady",        medium: "Watercolor with Pencil",  year: "2021", emoji: "🌹", bg: "linear-gradient(135deg,#f8d0d8,#c04060)",  span: "normal" },
  { file: "joker.jpg",                  title: "The Joker",           medium: "Mixed Media",             year: "2020", emoji: "🃏", bg: "linear-gradient(135deg,#d0d8f0,#7080c8)",  span: "tall"   },
  { file: "Rose_1.jpg",                 title: "Rose",                medium: "Color Pencil",            year: "2020", emoji: "🌹", bg: "linear-gradient(135deg,#f8d0d8,#c04060)",  span: "wide"   },
  { file: "Parisa_2.jpg",               title: "Lady in Hijab",       medium: "Pencil Sketch",           year: "2022", emoji: "🌹", bg: "linear-gradient(135deg,#f8d0d8,#c04060)",  span: "normal" },
  { file: "ICCLMM_2018.JPG",            title: "ICCLMM 2018",         medium: "Acrylic on Canvas",       year: "2018", emoji: "🏆", bg: "linear-gradient(135deg,#f8f0d0,#c0a030)",  span: "both"   },
  { file: "Friend.jpg",                 title: "Young Boy",           medium: "Pencil Sketch",           year: "2022", emoji: "🌹", bg: "linear-gradient(135deg,#f8d0d8,#c04060)",  span: "normal" },
  { file: "Gentle_man.jpg",             title: "Gentleman",           medium: "Mixed Media",             year: "2021", emoji: "💑", bg: "linear-gradient(135deg,#f0d8e8,#c06080)",  span: "normal" },
  { file: "Momo.jpg",                   title: "Momo",                medium: "Pencil Sketch",           year: "2021", emoji: "🖌️", bg: "linear-gradient(135deg,#f8e0d0,#c06040)",  span: "normal" },
  { file: "Kanchon_GF.jpg",             title: "Watercolor Portrait", medium: "Watercolor",              year: "2021", emoji: "🌹", bg: "linear-gradient(135deg,#f8d0d8,#c04060)",  span: "tall"   },
  { file: "Pritom.jpg",                 title: "Youth",               medium: "Pencil Sketch",           year: "2022", emoji: "🌅", bg: "linear-gradient(135deg,#fde8b0,#e8a020)",  span: "normal" },
  { file: "baby.jpg",                   title: "Innocence",           medium: "Color Pencil",            year: "2023", emoji: "👶", bg: "linear-gradient(135deg,#e8f0d0,#a0b870)",  span: "normal" },
  // { file: "Parisa_1.jpg",             title: "Young Lady",         medium: "Pencil Sketch",           year: "2021", emoji: "🌹", bg: "linear-gradient(135deg,#f8d0d8,#c04060)",  span: "normal" },

  // ── Childhood Paintings ──────────────────────────────────────
  { file: "Child_Bird.jpg",             title: "Birds",              medium: "Watercolor", year: "2010", emoji: "🎨", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "both",   childhood: true },
  { file: "Child_Village_work.jpg",     title: "Village Work",       medium: "Watercolor", year: "2009", emoji: "🌹", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "normal", childhood: true },
  { file: "Child_Mina.jpg",             title: "Mina",               medium: "Watercolor", year: "2010", emoji: "🖌️", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "tall",   childhood: true },
  { file: "Child_Primary_School.jpg",   title: "My Primary School",  medium: "Watercolor", year: "2011", emoji: "🎨", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "wide",   childhood: true },
  { file: "Child_Children_Playing.jpg", title: "Play",               medium: "Watercolor", year: "2009", emoji: "🌹", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "normal", childhood: true },
  { file: "Child_Flood.jpg",            title: "Flood",              medium: "Watercolor", year: "2010", emoji: "🖌️", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "both",   childhood: true },
  { file: "Child_Victory.jpg",          title: "Victory",            medium: "Watercolor", year: "2011", emoji: "🎨", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "normal", childhood: true },
  // { file: "Child_Krishna.jpg",        title: "Lord Krishna",       medium: "Watercolor", year: "2010", emoji: "🌹", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "tall",   childhood: true },
  // { file: "Child_Mansion.jpg",        title: "Mansion",            medium: "Watercolor", year: "2009", emoji: "🎨", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "normal", childhood: true },
  { file: "Child_21st_February.jpg",    title: "21st February",      medium: "Watercolor", year: "2010", emoji: "🖌️", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "normal", childhood: true },
  { file: "Child_Village.jpg",          title: "Village",            medium: "Watercolor", year: "2010", emoji: "🖌️", bg: "linear-gradient(135deg,#f8d0d8,#c04060)", span: "wide",   childhood: true },
];
