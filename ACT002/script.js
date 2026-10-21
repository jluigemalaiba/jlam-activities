const MAX = 20,
  MIN = 4,
  root = document.querySelector("#root");
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const save = () => {
  localStorage.setItem("drph-theme", JSON.stringify(app.theme));
  localStorage.setItem("drph-cast", JSON.stringify(app.castIds));
  localStorage.setItem("drph-customs", JSON.stringify(app.customs));
};
const esc = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
      c
      ],
  );
const iconPaths = {
  plus: "M12 5v14M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  shuffle: "M16 4h4v4M4 20L20 4M20 16v4h-4M14.5 14.5L20 20M4 4l5 5",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4",
  crown: "M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z",
  play: "M7 5l12 7-12 7V5z",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  mirror: "M12 3a6 8 0 016 8v10H6V11a6 8 0 016-8z",
  palette:
    "M12 3a9 9 0 100 18c1.2 0 1.8-.8 1.8-1.7 0-1.4-1.2-1.6-1.2-2.8 0-1 .8-1.5 1.8-1.5H17a4 4 0 004-4c0-4.4-4-8-9-8zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  wand: "M5 19L17 7M14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z",
};
const icon = (name, cls = "icon") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}"><path d="${iconPaths[name]}"/></svg>`;
const sun = (cls) => {
  const isWerkRiorCard = cls.includes("sr1-card-sun");
  return `<svg viewBox="-50 -50 100 100" class="${cls}" aria-hidden="true">${isWerkRiorCard ? '<defs><linearGradient id="werkrior-card-sun" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b72c58"/><stop offset=".52" stop-color="#8b245e"/><stop offset="1" stop-color="#59246f"/></linearGradient></defs>' : ""}<g fill="${isWerkRiorCard ? "url(#werkrior-card-sun)" : "currentColor"}">${Array.from({ length: 8 }, (_, i) => `<g transform="rotate(${i * 45})"><polygon points="-4,-20 4,-20 0,-48"/><polygon points="-2,-20 -9,-40 -5,-20" opacity=".75"/><polygon points="2,-20 9,-40 5,-20" opacity=".75"/></g>`).join("")}<circle r="18"/></g></svg>`;
};

const themes = [
  [
    "flag",
    "Default",
    "Filipi-yass!",
    "Red, blue and a sun-yellow glow.",
    ["#CE1126", "#0038A8", "#FCD116", "#121116"],
  ],
  [
    "s1",
    "Season 1",
    "Jeep-Eyyy!",
    "Chrome, route signs and sticker-bomb glam.",
    ["#D62B1F", "#1D5BA8", "#F2B705", "#2F8F46"],
  ],
  [
    "s2",
    "Season 2",
    "Let's Go, Beaches!",
    "Pink, yellow, orange. Beach-ready, sunburn optional.",
    ["#FF3D8B", "#FF7A00", "#FFD23F", "#3B0F2B"],
  ],
  [
    "s3",
    "Season 3",
    "Chi-Vogue",
    "Black, white, fishball couture.",
    ["#0A0A0A", "#FFFFFF", "#8A8780", "#CFCAC0"],
  ],
  [
    "s4",
    "Season 4",
    "Biot-diversity",
    "Deep-sea glamour, scales and pearls.",
    ["#0B6E99", "#13A3B5", "#8FE3D6", "#06283D"],
  ],
  ["sr1", "SR Season 1", "Werk-rior!", "Warrior-princess power, gilded armor and royal resolve.", ["#7B1E3A", "#4B2354", "#F4C95D", "#201227"]],
].map(([id, season, name, tagline, colors]) => ({
  id,
  season,
  name,
  tagline,
  colors,
}));
const slug = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Set `image` to a relative file path (for example, "assets/images/precious-paula-nicole.jpg").
// Leave it blank to keep the generated poster art.
const queenRoster = [
  {
    season: 1,
    name: "Precious Paula Nicole",
    image: "assets/Precious Paula Nicole.jpg",
    hometown: "Daet, Camarines Norte",
    placement: "Winner",
  },
  {
    season: 1,
    name: "Marina Summers",
    image: "assets/Marina Summers.jpg",
    hometown: "Makati, Metro Manila",
    placement: "Runner-up",
  },
  {
    season: 1,
    name: "Eva Le Queen",
    image: "assets/Eva Le Queen.jpg",
    hometown: "Marikina, Metro Manila",
    placement: "3rd",
  },
  {
    season: 1,
    name: "Xilhouete",
    image: "assets/Xilhouete.jpg",
    hometown: "Cabanatuan, Nueva Ecija",
    placement: "3rd",
  },
  {
    season: 1,
    name: "Minty Fresh",
    image: "assets/Minty Fresh.jpg",
    hometown: "Quezon City, Metro Manila",
    placement: "5th",
  },
  {
    season: 1,
    name: "Brigiding",
    image: "assets/Brigiding.jpg",
    hometown: "Mandaluyong, Metro Manila",
    placement: "6th",
  },
  {
    season: 1,
    name: "Viñas DeLuxe",
    image: "assets/Vinas Deluxe.jpg",
    hometown: "San Jose del Monte, Bulacan",
    placement: "7th",
  },
  {
    season: 1,
    name: "Lady Morgana",
    image: "assets/Lady Morgana.jpg",
    hometown: "Davao City, Davao del Sur",
    placement: "8th",
    note: "Miss Congeniality",
  },
  {
    season: 1,
    name: "Turing",
    image: "assets/Turing.jpg",
    hometown: "Cainta, Rizal",
    placement: "9th",
  },
  {
    season: 1,
    name: "Gigi Era",
    image: "assets/Gigi Era.jpg",
    hometown: "Melbourne, Australia",
    placement: "10th",
  },
  {
    season: 1,
    name: "Corazon",
    image: "assets/Corazon.jpg",
    hometown: "Bolinao, Pangasinan",
    placement: "11th",
  },
  {
    season: 1,
    name: "Prince",
    image: "assets/Prince.jpg",
    hometown: "Calumpit, Bulacan",
    placement: "12th",
  },
  {
    season: 2,
    name: "Captivating Katkat",
    image: "assets/Captivating Katkat.jpg",
    hometown: "Santa Maria, Ilocos Sur",
    placement: "Winner",
  },
  {
    season: 2,
    name: "Arizona Brandy",
    image: "assets/Arizona Brandy.jpg",
    hometown: "Makati, Metro Manila",
    placement: "Runner-up",
  },
  {
    season: 2,
    name: "Bernie",
    image: "assets/Bernie.jpg",
    hometown: "Mandaluyong, Metro Manila",
    placement: "3rd",
  },
  {
    season: 2,
    name: "M1ss Jade So",
    image: "assets/M1ss Jade So.jpg",
    hometown: "Marikina, Metro Manila",
    placement: "3rd",
  },
  {
    season: 2,
    name: "Hana Beshie",
    image: "assets/Hana Beshie.jpg",
    hometown: "Cagayan de Oro, Misamis Oriental",
    placement: "5th",
    note: "Miss Congeniality",
  },
  {
    season: 2,
    name: "ØV Cünt",
    image: "assets/ØV Cunt.jpg",
    hometown: "Rosario, Cavite",
    placement: "5th",
  },
  {
    season: 2,
    name: "DeeDee Marié Holliday",
    image: "assets/DeeDee Marie Holiday.jpg",
    hometown: "Tayabas, Quezon",
    placement: "7th",
  },
  {
    season: 2,
    name: "Matilduh",
    image: "assets/Matilduh.jpg",
    hometown: "Vigan, Ilocos Sur",
    placement: "8th",
  },
  {
    season: 2,
    name: "Veruschka Levels",
    image: "assets/Veruschka Levels.jpg",
    hometown: "Hong Kong",
    placement: "9th",
  },
  {
    season: 2,
    name: "Tiny DeLuxe",
    image: "assets/Tiny Deluxe.jpg",
    hometown: "Pasig, Metro Manila",
    placement: "10th",
  },
  {
    season: 2,
    name: "Astrid Mercury",
    image: "assets/Astrid Mercury.jpg",
    hometown: "Mandaluyong, Metro Manila",
    placement: "11th",
  },
  {
    season: 2,
    name: "Nicole Pardaux",
    image: "assets/Nicole Pardaux.jpg",
    hometown: "Cebu City, Cebu",
    placement: "12th",
  },
  {
    season: 3,
    name: "Maxie",
    image: "assets/Maxie.jpg",
    hometown: "Manila, Metro Manila",
    placement: "Winner",
  },
  {
    season: 3,
    name: "Khianna",
    image: "assets/Khianna.jpg",
    hometown: "Cagayan de Oro, Misamis Oriental",
    placement: "Runner-up",
  },
  {
    season: 3,
    name: "Angel",
    image: "assets/Angel.jpg",
    hometown: "Manila, Metro Manila",
    placement: "3rd",
  },
  {
    season: 3,
    name: "Tita Baby",
    image: "assets/Tita Baby.jpg",
    hometown: "Marikina, Metro Manila",
    placement: "3rd",
  },
  {
    season: 3,
    name: "Zymba Ding",
    image: "assets/Zymba Ding.jpg",
    hometown: "Caloocan, Metro Manila",
    placement: "5th",
  },
  {
    season: 3,
    name: "Myx Chanel",
    image: "assets/Myx Chanel.jpg",
    hometown: "Marikina, Metro Manila",
    placement: "6th",
  },
  {
    season: 3,
    name: "Popstar Bench",
    image: "assets/Popstar Bench.jpg",
    hometown: "Manila, Metro Manila",
    placement: "7th",
  },
  {
    season: 3,
    name: "John Fedellaga",
    image: "assets/John Fedellaga.jpg",
    hometown: "San Francisco, USA",
    placement: "8th",
  },
  {
    season: 3,
    name: "J Quinn",
    image: "assets/J Quinn.jpg",
    hometown: "Caloocan, Metro Manila",
    placement: "9th",
  },
  {
    season: 3,
    name: "Yudipota",
    image: "assets/Yudipota.jpg",
    hometown: "Bacolod, Negros Occidental",
    placement: "10th",
  },
  {
    season: 3,
    name: "Versex",
    image: "assets/Versex.jpg",
    hometown: "Manila, Metro Manila",
    placement: "11th",
    note: "Miss Congeniality",
  },
  {
    season: 4,
    name: "Andy Crocker",
    image: "assets/Andy Crocker.jpg",
    hometown: "Caloocan, Metro Manila",
    placement: "TBA",
  },
  {
    season: 4,
    name: "Bhorj Gum",
    image: "assets/Bhorj Gum.jpg",
    hometown: "Bacolod, Negros Occidental",
    placement: "TBA",
  },
  {
    season: 4,
    name: "Bombalicious Eklaver",
    image: "assets/Bombalicious Eklaver.jpg",
    hometown: "Baltimore, USA",
    placement: "TBA",
  },
  {
    season: 4,
    name: "Dixxxy Decoy",
    image: "assets/Dixxxy Decoy.jpg",
    hometown: "Davao City, Davao del Sur",
    placement: "11th",
  },
  {
    season: 4,
    name: "Ghulli Ghush",
    image: "assets/Ghulli Ghush.jpg",
    hometown: "Cavite City, Cavite",
    placement: "10th",
  },
  {
    season: 4,
    name: "Katana",
    image: "assets/Katana.jpg",
    hometown: "Santiago, Isabela",
    placement: "TBA",
  },
  {
    season: 4,
    name: "Manza",
    image: "assets/Manza.jpg",
    hometown: "Nabunturan, Davao de Oro",
    placement: "TBA",
  },
  {
    season: 4,
    name: "Maureen Biology",
    image: "assets/Maureen Biology.jpg",
    hometown: "Baguio, Benguet",
    placement: "TBA",
  },
  {
    season: 4,
    name: "Merckz",
    image: "assets/Merckz.jpg",
    hometown: "Antipolo, Rizal",
    placement: "TBA",
  },
  {
    season: 4,
    name: "Misua",
    image: "assets/Misua.jpg",
    hometown: "Cagayan de Oro, Misamis Oriental",
    placement: "†Departured",
    note: "In loving memory",
  },
  {
    season: 4,
    name: "Taylor Sheesh",
    image: "assets/Taylor Sheesh.jpg",
    hometown: "Antipolo, Rizal",
    placement: "TBA",
  },
  {
    season: 4,
    name: "Valeria",
    image: "assets/Valeria.jpg",
    hometown: "Manila, Metro Manila",
    placement: "TBA",
  },
  {
    season: "sr1",
    name: "Brigiding",
    image: "assets/Brigiding SR.jpg",
    hometown: "Mandaluyong, Metro Manila",
    placement: "Winner"
  },
  {
    season: "sr1",
    name: "Viñas DeLuxe",
    image: "assets/Vinas Deluxe SR.jpg",
    hometown: "San Jose del Monte, Bulacan",
    placement: "Runner-up"
  },
  {
    season: "sr1",
    name: "Arizona Brandy",
    image: "assets/Arizona Brandy SR.jpg",
    hometown: "Makati, Metro Manila",
    placement: "3rd"
  },
  {
    season: "sr1",
    name: "Suki Doll",
    image: "assets/Suki Doll SR.jpg",
    hometown: "Montréal, Quebec",
    placement: "3rd",
    note: "Miss Congeniality"
  },
  {
    season: "sr1",
    name: "Khianna",
    image: "assets/Khianna SR.jpg",
    hometown: "Cagayan de Oro, Misamis Oriental",
    placement: "5th"
  },
  {
    season: "sr1",
    name: "Yuhua",
    image: "assets/Yuhua SR.jpg",
    hometown: "New York City, New York",
    placement: "6th"
  },
  {
    season: "sr1",
    name: "Siam Phusri",
    image: "assets/Siam Phusri SR.jpg",
    hometown: "Las Vegas, Nevada",
    placement: "7th"
  },
  {
    season: "sr1",
    name: "Bernie",
    image: "assets/Bernie SR.jpg",
    hometown: "Mandaluyong, Metro Manila",
    placement: "8th"
  },
  {
    season: "sr1",
    name: "Kitty Space",
    image: "assets/Kitty Space SR.jpg",
    hometown: "Lyon, France",
    placement: "9th"
  },
  {
    season: "sr1",
    name: "Ivory Glaze",
    image: "assets/Ivory Glaze SR.jpg",
    hometown: "Sydney, Australia",
    placement: "10th"
  },
  {
    season: "sr1",
    name: "Sum Ting Wong",
    image: "assets/Sum Ting Wong SR.jpg",
    hometown: "Birmingham, England",
    placement: "11th"
  },
  {
    season: "sr1",
    name: "Madame Yoko",
    image: "assets/Madame Yoko SR.jpg",
    hometown: "Luxembourg City, Luxembourg",
    placement: "12th"
  },
];
const queens = queenRoster.map((queen) => ({
  ...queen,
  id: `s${queen.season}-${slug(queen.name)}`,
}));
const app = {
  theme: read("drph-theme", "flag"),
  castIds: read("drph-cast", []),
  customs: read("drph-customs", []),
  filter: "all",
  sort: "chrono",
  query: "",
};
const allQueens = () => [...queens, ...app.customs];
const seasonLabel = (season) =>
  season === "custom" ? "Custom" : season === "sr1" ? "SR Season 1" : `S${season}`;
const cast = () => {
  const byId = new Map(allQueens().map((q) => [q.id, q]));
  return app.castIds.map((id) => byId.get(id)).filter(Boolean);
};
const currentTheme = () => themes.find((t) => t.id === app.theme) || themes[0];
const initials = (name) => {
  const words = name.replace(/[^\p{L}\p{N}\s]/gu, "").split(/\s+/);
  return (words[0][0] + (words[1]?.[0] || "")).toUpperCase();
};
const hash = (text) =>
  [...text].reduce(
    (value, char) => Math.imul(value ^ char.charCodeAt(0), 16777619),
    2166136261,
  ) >>> 0;
function queenArt(q, number, compact = false) {
  if (q.image) {
    return `<img class="queen-art" src="${esc(q.image)}" alt="${esc(q.name)}" loading="lazy" draggable="false">`;
  }

  const h = hash(q.name),
    tone = q.tone || ["c1", "c2", "c3", "ink"][h % 4],
    bg = tone === "ink" ? "var(--ink)" : `var(--${tone})`,
    fg = tone === "ink" ? "var(--bg)" : `var(--on-${tone})`,
    mono = initials(q.name),
    fontSize = mono.length === 1 ? 104 : 70,
    season = seasonLabel(q.season);
  const stars = [0, 1, 2]
    .map((i) => {
      const x = [10, 100, 56][i] + ((h >> (i + 2)) % 8) - 4,
        y = [20, 30, 8][i];
      return `<path transform="translate(${x} ${y}) scale(.32)" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" fill="${fg}" opacity=".85"/>`;
    })
    .join("");
  return `<svg viewBox="0 0 120 150" class="queen-art" role="img" aria-label="${esc(q.name)} poster art" preserveAspectRatio="xMidYMid slice"><rect width="120" height="150" fill="${bg}"/><g transform="translate(${20 + (h % 80)} ${18 + ((h >> 3) % 60)}) rotate(${(h >> 5) % 45})" fill="${fg}" opacity=".16">${Array.from({ length: 8 }, (_, i) => `<polygon points="-7,0 7,0 0,-170" transform="rotate(${i * 45})"/>`).join("")}<circle r="20"/></g>${stars}<text x="-4" y="146" fill="${fg}" style="font-family:var(--display);font-style:var(--display-style);font-weight:var(--display-weight);font-size:calc(${fontSize}px * var(--dscale));letter-spacing:-.02em">${mono}</text>${compact ? "" : `<text x="112" y="16" text-anchor="end" fill="${fg}" style="font-family:DM Mono,monospace;font-size:8px;letter-spacing:.08em" opacity=".9">${season}${number === undefined ? "" : ` · ${String(number).padStart(2, "0")}`}</text>`}</svg>`;
}
function stageFloor() {
  const rows = [0, 0.16, 0.36, 0.62, 1],
    cols = 10,
    left = (t) => 140 - 260 * t,
    right = (t) => 860 + 260 * t,
    at = (t, column) => left(t) + ((right(t) - left(t)) * column) / cols;
  const tiles = rows
    .slice(0, -1)
    .flatMap((top, row) =>
      Array.from({ length: cols }, (_, column) => {
        const bottom = rows[row + 1];
        return `<polygon points="${[
          [at(top, column), top * 300],
          [at(top, column + 1), top * 300],
          [at(bottom, column + 1), bottom * 300],
          [at(bottom, column), bottom * 300],
        ]
          .map((point) => point.join(","))
          .join(" ")}" fill="${(row + column) % 2 ? "#0d0c12" : "#ecebf0"}"/>`;
      }),
    )
    .join("");
  return `<svg viewBox="0 0 1000 300" preserveAspectRatio="none" class="fill" aria-hidden="true"><defs><linearGradient id="stage-floor-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07060b" stop-opacity=".75"/><stop offset=".5" stop-color="#07060b" stop-opacity=".15"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient></defs>${tiles}<rect width="1000" height="300" fill="url(#stage-floor-fade)"/><polyline class="stage-neon-line" points="-120,300 140,0 860,0 1120,300" fill="none" stroke-width="3"/></svg>`;
}
const neonStar = (classes) =>
  `<svg viewBox="0 0 24 24" class="neon-star ${classes}" aria-hidden="true"><path d="M12 2.5l2.8 6.3 6.8.6-5.2 4.5 1.6 6.7L12 17.1l-6 3.5 1.6-6.7-5.2-4.5 6.8-.6z" fill="none" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const werkFloor = () =>
  `<svg viewBox="0 0 1000 400" preserveAspectRatio="none" class="fill" aria-hidden="true">${["var(--c1)", "var(--c3)", "var(--c2)", "var(--c1)", "var(--c3)"].map((color, index) => `<path d="M ${-120 + index * 40} 420 Q 500 ${70 + index * 34} ${1120 - index * 40} 420" fill="none" stroke="${color}" stroke-width="7" vector-effect="non-scaling-stroke" opacity=".85"/>`).join("")}</svg>`;
function glitterStar() {
  const cx = 110,
    cy = 110,
    points = Array.from({ length: 10 }, (_, i) => {
      const radius = i % 2 ? 42 : 104,
        angle = -Math.PI / 2 + (i * Math.PI) / 5;
      return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    });
  const outline = points.map((point) => point.join(",")).join(" "),
    facets = points.map((point, i) =>
      [[cx, cy], point, points[(i + 1) % 10]]
        .map((point) => point.join(","))
        .join(" "),
    );
  return `<svg viewBox="0 0 220 220" class="glitter-star" aria-hidden="true"><defs><pattern id="lounge-glitter" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="2" r=".9" fill="#fff" opacity=".9"/><circle cx="5" cy="5.5" r=".7" fill="#fff" opacity=".6"/></pattern></defs>${facets.map((facet, index) => `<polygon points="${facet}" fill="${index % 2 ? "#8f939e" : "#dfe2e8"}"/>`).join("")}<polygon points="${outline}" fill="url(#lounge-glitter)"/><polygon points="${outline}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/></svg>`;
}
function mannequin(tone, classes) {
  const fill =
    tone === "gold" ? ["#f7d77a", "#b8862b"] : ["#ffffff", "#c9c4cf"],
    id = `mannequin-${tone}`;
  return `<svg viewBox="0 0 80 200" class="mannequin ${classes}" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${fill[1]}"/><stop offset=".45" stop-color="${fill[0]}"/><stop offset="1" stop-color="${fill[1]}"/></linearGradient></defs><rect x="36" y="2" width="8" height="12" rx="2" fill="#2a2030"/><path d="M30 14h20c20 6 24 20 20 36-6 20-12 30-10 46 2 16 10 24 6 34H14c-4-10 4-18 6-34 2-16-4-26-10-46-4-16 0-30 20-36Z" fill="url(#${id})"/><rect x="38" y="130" width="4" height="60" fill="#2a2030"/><ellipse cx="40" cy="194" rx="20" ry="5" fill="#2a2030"/></svg>`;
}
const loungeTable = () =>
  `<svg viewBox="0 0 320 172" class="lounge-table from-md" aria-hidden="true"><defs><pattern id="popcorn-stripes" width="8" height="10" patternUnits="userSpaceOnUse"><rect width="4" height="10" fill="#e21d38"/><rect x="4" width="4" height="10" fill="#fff"/></pattern><pattern id="nuts" width="7" height="6" patternUnits="userSpaceOnUse"><ellipse cx="3.5" cy="3" rx="3" ry="2.3" fill="#d9a35a"/></pattern></defs><rect x="34" y="96" width="5" height="62" fill="#7b3fb0"/><rect x="281" y="96" width="5" height="62" fill="#7b3fb0"/><rect x="6" y="126" width="6" height="46" fill="#9654cc"/><rect x="308" y="126" width="6" height="46" fill="#9654cc"/><polygon points="30,92 290,92 318,118 2,118" fill="#b878ea"/><polygon points="30,92 290,92 296,98 24,98" fill="#fff" opacity=".18"/><rect x="2" y="118" width="316" height="9" fill="#8c49c0"/><rect x="40" y="66" width="16" height="38" rx="2" fill="#ff4f9a"/><line x1="51" y1="46" x2="49" y2="68" stroke="#fff" stroke-width="2.5"/><rect x="64" y="76" width="14" height="28" rx="2" fill="#ff9a2e"/><g>${Array.from({ length: 7 }, (_, i) => `<circle cx="${112 + i * 4.5}" cy="${60 - (i % 3) * 3}" r="5" fill="#fff4d2"/>`).join("")}<polygon points="106,62 144,62 139,106 111,106" fill="url(#popcorn-stripes)"/></g><rect x="160" y="54" width="30" height="50" rx="7" fill="#fff" opacity=".28" stroke="#fff" stroke-opacity=".7"/><g>${[
    ["#ff4f9a", 168, 92],
    ["#ffd23f", 180, 94],
    ["#4fd1ff", 174, 84],
    ["#ff7a00", 184, 82],
    ["#9b5cff", 167, 78],
    ["#fff", 179, 72],
  ]
    .map(
      ([color, x, y]) =>
        `<circle cx="${x}" cy="${y}" r="4.5" fill="${color}"/>`,
    )
    .join(
      "",
    )}</g><rect x="163" y="48" width="24" height="8" rx="2" fill="#ff4f9a"/><rect x="208" y="50" width="36" height="54" rx="8" fill="url(#nuts)"/><rect x="212" y="44" width="28" height="9" rx="2" fill="#e9ecf2"/><rect x="258" y="72" width="15" height="32" rx="3" fill="#ff4f9a"/></svg>`;
function redCarpetSet() {
  const y = (t) => 128 + (414 - 128) * Math.pow(t, 1.2),
    width = (t) => 320 + 520 * t,
    steps = Array.from({ length: 11 }, (_, i) => {
      const a = i / 11,
        b = (i + 1) / 11,
        y0 = y(a),
        y1 = y(b),
        ym = y0 + (y1 - y0) * 0.38,
        w0 = width(a),
        w1 = width(b),
        wm = w0 + (w1 - w0) * 0.38,
        poly = (ya, wa, yb, wb) =>
          `${500 - wa / 2},${ya} ${500 + wa / 2},${ya} ${500 + wb / 2},${yb} ${500 - wb / 2},${yb}`;
      return `<polygon points="${poly(y0, w0, ym, wm)}" fill="var(--carpet-step-a, #d3172f)"/><polygon points="${poly(ym, wm, y1, w1)}" fill="var(--carpet-step-b, #8c091d)"/><line x1="${500 - w0 / 2}" y1="${y0}" x2="${500 + w0 / 2}" y2="${y0}" stroke="#fff" stroke-opacity=".16" stroke-width="1.5"/>`;
    }).join("");
  const post = (x, py, scale) =>
    `<ellipse cx="${x}" cy="${py}" rx="${10 * scale}" ry="${3 * scale}" fill="#7a5a1c"/><rect x="${x - 3 * scale}" y="${py - 74 * scale}" width="${6 * scale}" height="${74 * scale}" rx="${2 * scale}" fill="url(#carpet-gold)"/><circle cx="${x}" cy="${py - 74 * scale}" r="${6 * scale}" fill="url(#carpet-gold)"/>`;
  const posts = [0.08, 0.32, 0.56, 0.8, 1, 1.28].map((t) => {
    const scale = 0.45 + 0.6 * Math.min(t, 1.1),
      py = t <= 1 ? y(t) : 414 + (t - 1) * 360,
      x = 500 - (t <= 1 ? width(t) : width(1) + (t - 1) * 340) / 2 - 14 * scale;
    return { x, py, scale };
  });
  const side = (flip) =>
    `<g transform="${flip ? "translate(1000 0) scale(-1 1)" : ""}">${posts
      .slice(0, -1)
      .map((p, i) => {
        const q = posts[i + 1];
        return `<path d="M${p.x} ${p.py - 74 * p.scale + 6 * p.scale} Q ${(p.x + q.x) / 2} ${(p.py - 74 * p.scale + q.py - 74 * q.scale) / 2 + 26 * q.scale} ${q.x} ${q.py - 74 * q.scale + 6 * q.scale}" fill="none" stroke="#a3001d" stroke-width="${5 * q.scale}" stroke-linecap="round"/>`;
      })
      .join("")}${posts.map((p) => post(p.x, p.py, p.scale)).join("")}</g>`;
  return `<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" class="carpet-set" aria-hidden="true"><defs><linearGradient id="carpet-wall" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#3a1410"/><stop offset="1" stop-color="#120507"/></linearGradient><linearGradient id="carpet-floor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--carpet-floor-a, #b10d27)"/><stop offset="1" stop-color="var(--carpet-floor-b, #4d0410)"/></linearGradient><linearGradient id="carpet-gold" x1="0" x2="1"><stop stop-color="#8a6420"/><stop offset=".45" stop-color="#ffe08a"/><stop offset="1" stop-color="#a87a26"/></linearGradient><radialGradient id="carpet-door" cx=".5" cy=".7" r=".7"><stop stop-color="#ffd59a"/><stop offset="1" stop-color="#7a2a10"/></radialGradient></defs><rect width="1000" height="560" fill="url(#carpet-wall)"/>${Array.from({ length: 15 }, (_, i) => `<rect x="${i * 70 + 8}" y="0" width="54" height="410" rx="3" fill="#fff" opacity=".025"/>`).join("")}<path d="M432 112V46Q500-4 568 46v66Z" fill="url(#carpet-door)"/><path d="M418 112V44Q500-22 582 44v68" fill="none" stroke="#c99a45" stroke-width="5" opacity=".8"/><rect x="330" y="106" width="340" height="22" fill="var(--carpet-landing, #c4122d)"/>${steps}<rect y="414" width="1000" height="146" fill="url(#carpet-floor)"/>${side(false)}${side(true)}${[
    [60, 120],
    [140, 220],
    [40, 300],
    [880, 110],
    [950, 230],
    [840, 300],
  ]
    .map(
      ([x, y]) =>
        `<g class="carpet-flash" transform="translate(${x} ${y})"><circle r="16" fill="#fff" opacity=".25"/><path d="M0-18 3-3 18 0 3 3 0 18-3 3-18 0-3-3Z" fill="#fff"/></g>`,
    )
    .join("")}</svg>`;
}
function toast(message) {
  document.querySelector(".app-toast")?.remove();
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="app-toast animate-rise text-sm fw-bold">${esc(message)}</div>`,
  );
  setTimeout(() => document.querySelector(".app-toast")?.remove(), 2200);
}
function hero() {
  return `<section id="top" class="hero stage-bg"><div class="hero-stage"><div class="led-tiles led-center" aria-hidden="true"></div><div class="led-tiles led-left" aria-hidden="true"></div><div class="led-tiles led-right" aria-hidden="true"></div><div class="light-strip hero-strip is-left" aria-hidden="true"></div><div class="light-strip hero-strip is-right" aria-hidden="true"></div><div class="disco" aria-hidden="true"></div><div class="spotlight" aria-hidden="true"></div><div class="hero-floor">${stageFloor()}</div><div class="hero-floor-front" aria-hidden="true"></div><div class="hero-lights" aria-hidden="true">${Array.from({ length: 7 }, (_, i) => `<span class="front-light ${i % 2 ? "from-sm" : ""}"></span>`).join("")}</div><div class="hero-content"><div class="hero-kicker-frame"><p class="hero-kicker">Drag Race Filipinas Simulator</p></div><h1 class="h-stage font-display stage-title">Build your<br><span class="text-outline">own</span> season.</h1><div class="stage-card"><p class="hero-lede font-serif-accent">Pick up to <span class="stage-accent fw-semibold">20 queens</span> from Seasons 1 to 4 and <span class="stage-accent fw-semibold">Slaysian Royale Season 1</span>, or create your own <span class="stage-accent fw-semibold">custom queen</span>.</p><p class="hero-note">Choose a season look, then hit start.</p><p class="hero-tag font-serif-accent stage-accent">Good luck, at dapat pakak!</p><div class="hero-actions"><a href="#library" class="stage-btn-ghost">Pick your queens</a><a href="#custom" class="stage-btn-ghost">Create your own queen</a></div></div></div></div></section>`;
}
function werkRoom(items) {
  const slots = Array.from({ length: MAX }, (_, i) => items[i]);
  const mirror = (queen, n) =>
    queen
      ? `<div class="mirror-seat animate-rise"><div class="mirror-frame is-lit"><div class="mirror-screen">${queenArt(queen, undefined, true)}<span class="mirror-sheen"></span><span class="mirror-caption"><span class="mirror-name" title="${esc(queen.name)}">${esc(queen.name)}</span><span class="mirror-meta">${String(n).padStart(2, "0")} · ${queen.season === "custom" ? "Custom" : `S${queen.season}`}</span></span></div></div><button type="button" data-remove="${queen.id}" aria-label="Remove ${esc(queen.name)}" class="mirror-remove">${icon("x", "icon-xs")}</button></div>`
      : `<a href="#library" aria-label="Empty mirror ${n}, pick a queen from the library" class="mirror-link"><div class="mirror-frame"><div class="mirror-glass"><span class="mirror-num">${String(n).padStart(2, "0")}</span>${icon("plus", "mirror-plus icon-md")}</div></div></a>`;
  const table = (group, index) => {
    const first = index * 5 + 1;
    return `<div class="werk-table ${index < 2 ? "is-back" : ""}"><div class="werk-mirrors">${group.map((queen, offset) => mirror(queen, first + offset)).join("")}</div><div class="table-top"></div><div class="werk-rail"><span>Station ${String(first).padStart(2, "0")}–${String(first + 4).padStart(2, "0")}</span><span class="opacity-75">${group.filter(Boolean).length}/5</span></div><div class="werk-legs" aria-hidden="true"><span class="werk-leg is-left"></span><span class="werk-leg is-right"></span><span class="werk-bar"></span><span class="werk-shelf"></span></div><span class="werk-table-shadow" aria-hidden="true"></span></div>`;
  };
  return `<section id="werkroom" class="werk-section werk-wall"><span class="light-strip werk-strip is-left from-sm" aria-hidden="true"></span><span class="light-strip werk-strip is-right from-sm" aria-hidden="true"></span>${neonStar("werk-star is-left is-near from-md")}${neonStar("werk-star is-left is-far from-lg")}${neonStar("werk-star is-right is-near from-md")}${neonStar("werk-star is-right is-far from-lg")}${sun("werk-sun animate-spin-slow")}<div class="werk-head px-section"><div class="d-flex align-items-center gap-2"><button type="button" data-action="random" class="btn btn-glass werk-action is-random rounded-pill d-inline-flex align-items-center gap-2">${icon("shuffle")} Fill random</button><button type="button" data-action="clear" class="btn btn-glass werk-action is-clear rounded-pill d-inline-flex align-items-center gap-2" ${items.length ? "" : "disabled"}>${icon("trash")} Clear</button></div></div><div class="werk-sign"><div class="sign-box"><div class="sign-screen"><h2 class="werk-title neon font-display">Werk Room</h2><p class="werk-sign-meta"><span class="text-c3">${String(items.length).padStart(2, "0")}</span> / ${MAX} queens seated</p><p class="werk-blurb werk-sign-blurb text-sm">Minimum ${MIN}, maximum ${MAX}. The lights switch on when a queen takes her seat.</p></div></div></div><div class="werk-stage"><div class="werk-floor" aria-hidden="true">${werkFloor()}<span class="werk-floor-edge"></span></div><div class="werk-tables">${Array.from({ length: 4 }, (_, index) => table(slots.slice(index * 5, index * 5 + 5), index)).join("")}</div></div></section>`;
}
function customForm() {
  const types = [
    "Pageant",
    "Comedy",
    "Fashion",
    "Dancer",
    "Camp",
    "Look queen",
  ];
  return `<section id="custom" class="vanity-section vanity-wall"><div class="vanity-pillar is-left"></div><div class="vanity-pillar is-right"></div><header class="text-center"><h2 class="vanity-title font-display neon">Custom Queen</h2><p class="vanity-lede text-sm">Sit down, beat that mug, and create your own queen.</p></header><div class="vanity-mirror"><div class="vanity-frame" style="border-radius:64px;padding:30px"><div class="vanity-glass" style="border-radius:34px"><div class="vanity-body"><div class="vanity-preview"><div id="preview-art" class="vanity-portrait">${queenArt({ name: "Your Queen", season: "custom", tone: "c1" }, undefined, true)}</div><p id="preview-name" class="vanity-name font-display">Your Queen</p><p id="preview-sub" class="vanity-sub text-xs">Pageant · Hometown</p></div><form id="custom-form" class="vanity-form"><div class="vanity-fields"><label><span class="vanity-label">Drag name</span><input name="name" class="form-control vanity-input" maxlength="28"></label><label><span class="vanity-label">Hometown</span><input name="hometown" class="form-control vanity-input" maxlength="36"></label><label class="vanity-image-url"><span class="vanity-label">Image URL <small>(optional)</small></span><input type="url" name="image" class="form-control vanity-input" placeholder="https://example.com/your-queen.jpg"></label></div><fieldset><legend class="vanity-label">Drag type</legend><div class="chip-row">${types.map((type, i) => `<input type="radio" class="btn-check" name="archetype" id="type-${i}" value="${type}" ${i ? "" : "checked"}><label class="btn chip" for="type-${i}">${type}</label>`).join("")}</div></fieldset><fieldset><legend class="vanity-label">Poster color</legend><div class="swatch-row">${["c1", "c2", "c3", "ink"].map((tone, i) => `<input type="radio" class="btn-check" name="tone" id="tone-${tone}" value="${tone}" ${i ? "" : "checked"}><label class="btn swatch" for="tone-${tone}" style="--swatch:var(--${tone})"></label>`).join("")}</div></fieldset><p id="custom-error" class="stage-accent text-xs fw-semibold"></p><button class="stage-btn-ghost vanity-submit" ${app.castIds.length >= MAX ? "disabled" : ""}>Add to Werk Room</button></form></div></div></div></div><div class="vanity-table"><div class="vanity-top"></div><div class="vanity-front"><div class="vanity-drawer"></div><div class="vanity-drawer"></div><div class="vanity-drawer"></div></div></div></section>`;
}
function looks() {
  const current = currentTheme(),
    tilts = [-4, 2.5, -2, 3, -3];
  const sofa = (items, color, offset) =>
    `<div class="sofa" style="--sofa:${color}"><div class="sofa-back"><div class="sofa-cushions"><span class="sofa-cushion"></span><span class="sofa-cushion"></span><span class="sofa-cushion"></span></div></div><div class="sofa-seat"></div><div class="sofa-cards">${items
      .map((t, index) => {
        const on = app.theme === t.id;
        return `<button type="button" data-theme-pick="${t.id}" class="lounge-pick ${on ? "is-on" : ""}" aria-pressed="${on}" aria-label="${t.season}: ${t.name}" style="z-index:${on ? 5 : 1}"><span class="lounge-pick-shadow"></span><div class="lounge-pick-lift" style="transform:${on ? "translateY(-42px) scale(1.08)" : `rotate(${tilts[(offset + index) % tilts.length]}deg)`}"><div class="lounge-pick-hover"><div class="${on ? "animate-floaty" : ""}"><div data-theme="${t.id}" class="lounge-card"><div class="panel lounge-card-art"><div class="panel-pattern fill"></div>${sun(`lounge-card-sun ${t.id === "sr1" ? "sr1-card-sun" : ""} ${on ? "animate-spin-slow" : ""}`)}<span class="lounge-card-season">${t.season}</span><p class="lounge-card-name font-display">${t.name}</p></div><div class="lounge-card-foot"><span class="lounge-card-status">${on ? `${icon("check", "icon-xs")} On` : "Apply"}</span></div></div></div></div></div></button>`;
      })
      .join(
        "",
      )}</div><div class="sofa-front"></div><div class="sofa-arm is-left"></div><div class="sofa-arm is-right"></div><span class="sofa-leg is-left"></span><span class="sofa-leg is-right"></span></div>`;
  return `<section id="look" class="lounge-section"><div class="lounge-head px-section"><div><h2 class="h-section font-display">Choose the <span class="text-outline stage-accent">vibe</span></h2></div><div class="lounge-blurb text-sm"><p class="mt-2 fw-semibold"><span class="stage-accent">${current.name}</span> <span class="lounge-blurb-tag">· ${current.tagline}</span></p></div></div><div class="lounge-set"><div class="lounge-wall"></div><div class="lounge-floor"></div><div class="lounge-alcove"></div><div class="lounge-curtain is-left"></div><div class="lounge-curtain is-right"></div><div class="lounge-mirror is-left"></div><div class="lounge-mirror is-right"></div><div class="led-board"><span class="led-letters">UNTUCKED!</span></div><div class="lounge-sofas">${sofa(themes.slice(0, 3), "#e8344e", 0)}${sofa(themes.slice(3), "#f2703a", 3)}</div></div></section>`;
}
function card(q, index = 0) {
  const added = app.castIds.includes(q.id),
    full = app.castIds.length >= MAX,
    season = seasonLabel(q.season),
    bulbPositions = [
      ["3.25%", "6px"],
      ["18%", "6px"],
      ["34%", "6px"],
      ["50%", "6px"],
      ["66%", "6px"],
      ["82%", "6px"],
      ["96.25%", "6px"],
      ["6px", "20%"],
      ["6px", "37%"],
      ["6px", "52%"],
      ["6px", "67%"],
      ["6px", "82%"],
      ["calc(100% - 6px)", "20%"],
      ["calc(100% - 6px)", "37%"],
      ["calc(100% - 6px)", "52%"],
      ["calc(100% - 6px)", "67%"],
      ["calc(100% - 6px)", "82%"],
      ["3.25%", "calc(100% - 6px)"],
      ["18%", "calc(100% - 6px)"],
      ["34%", "calc(100% - 6px)"],
      ["50%", "calc(100% - 6px)"],
      ["66%", "calc(100% - 6px)"],
      ["82%", "calc(100% - 6px)"],
      ["96.25%", "calc(100% - 6px)"],
    ],
    bulbs = bulbPositions
      .map(
        ([left, top]) =>
          `<span class="queen-frame-bulb" style="left:${left};top:${top}"></span>`,
      )
      .join("");
  return `<li class="queen-card ${added ? "is-added" : ""}"><div class="queen-card-wall"><div class="queen-card-frame"><span class="queen-card-bulbs" aria-hidden="true">${bulbs}</span><div class="queen-card-art"><div class="queen-card-zoom">${queenArt(q, index + 1)}</div>${q.placement === "Winner" ? `<span class="badge queen-badge is-winner">${icon("crown", "icon-xs")} Winner</span>` : ""}${q.note ? `<span class="badge queen-badge is-note">${q.note === "In loving memory" ? "♥ " : ""}${esc(q.note)}</span>` : ""}${added ? `<span class="queen-added animate-pop">${icon("check")}</span>` : ""}</div></div></div><div class="queen-card-body"><div class="d-flex align-items-start justify-content-between gap-2"><p class="queen-name">${esc(q.name)}</p><span class="badge season-tag">${season}</span></div><p class="queen-hometown text-xs" title="${esc(q.hometown)}">${icon("pin", "icon-xs flex-shrink-0")} <span class="text-truncate">${esc(q.hometown)}</span></p><p class="queen-meta">${q.placement ? `Placed ${q.placement}` : q.archetype || "Season in progress"}</p><button type="button" data-toggle="${q.id}" class="btn cast-btn d-inline-flex align-items-center justify-content-center ${added ? "btn-c1" : "btn-ink-outline"}" ${!added && full ? "disabled" : ""}>${added ? `${icon("check", "icon-sm")} In cast · Remove` : `${icon("plus", "icon-sm")} ${full ? "Cast is full" : "Add to cast"}`}</button></div></li>`;
}
function renderQueenGroups() {
  let list = allQueens().filter(
    (q) =>
      (app.filter === "all" || String(q.season) === app.filter) &&
      (!app.query ||
        q.name.toLowerCase().includes(app.query) ||
        q.hometown.toLowerCase().includes(app.query)),
  );
  if (app.sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));

  const groups =
    app.sort === "az"
      ? [["A–Z", list]]
      : ["1", "2", "3", "4", "sr1", "custom"]
        .map((key) => [
          key === "custom" ? "Custom Queens" : key === "sr1" ? "Slaysian Royale Season 1" : `Season ${key}`,
          list.filter((q) => String(q.season) === key),
        ])
        .filter(([, items]) => items.length);
  const elParent = document.getElementById("queen-groups");
  if (!elParent) return;

  elParent.innerHTML = "";
  if (!groups.length) {
    elParent.innerHTML = '<div class="library-empty">No queens found.</div>';
    return;
  }

  for (let i = 0; i < groups.length; i++) {
    const [title, items] = groups[i];
    const missing = items.filter((q) => !app.castIds.includes(q.id));
    elParent.innerHTML += `<div class="mt-4"><div class="group-head"><h3 class="group-title font-display">${title}</h3><span class="group-rule"></span><button type="button" data-add-many="${missing.map((q) => q.id).join(",")}" class="btn btn-line rounded-pill d-inline-flex flex-shrink-0 align-items-center" ${missing.length === 0 || app.castIds.length >= MAX ? "disabled" : ""}>${missing.length === 0 ? `${icon("check", "icon-sm")} All in cast` : `${icon("plus", "icon-sm")} Add all ${missing.length}`}</button></div><ul class="queen-grid list-unstyled mb-0">${items.map(card).join("")}</ul></div>`;
  }

  elParent.querySelectorAll(".queen-card").forEach((queenCard) => {
    const meta = queenCard.querySelector(".queen-meta");
    if (!meta) return;

    const status = meta.textContent.trim().replace(/^Placed\s+/, "");
    meta.remove();
    if (!status || status === "Winner" || status === "Season in progress")
      return;

    const pill = document.createElement("span");
    pill.className = "badge queen-badge is-placement";
    pill.textContent = status;
    queenCard.querySelector(".queen-card-art")?.append(pill);
    queenCard.querySelector(".queen-added")?.classList.add("has-status");
  });
}
function library() {
  const filters = [
    ["all", "All seasons"],
    ["1", "Season 1"],
    ["2", "Season 2"],
    ["3", "Season 3"],
    ["4", "Season 4"],
    ["sr1", "SR Season 1"],
    ...(app.customs.length ? [["custom", "Custom"]] : []),
  ];
  return `<section id="library" class="library"><div class="carpet"><div class="carpet-vignette"></div><div class="carpet-head"><h2 class="h-section font-display carpet-title">The <span class="text-outline text-c3">Queens</span></h2><p class="carpet-lede">Every queen from Drag Race Philippines Season 1 to 4 and Slaysian Royale Season 1. Add them one by one, or grab a whole season.</p></div></div><div class="library-controls"><div class="filter-scroller">${filters.map(([id, label]) => `<button data-filter="${id}" class="filter-chip ${app.filter === id ? "is-on" : ""}"><span class="panel filter-chip-badge">${id === "all" ? icon("grid", "icon-sm") : id === "custom" ? "C" : id === "sr1" ? "SR" : id}</span><span>${label}</span></button>`).join("")}</div><label class="search-pill">${icon("search")}<input id="search" value="${esc(app.query)}" placeholder="Search queens…" class="search-input"></label><div class="sort-toggle"><button data-sort="chrono" class="${app.sort === "chrono" ? "is-on" : ""}">Chronological</button><button data-sort="az" class="${app.sort === "az" ? "is-on" : ""}">A–Z</button></div></div><div id="queen-groups"></div></section>`;
}
function startBar(items) {
  const ready = items.length >= MIN,
    theme = currentTheme();
  return `<div class="startbar fixed-bottom pe-none"><div class="startbar-inner pe-auto"><div class="startbar-cast"><div class="avatar-stack">${items
    .slice(0, 5)
    .map((q) => `<span class="avatar">${queenArt(q, undefined, true)}</span>`)
    .join("") || '<span class="avatar is-empty">?</span>'
    }${items.length > 5 ? `<span class="avatar is-more">+${items.length - 5}</span>` : ""}</div><div class="min-w-0 lh-sm"><p class="text-sm fw-bold">${items.length}/${MAX} queens</p><p class="startbar-sub text-truncate">${ready ? "Ready to sashay!" : `Add ${MIN - items.length} more to start`}</p></div></div><div class="startbar-progress from-md" aria-hidden="true"><div class="seg-track">${Array.from({ length: MAX }, (_, i) => `<span class="seg ${i < items.length ? "is-on" : ""}"></span>`).join("")}</div><div class="startbar-theme">${icon("palette", "icon startbar-theme-icon")}<div class="lh-sm"><p class="startbar-theme-season">${theme.season}</p><p class="text-xs fw-bold">${theme.name}</p></div></div></div><button type="button" data-start class="btn btn-c3 startbar-go d-inline-flex flex-shrink-0 align-items-center ms-auto" ${ready ? "" : "disabled"}>${icon("play")} Start the race</button></div></div>`;
}
function render() {
  const items = cast(),
    theme = currentTheme();
  document.documentElement.dataset.theme = app.theme;
  root.innerHTML = `<div data-theme="${app.theme}" class="app-root"><header class="topbar sticky-top"><div class="stripe"></div><div class="topbar-inner"><a href="#top" class="brand"><span class="brand-mark" role="img" aria-label="Drag Race Philippines"></span><span><span class="brand-name font-display">Drag Race Filipinas Simulator</span><span class="brand-sub">Are u ready to be the next drag superstar?</span></span></a><div class="ms-auto d-flex align-items-center gap-2 header-controls from-md"><div class="theme-chip"><span class="text-xs fw-semibold">Theme: ${theme.name}</span></div><div class="count-chip"><span class="font-monospace text-xs">${String(items.length).padStart(2, "0")}<span class="opacity-50">/${MAX}</span></span><div class="progress" role="progressbar" aria-label="Cast size" aria-valuenow="${items.length}" aria-valuemin="0" aria-valuemax="${MAX}"><div class="progress-bar" style="width:${(items.length / MAX) * 100}%"></div></div></div></div></div></header><div class="app-shell"><aside class="app-sidebar"><div class="app-sidebar-inner"><p class="side-label eyebrow">Setup</p><nav class="side-nav">${[
    ["werkroom", "Werk Room", "mirror"],
    ["custom", "Custom Queen", "wand"],
    ["look", "Season Look", "palette"],
    ["library", "The Queens", "grid"],
  ]
    .map(
      ([id, label, i], n) =>
        `<a href="#${id}" class="side-link"><span class="side-link-icon">${icon(i)}</span>${label}<span class="side-link-num">0${n + 1}</span></a>`,
    )
    .join(
      "",
    )}</nav></div></aside><main class="app-main">${hero()}${werkRoom(items)}${customForm()}${looks()}${library()}<footer class="app-footer text-xs">Sashay · a fan-made Drag Race Philippines simulator.</footer></main></div>${startBar(items)}</div>`;
  renderQueenGroups();
  bind();
}
function rerender(message) {
  save();
  render();
  if (message) toast(message);
}
function toggle(id) {
  const q = allQueens().find((q) => q.id === id);
  if (app.castIds.includes(id)) {
    app.castIds = app.castIds.filter((x) => x !== id);
    if (q.season === "custom")
      app.customs = app.customs.filter((x) => x.id !== id);
    rerender(`Sashay away, ${q.name}.`);
  } else if (app.castIds.length >= MAX) toast("The werk room is full.");
  else {
    app.castIds.push(id);
    rerender(`${q.name} joined the cast!`);
  }
}
function setPieces(items) {
  const side = document.querySelector(".app-sidebar-inner");
  if (side)
    side.insertAdjacentHTML(
      "beforeend",
      `<div class="side-card"><div class="d-flex align-items-center justify-content-between">${sun("side-card-sun")}<span class="font-monospace text-2xs text-muted">v0.1 beta</span></div><p class="side-card-title">${items.length === 0 ? "The werk room is still empty." : items.length < MIN ? "Just a few more queens!" : "Your cast is ready."}</p><p class="side-card-note">Fan-made simulator. Not affiliated with World of Wonder or HBO.</p></div>`,
    );

  const table = document.querySelector(".vanity-table");
  if (table)
    table.insertAdjacentHTML(
      "afterbegin",
      `<div class="vanity-props" aria-hidden="true"><div class="vanity-prop-group from-lg"><svg class="prop prop-wig" viewBox="0 0 90 150"><rect x="40" y="96" width="10" height="40" fill="#cfd3da"/><ellipse cx="45" cy="142" rx="22" ry="6" fill="#9aa0aa"/><path d="M45 6C14 6 2 36 8 66c4 24 14 38 22 44h30c8-6 18-20 22-44C88 36 76 6 45 6Z" fill="var(--c3)"/><ellipse cx="45" cy="60" rx="20" ry="27" fill="#ece7ea"/><path d="M45 6C26 6 22 26 26 40c8-12 26-16 40-6C68 20 60 6 45 6Z" fill="var(--c3)"/></svg><svg class="prop prop-perfume" viewBox="0 0 48 70"><rect x="18" y="2" width="12" height="12" rx="2" fill="#e9c46a"/><rect x="21" y="13" width="6" height="6" fill="#c9a24a"/><path d="M8 26Q8 18 16 18h16q8 0 8 8v36q0 6-6 6H14q-6 0-6-6Z" fill="var(--led-b)" opacity=".75"/><path d="M8 26Q8 18 16 18h16q8 0 8 8v36q0 6-6 6H14q-6 0-6-6Z" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/><rect x="13" y="24" width="4" height="36" rx="2" fill="#fff" opacity=".4"/><rect x="16" y="38" width="16" height="10" rx="1.5" fill="#fff" opacity=".85"/></svg></div><div class="vanity-prop-group is-center"><svg class="prop prop-compact" viewBox="0 0 60 26"><ellipse cx="30" cy="18" rx="27" ry="7" fill="#c9a24a"/><ellipse cx="30" cy="14" rx="27" ry="7" fill="#e9c46a"/><ellipse cx="30" cy="13.5" rx="21" ry="5" fill="#f3d9c4"/><ellipse cx="38" cy="9" rx="12" ry="5.5" fill="#fff"/></svg><svg class="prop prop-palette" viewBox="0 0 96 40"><path d="M10 6h76L80 0H16Z" fill="#c9ccd4"/><rect x="4" y="6" width="88" height="30" rx="5" fill="#16141b"/><g>${["var(--c1)", "var(--c2)", "var(--c3)", "#e8a0bf", "#8b5e3c", "#f5d0b5", "var(--c4)", "#2b2733"].map((color, index) => `<ellipse cx="${16 + (index % 4) * 21.3}" cy="${index < 4 ? 14 : 27}" rx="8" ry="4.6" fill="${color}"/>`).join("")}</g></svg><svg class="prop prop-lipstick" viewBox="0 0 20 64"><path d="M6 4 14 10v16H6Z" fill="var(--c1)"/><rect x="4.5" y="25" width="11" height="12" rx="1" fill="#e9c46a"/><rect x="3" y="36" width="14" height="28" rx="2" fill="#1a1720"/><rect x="3" y="36" width="14" height="3" fill="#e9c46a"/></svg></div><div class="vanity-prop-group from-lg"><svg class="prop prop-lipstick is-tall" viewBox="0 0 20 64"><path d="M6 4 14 10v16H6Z" fill="var(--c1)"/><rect x="4.5" y="25" width="11" height="12" rx="1" fill="#e9c46a"/><rect x="3" y="36" width="14" height="28" rx="2" fill="#1a1720"/></svg><svg class="prop prop-lipstick is-mid" viewBox="0 0 20 64"><path d="M6 4 14 10v16H6Z" fill="var(--c1)"/><rect x="4.5" y="25" width="11" height="12" rx="1" fill="#e9c46a"/><rect x="3" y="36" width="14" height="28" rx="2" fill="#1a1720"/></svg><svg class="prop prop-brushcup" viewBox="0 0 56 96"><g transform="rotate(-14 17 70)"><ellipse cx="17" cy="14" rx="5" ry="11" fill="#d9a777"/><rect x="14" y="22" width="6" height="10" fill="#cfd3da"/><rect x="14.8" y="31" width="4.4" height="40" rx="2" fill="#141218"/></g><g transform="rotate(8 39 70)"><ellipse cx="39" cy="20" rx="5" ry="11" fill="#f0c8a8"/><rect x="36" y="28" width="6" height="10" fill="#cfd3da"/><rect x="36.8" y="37" width="4.4" height="34" rx="2" fill="#141218"/></g><path d="M8 52h40l-3 40q0 3-3 3H14q-3 0-3-3Z" fill="var(--c4)"/><rect x="8" y="52" width="40" height="5" fill="#fff" opacity=".5"/></svg></div></div>`,
    );
  const frame = document.querySelector(".vanity-frame");
  if (frame) {
    const bulbRail = (side, count, delayOffset = 0) =>
      `<span class="vanity-bulb-rail is-${side}" aria-hidden="true">${Array.from(
        { length: count },
        (_, i) =>
          `<span class="vanity-bulb ${i % 4 === 1 ? "twinkle" : ""}" style="animation-delay:${((i + delayOffset) % 7) * -0.45}s"></span>`,
      ).join("")}</span>`;

    const renderVanityBulbs = () => {
      const { width, height } = frame.getBoundingClientRect();
      const horizontalCount = Math.min(
        12,
        Math.max(5, Math.round(width / 105)),
      );
      const verticalCount = Math.min(7, Math.max(4, Math.round(height / 100)));

      frame
        .querySelectorAll(".vanity-bulb-rail")
        .forEach((rail) => rail.remove());
      frame.insertAdjacentHTML(
        "afterbegin",
        [
          bulbRail("top", horizontalCount),
          bulbRail("right", verticalCount, horizontalCount),
          bulbRail("bottom", horizontalCount, horizontalCount + verticalCount),
          bulbRail("left", verticalCount, horizontalCount * 2 + verticalCount),
        ].join(""),
      );
    };

    renderVanityBulbs();
    new ResizeObserver(renderVanityBulbs).observe(frame);
  }
  document
    .querySelector(".vanity-glass")
    ?.insertAdjacentHTML("afterbegin", '<span class="vanity-sheen"></span>');
  document
    .querySelectorAll(".vanity-drawer")
    .forEach((drawer) =>
      drawer.insertAdjacentHTML(
        "beforeend",
        '<span class="vanity-handle"></span>',
      ),
    );
  const form = document.querySelector("#custom-form");
  if (form) {
    form
      .querySelectorAll(".vanity-fields label")
      .forEach((label) => label.classList.add("d-block"));
    form.elements.name.placeholder = "e.g. Ate Gurl Supreme";
    form.elements.hometown.placeholder = "e.g. Iloilo City";
  }

  const lounge = document.querySelector(".lounge-set");
  if (lounge)
    lounge.insertAdjacentHTML(
      "beforeend",
      `${glitterStar()}${mannequin("white", "is-white from-lg")}${mannequin("gold", "is-gold from-lg")}${loungeTable()}`,
    );

  const carpet = document.querySelector(".carpet");
  if (carpet) carpet.insertAdjacentHTML("afterbegin", redCarpetSet());
  document
    .querySelectorAll(".carpet-flash")
    .forEach((flash, i) => (flash.style.animationDelay = `${(i * 0.73) % 4}s`));
  if (carpet) {
    const shoes = [
      { season: "1", color: "#d62b1f", rot: -26, drop: 0 },
      { season: "2", color: "#ff3d8b", rot: 18, drop: 34 },
      { season: "3", color: "#151318", rot: -10, drop: 10 },
      { season: "4", color: "#13a3b5", rot: 30, drop: 40 },
      { season: "sr1", label: "SR1", color: "#6b2d8f", rot: -18, drop: 22 },
    ];
    carpet.insertAdjacentHTML(
      "beforeend",
      `<div class="heels heels-in" aria-label="Season quick filters">${shoes.map((shoe, i) => `<button type="button" data-filter="${shoe.season}" class="heel heel-drop ${app.filter === shoe.season ? "is-selected" : ""}" aria-label="Show ${shoe.label || `Season ${shoe.season}`} queens" title="${shoe.label || `Season ${shoe.season}`}" style="margin-top:${shoe.drop}px;animation-delay:${i * 0.14}s;--r:${shoe.rot}deg"><span class="heel-sway" style="animation-delay:${i * -0.9}s"><span class="heel-art" style="filter:drop-shadow(0 10px 12px rgba(0,0,0,.55))"><svg class="stiletto" viewBox="0 0 120 82" aria-hidden="true"><defs><pattern id="shoe-${shoe.season}" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.4" r=".7" fill="#fff" opacity=".55"/><circle cx="3.8" cy="3.6" r=".5" fill="#fff" opacity=".35"/></pattern><linearGradient id="heel-gold-${shoe.season}" x1="0" x2="1"><stop stop-color="#9a7022"/><stop offset=".5" stop-color="#ffe08a"/><stop offset="1" stop-color="#a87a26"/></linearGradient></defs><path d="M14 44 24 46 21 80 18 80Z" fill="url(#heel-gold-${shoe.season})"/><path d="M14 14C22 14 26 22 34 30c14 14 32 22 56 26 14 2 24 6 24 12 0 4-4 5-10 5H74c-18 0-32-11-42-23-4-4-8-6-12-6H14Z" fill="${shoe.color}"/><path d="M14 14C22 14 26 22 34 30c14 14 32 22 56 26 14 2 24 6 24 12 0 4-4 5-10 5H74c-18 0-32-11-42-23-4-4-8-6-12-6H14Z" fill="url(#shoe-${shoe.season})"/><text x="56" y="60" transform="rotate(26 56 56)" text-anchor="middle" class="font-display" font-size="13" fill="#fff">${shoe.label || `S${shoe.season}`}</text></svg></span></span></button>`).join("")}</div>`,
    );
  }
}
function updatePreview() {
  const form = document.querySelector("#custom-form");
  if (!form) return;
  const name = form.name.value.trim() || "Your Queen",
    hometown = form.hometown.value.trim() || "Hometown",
    type = form.archetype.value,
    tone = form.tone.value,
    image = form.image.value.trim();
  const art = document.querySelector("#preview-art"),
    title = document.querySelector("#preview-name"),
    sub = document.querySelector("#preview-sub");
  if (art)
    art.innerHTML = queenArt(
      { name, season: "custom", tone, image },
      undefined,
      true,
    );
  if (title) title.textContent = name;
  if (sub) sub.textContent = `${type} · ${hometown}`;
}
function bind() {
  setPieces(cast());
  document
    .querySelectorAll("[data-toggle],[data-remove]")
    .forEach(
      (el) =>
        (el.onclick = () => toggle(el.dataset.toggle || el.dataset.remove)),
    );
  document.querySelectorAll("[data-theme-pick]").forEach(
    (button) =>
    (button.onclick = () => {
      app.theme = button.dataset.themePick;
      rerender();
    }),
  );
  document.querySelectorAll("[data-filter]").forEach(
    (el) =>
    (el.onclick = () => {
      app.filter = el.dataset.filter;
      render();
    }),
  );
  document.querySelectorAll("[data-sort]").forEach(
    (el) =>
    (el.onclick = () => {
      app.sort = el.dataset.sort;
      render();
    }),
  );
  document.querySelectorAll("[data-add-many]").forEach(
    (button) =>
    (button.onclick = () => {
      const openIds = button.dataset.addMany
        .split(",")
        .filter(Boolean)
        .slice(0, MAX - app.castIds.length);
      if (!openIds.length) return;
      app.castIds.push(...openIds);
      rerender(`${openIds.length} queens joined the cast!`);
    }),
  );
  document
    .querySelector('[data-action="random"]')
    ?.addEventListener("click", () => {
      const pool = allQueens()
        .filter((q) => !app.castIds.includes(q.id))
        .sort(() => Math.random() - 0.5);
      const picked = pool.slice(
        0,
        app.castIds.length ? MAX - app.castIds.length : 12,
      );
      app.castIds.push(...picked.map((q) => q.id));
      rerender(`Surprise! ${picked.length} random queens added.`);
    });
  document
    .querySelector('[data-action="clear"]')
    ?.addEventListener("click", () => {
      app.castIds = [];
      rerender();
    });
  document.querySelector("#search")?.addEventListener("input", (e) => {
    const caret = e.target.selectionStart;
    app.query = e.target.value.toLowerCase();
    render();
    const search = document.querySelector("#search");
    search?.focus();
    search?.setSelectionRange(caret, caret);
  });
  document
    .querySelector("#custom-form")
    ?.addEventListener("submit", createCustom);
  document
    .querySelector("#custom-form")
    ?.addEventListener("input", updatePreview);
  document
    .querySelector("#custom-form")
    ?.addEventListener("change", updatePreview);
  document.querySelector("[data-start]")?.addEventListener("click", startRace);

  const syncTopbar = () =>
    document
      .querySelector(".topbar")
      ?.classList.toggle("is-compact", window.scrollY > 32);
  syncTopbar();
  if (!window.__drphTopbarScrollBound) {
    window.addEventListener("scroll", syncTopbar, { passive: true });
    window.__drphTopbarScrollBound = true;
  }
}
function createCustom(event) {
  event.preventDefault();
  const form = event.currentTarget,
    name = form.name.value.trim(),
    error = document.querySelector("#custom-error");
  if (!name) return (error.textContent = "Your queen needs a drag name.");
  if (allQueens().some((q) => q.name.toLowerCase() === name.toLowerCase()))
    return (error.textContent = "A queen with that name already exists.");
  const q = {
    id: `custom-${Date.now()}`,
    name,
    hometown: form.hometown.value.trim() || "Somewhere fabulous",
    image: form.image.value.trim(),
    season: "custom",
    archetype: form.archetype.value,
    tone: form.tone.value,
  };
  app.customs.push(q);
  app.castIds.push(q.id);
  rerender(`Welcome to the werk room, ${q.name}!`);
}
function startRace() {
  const names = cast();
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="race-overlay"><div class="panel race-panel"><button class="glass race-close">${icon("x")}</button><div class="race-count"><span class="race-num animate-pop font-display">3</span></div></div></div>`,
  );
  const modal = document.querySelector(".race-overlay"),
    number = modal.querySelector(".race-num");
  let step = 0;
  const timer = setInterval(() => {
    step++;
    if (step < 4) number.textContent = ["3", "2", "1", "Sashay!"][step];
    else {
      clearInterval(timer);
      modal.querySelector(".race-count").innerHTML =
        `<div class="race-body"><div class="race-head race-pad"><h2 class="race-title font-display">Episode 1: The Grand Entrance</h2></div><ul class="race-list race-pad list-unstyled">${names.map((q) => `<li class="race-item glass"><span class="race-thumb">${queenArt(q)}</span><span><b>${esc(q.name)}</b><span class="race-line">Hello, hello! ${esc(q.name)} is in the building.</span></span></li>`).join("")}</ul></div>`;
    }
  }, 650);
  modal.querySelector(".race-close").onclick = () => {
    clearInterval(timer);
    modal.remove();
  };
}
render();
