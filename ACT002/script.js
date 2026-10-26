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
  localStorage.setItem("drph-options", JSON.stringify(app.options));
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
  settings: "M4 7h16M4 12h16M4 17h16M8 5v4M16 10v4M11 15v4",
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
    entline: "(fake scream) Echos..."
  },
  {
    season: 1,
    name: "Marina Summers",
    image: "assets/Marina Summers.jpg",
    hometown: "Makati, Metro Manila",
    placement: "Runner-up",
    entline: "Just like summer, this is my season."
  },
  {
    season: 1,
    name: "Eva Le Queen",
    image: "assets/Eva Le Queen.jpg",
    hometown: "Marikina, Metro Manila",
    placement: "3rd",
    entline: "Mirror, mirror, on the wall... Who's the baddest bitch of them all?"
  },
  {
    season: 1,
    name: "Xilhouete",
    image: "assets/Xilhouete.jpg",
    hometown: "Cabanatuan, Nueva Ecija",
    placement: "3rd",
    entline: "I see stalkers... Oh, there they are. Hi, kids!"
  },
  {
    season: 1,
    name: "Minty Fresh",
    image: "assets/Minty Fresh.jpg",
    hometown: "Quezon City, Metro Manila",
    placement: "5th",
    entline: "Pilipinas, fresh ka pa ba?"
  },
  {
    season: 1,
    name: "Brigiding",
    image: "assets/Brigiding.jpg",
    hometown: "Mandaluyong, Metro Manila",
    placement: "6th",
    entline: "Finally... I'm here! Bring it on, girls!"
  },
  {
    season: 1,
    name: "Viñas DeLuxe",
    image: "assets/Vinas Deluxe.jpg",
    hometown: "San Jose del Monte, Bulacan",
    placement: "7th",
    entline: "♫ Say yeeeeeahhhhh... ♫ (looks towards the queens' direction) Andito na pala kayo! Oh, my God!"
  },
  {
    season: 1,
    name: "Lady Morgana",
    image: "assets/Lady Morgana.jpg",
    hometown: "Davao City, Davao del Sur",
    placement: "8th",
    note: "Miss Congeniality",
    entline: "Madayon, mga kaigsuonan!, or I should say... Hello, mga kaibigan, with feelings!"
  },
  {
    season: 1,
    name: "Turing",
    image: "assets/Turing.jpg",
    hometown: "Cainta, Rizal",
    placement: "9th",
    entline: "Let's do this!"
  },
  {
    season: 1,
    name: "Gigi Era",
    image: "assets/Gigi Era.jpg",
    hometown: "Melbourne, Australia",
    placement: "10th",
    entline: "Miss ma'am! I'm home... And I'm ready to sit on that throne, bitches!"
  },
  {
    season: 1,
    name: "Corazon",
    image: "assets/Corazon.jpg",
    hometown: "Bolinao, Pangasinan",
    placement: "11th",
    entline: "(tongue trill) Happy fiesta! (chuckle) Oh, my God! My name is Corazon at naniniwala ako sa mga katagang: Mga sis! Diyan muna kayo sa likod, tatawagin na lang 'pag may tira."
  },
  {
    season: 1,
    name: "Prince",
    image: "assets/Prince.jpg",
    hometown: "Calumpit, Bulacan",
    placement: "12th",
    entline: "Dude. Pare. Tsong. Of course."
  },
  {
    season: 2,
    name: "Captivating Katkat",
    image: "assets/Captivating Katkat.jpg",
    hometown: "Santa Maria, Ilocos Sur",
    placement: "Winner",
    entline: "Ah, eh... Maganda ba 'ko sa picture?"
  },
  {
    season: 2,
    name: "Arizona Brandy",
    image: "assets/Arizona Brandy.jpg",
    hometown: "Makati, Metro Manila",
    placement: "Runner-up",
    entline: "Ito ang tunay na shot puno!"
  },
  {
    season: 2,
    name: "Bernie",
    image: "assets/Bernie.jpg",
    hometown: "Mandaluyong, Metro Manila",
    placement: "3rd",
    entline: "Hello, mga diday! Pinag-uusapan niyo ba 'ko?"
  },
  {
    season: 2,
    name: "M1ss Jade So",
    image: "assets/M1ss Jade So.jpg",
    hometown: "Marikina, Metro Manila",
    placement: "3rd",
    entline: "It's raining... men. Ha-ha-hallelujah!"
  },
  {
    season: 2,
    name: "Hana Beshie",
    image: "assets/Hana Beshie.jpg",
    hometown: "Cagayan de Oro, Misamis Oriental",
    placement: "5th",
    note: "Miss Congeniality",
    entline: "The Bluesoos device is... ready to paiwww."
  },
  {
    season: 2,
    name: "ØV Cünt",
    image: "assets/ØV Cunt.jpg",
    hometown: "Rosario, Cavite",
    placement: "5th",
    entline: "Ehem, ehem, ehem... Bakit kasi hindi kayo makuha sa tingin?"
  },
  {
    season: 2,
    name: "DeeDee Marié Holliday",
    image: "assets/DeeDee Marie Holiday.jpg",
    hometown: "Tayabas, Quezon",
    placement: "7th",
    entline: "Well, well... I'm horny."
  },
  {
    season: 2,
    name: "Matilduh",
    image: "assets/Matilduh.jpg",
    hometown: "Vigan, Ilocos Sur",
    placement: "8th",
    entline: "Handuh na ba kayo?"
  },
  {
    season: 2,
    name: "Veruschka Levels",
    image: "assets/Veruschka Levels.jpg",
    hometown: "Hong Kong",
    placement: "9th",
    entline: "Bitch, the goddess is here!"
  },
  {
    season: 2,
    name: "Tiny DeLuxe",
    image: "assets/Tiny Deluxe.jpg",
    hometown: "Pasig, Metro Manila",
    placement: "10th",
    entline: "Chubby, ah?"
  },
  {
    season: 2,
    name: "Astrid Mercury",
    image: "assets/Astrid Mercury.jpg",
    hometown: "Mandaluyong, Metro Manila",
    placement: "11th",
    entline: "Mercury... is in retrograde."
  },
  {
    season: 2,
    name: "Nicole Pardaux",
    image: "assets/Nicole Pardaux.jpg",
    hometown: "Cebu City, Cebu",
    placement: "12th",
    entline: "Dong, anhi diri... Sabak Mommy B."
  },
  {
    season: 3,
    name: "Maxie",
    image: "assets/Maxie.jpg",
    hometown: "Manila, Metro Manila",
    placement: "Winner",
    entline: "Tang ina niyo, ano na? Bomba na! (fake sniffing) Parang ang baho... kayo yun?"
  },
  {
    season: 3,
    name: "Khianna",
    image: "assets/Khianna.jpg",
    hometown: "Cagayan de Oro, Misamis Oriental",
    placement: "Runner-up",
    entline: "What's up, mga gay? It's Khianna with a K..."
  },
  {
    season: 3,
    name: "Angel",
    image: "assets/Angel.jpg",
    hometown: "Manila, Metro Manila",
    placement: "3rd",
    entline: "Ba't niyo 'ko tinitignan?"
  },
  {
    season: 3,
    name: "Tita Baby",
    image: "assets/Tita Baby.jpg",
    hometown: "Marikina, Metro Manila",
    placement: "3rd",
    entline: "Ihanda na ang kanin, andito na ang ulam!"
  },
  {
    season: 3,
    name: "Zymba Ding",
    image: "assets/Zymba Ding.jpg",
    hometown: "Caloocan, Metro Manila",
    placement: "5th",
    entline: "I... have no worries. (grrr)"
  },
  {
    season: 3,
    name: "Myx Chanel",
    image: "assets/Myx Chanel.jpg",
    hometown: "Marikina, Metro Manila",
    placement: "6th",
    entline: "Drag Race Philippines Season 3, beke nemen!"
  },
  {
    season: 3,
    name: "Popstar Bench",
    image: "assets/Popstar Bench.jpg",
    hometown: "Manila, Metro Manila",
    placement: "7th",
    entline: "Ciao, ciao, ciao! Tong-its! Whoo!"
  },
  {
    season: 3,
    name: "John Fedellaga",
    image: "assets/John Fedellaga.jpg",
    hometown: "San Francisco, USA",
    placement: "8th",
    entline: "(moan) Hi, Daddy... are you ready for me?"
  },
  {
    season: 3,
    name: "J Quinn",
    image: "assets/J Quinn.jpg",
    hometown: "Caloocan, Metro Manila",
    placement: "9th",
    entline: "Naro sijakdoeneun drama."
  },
  {
    season: 3,
    name: "Yudipota",
    image: "assets/Yudipota.jpg",
    hometown: "Bacolod, Negros Occidental",
    placement: "10th",
    entline: "It's your favorite puta, Yudipota."
  },
  {
    season: 3,
    name: "Versex",
    image: "assets/Versex.jpg",
    hometown: "Manila, Metro Manila",
    placement: "11th",
    note: "Miss Congeniality",
    entline: "Gandang hindi mo ranas... bitch."
  },
  {
    season: 4,
    name: "Andy Crocker",
    image: "assets/Andy Crocker.jpg",
    hometown: "Caloocan, Metro Manila",
    placement: "TBA",
    entline: "Avisala, mga Crock-lings! (bites salt and vinegar-flavored cracker) Mmm! May asim pa! Diyos ko..."
  },
  {
    season: 4,
    name: "Bhorj Gum",
    image: "assets/Bhorj Gum.jpg",
    hometown: "Bacolod, Negros Occidental",
    placement: "TBA",
    entline: "When you walked out, I... walked in! (fake laugh)"
  },
  {
    season: 4,
    name: "Bombalicious Eklaver",
    image: "assets/Bombalicious Eklaver.jpg",
    hometown: "Washington D.C., USA",
    placement: "TBA",
    entline: "Shhh... Pasabog, 'di ba?!"
  },
  {
    season: 4,
    name: "Dixxxy Decoy",
    image: "assets/Dixxxy Decoy.jpg",
    hometown: "Davao City, Davao del Sur",
    placement: "11th",
    entline: "Your Diva-wenya superstar has finally arrived! You're welcome."
  },
  {
    season: 4,
    name: "Ghulli Ghush",
    image: "assets/Ghulli Ghush.jpg",
    hometown: "Cavite City, Cavite",
    placement: "10th",
    entline: "Drag Race Philippines, pwede bang bumanat?"
  },
  {
    season: 4,
    name: "Katana",
    image: "assets/Katana.jpg",
    hometown: "Santiago, Isabela",
    placement: "TBA",
    entline: "It's... your... kanto... mama."
  },
  {
    season: 4,
    name: "Manza",
    image: "assets/Manza.jpg",
    hometown: "Nabunturan, Davao de Oro",
    placement: "TBA",
    entline: "The long wait is over. (looks towards the queens) Ano? Sugdan na ag tubot! (fake scream)"
  },
  {
    season: 4,
    name: "Maureen Biology",
    image: "assets/Maureen Biology.jpg",
    hometown: "Baguio, Benguet",
    placement: "TBA",
    entline: "Bless."
  },
  {
    season: 4,
    name: "Merckz",
    image: "assets/Merckz.jpg",
    hometown: "Antipolo, Rizal",
    placement: "TBA",
    entline: "If you do not feel, breathe, and ooze cunt, do not come to this floor." 
  },
  {
    season: 4,
    name: "Misua",
    image: "assets/Misua.jpg",
    hometown: "Cagayan de Oro, Misamis Oriental",
    placement: "†Departured",
    note: "In loving memory",
    entline: "Meron ba kayong Misua?!"
  },
  {
    season: 4,
    name: "Taylor Sheesh",
    image: "assets/Taylor Sheesh.jpg",
    hometown: "Antipolo, Rizal",
    placement: "TBA",
    entline: "Talaga naman, talaga namang... trending na trending, at... pinipilahan!"
  },
  {
    season: 4,
    name: "Valeria",
    image: "assets/Valeria.jpg",
    hometown: "Manila, Metro Manila",
    placement: "TBA",
    entline: "Avisala... mga big cock!"
  },
  {
    season: "sr1",
    name: "Brigiding",
    image: "assets/Brigiding SR.jpg",
    hometown: "Mandaluyong, Metro Manila",
    placement: "Winner",
    entline: "Ding, ding, ding! It's a new Ding in the Werk Room..."
  },
  {
    season: "sr1",
    name: "Viñas DeLuxe",
    image: "assets/Vinas Deluxe SR.jpg",
    hometown: "San Jose del Monte, Bulacan",
    placement: "Runner-up",
    entline: "I'm back... la!"
  },
  {
    season: "sr1",
    name: "Arizona Brandy",
    image: "assets/Arizona Brandy SR.jpg",
    hometown: "Makati, Metro Manila",
    placement: "3rd",
    entline: "Welcome to Drag Race Philippines: Slaysian Royale! And I... thank you!"
  },
  {
    season: "sr1",
    name: "Suki Doll",
    image: "assets/Suki Doll SR.jpg",
    hometown: "Montréal, Quebec",
    placement: "3rd",
    note: "Miss Congeniality",
    entline: "Mother Doll has arrived... Bisous."
  },
  {
    season: "sr1",
    name: "Khianna",
    image: "assets/Khianna SR.jpg",
    hometown: "Cagayan de Oro, Misamis Oriental",
    placement: "5th",
    entline: "Round 2! Fight..."
  },
  {
    season: "sr1",
    name: "Yuhua",
    image: "assets/Yuhua SR.jpg",
    hometown: "New York City, New York",
    placement: "6th",
    entline: "Did somebody order a drag QUEEEEEEEEEEN?! Woo!"
  },
  {
    season: "sr1",
    name: "Siam Phusri",
    image: "assets/Siam Phusri SR.jpg",
    hometown: "Las Vegas, Nevada",
    placement: "7th",
    entline: "Gagawin ang lahat... Bigay... bigay... bigay... bigay? Bigay... Bigay mo sa'kin ang crown! Hi, Siam! Sawatdee kha! Hi, Siam! Mabuhay!"
  },
  {
    season: "sr1",
    name: "Bernie",
    image: "assets/Bernie SR.jpg",
    hometown: "Mandaluyong, Metro Manila",
    placement: "8th",
    entline: "Psst! Gusto mo bang patungan kita?"
  },
  {
    season: "sr1",
    name: "Kitty Space",
    image: "assets/Kitty Space SR.jpg",
    hometown: "Lyon, France",
    placement: "9th",
    entline: "Did you prepare a big Asian buffet? 'Cause I'm gonna eat them all... Bon appétit!"
  },
  {
    season: "sr1",
    name: "Ivory Glaze",
    image: "assets/Ivory Glaze SR.jpg",
    hometown: "Sydney, Australia",
    placement: "10th",
    entline: "Oh, my God, oh, my God, oh, my God, oh, my God, oh, my God! I'm so excited, I think I could... (pretends to faint)"
  },
  {
    season: "sr1",
    name: "Sum Ting Wong",
    image: "assets/Sum Ting Wong SR.jpg",
    hometown: "Birmingham, England",
    placement: "11th",
    entline: "Sum Ting wicked this way comes!"
  },
  {
    season: "sr1",
    name: "Madame Yoko",
    image: "assets/Madame Yoko SR.jpg",
    hometown: "Luxembourg City, Luxembourg",
    placement: "12th",
    entline: "Summer holidays, here I am... joking. No... Let's fight! ...for the crown."
  },
];
const queens = queenRoster.map((queen) => ({
  ...queen,
  id: `s${queen.season}-${slug(queen.name)}`,
}));
const app = {
  options: { premiere: "Normal Premiere", season: "Regular", returning: "None", finale: "Top 4", ...read("drph-options", {}) },
  theme: read("drph-theme", "flag"),
  castIds: read("drph-cast", []),
  customs: read("drph-customs", []),
  filter: "all",
  sort: "chrono",
  query: "",
};
const allQueens = () => [...queens, ...app.customs];
const seasonLabel = (season) =>
  season === "custom" ? "Custom" : season === "sr1" ? "SR S1" : `S${season}`;
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
      ? `<div class="mirror-seat animate-rise"><div class="mirror-frame is-lit"><div class="mirror-screen">${queenArt(queen, undefined, true)}<span class="mirror-sheen"></span><span class="mirror-caption"><span class="mirror-name" title="${esc(queen.name)}">${esc(queen.name)}</span><span class="mirror-meta">${String(n).padStart(2, "0")} · ${queen.season === "custom" ? "Custom" : queen.season === "sr1" ? "SR S1" : `S${queen.season}`}</span></span></div></div><button type="button" data-remove="${queen.id}" aria-label="Remove ${esc(queen.name)}" class="mirror-remove">${icon("x", "icon-xs")}</button></div>`
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
  return `<section id="custom" class="vanity-section vanity-wall"><div class="vanity-pillar is-left"></div><div class="vanity-pillar is-right"></div><header class="text-center"><h2 class="vanity-title font-display neon">Custom Queen</h2><p class="vanity-lede text-sm">Sit down, beat that mug, and create your own queen.</p></header><div class="vanity-mirror"><div class="vanity-frame" style="border-radius:64px;padding:30px"><div class="vanity-glass" style="border-radius:34px"><div class="vanity-body"><div class="vanity-preview"><div id="preview-art" class="vanity-portrait">${queenArt({ name: "Your Queen", season: "custom", tone: "c1" }, undefined, true)}</div><p id="preview-name" class="vanity-name font-display">Your Queen</p><p id="preview-sub" class="vanity-sub text-xs">Pageant · Hometown</p></div><form id="custom-form" class="vanity-form"><div class="vanity-fields"><label><span class="vanity-label">Drag Name</span><input name="name" class="form-control vanity-input" maxlength="28"></label><label><span class="vanity-label">Hometown</span><input name="hometown" class="form-control vanity-input" maxlength="36"></label><label class="vanity-entrance"><span class="vanity-label">Entrance Line</span><textarea name="entline" class="form-control vanity-input" rows="3" required placeholder="Your Queen's Grand Entrance Line"></textarea></label><label class="vanity-image-url"><span class="vanity-label">Image URL <small>(optional)</small></span><input type="url" name="image" class="form-control vanity-input" placeholder="https://example.com/your-queen.jpg"></label></div><fieldset><legend class="vanity-label">Drag Type</legend><div class="chip-row">${types.map((type, i) => `<input type="radio" class="btn-check" name="archetype" id="type-${i}" value="${type}" ${i ? "" : "checked"}><label class="btn chip" for="type-${i}">${type}</label>`).join("")}</div></fieldset><fieldset><legend class="vanity-label">Poster Color</legend><div class="swatch-row">${["c1", "c2", "c3", "ink"].map((tone, i) => `<input type="radio" class="btn-check" name="tone" id="tone-${tone}" value="${tone}" ${i ? "" : "checked"}><label class="btn swatch" for="tone-${tone}" style="--swatch:var(--${tone})"></label>`).join("")}</div></fieldset><p id="custom-error" class="stage-accent text-xs fw-semibold"></p><button class="stage-btn-ghost vanity-submit" ${app.castIds.length >= MAX ? "disabled" : ""}>Add to Werk Room</button></form></div></div></div></div><div class="vanity-table"><div class="vanity-top"></div><div class="vanity-front"><div class="vanity-drawer"></div><div class="vanity-drawer"></div><div class="vanity-drawer"></div></div></div></section>`;
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
    theme = currentTheme(),
    visibleAvatarCount = items.length >= 4 ? 3 : 5;
  return `<div class="startbar fixed-bottom pe-none"><div class="startbar-inner pe-auto"><div class="startbar-cast"><div class="avatar-stack">${items
    .slice(0, visibleAvatarCount)
    .map((q) => `<span class="avatar">${queenArt(q, undefined, true)}</span>`)
    .join("") || '<span class="avatar is-empty">?</span>'
    }${items.length > visibleAvatarCount ? `<span class="avatar is-more">+${items.length - visibleAvatarCount}</span>` : ""}</div><div class="min-w-0 lh-sm"><p class="text-sm fw-bold">${items.length}/${MAX} queens</p><p class="startbar-sub text-truncate">${ready ? "Ready to WERK!" : `Add ${MIN - items.length} more to start`}</p></div></div><div class="startbar-progress from-md" aria-hidden="true"><div class="seg-track">${Array.from({ length: MAX }, (_, i) => `<span class="seg ${i < items.length ? "is-on" : ""}"></span>`).join("")}</div><div class="startbar-theme">${icon("palette", "icon startbar-theme-icon")}<div class="lh-sm"><p class="startbar-theme-season">${theme.season}</p><p class="text-xs fw-bold">${theme.name}</p></div></div></div><div class="startbar-actions ms-auto"><button type="button" data-options class="btn btn-glass startbar-edit d-inline-flex align-items-center justify-content-center">${icon("palette", "icon-sm")} Edit sim settings</button><button type="button" data-start class="btn btn-c3 startbar-go d-inline-flex align-items-center justify-content-center" ${ready ? "" : "disabled"}>${icon("play")} Start the race</button></div></div></div>`;
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
  if (side) {
    const label = side.querySelector(".side-label"),
      nav = side.querySelector(".side-nav"),
      sections = [
        ["werkroom", "Werk Room", "mirror"],
        ["custom", "Custom Queens", "wand"],
        ["look", "Season Look", "palette"],
        ["library", "The Queens", "grid"],
        ["top", "Edit Options", "settings"],
      ];
    if (label) label.textContent = "Season setup";
    if (nav) {
      nav.classList.add("side-cabinet");
      nav.innerHTML = sections
        .map(
          ([id, name, glyph]) =>
            `<a ${id === "top" ? 'href="#" data-options' : `href="#${id}"`} class="side-link cabinet-shelf"><span class="cabinet-cosmetics" aria-hidden="true"><i class="cabinet-lipstick"></i><i class="cabinet-compact"></i><i class="cabinet-palette"></i><i class="cabinet-perfume"></i></span><span class="side-link-icon">${icon(glyph)}</span><span class="cabinet-label">${name}</span></a>`,
        )
        .join("");
    }
  }

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
  document.querySelectorAll("[data-options]").forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); openOptions(button); }));
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
  document.querySelectorAll(".cabinet-shelf").forEach((shelf) =>
    shelf.addEventListener("click", () => {
      document
        .querySelectorAll(".cabinet-shelf")
        .forEach((item) => item.classList.remove("is-active"));
      shelf.classList.add("is-active");
    }),
  );
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
    entline = form.elements.entline.value.trim(),
    error = document.querySelector("#custom-error");
  if (!name) return (error.textContent = "Your queen needs a drag name.");
  if (!entline) return (error.textContent = "Your queen needs an entrance line.");
  if (allQueens().some((q) => q.name.toLowerCase() === name.toLowerCase()))
    return (error.textContent = "A queen with that name already exists.");
  const q = {
    id: `custom-${Date.now()}`,
    name,
    entline,
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
const optionGroups = [
  ["premiere", "Premiere Format", ["Normal Premiere", "Normal Premiere (Non-Elimination)", "Double Premiere", "Double Premiere (Non-Elimination)"]],
  ["season", "Season Format", ["Regular", "Lipsync For Your Legacy", "All Winners"]],
  ["returning", "Returning Format", ["None", "Choose who returns", "LaLaPaRuZa", "Remaining Queens Vote"]],
  ["finale", "Finale Format", ["Top 4", "Top 3"]],
];
function openOptions(trigger) {
  const overlay = document.createElement("div");
  overlay.className = "options-overlay";
  overlay.innerHTML = `<div class="options-frame vanity-frame" role="dialog" aria-modal="true" aria-labelledby="options-title"><div class="options-glass"><div class="options-scroll"><header class="options-header"><div><span class="options-eyebrow">EDIT OPTIONS</span><h2 id="options-title">Set the stage<span>!</span></h2><p>Choose the rules for your season!</p></div><button type="button" class="options-close" aria-label="Close settings">${icon("x")}</button></header><form class="options-form">${optionGroups.map(([key, title, values], index) => `<fieldset class="options-group"><legend><span>0${index + 1}</span> ${title}</legend><div class="options-choices">${values.map((value) => `<label class="options-choice"><input type="radio" name="${key}" value="${esc(value)}" ${app.options[key] === value ? "checked" : ""}><span>${esc(value)}<i aria-hidden="true"></i></span></label>`).join("")}</div></fieldset>`).join("")}<div class="options-actions"><button type="button" class="options-cancel">Cancel</button><button type="submit" class="options-save">Save settings ${icon("check", "icon-sm")}</button></div></form></div></div></div>`;
  document.body.append(overlay);
  const frame = overlay.querySelector(".options-frame");
  const renderBulbs = () => {
    const { width, height } = frame.getBoundingClientRect();
    const horizontal = Math.min(12, Math.max(5, Math.round(width / 105)));
    const vertical = Math.min(7, Math.max(4, Math.round(height / 100)));
    frame.querySelectorAll(".vanity-bulb-rail").forEach((rail) => rail.remove());
    frame.insertAdjacentHTML("afterbegin", ["top", "right", "bottom", "left"].map((side) =>
      `<span class="vanity-bulb-rail is-${side}" aria-hidden="true">${Array.from({ length: side === "top" || side === "bottom" ? horizontal : vertical }, () => '<span class="vanity-bulb"></span>').join("")}</span>`
    ).join(""));
  };
  renderBulbs();
  const bulbObserver = new ResizeObserver(renderBulbs);
  bulbObserver.observe(frame);
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  const close = () => { bulbObserver.disconnect(); document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKey); overlay.remove(); trigger.focus(); };
  const onKey = (event) => { if (event.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  overlay.addEventListener("click", (event) => { if (event.target === overlay || event.target.closest(".options-close, .options-cancel")) close(); });
  overlay.querySelector("form").addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); optionGroups.forEach(([key]) => { app.options[key] = data.get(key); }); save(); close(); toast("Season settings saved!"); });
  overlay.querySelector(".options-close").focus();
}
// Fisher-Yates gives each queen an equal chance at every entrance position.
function shuffleEntranceCast(queens) {
  const order = [...queens];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
function createEntranceSession(queens, options) {
  const order = shuffleEntranceCast(queens);
  return {
    options: { ...options },
    cast: order,
    groups: options.premiere.startsWith("Double")
      ? [order.slice(0, Math.ceil(order.length / 2)), order.slice(Math.ceil(order.length / 2))]
      : [order],
    groupIndex: 0,
    queenIndex: 0,
    arrived: [],
    phase: "countdown",
  };
}
// Advance only after the current portrait has reached the cast row.
function advanceEntranceSession(session) {
  if (session.phase === "entrances") {
    const group = session.groups[session.groupIndex];
    session.arrived.push(group[session.queenIndex].id);
    if (session.queenIndex + 1 < group.length) session.queenIndex++;
    else session.phase = session.groupIndex + 1 < session.groups.length ? "between-premieres" : "lineup";
  } else if (session.phase === "between-premieres") {
    session.groupIndex++;
    session.queenIndex = 0;
    session.phase = "entrances";
  } else if (session.phase === "lineup") session.phase = "ready";
  return session.phase;
}
function entranceSet() {
  const bulbs = (side, count) => `<span class="entrance-door-bulbs is-${side}">${'<i></i>'.repeat(count)}</span>`;
  const cosmetics = '<i class="cabinet-lipstick"></i><i class="cabinet-perfume"></i><i class="cabinet-compact"></i>';
  const cabinet = () => `<div class="entrance-wall-cabinet"><div class="entrance-cabinet-glass"><span class="entrance-cabinet-shelf">${cosmetics}</span><span class="entrance-cabinet-shelf">${cosmetics}</span></div><span class="entrance-cabinet-handles"></span></div>`;
  const furniture = (side) => `<div class="entrance-furnishings is-${side}"><div class="entrance-wall-cabinets">${cabinet()}${cabinet()}</div><div class="entrance-worktable"><div class="entrance-table-props">${cosmetics}<i class="cabinet-palette"></i></div><div class="table-top"></div><div class="werk-rail"><span>WERK</span></div><div class="werk-legs"><span class="werk-leg is-left"></span><span class="werk-leg is-right"></span><span class="werk-bar"></span><span class="werk-shelf"></span></div><span class="werk-table-shadow"></span></div></div>`;
  return `<div class="entrance-set" aria-hidden="true"><div class="entrance-wall"></div>${sun("entrance-door-sun")}<div class="entrance-pillar is-left"></div><div class="entrance-pillar is-right"></div><div class="entrance-door"><div class="entrance-door-inside"><span class="entrance-door-sign">WERK</span><span class="entrance-curtain is-left"></span><span class="entrance-curtain is-right"></span></div>${bulbs("top", 6)}${bulbs("left", 7)}${bulbs("right", 7)}</div><div class="entrance-floor"><span></span><i></i></div>${furniture("left")}${furniture("right")}</div>`;
}
function entrancePortrait(queen) {
  return `<div class="entrance-portrait">${queenArt(queen, undefined, true).replace('loading="lazy"', 'loading="eager"')}</div>`;
}
function startRace() {
  if (document.querySelector(".entrance-overlay")) return;
  const queens = cast();
  if (queens.length < MIN || queens.length > MAX) return;
  const trigger = document.activeElement;
  const session = createEntranceSession(queens, app.options);
  app.race = session;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const overlay = document.createElement("div");
  overlay.className = "entrance-overlay";
  overlay.innerHTML = `<section class="entrance-shell" role="dialog" aria-modal="true" aria-label="Meet the queens"><button type="button" class="entrance-close options-close" aria-label="Close entrances">${icon("x")}</button><div class="entrance-content"></div><p class="visually-hidden entrance-live" aria-live="polite" aria-atomic="true"></p></section>`;
  document.body.append(overlay);
  const content = overlay.querySelector(".entrance-content");
  const live = overlay.querySelector(".entrance-live");
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  const timers = new Set();
  const animations = new Set();
  let disposed = false;
  let busy = true;
  const later = (callback, delay) => {
    const timer = setTimeout(() => { timers.delete(timer); if (!disposed) callback(); }, delay);
    timers.add(timer);
  };
  const animate = (element, keyframes, duration = 650, delay = 0) => {
    if (reducedMotion || !element.animate) return Promise.resolve();
    const animation = element.animate(keyframes, { duration, delay, easing: "cubic-bezier(.2,.75,.25,1)", fill: "backwards" });
    animations.add(animation);
    return animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  };
  const close = () => {
    disposed = true;
    timers.forEach(clearTimeout);
    animations.forEach((animation) => animation.cancel());
    document.removeEventListener("keydown", onKey);
    document.body.style.overflow = previousOverflow;
    overlay.remove();
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  };
  const onKey = (event) => {
    if (event.key === "Escape") { close(); return; }
    if (event.key !== "Tab") return;
    const controls = [...overlay.querySelectorAll('button:not(:disabled), [tabindex="0"]')].filter((el) => el.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  document.addEventListener("keydown", onKey);
  overlay.querySelector(".entrance-close").addEventListener("click", close);
  overlay.querySelector(".entrance-close").focus({ preventScroll: true });

  const updateHeader = () => {
    const group = session.groups[session.groupIndex];
    content.querySelector(".entrance-progress").textContent = `${session.arrived.length} / ${session.cast.length} queens in the room`;
    content.querySelector(".entrance-premiere-label").textContent = session.groups.length > 1
      ? `Premiere ${session.groupIndex + 1} of 2 | ${session.options.premiere.includes("Non-Elimination") ? "Non-elimination" : "Split premiere"}`
      : session.options.premiere;
    content.querySelector(".entrance-counter").textContent = `${String(session.queenIndex + 1).padStart(2, "0")} / ${String(group.length).padStart(2, "0")}`;
  };
  const enterQueen = async () => {
    session.phase = "entrances";
    busy = true;
    const queen = session.groups[session.groupIndex][session.queenIndex];
    const feature = content.querySelector(".entrance-feature");
    const next = content.querySelector(".entrance-next");
    updateHeader();
    feature.innerHTML = `${entrancePortrait(queen)}<div class="entrance-introduction"><span class="entrance-kicker entrance-origin"><span class="entrance-origin-season">${esc(seasonLabel(queen.season))}</span><span class="entrance-origin-hometown">${esc(queen.hometown || "Somewhere fabulous")}</span></span><h3>${esc(queen.name)}</h3><blockquote>${esc(queen.entline || `Hello, hello! ${queen.name} is in the building.`)}</blockquote></div>`;
    const portrait = feature.querySelector(".entrance-portrait");
    content.querySelector(".entrance-room").classList.add("is-entering");
    next.disabled = true;
    next.innerHTML = `${session.queenIndex === session.groups[session.groupIndex].length - 1 ? "Complete this premiere" : "Next queen"} ${icon("play", "icon-sm")}`;
    live.textContent = `${queen.name}. ${queen.entline || "Welcome to the Werk Room!"}`;
    // The portrait starts inside the doorway, then comes forward into the spotlight.
    await Promise.all([
      animate(portrait, [{ opacity: 0, transform: "translateY(-90px) scale(.16)" }, { opacity: 1, transform: "translateY(-65px) scale(.35)", offset: .3 }, { opacity: 1, transform: "translateY(0) scale(1)" }], 1050),
      animate(feature.querySelector(".entrance-introduction"), [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }], 550, 650),
    ]);
    if (disposed) return;
    content.querySelector(".entrance-room").classList.remove("is-entering");
    next.disabled = false;
    busy = false;
  };
  const finishEntrances = async () => {
    session.phase = "lineup";
    const portraits = [...content.querySelectorAll(".entrance-roster .entrance-portrait")];
    const before = portraits.map((portrait) => portrait.getBoundingClientRect());
    const room = content.querySelector(".entrance-room");
    room.classList.add("is-complete");
    content.querySelector(".entrance-heading h2").textContent = "The queens are here!";
    content.querySelector(".entrance-premiere-label").textContent = "The cast is complete. Let the season begin.";
    content.querySelector(".entrance-roster-label").textContent = "YOUR CAST";
    content.querySelector(".entrance-scene").hidden = true;
    const next = content.querySelector(".entrance-next");
    next.innerHTML = `Let's start the race! ${icon("play", "icon-sm")}`;
    next.disabled = true;
    live.textContent = `All ${session.cast.length} queens have entered. Let's start the race!`;
    await Promise.all(portraits.map((portrait, index) => {
      const after = portrait.getBoundingClientRect();
      return animate(portrait, [{ transform: `translate(${before[index].left - after.left}px, ${before[index].top - after.top}px) scale(${before[index].width / after.width})` }, { transform: "translate(0, 0) scale(1)" }], 850, index * 30);
    }));
    if (disposed) return;
    next.disabled = false;
    busy = false;
    animate(next, [{ opacity: 0, transform: "translateY(15px)" }, { opacity: 1, transform: "translateY(0)" }], 450);
  };
  const featurePlaceholder = (portrait) => {
    const placeholder = document.createElement("div");
    placeholder.className = "entrance-portrait-placeholder";
    placeholder.style.width = `${portrait.offsetWidth}px`;
    placeholder.style.height = `${portrait.offsetHeight}px`;
    portrait.before(placeholder);
  };
  const nextQueen = async () => {
    if (busy || disposed) return;
    if (session.phase === "lineup") { showSeasonReady(); return; }
    if (session.phase === "between-premieres") {
      advanceEntranceSession(session);
      await enterQueen();
      return;
    }
    busy = true;
    const next = content.querySelector(".entrance-next");
    next.disabled = true;
    const queen = session.groups[session.groupIndex][session.queenIndex];
    const portrait = content.querySelector(".entrance-feature .entrance-portrait");
    const before = portrait.getBoundingClientRect();
    // Preserve the spotlight's space while its portrait moves into the roster.
    featurePlaceholder(portrait);
    const item = document.createElement("li");
    item.className = "entrance-roster-queen";
    item.innerHTML = `<span class="entrance-roster-name">${esc(queen.name)}</span>`;
    item.prepend(portrait);
    const roster = content.querySelector(".entrance-roster");
    roster.append(item);
    roster.scrollTop = roster.scrollHeight;
    const after = portrait.getBoundingClientRect();
    // Animate a floating copy so the scrollable cast row cannot clip the flight.
    const flyingPortrait = portrait.cloneNode(true);
    Object.assign(flyingPortrait.style, {
      position: "fixed", left: `${before.left}px`, top: `${before.top}px`,
      width: `${before.width}px`, height: `${before.height}px`,
      transformOrigin: "top left", pointerEvents: "none", zIndex: "20",
    });
    overlay.append(flyingPortrait);
    portrait.style.visibility = "hidden";
    content.querySelector(".entrance-introduction").style.visibility = "hidden";
    await animate(flyingPortrait, [{ transform: "translate(0, 0) scale(1)" }, { transform: `translate(${after.left - before.left}px, ${after.top - before.top}px) scale(${after.width / before.width})` }], 650);
    flyingPortrait.remove();
    if (disposed) return;
    portrait.style.visibility = "";
    advanceEntranceSession(session);
    content.querySelector(".entrance-progress").textContent = `${session.arrived.length} / ${session.cast.length} queens in the room`;
    if (session.phase === "entrances") {
      await enterQueen();
    } else if (session.phase === "between-premieres") {
      content.querySelector(".entrance-feature").innerHTML = `<div class="entrance-group-complete"><span class="entrance-kicker">ONE ROOM. TWO GRAND ENTRANCES.</span><h3>Premiere 1 is here.</h3><p>There's another group of queens waiting behind the curtain.</p></div>`;
      next.innerHTML = `Meet Premiere 2 ${icon("plus", "icon-sm")}`;
      next.disabled = false;
      busy = false;
    } else await finishEntrances();
  };
  const showSeasonReady = () => {
    advanceEntranceSession(session);
    content.innerHTML = `<div class="entrance-ready">${sun("entrance-ready-sun")}<span class="entrance-kicker">THE STAGE IS SET</span><h2 class="font-display">Let's start the race!</h2><p>${session.cast.length} queens. One crown. Your season is ready.</p><div class="entrance-rules">${optionGroups.map(([key, label]) => `<div><span>${label}</span><strong>${esc(session.options[key])}</strong></div>`).join("")}</div><p class="entrance-ready-note">Entrances complete. The first challenge is the next stage of the simulator.</p><button type="button" class="entrance-next entrance-return">Back to season setup ${icon("check", "icon-sm")}</button></div>`;
    content.querySelector(".entrance-return").addEventListener("click", close);
    window.dispatchEvent(new CustomEvent("drph:entrances-complete", { detail: { cast: [...session.cast], options: { ...session.options }, groups: session.groups.map((group) => [...group]) } }));
  };
  const showRoom = () => {
    content.innerHTML = `<div class="entrance-room">${entranceSet()}<header class="entrance-heading"><div><span class="entrance-kicker entrance-premiere-label"></span><h2>Welcome to the Werk Room</h2></div><span class="entrance-counter"></span></header><div class="entrance-scene"><article class="entrance-feature"></article></div><section class="entrance-deck" aria-label="Queens in the Werk Room"><div class="entrance-deck-heading"><span class="entrance-roster-label">IN THE WERK ROOM</span><span class="entrance-progress"></span></div><ol class="entrance-roster"></ol></section><footer class="entrance-controls"><button type="button" class="entrance-next" disabled>Next queen ${icon("plus", "icon-sm")}</button></footer></div>`;
    content.querySelector(".entrance-next").addEventListener("click", nextQueen);
    enterQueen();
  };
  content.innerHTML = `<div class="entrance-countdown"><div class="entrance-rays" aria-hidden="true"></div>${sun("entrance-countdown-sun")}<span class="entrance-count-number">3</span><p class="entrance-count-label">THE WERK ROOM IS WAITING</p></div>`;
  const number = content.querySelector(".entrance-count-number");
  const count = (value) => {
    number.textContent = value;
    live.textContent = String(value);
    animate(number, [{ opacity: 0, transform: "scale(.7)" }, { opacity: 1, transform: "scale(1)" }], 350);
  };
  count(3);
  later(() => count(2), 900);
  later(() => count(1), 1800);
  later(() => {
    number.textContent = "Let's Meet The Queens!";
    content.querySelector(".entrance-countdown").classList.add("is-announcing");
    live.textContent = "Let's Meet The Queens!";
    animate(number, [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }], 500);
  }, 2700);
  later(showRoom, 4300);
}

render();
