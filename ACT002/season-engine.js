(function (scope) {
  'use strict';
  const FORMATS = {
    premiere: ['Normal Premiere', 'Normal Premiere (Non-Elimination)', 'Double Premiere', 'Double Premiere (Non-Elimination)'],
    season: ['Regular', 'Lipsync For Your Legacy', 'All Winners'],
    returning: ['None', 'Choose who returns', 'LaLaPaRuZa', 'Remaining Queens Vote'],
    finale: ['Top 4', 'Top 3'],
    doubleShantay: ['None', 'Double Shantay'],
    doubleSashay: ['None', 'Double Sashay'],
  };
  const PPE = { WIN: 5, TOP2: 4.5, HIGH: 4, SAFE: 3, LOW: 2, BTM2: 1, ELIM: 0 };
  const RELATIONSHIPS = [
    { id: 'showmance', label: 'Showmance', short: 'Show', score: 90, min: 75 },
    { id: 'friend', label: 'Friend', short: 'Frnd', score: 55, min: 40 },
    { id: 'ally', label: 'Ally', short: 'Ally', score: 25, min: 15 },
    { id: 'neutral', label: 'Neutral', short: '--', score: 0, min: -14 },
    { id: 'tense', label: 'Tense', short: 'Tense', score: -30, min: -44 },
    { id: 'enemy', label: 'Enemy', short: 'Enemy', score: -65, min: -100 },
  ];
  const SONGS = [
    ['Tala', 'Sarah Geronimo', '6C6F2oA7cmZKqq26FPGl0J', 'PH S1 E1'],
    ['Shine', 'Regine Velasquez', '7za1Ok6xxwuLWUyxloaBUl', 'PH S1 E4'],
    ['AMAKABOGERA', 'Maymay Entrata', '5SZ0wDFDzdvlU5S7zB1DLm', 'PH S1 E6'],
    ['Sissy That Walk', 'RuPaul', '5PHPENfE3RVmHGAA2A7Hfx', 'PH S1 finale'],
    ['Call Me Mother', 'RuPaul', '0SENYBHXBj0TI1ZygWwxee', 'PH S1 finale'],
    ['Sirena', 'Gloc-9 feat. Ebe Dancel', '1y8uWtPF64SEAkU2RWvYpr', 'PH S1 finale'],
    ['Born Naked', 'RuPaul feat. Clairy Browne', '5Y0TwK9DiaM4cYl0SeprDy', 'PH S1 E7'],
  ].map(([title, artist, spotify, source]) => ({ title, artist, spotify, source }));
  const CHALLENGES = [
    { id: 'girlgroup', label: 'Girl Groups', min: 8, max: 12, skill: 'dance', core: true, titles: ['Bida Ka, Beks', 'A Round of Haplos', 'Alarma!'], brief: 'Two groups of queens bring a Filipino pop concept to life through choreography, stage presence, and teamwork.' },
    { id: 'snatch', label: 'Snatch Game', min: 8, skill: 'comedy', core: true, titles: ['Snatch Game, Enebe?'], brief: 'Bring a celebrity impersonation to life with quick answers, sharp timing, and a character that stays funny.' },
    { id: 'rusical', label: 'Rusical', min: 8, skill: 'acting', core: true, titles: ['Dragna', 'Bongga Ka Gay!', 'Ang Unang Zsa-Zsa: The Rusical'], brief: 'Sing, dance, and act through an original camp musical about a small-town diva chasing the spotlight.' },
    { id: 'design', label: 'Design / Ball', min: 3, skill: 'fashion', core: true, titles: ['The Sari-Sari Store Ball', 'Recycled Royalty', 'Happy Fiesta!'], brief: 'Present two styled looks and construct a final outfit from unexpected materials. Construction, silhouette, and storytelling count.' },
    { id: 'roast', label: 'Roast', min: 3, skill: 'comedy', titles: ['The Roast of Mamwa Pao', 'Porkchop Roast', 'Queen of the Roast'], brief: 'Deliver an original roast of the imaginary Barangay Glam Council. Keep the jokes sharp and the delivery warmer than the lights.' },
    { id: 'acting', label: 'Acting', min: 3, skill: 'acting', titles: ['Kambal sa Dressing Room', 'Ang Nawawalang Korona', 'Bituin, Bawal ang Flat Shoes'], brief: 'Star in a camp teleserye parody. Commit to the character, land the punchlines, and share the scene.' },
    { id: 'advert', label: 'Branding / Commercial', min: 3, skill: 'comedy', titles: ['Budol Beauty Network', 'Sell Me That Fantasy'], brief: 'Create a ridiculous beauty product and sell it in an original commercial with a clear brand and a memorable joke.' },
    { id: 'makeover', label: 'Makeover', min: 3, skill: 'fashion', titles: ['Chosen Family Resemblance', 'Drag Sister, Drag Daughter'], brief: 'Transform a fictional guest into a member of your drag family. Show resemblance without losing either personality.' },
    { id: 'dance', label: 'Choreography', min: 3, skill: 'dance', titles: ['Sayaw sa Kanto', 'Afterparty Aerobics'], brief: 'Learn a fast routine and make every count look effortless. Musicality matters as much as precision.' },
    { id: 'talent', label: 'Talent Show', min: 2, skill: 'performance', titles: ['Talent Show Extrabagansya'], brief: 'Introduce your drag through a one-minute signature talent performance.' },
    { id: 'improv', label: 'Improv / Hosting', min: 3, skill: 'comedy', titles: ['Chika Hotline Live', 'Good Morning, Mga Beks!'], brief: 'Host an unpredictable live segment and turn every surprise into a punchline.' },
    { id: 'lalaparuza', label: 'LaLaPaRuZa', min: 8, skill: 'lipsync', titles: ['LaLaPaRuZa: Todo Na Twooh!'], brief: 'A survival lip-sync tournament. Match winners become safe; losing queens continue until the final elimination lip sync.' },
  ];
  const CELEBRITIES = ['Regine Velasquez', 'Kris Aquino', 'Vice Ganda', 'Nora Aunor', 'Vilma Santos', 'Jessica Soho', 'Melai Cantiveros', 'Ruffa Gutierrez', 'Maricel Soriano', 'Dolly Parton', 'Cher', 'Lady Gaga', 'Sharon Cuneta', 'Sarah Geronimo', 'Marian Rivera', 'Heart Evangelista', 'Lea Salonga', 'Anne Curtis', 'Ai-Ai delas Alas', 'Jolina Magdangal', 'KZ Tandingan', 'Moira Dela Torre', 'Regine Tolentino', 'Aga Muhlach', 'Piolo Pascual', 'John Lloyd Cruz', 'Coco Martin', 'Dingdong Dantes', 'Sam Milby', 'James Reid', 'Daniel Padilla', 'Enchong Dee', 'Jericho Rosales', 'Alden Richards', 'Billy Crawford', 'Gary Valenciano', 'Ogie Alcasid', 'Martin Nievera', 'Jaya', 'Zsa Zsa Padilla', 'Kyla', 'Jona', 'Yeng Constantino', 'Moira Dela Torre', 'Regine Velasquez-Alcasid', 'Sarah Geronimo-Guidicelli', 'Lea Salonga', 'Anne Curtis-Smith', 'Ai-Ai delas Alas', 'Jolina Magdangal-Escueta', 'KZ Tandingan', 'Moira Dela Torre', 'Regine Tolentino'];
  const RUNWAYS = [
    'Terno After Midnight', 'Pearlas ng Pilipinas', 'Jeepney Jewel Box', 'Neon sa Kanto',
    'Flores de Mayo Fantasy', 'Barong, But Make It Drag', 'Filipiniana of the Future', 'Sampaguita Eleganza',
    'Banig Couture', 'Pamaypay Extravaganza', 'Parol After Dark', 'Pista sa Barangay',
    'Sarimanok in Flight', 'Maria Clara Reimagined', 'OPM Music Video Vixen', 'Reyna ng Santacruzan',
    'Manila Disco Nights', 'Bahay Kubo Botanicals', 'Halo-Halo Haute Couture', 'Alamat: Mythical Majesty',
    'LuzViMinda Island Goddess', 'Ukay-Ukay to Runway', 'Ginto ng Kapuluan', 'Perlas ng Palengke',
  ];
  function scheduleRunway(s, design) {
    const used = new Set(s.episodes.map(ep => ep.runwayTheme || ep.runway));
    let available = RUNWAYS.filter(theme => !used.has(theme));
    if (!available.length) available = RUNWAYS.flatMap((first, i) => RUNWAYS.slice(i + 1).map(second => `${first} meets ${second}`)).filter(theme => !used.has(theme));
    const theme = pick(s, available);
    return { runwayTheme: theme, runway: design ? `${theme} Ball: Hometown Muse / Fiesta After Dark / Made in the Werk Room` : theme };
  }
  const ROLES = ['The Terminal Diva', 'The Mayor of Glam', 'The Lost Heiress', 'The Karaoke Queen', 'The Fierce Conductor', 'The Beauty Queen Next Door', 'The Tindera of Dreams', 'The Chismosa Narrator', 'The Disco Auntie', 'The Pageant Coach', 'The Secret Superstar', 'The Midnight Dancer', 'The Glam Inspector', 'The Heartbroken Host', 'The Festival Muse', 'The Rookie Diva', 'The Reunion Singer', 'The Royal Stylist', 'The Hometown Hero', 'The Last Passenger'];
  const GIRL_GROUP_TEAMS = {
    'Bida Ka, Beks': ['La Bida Loca', 'Bida-bits'],
    'A Round of Haplos': ['Haplashhh', 'Pa-kwak'],
    'Alarma!': ['Girlaloos', 'Wembewem'],
  };
  function girlGroupTeams(title) {
    const key = Object.keys(GIRL_GROUP_TEAMS).find(key => key.toLowerCase().replace(/[^a-z]/g, '') === title.toLowerCase().replace(/[^a-z]/g, ''));
    return GIRL_GROUP_TEAMS[key] || GIRL_GROUP_TEAMS['Bida Ka, Beks'];
  }
  const READS = [
    "Your runway had a plot twist: the outfit was still in rehearsal.",
    "I admire your confidence. It survives every piece of evidence.",
    "Your wig has more unfinished business than a canceled soap opera.",
    "You called that a reveal? I have seen curtains with better timing.",
    "Your sewing machine filed a request to work remotely.",
    "You dress like every fitting ended with 'we will fix it in post.'",
    "Your brand is luxury, but your zipper keeps asking for a refund.",
    "The judges asked for a signature look. You brought a rejected draft.",
    "Your contour is so dramatic it should be billing by the episode.",
    "You serve face like the Wi-Fi: strong signal, no connection.",
    "Your performance had layers. Unfortunately, none of them were rehearsed.",
    "That outfit is a conversation starter. Mostly, 'what happened?'",
    "You are a conceptual queen. One day, the concept might arrive.",
    "Your entrance promised a main character. Your runway delivered a loading screen.",
    "You bring so much to the stage. Timing just never makes the trip.",
    "Your fashion references are impressive. Shame they keep denying the connection.",
    "You say you work best under pressure. Your hems have asked for a second opinion.",
    "Your dress has more loose ends than your explanation for it.",
    "You are proof that a spotlight cannot do all the work.",
    "Your choreography is very exclusive. Even the beat was not invited.",
    "You have a face for every occasion, and the same unfinished lash for all of them.",
    "Your lip sync was an interpretation. The lyrics would like their lawyer present.",
    "You keep saying 'watch this space.' We are still waiting for something to happen.",
    "Your taste is expensive. Fortunately, you never seem to use it.",
    "You call it a capsule wardrobe. I call it the same mistake in different lighting.",
    "Your look took courage. Wearing it twice would take a publicist.",
    "You said the outfit tells a story. I would like to skip this chapter.",
    "You arrived fully booked. Apparently, none of those bookings were fittings.",
    "That runway walk has so many stops, it needs its own transit map.",
    "Your makeup is a collaboration between ambition and poor lighting.",
    "You bring the drama, the suspense, and absolutely no finished seams.",
    "Your reveal had a reveal: there was less planning underneath.",
    "You are always ahead of the curve. Sadly, the curve is your eyeliner.",
    "Your talent is keeping a straight face while calling that couture.",
    "You said you came to break the internet. Start by connecting to the beat.",
    "Your runway is a limited edition. The designer has promised not to repeat it.",
    "You give every challenge one hundred percent. We are still checking the math.",
    "Your outfit says 'creative freedom.' The fabric says 'hostage situation.'",
    "Your stage presence is unforgettable. The judges have tried.",
    "You call yourself a polished queen. So far, I have only seen the packaging.",
  ];
  function random(s) { let x = s.rng >>> 0; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; s.rng = x >>> 0; return s.rng / 4294967296; }
  const pick = (s, values) => values[Math.floor(random(s) * values.length)];
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  function shuffle(s, values) { const a = [...values]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(random(s) * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
  const key = (a, b) => [a, b].sort().join('::');
  const relationship = (s, a, b) => s.relationships[key(a, b)] || 0;
  const relationshipType = score => RELATIONSHIPS.find(type => score >= type.min) || RELATIONSHIPS.at(-1);
  const canEditRelationships = s => s.uiStep === 'relationships' && (!s.current || s.current.completed);
  function setRelationship(s, a, b, typeId) {
    const type = RELATIONSHIPS.find(type => type.id === typeId);
    if (!canEditRelationships(s) || !type || a === b || !s.queens.some(q => q.id === a) || !s.queens.some(q => q.id === b)) return false;
    s.relationships[key(a, b)] = type.score;
    s.initialRelationships[key(a, b)] = type.score;
    return true;
  }
  function resetRelationships(s, ids = s.queens.map(q => q.id), randomized = false) {
    if (!canEditRelationships(s)) return false;
    const members = [...new Set(ids)].filter(id => s.queens.some(q => q.id === id));
    const partners = new Set();
    let showmances = 0;
    const limit = Math.max(1, Math.floor(members.length / 8));
    for (let a = 0; a < members.length; a++) for (let b = a + 1; b < members.length; b++) {
      let type = 'neutral';
      if (randomized) {
        const roll = random(s);
        if (roll < .015 && showmances < limit && !partners.has(members[a]) && !partners.has(members[b])) {
          type = 'showmance'; showmances++; partners.add(members[a]); partners.add(members[b]);
        } else type = roll < .15 ? 'friend' : roll < .35 ? 'ally' : roll < .72 ? 'neutral' : roll < .91 ? 'tense' : 'enemy';
      }
      setRelationship(s, members[a], members[b], type);
    }
    return true;
  }
  const clearRelationships = (s, ids) => resetRelationships(s, ids);
  const randomizeRelationships = (s, ids) => resetRelationships(s, ids, true);
  const queen = (s, id) => s.queens.find(q => q.id === id);
  function ppe(s, id) { const results = s.episodes.filter(e => e.kind === 'competition').map(e => e.placements[id]).filter(status => PPE[status] !== undefined); return results.length ? results.reduce((sum, status) => sum + PPE[status], 0) / results.length : 0; }
  function wins(s, id) { return s.episodes.filter(e => e.kind === 'competition' && e.placements[id] === 'WIN').length; }
  function createSeason(cast, options, seed = Date.now()) {
    if (!Array.isArray(cast) || cast.length < 4 || cast.length > 20 || new Set(cast.map(q => q.id)).size !== cast.length) throw new Error('Choose 4 to 20 different queens.');
    const normalized = Object.fromEntries(Object.entries(FORMATS).map(([k, values]) => [k, values.includes(options[k]) ? options[k] : values[0]]));
    const s = { version: 1, rng: (seed >>> 0) || 1234567, seed, options: normalized, queens: cast.map(q => ({ ...q })), active: cast.map(q => q.id), eliminated: [], episodes: [], current: null, relationships: {}, initialRelationships: {}, stars: {}, blocked: null, coreDone: [], readingDone: false, returnDone: false, status: 'playing', uiStep: 'relationships', usedSongs: [], winner: null, missCongeniality: null, mcVotes: [], standings: [], competitionCount: 0, girlGroupPerformed: [] };
    s.finaleSize = normalized.finale === 'Top 3' ? 3 : 4;
    s.groups = normalized.premiere.startsWith('Double') ? [s.active.slice(0, Math.ceil(s.active.length / 2)), s.active.slice(Math.ceil(s.active.length / 2))] : [s.active.slice()];
    for (const q of s.queens) { q.skills = Object.fromEntries(['fashion', 'comedy', 'acting', 'dance', 'performance', 'lipsync'].map(skill => [skill, 45 + random(s) * 40])); s.stars[q.id] = 0; }
    randomizeRelationships(s);
    s.twists = { shantay: normalized.doubleShantay === 'Double Shantay', sashay: normalized.doubleSashay === 'Double Sashay', usedShantay: false, usedSashay: false };
    s.allWinnersRounds = Math.max(8, Math.min(12, cast.length + 2));
    return s;
  }
  function song(s) { const available = SONGS.filter(track => !s.usedSongs.includes(track.spotify)); const track = pick(s, available.length ? available : SONGS); if (!available.length) s.usedSongs = []; s.usedSongs.push(track.spotify); return { ...track }; }
  function battle(s, ids, type, ep) {
    const scores = ids.map(id => ({ id, score: queen(s, id).skills.lipsync * .4 + random(s) * 60 }));
    scores.sort((a, b) => b.score - a.score);
    const match = { type, participants: [...ids], winners: [scores[0].id], losers: scores.slice(1).map(q => q.id), song: song(s), scores, outcome: 'win' };
    ep.lipSyncs.push(match);
    return match;
  }
  const UNTUCKED_LINES = {
  "showmance": [
    [
      "I saved you the seat next to me. Tonight feels less frightening with you here.",
      "Keep holding my hand, but remind me to keep my eyes on the crown."
    ],
    [
      "You looked at me during the runway and nearly made me forget my pose.",
      "Then I owe you a distraction-free rehearsal tomorrow."
    ],
    [
      "If we end up competing against each other, can we leave the feelings backstage?",
      "I can care about you and still give you the performance of my life."
    ],
    [
      "The room keeps asking about our chemistry. I would rather hear how you are feeling.",
      "Nervous, honestly. Having you here helps, but I still have to earn my place."
    ],
    [
      "I came here for a crown. I did not expect you to make the quiet moments matter.",
      "Let us enjoy the spark without letting it decide our competition."
    ]
  ],
  "friend": [
    [
      "That critique was hard to hear. Do you want advice or just someone to listen?",
      "Just listen for a minute. Then we can work out how I come back stronger."
    ],
    [
      "You do not have to pretend you are fine with me.",
      "Thank you. I can take a critique; I just needed a friend afterward."
    ],
    [
      "If your confidence slips tonight, borrow some of mine.",
      "Only if you promise to ask for it back when you need it."
    ],
    [
      "We can want the same crown without making each other feel small.",
      "Exactly. Your success does not cancel out my talent."
    ],
    [
      "I will help you rehearse, but I am still trying to beat you next week.",
      "That is why I trust you. Support me, challenge me, and keep it honest."
    ]
  ],
  "ally": [
    [
      "Let us compare the notes we received and stop making the same mistakes.",
      "Agreed. Better preparation helps both of us, even when the judging is individual."
    ],
    [
      "If a strategic choice comes up, I want us to talk before making promises.",
      "Fair. An alliance works better when neither of us invents the rules afterward."
    ],
    [
      "We cover each other in rehearsal, but the runway is our own responsibility.",
      "That is the deal. We share the work, not the credit for someone else's performance."
    ],
    [
      "People notice that we work together. We should be clear about what that means.",
      "It means useful feedback and honest conversations, not a guaranteed rescue."
    ],
    [
      "I would rather hear a difficult truth from you than a convenient compliment.",
      "Then here is the truth: we both need to sharpen our choices next time."
    ]
  ],
  "neutral": [
    [
      "We have barely had a proper conversation since we arrived. How are you settling in?",
      "Still finding my rhythm. It is good to talk without a rehearsal clock running."
    ],
    [
      "What part of the challenge felt most different from what you expected?",
      "The pressure. Everything sounds simpler until it is your turn to perform."
    ],
    [
      "I do not know your drag very well yet. What should I watch for next time?",
      "A stronger point of view. I want the work to introduce me properly."
    ],
    [
      "Would you mind if I sat here? I need a quiet minute.",
      "Of course. We can take a breath before the next announcement."
    ],
    [
      "Everyone seems to have an opinion tonight. I am still making up my own mind.",
      "Same here. One conversation does not tell us everything about a person."
    ]
  ],
  "tense": [
    [
      "Your rehearsal comment sounded more personal than helpful.",
      "I meant the performance. I can be clearer without making it about you."
    ],
    [
      "I heard you questioned my effort when I was not in the room.",
      "I questioned a choice, not your effort. We should discuss it directly."
    ],
    [
      "I am finding it difficult to tell whether that was advice or a warning.",
      "It was criticism. You can disagree with it, but I should have said it more carefully."
    ],
    [
      "We keep talking past each other, and it is making this room uncomfortable.",
      "Then let us deal with the actual disagreement instead of guessing each other's motives."
    ],
    [
      "I can respect your drag without agreeing with everything you say about mine.",
      "Good. We do not need to be close to keep this conversation civil."
    ]
  ],
  "enemy": [
    [
      "You keep discussing my drag. Tell me what you mean while I am sitting here.",
      "I think your choices missed the assignment. I would say the same thing to your face."
    ],
    [
      "Your opinion is loud, but it does not get an extra vote at the judging panel.",
      "Neither does your confidence. We both have to prove ourselves onstage."
    ],
    [
      "I am not going to shrink my drag to make you more comfortable.",
      "Then stop treating every disagreement as an attempt to silence you."
    ],
    [
      "If you want me out of this competition, you will have to outlast me.",
      "That is the plan. I am concentrating on my performance, not asking for your approval."
    ],
    [
      "We are not going to settle this by exchanging another set of insults.",
      "Agreed. Keep your distance, and let the next performance speak for itself."
    ]
  ]
};
  const CONFESSIONAL_LINES = {
  "showmance": [
    "I feel a spark with {other}, but chemistry cannot make my competition decisions for me.",
    "{other} makes the room feel warmer. I still need to protect my focus when the stakes rise.",
    "I want another quiet moment with {other}, and I also want that crown. Those feelings can coexist.",
    "If I have to compete against {other}, I will give everything. Affection is not a reason to hold back.",
    "People can speculate about me and {other}. I would rather let our performances earn the attention."
  ],
  "friend": [
    "{other} knows when I need honest advice and when I just need someone to sit beside me.",
    "I can celebrate {other} without forgetting my own ambition. Friendship is not a consolation prize.",
    "Having {other} here gives me support, not immunity. I still have to deliver every week.",
    "If {other} struggles, I will help with rehearsal. Onstage, we each have to carry our own work.",
    "I trust {other} to tell me the truth instead of giving me a compliment I cannot use."
  ],
  "ally": [
    "Working with {other} is useful because we exchange real feedback, not empty promises.",
    "{other} and I have an understanding. Any strategic decision still needs a proper conversation.",
    "I value my alliance with {other}, but I am not signing away my own place in the competition.",
    "{other} sees details I miss in rehearsal. That is a practical reason to keep working together.",
    "If the rules force a difficult choice involving {other}, I will weigh loyalty against the actual stakes."
  ],
  "neutral": [
    "I am still getting to know {other}. I am not going to invent a friendship or a feud for the cameras.",
    "{other} and I had a calm conversation. That is a start, not a lifelong alliance.",
    "I want to see more of {other}'s work before I decide where we stand.",
    "There is no issue between me and {other}. Right now, my attention is on my own performance.",
    "I do not know what {other} is thinking, so I would rather ask than build a story out of rumors."
  ],
  "tense": [
    "The conversation with {other} felt pointed. I am listening, but my guard is up.",
    "I can take feedback from {other}. I would appreciate it arriving without the extra attitude.",
    "{other} and I are not on the same page, and pretending otherwise will not improve the situation.",
    "I want some space from {other} before we turn a disagreement into something bigger.",
    "I will keep things civil with {other}. Trust will take more than one careful conversation."
  ],
  "enemy": [
    "{other} has plenty to say about my drag. None of it is a reason for me to give up my place.",
    "I am not looking for approval from {other}. I am looking for a stronger performance next week.",
    "There is no alliance between me and {other}. Any strategic choice will reflect that reality.",
    "I would rather spend my energy rehearsing than have the same argument with {other} again.",
    "{other} wants to outlast me. That makes two of us with a very clear goal."
  ]
};
  function dialogueChoice(s, section, type, choices) {
    const previous = s.episodes.flatMap(ep => ep.dialogue?.[section] || []).filter(row => row.relationshipType === type);
    const used = new Set(previous.map(row => row.variant));
    let available = choices.map((value, variant) => ({ value, variant })).filter(row => !used.has(row.variant));
    if (!available.length) available = choices.map((value, variant) => ({ value, variant })).filter(row => row.variant !== previous.at(-1)?.variant);
    return pick(s, available);
  }
  function dialogue(s, participants) {
    const shuffled = shuffle(s, participants), scenes = [], used = new Set(), pairs = [];
    for (let a = 0; a < shuffled.length; a++) for (let b = a + 1; b < shuffled.length; b++) pairs.push({ a: shuffled[a], b: shuffled[b], priority: Math.abs(relationship(s, shuffled[a], shuffled[b])) + random(s) * 65 });
    pairs.sort((a, b) => b.priority - a.priority);
    for (const pair of pairs) {
      if (used.has(pair.a) || used.has(pair.b)) continue;
      const { a, b } = pair, rel = relationship(s, a, b), type = relationshipType(rel);
      const choice = dialogueChoice(s, 'scenes', type.id, UNTUCKED_LINES[type.id]);
      scenes.push({ a, b, tone: type.label, relationshipType: type.id, lines: [...choice.value], variant: choice.variant, delta: rel >= 15 ? 3 : rel <= -15 ? -3 : 1 });
      used.add(a); used.add(b);
      if (scenes.length >= Math.min(3, Math.floor(shuffled.length / 2))) break;
    }
    const confessionals = shuffled.slice(0, 2).map((id, index) => {
      const scene = scenes.find(scene => scene.a === id || scene.b === id);
      const target = scene ? (scene.a === id ? scene.b : scene.a) : shuffled[(index + 1) % shuffled.length];
      const type = relationshipType(relationship(s, id, target));
      const choice = dialogueChoice(s, 'confessionals', type.id, CONFESSIONAL_LINES[type.id]);
      return { id, target, relationshipType: type.id, variant: choice.variant, line: choice.value.replaceAll('{other}', queen(s, target).name) };
    });
    return { version: 2, scenes, confessionals };
  }
  function ensureDialogue(s, ep) {
    if (ep.dialogue?.version !== 2) {
      const rng = s.rng;
      ep.dialogue = dialogue(s, ep.participants);
      s.rng = rng;
    }
    return ep.dialogue;
  }
  const MINI_CHALLENGES = [
    { title: "The Reading Challenge", description: "The library is open, barangay edition! Take turns delivering clever, playful insults about your fellow queens as if trading quips at a neighborhood gathering. Original punchlines and comic timing win. Keep the reads in English." },
    { title: "Quick Drag: Tindera of the Year", description: "Become a public-market vendor in quick drag and sell an everyday market item as a luxury must-have. Invent a catchy sales call, handle a surprise haggler, and close with a punchline." },
    { title: "Palarong Pakak", description: "Turn a barangay sports day into a drag relay with spoon-and-calamansi balancing, sack-race poses, and a dramatic finish. Coordination, character, and comic reactions decide the winner." },
    { title: "Santacruzan Snapshot", description: "Create a floral procession-inspired fashion portrait using paper flowers and a handheld arch. You get one photograph to show a graceful silhouette, a strong expression, and your own drag personality." },
    { title: "Pinoy Henyo: Drag Edition", description: "Guess the Filipino food, household item, or drag accessory on your card by asking questions answered only with yes, no, or maybe. The queen who identifies the most cards before time runs out wins." },
    { title: "Sari-Sari Store Memory Game", description: "Study a miniature sari-sari store display before it is covered. Recall the products and their positions, then deliver your answers as an impatient customer placing an order." },
    { title: "Parlor Queen Speed Styling", description: "Transform a mystery wig into the signature hairstyle of your neighborhood beauty-parlor character. Work against the clock, then introduce your salon with a confident pose and a quick sales pitch." },
    { title: "Marites Puppet Hotline", description: "Turn a puppet into a fellow queen and stage a playful neighborhood gossip call. Capture her signature mannerisms, invent a harmless rumor about her drag, and finish with a witty punchline." },
    { title: "Teleserye Without Words", description: "Perform a classic teleserye twist without speaking: a surprise heir, a switched identity, or a dramatic family reunion. Use readable facial expressions and exaggerated movement to tell the story." },
    { title: "Budol Beauty Counter", description: "Invent a fictional Filipino beauty product, draw its packaging, and pitch it like an enthusiastic livestream seller. Give it a memorable name, an outrageous promise, and a ten-second slogan." },
    { title: "Pinoy Showbiz Speed Impressions", description: "Switch between surprise Filipino celebrity impressions in timed rounds. Use recognizable mannerisms, a clear character, and original jokes rather than repeating another queen." },
    { title: "Electric Fan Eleganza", description: "Pose for a glamorous neighborhood photo-studio portrait while an electric fan changes direction. Keep your expression and wig under control, then turn a surprise interruption into a cover-worthy moment." },
    { title: "Perya Makeover Booth", description: "Apply makeup to a mannequin while blindfolded at a fictional town-fair beauty booth. Reveal the result, name your look, and convince the crowd that every unexpected detail was intentional." },
    { title: "Jeepney Barya Relay", description: "Act out passing the fare along a pretend jeepney while balancing a bag and reacting to surprise stops. Get the correct prop coins to the driver without dropping your commuter character." },
    { title: "Barangay Awards Night", description: "Accept an absurd neighborhood award with no preparation. Thank an unexpected guest, explain why you deserved the title, and end with a dramatic, funny final line." },
    { title: "Family Group Chat Drama", description: "Turn a sequence of emojis from a fictional Filipino family group chat into a short scene. Make the misunderstanding clear, play the reactions, and resolve it with a comic twist." },
    { title: "Ukay-Ukay Sales Pitch", description: "Pick a mystery secondhand accessory and present it as the greatest ukay-ukay discovery ever. Invent its glamorous backstory, demonstrate three uses, and win over a skeptical shopper." },
    { title: "Barangay Weather Bulletin", description: "Deliver a quick-drag neighborhood weather report while receiving surprise updates about the fiesta, laundry, and outdoor videoke. Keep the forecast clear and turn each interruption into a joke." },
    { title: "Fiesta Stop Dance", description: "Perform at an imaginary barangay fiesta and freeze in a character pose whenever the music stops. Keep each pose distinct while selling the excitement of a neighborhood dance contest." },
    { title: "Balikbayan Box Surprise", description: "Draw three unexpected objects from a fictional balikbayan box and turn them into a short homecoming comedy scene. Use every prop and build toward one clear punchline." },
    { title: "Miss Barangay Q and A", description: "Answer ridiculous community-pageant questions with complete confidence. Deliver a poised introduction, give a clever answer, and finish with a memorable statement worthy of a sash." },
    { title: "OPM Album Cover Divas", description: "Create the cover of a fictional Original Pilipino Music album using your body and simple props. Invent an artist persona, name the album, and perform a dramatic promotional pose." },
    { title: "Barangay Announcer Takeover", description: "Read increasingly tricky fictional neighborhood announcements as a confident barangay host. Keep the details clear while handling surprise name changes, repeated announcements, and an impatient audience." },
    { title: "Radyo Drama Sound Booth", description: "Create live sound effects for a fictional Filipino radio drama using only your voice. Follow the narrator through a market, a jeepney ride, and a dramatic homecoming without missing a cue." },
    { title: "Teleserye Door Slam", description: "Perform three different teleserye exits through the Werk Room door: betrayed heiress, triumphant rival, and heartbroken star. Make every departure readable, distinct, and funny." },
    { title: "Barangay Fashion Hearing", description: "Defend a questionable fiesta outfit at a fictional neighborhood hearing. Explain your design choices, improvise answers to complaints, and deliver a persuasive closing punchline." },
    { title: "Videoke Grand Finals", description: "Invent a dramatic videoke contestant and perform an original short chorus for the imaginary neighborhood finals. Introduce your song dedication, sell the emotion, and react to a surprise score." },
    { title: "Flores de Mayo Paper Crown", description: "Build a floral headpiece from paper and craft supplies for a fictional neighborhood flower parade. Present a clear silhouette, name your look, and introduce your character with a confident walk." },
    { title: "Taho Jingle Takeover", description: "Create an original advertising jingle for a fictional taho stall. Include the product name, a catchy neighborhood sales call, and one unexpected joke in a short live pitch." },
    { title: "Fiesta Host Emergency", description: "Host an imaginary barangay fiesta while the talent act is late and the program keeps changing. Introduce surprise guests, keep the crowd entertained, and smoothly announce the next event." },
  ];
  function mini(s, ids) {
    const used = new Set(s.episodes.map(ep => ep.mini?.title));
    const choices = MINI_CHALLENGES.filter(challenge => challenge.title !== 'The Reading Challenge');
    const unused = choices.filter(challenge => !used.has(challenge.title));
    const previous = s.episodes.at(-1)?.mini?.title;
    const challenge = pick(s, unused.length ? unused : choices.filter(challenge => challenge.title !== previous));
    return { ...challenge, winner: pick(s, ids), reading: false, reads: [] };
  }
  function scheduleReading(s, ep) {
    if (s.readingDone) return;
    const anotherPremiere = ep.split && ep.premiere === 1;
    const lastRound = !anotherPremiere && (s.options.season === 'All Winners'
      ? s.competitionCount + 1 >= s.allWinnersRounds
      : s.active.length - ep.eliminated.length <= s.finaleSize);
    const remainingRounds = s.options.season === 'All Winners'
      ? s.allWinnersRounds - s.competitionCount
      : Math.max(2, s.active.length - s.finaleSize);
    if (!lastRound && random(s) >= 1 / remainingRounds) return;
    const lines = shuffle(s, READS), readers = shuffle(s, ep.participants);
    ep.mini.title = 'The Reading Challenge';
    ep.mini.description = MINI_CHALLENGES[0].description;
    ep.mini.reading = true;
    ep.mini.reads = readers.map((id, index) => ({ id, target: readers[(index + 1) % readers.length], line: lines[index] }));
  }
  function scheduleChallenge(s, ids, split) {
    if (split) return CHALLENGES.find(c => c.id === 'talent');
    const remaining = CHALLENGES.filter(c => c.core && !s.coreDone.includes(c.id) && ids.length >= c.min && (!c.max || ids.length <= c.max));
    const tight = remaining.filter(c => c.min >= 8);
    if (tight.length) return tight.find(c => c.id === 'girlgroup') || pick(s, tight);
    if (remaining.length) return pick(s, remaining);
    let eligible = CHALLENGES.filter(c => ids.length >= c.min && (!c.max || ids.length <= c.max));
    if (s.options.season !== 'Regular') eligible = eligible.filter(c => c.id !== 'lalaparuza');
    const last = s.episodes.filter(e => e.kind === 'competition').at(-1)?.challenge.id;
    return pick(s, eligible.filter(c => c.id !== last).length ? eligible.filter(c => c.id !== last) : eligible);
  }
  function casting(s, challenge, ids, title) {
    if (challenge.id === 'snatch') return shuffle(s, CELEBRITIES).slice(0, ids.length).map((role, i) => ({ id: ids[i], role, note: pick(s, ['Quick-witted answers keep the character alive.', 'Leans into a larger-than-life voice and improvised reactions.', 'Finds the joke in an unexpected answer.']) }));
    if (challenge.id === 'roast') return ids.map(id => ({ id, role: 'Roasting the imaginary Glam Council', note: pick(s, ['Councilor Glitter has been serving looks since dial-up. Unfortunately, the outfit is still loading.', 'The council promised a bigger budget for drag. They spent it all on one ring light.', 'Mayor Sparkle has a five-step plan for glamour. Step one: find the other four steps.', 'Our imaginary guest judge is so committed to suspense, even the zipper is on a cliffhanger.', 'The Glam Council called this a black-tie event. Their tie is the only thing with a clean finish.', 'Madam Chairwoman brought receipts. Unfortunately, they are all from the wig repair shop.']) }));
    if (challenge.id === 'rusical') return shuffle(s, ROLES).slice(0, ids.length).map((role, i) => ({ id: ids[i], role, note: 'An original role in this fictional Rusical.' }));
    if (challenge.id === 'girlgroup') {
      const order = shuffle(s, ids), cut = Math.ceil(ids.length / 2), teams = girlGroupTeams(title);
      return order.map((id, i) => ({ id, role: teams[i < cut ? 0 : 1] }));
    }
    return ids.map(id => ({ id, role: challenge.id === 'advert' ? pick(s, ['Confidence in a Can', 'Wig Insurance Plus', 'Bongga Brow Balm']) : challenge.id === 'design' ? pick(s, ['A woven-paper silhouette with sculptural shoulders.', 'A festival-inspired look made from recycled packaging.', 'An evening gown built from fabric scraps and metallic trims.']) : 'The assignment', note: pick(s, ['Commits to an ambitious concept.', 'Keeps the idea polished and focused.', 'Takes a risk with the presentation.']) }));
  }
  function makeEpisode(s, kind, participants) {
    return { number: s.episodes.length + 1, kind, participants: [...participants], activeBefore: [...s.active], placements: {}, lipSyncs: [], eliminated: [], returned: [], starAwards: [], blocked: null, dialogue: dialogue(s, participants), completed: false };
  }
  function returnDue(s) {
    if (s.returnDone || s.options.returning === 'None' || s.options.season === 'All Winners' || s.eliminated.length < 1) return false;
    if (s.groups.length === 2 && s.competitionCount < 2) return false;
    return s.active.length <= Math.max(s.finaleSize, Math.ceil(s.queens.length * .6));
  }
  function prepareReturn(s) {
    const ep = makeEpisode(s, 'return', s.queens.map(q => q.id));
    ep.title = 'One More Chance'; ep.method = s.options.returning; ep.candidates = [...s.eliminated]; ep.votes = [];
    if (ep.method === 'Choose who returns') { ep.needsChoice = true; ep.returnWinner = null; }
    else if (ep.method === 'Remaining Queens Vote') {
      for (const voter of s.active) {
        const preference = ep.candidates.map(id => ({ id, score: relationship(s, voter, id) + random(s) * 35 })).sort((a, b) => b.score - a.score);
        ep.votes.push({ voter, choice: preference[0].id });
      }
      const counts = Object.fromEntries(ep.candidates.map(id => [id, ep.votes.filter(v => v.choice === id).length]));
      ep.returnWinner = shuffle(s, ep.candidates).sort((a, b) => counts[b] - counts[a])[0];
      ep.note = 'Every remaining queen casts one vote. A tied vote is resolved by a random draw.';
    } else if (s.queens.length >= 8) {
      const eliminated = shuffle(s, ep.candidates).slice(0, 8);
      const entrants = [...eliminated, ...shuffle(s, s.active).slice(0, 8 - eliminated.length)];
      let round = entrants;
      while (round.length > 1) { const next = []; for (let i = 0; i < round.length; i += 2) next.push(battle(s, round.slice(i, i + 2), 'Return LaLaPaRuZa', ep).winners[0]); round = next; }
      ep.returnWinner = ep.candidates.includes(round[0]) ? round[0] : null;
      ep.note = ep.returnWinner ? 'Eight queens battled. An eliminated queen wins her place back.' : 'Eight queens battled. A remaining queen won, so no eliminated queen returns.';
    } else {
      ep.method = 'Return performance showdown';
      ep.note = 'LaLaPaRuZa requires eight participants. With a smaller cast, the eliminated queens compete in a return performance showdown instead.';
      ep.returnWinner = battle(s, ep.candidates, ep.method, ep).winners[0];
    }
    return ep;
  }
  function chooseReturn(s, id) { const ep = s.current; if (!ep || ep.kind !== 'return' || !ep.needsChoice || !ep.candidates.includes(id)) throw new Error('Choose an eligible eliminated queen.'); ep.returnWinner = id; ep.needsChoice = false; }
  function scoreCompetition(s, ep) {
    const c = ep.challenge;
    ep.scores = ep.participants.map(id => {
      const q = queen(s, id);
      const performance = q.skills[c.skill] * .38 + random(s) * 62 + (ep.mini.winner === id ? 2 : 0);
      const runway = q.skills.fashion * .38 + random(s) * 62;
      return { id, performance: Math.round(performance), runway: Math.round(runway), total: performance * .8 + runway * .2 };
    });
    if (c.id === 'girlgroup') {
      const groups = [...new Set(ep.casting.map(cast => cast.role))];
      ep.teamScores = groups.map(name => { const ids = ep.casting.filter(cast => cast.role === name).map(cast => cast.id); return { name, ids, score: ep.scores.filter(row => ids.includes(row.id)).reduce((a, row) => a + row.total, 0) / ids.length }; }).sort((a, b) => b.score - a.score);
      ep.scores.forEach(row => { if (ep.teamScores[0].ids.includes(row.id)) row.total += 4; });
    }
    ep.ranking = ep.scores.filter(row => !(ep.guestIds || []).includes(row.id)).sort((a, b) => b.total - a.total).map(row => row.id);
    for (const id of ep.participants) ep.placements[id] = (ep.guestIds || []).includes(id) ? 'GUEST' : 'SAFE';
    const top = ep.ranking[0];
    const forWin = s.options.season !== 'Regular' || ep.nonElimination;
    const highCount = ep.ranking.length >= 7 && !forWin ? 2 : ep.ranking.length >= 5 ? 1 : 0;
    if (s.options.season === 'All Winners' || ep.nonElimination || s.options.season === 'Lipsync For Your Legacy') {
      const topTwo = ep.ranking.slice(0, 2);
      const match = battle(s, topTwo, 'Lip Sync for the Win', ep);
      ep.placements[match.winners[0]] = 'WIN'; ep.placements[match.losers[0]] = 'TOP2';
      for (const id of ep.ranking.slice(2, 2 + highCount)) ep.placements[id] = 'HIGH';
      if (s.options.season === 'All Winners') {
        ep.starAwards = topTwo.filter(id => id !== s.blocked);
        ep.deniedStar = topTwo.includes(s.blocked) ? s.blocked : null;
        const targets = ep.participants.filter(id => !topTwo.includes(id));
        ep.blocked = targets.length ? targets.map(id => ({ id, score: -relationship(s, match.winners[0], id) * .65 + s.stars[id] * 12 + random(s) * 40 })).sort((a, b) => b.score - a.score)[0].id : null;
        ep.note = 'The top two earn a star unless blocked, then lip sync for the win. The winner blocks one rival from earning a star next episode. Nobody is eliminated.';
      } else if (!ep.nonElimination) {
        const bottom = ep.ranking.slice(-2);
        const chooser = match.winners[0];
        const preference = bottom.map(id => ({ id, score: -relationship(s, chooser, id) + ppe(s, id) * 7 + random(s) * 35 }));
        ep.eliminated = [preference.sort((a, b) => b.score - a.score)[0].id];
        bottom.forEach(id => { ep.placements[id] = 'BTM2'; });
        ep.placements[ep.eliminated[0]] = 'ELIM';
        ep.lipstick = { chooser, choice: ep.eliminated[0], candidates: bottom };
        ep.note = 'The top-two lip-sync winner chooses one of the bottom two to eliminate. Relationships and strategy influence the lipstick.';
      }
    } else if (c.id === 'lalaparuza') {
      let unsafe = shuffle(s, ep.participants), survivors = [];
      while (unsafe.length > 2) {
        if (unsafe.length === 3) { const match = battle(s, unsafe, 'LaLaPaRuZa three-way survival', ep); survivors.push(...match.winners); unsafe = [...match.losers]; break; }
        const next = [];
        for (let i = 0; i < unsafe.length; i += 2) {
          if (!unsafe[i + 1]) { survivors.push(unsafe[i]); continue; }
          const match = battle(s, unsafe.slice(i, i + 2), 'LaLaPaRuZa survival round', ep);
          survivors.push(match.winners[0]); next.push(match.losers[0]);
        }
        unsafe = next;
      }
      const final = battle(s, unsafe, 'Lip Sync for Your Life', ep);
      ep.placements[final.winners[0]] = 'BTM2'; ep.placements[final.losers[0]] = 'ELIM';
      ep.eliminated = [...final.losers];
      const star = ep.ranking.find(id => survivors.includes(id));
      if (star) ep.placements[star] = 'WIN';
    } else {
      ep.placements[top] = 'WIN';
      ep.ranking.slice(1, 1 + highCount).forEach(id => { ep.placements[id] = 'HIGH'; });
      const bottom = ep.ranking.slice(-2), match = battle(s, bottom, 'Lip Sync for Your Life', ep);
      bottom.forEach(id => { ep.placements[id] = 'BTM2'; });
      if (s.options.doubleShantay === 'Double Shantay' && !s.twists.usedShantay) {
        ep.twist = 'Double shantay'; match.winners = [...bottom]; match.losers = []; match.outcome = 'double-shantay';
      } else if (s.options.doubleSashay === 'Double Sashay' && !s.twists.usedSashay && s.active.length - 2 >= s.finaleSize && !(s.active.length === 9 && ep.pendingEight)) {
        ep.twist = 'Double sashay'; ep.eliminated = [...bottom]; match.winners = []; match.losers = [...bottom]; match.outcome = 'double-sashay'; bottom.forEach(id => { ep.placements[id] = 'ELIM'; });
      } else { ep.eliminated = [...match.losers]; ep.placements[match.losers[0]] = 'ELIM'; }
    }
    if (s.options.season !== 'All Winners' && c.id !== 'lalaparuza') {
      const hasBottomTwo = ep.ranking.some(id => ['BTM2', 'ELIM'].includes(ep.placements[id]));
      const low = ep.ranking.at(hasBottomTwo ? -3 : -1);
      if (low && ep.placements[low] === 'SAFE') ep.placements[low] = 'LOW';
    }
  }
  function prepareFinale(s) {
    const ep = makeEpisode(s, 'finale', s.active);
    ep.title = `The Grand Finale: Top ${s.finaleSize}`;
    ep.mini = null;
    ep.runway = 'Coronation Eleganza';
    ep.scores = ep.participants.map(id => ({ id, runway: Math.round(queen(s, id).skills.fashion * .38 + random(s) * 62) }));
    let finalTwo;
    if (ep.participants.length === 4) {
      const seeds = shuffle(s, ep.participants);
      finalTwo = [battle(s, seeds.slice(0, 2), 'Semi-final 1', ep).winners[0], battle(s, seeds.slice(2), 'Semi-final 2', ep).winners[0]];
    } else {
      const match = battle(s, ep.participants, 'Top 3 showdown', ep);
      finalTwo = match.scores.slice(0, 2).map(q => q.id); match.winners = [...finalTwo]; match.losers = match.scores.slice(2).map(q => q.id);
    }
    const crown = battle(s, finalTwo, 'Lip Sync for the Crown', ep);
    ep.winner = crown.winners[0]; ep.runnerUp = crown.losers[0];
    ep.participants.forEach(id => { ep.placements[id] = id === ep.winner ? 'WINNER' : id === ep.runnerUp ? 'RUNNERUP' : 'FINALIST'; });
    const eligible = s.queens.map(q => q.id).filter(id => id !== ep.winner);
    ep.mcVotes = s.queens.map(voter => { const candidates = eligible.filter(id => id !== voter.id); const scores = candidates.map(id => ({ id, score: relationship(s, voter.id, id) + random(s) * 25 })); return { voter: voter.id, choice: scores.sort((a, b) => b.score - a.score)[0].id }; });
    const counts = Object.fromEntries(eligible.map(id => [id, ep.mcVotes.filter(v => v.choice === id).length]));
    ep.missCongeniality = shuffle(s, eligible).sort((a, b) => counts[b] - counts[a])[0];
    return ep;
  }
  function prepareEpisode(s) {
    if (s.status === 'complete') return null;
    if (s.current && !s.current.completed) return s.current;
    let ep;
    if (s.options.season === 'All Winners' && s.competitionCount >= s.allWinnersRounds && s.active.length > s.finaleSize) {
      ep = makeEpisode(s, 'qualifier', s.active); ep.title = 'The Stars Decide';
      ep.order = shuffle(s, s.active).sort((a, b) => s.stars[b] - s.stars[a] || ppe(s, b) - ppe(s, a) || wins(s, b) - wins(s, a));
      ep.finalists = ep.order.slice(0, s.finaleSize); ep.eliminated = ep.order.slice(s.finaleSize);
      ep.note = 'Stars decide the finalists. Ties use PPE, challenge wins, then a seeded random draw. This qualification is not a scored challenge.';
      ep.participants.forEach(id => { ep.placements[id] = ep.finalists.includes(id) ? 'FINALIST' : 'CUT'; });
    } else if (returnDue(s)) ep = prepareReturn(s);
    else if (s.readingDone && !(s.groups.length === 2 && s.competitionCount < 2) && s.active.length === s.finaleSize && (s.options.season !== 'All Winners' || s.competitionCount >= s.allWinnersRounds)) ep = prepareFinale(s);
    else {
      const split = s.groups.length === 2 && s.competitionCount < 2;
      let ids = split ? s.groups[s.competitionCount].filter(id => s.active.includes(id)) : [...s.active];
      const largeGirlGroup = !split && s.options.season === 'All Winners' && s.active.length > 12 && !s.coreDone.includes('girlgroup');
      let guestIds = [];
      if (largeGirlGroup) {
        const waiting = shuffle(s, s.active.filter(id => !s.girlGroupPerformed.includes(id)));
        ids = waiting.slice(0, Math.max(8, Math.ceil(s.active.length / 2)));
        guestIds = shuffle(s, s.girlGroupPerformed).slice(0, Math.max(0, 8 - ids.length));
        ids.push(...guestIds);
      }
      ep = makeEpisode(s, 'competition', ids);
      ep.premiere = split ? s.competitionCount + 1 : s.competitionCount === 0 ? 1 : null;
      ep.split = split;
      ep.challenge = { ...(largeGirlGroup ? CHALLENGES.find(c => c.id === 'girlgroup') : scheduleChallenge(s, ids, split)) };
      ep.guestIds = guestIds;
      ep.title = pick(s, ep.challenge.titles);
      ep.casting = casting(s, ep.challenge, ids, ep.title);
      Object.assign(ep, scheduleRunway(s, ep.challenge.id === 'design'));
      ep.mini = mini(s, ids);
      const pending = CHALLENGES.filter(c => c.core && c.min >= 8 && !s.coreDone.includes(c.id) && c.id !== ep.challenge.id);
      ep.pendingEight = pending.length > 0;
      const protectEight = s.active.length === 8 && pending.length > 0;
      ep.nonElimination = s.options.season === 'All Winners' || s.active.length === s.finaleSize || (ep.premiere && s.options.premiere.includes('Non-Elimination')) || ids.length < 4 || protectEight;
      if (protectEight && !s.options.premiere.includes('Non-Elimination') && s.options.season !== 'All Winners') ep.note = 'A non-elimination showcase keeps eight queens available for the remaining required large-cast challenges.';
      else if (ids.length < 4) ep.note = 'This small premiere group is a top-two showcase; nobody goes home.';
      else if (ep.nonElimination && s.options.season !== 'All Winners') ep.note = 'A top-two lip sync decides the win. No queen is eliminated in this premiere.';
      scoreCompetition(s, ep);
      scheduleReading(s, ep);
      if (largeGirlGroup) ep.note += ' This large All Winners cast uses two girl-group showcases. Each queen has one scored appearance; returning guest performers fill any short team and receive no second star or PPE score.';
    }
    s.current = ep;
    return ep;
  }
  function completeEpisode(s) {
    const ep = s.current;
    if (!ep || ep.completed) return ep;
    if (ep.needsChoice) throw new Error('Choose a returning queen before continuing.');
    if (ep.kind === 'return') {
      s.returnDone = true;
      if (ep.returnWinner) { ep.returned = [ep.returnWinner]; ep.placements[ep.returnWinner] = 'RET'; s.active.push(ep.returnWinner); s.eliminated = s.eliminated.filter(id => id !== ep.returnWinner); }
    } else if (ep.kind === 'competition') {
      s.competitionCount++;
      if (ep.challenge.id === 'girlgroup') s.girlGroupPerformed.push(...ep.participants.filter(id => !ep.guestIds?.includes(id) && !s.girlGroupPerformed.includes(id)));
      const moreGirlGroups = ep.challenge.id === 'girlgroup' && s.options.season === 'All Winners' && s.active.length > 12 && s.girlGroupPerformed.length < s.active.length;
      if (!moreGirlGroups && !s.coreDone.includes(ep.challenge.id)) s.coreDone.push(ep.challenge.id);
      ep.starAwards.forEach(id => { s.stars[id]++; });
      if (s.options.season === 'All Winners') s.blocked = ep.blocked;
      if (ep.twist === 'Double shantay') s.twists.usedShantay = true;
      if (ep.twist === 'Double sashay') s.twists.usedSashay = true;
    }
    if (ep.mini?.reading) s.readingDone = true;
    for (const id of ep.eliminated) { s.active = s.active.filter(active => active !== id); if (!s.eliminated.includes(id)) s.eliminated.push(id); }
    for (const scene of ep.dialogue.scenes) s.relationships[key(scene.a, scene.b)] = clamp(relationship(s, scene.a, scene.b) + scene.delta, -100, 100);
    ep.completed = true;
    s.episodes.push(ep);
    if (ep.kind === 'finale') {
      s.winner = ep.winner; s.missCongeniality = ep.missCongeniality; s.mcVotes = ep.mcVotes; s.status = 'complete';
      const nonFinalists = s.options.season === 'All Winners' ? (s.episodes.find(e => e.kind === 'qualifier')?.order.slice(s.finaleSize) || []) : [...s.eliminated].reverse();
      s.standings = [ep.winner, ep.runnerUp, ...ep.participants.filter(id => id !== ep.winner && id !== ep.runnerUp), ...nonFinalists];
    }
    return ep;
  }
  function coreNotes(s) { return CHALLENGES.filter(c => c.core && !s.coreDone.includes(c.id)).map(c => `${c.label}: not scheduled because no eligible round remained (${c.min}${c.max ? '-' + c.max : '+'} queens required).`); }
  const api = { FORMATS, PPE, SONGS, CHALLENGES, MINI_CHALLENGES, RUNWAYS, UNTUCKED_LINES, CONFESSIONAL_LINES, ensureDialogue, girlGroupTeams, RELATIONSHIPS, relationshipType, setRelationship, clearRelationships, randomizeRelationships, createSeason, prepareEpisode, completeEpisode, chooseReturn, ppe, wins, relationship, queen, coreNotes };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else scope.DRSeason = api;
})(typeof window !== 'undefined' ? window : globalThis);
