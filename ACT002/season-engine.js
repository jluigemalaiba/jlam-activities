(function (scope) {
  'use strict';
  const FORMATS = {
    premiere: ['Normal Premiere', 'Normal Premiere (Non-Elimination)', 'Double Premiere', 'Double Premiere (Non-Elimination)'],
    season: ['Regular', 'Lipsync For Your Legacy', 'All Winners'],
    returning: ['None', 'Choose who returns', 'LaLaPaRuZa', 'Remaining Queens Vote'],
    finale: ['Top 4', 'Top 3'],
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
    { id: 'girlgroup', label: 'Girl Groups', min: 8, max: 12, skill: 'dance', core: true, titles: ['Bida Ka, Beks!', 'Barangay Pop Royalty', 'Main Character Energy'], brief: 'Two groups. Four to six queens per group. Write an original verse, build choreography, and perform a pop anthem.' },
    { id: 'snatch', label: 'Snatch Game', min: 8, skill: 'comedy', core: true, titles: ['Snatch Game: Chika Edition'], brief: 'Bring a celebrity impersonation to life with quick answers, sharp timing, and a character that stays funny.' },
    { id: 'rusical', label: 'Rusical', min: 8, skill: 'acting', core: true, titles: ['Divas of the Last Jeep: The Rusical', 'Reyna ng Barangay: The Rusical', 'Bituin sa Terminal: The Rusical'], brief: 'Sing, dance, and act through an original camp musical about a small-town diva chasing the spotlight.' },
    { id: 'design', label: 'Design / Ball', min: 3, skill: 'fashion', core: true, titles: ['The Sari-Sari Store Ball', 'Recycled Royalty', 'Fiesta After Dark Ball'], brief: 'Present two styled looks and construct a final outfit from unexpected materials. Construction, silhouette, and storytelling count.' },
    { id: 'roast', label: 'Roast', min: 3, skill: 'comedy', titles: ['The Roast of the Empty Throne', 'Shade sa Barangay Hall'], brief: 'Deliver an original roast of the imaginary Barangay Glam Council. Keep the jokes sharp and the delivery warmer than the lights.' },
    { id: 'acting', label: 'Acting', min: 3, skill: 'acting', titles: ['Kambal sa Dressing Room', 'Ang Nawawalang Korona', 'Bituin, Bawal ang Flat Shoes'], brief: 'Star in a camp teleserye parody. Commit to the character, land the punchlines, and share the scene.' },
    { id: 'advert', label: 'Branding / Commercial', min: 3, skill: 'comedy', titles: ['Budol Beauty Network', 'Sell Me That Fantasy'], brief: 'Create a ridiculous beauty product and sell it in an original commercial with a clear brand and a memorable joke.' },
    { id: 'makeover', label: 'Makeover', min: 3, skill: 'fashion', titles: ['Chosen Family Resemblance', 'Drag Sister, Drag Daughter'], brief: 'Transform a fictional guest into a member of your drag family. Show resemblance without losing either personality.' },
    { id: 'dance', label: 'Choreography', min: 3, skill: 'dance', titles: ['Sayaw sa Kanto', 'Afterparty Aerobics'], brief: 'Learn a fast routine and make every count look effortless. Musicality matters as much as precision.' },
    { id: 'talent', label: 'Talent Show', min: 2, skill: 'performance', titles: ['Bida sa Unang Gabi', 'One Minute, One Queen'], brief: 'Introduce your drag through a one-minute signature talent performance.' },
    { id: 'improv', label: 'Improv / Hosting', min: 3, skill: 'comedy', titles: ['Chika Hotline Live', 'Good Morning, Mga Beks!'], brief: 'Host an unpredictable live segment and turn every surprise into a punchline.' },
    { id: 'lalaparuza', label: 'LaLaPaRuZa', min: 8, skill: 'lipsync', titles: ['LaLaPaRuZa: Last Queen Standing'], brief: 'A survival lip-sync tournament. Match winners become safe; losing queens continue until the final elimination lip sync.' },
  ];
  const CELEBRITIES = ['Regine Velasquez', 'Kris Aquino', 'Vice Ganda', 'Nora Aunor', 'Vilma Santos', 'Jessica Soho', 'Melai Cantiveros', 'Ruffa Gutierrez', 'Maricel Soriano', 'Dolly Parton', 'Cher', 'Lady Gaga', 'Sharon Cuneta', 'Sarah Geronimo', 'Marian Rivera', 'Heart Evangelista', 'Lea Salonga', 'Anne Curtis', 'Ai-Ai delas Alas', 'Jolina Magdangal'];
  const RUNWAYS = ['Pearl of the Party', 'Terno After Midnight', 'Metallics sa Maynila', 'A Thousand Flowers', 'Red Carpet, Red Alert', 'Ocean of Opulence', 'Jeepney Jewel Box', 'Black and White and Read All Over', 'Golden Hour Goddess', 'Plumes, Please!', 'Ribbons of Rebellion', 'Neon sa Kanto'];
  const ROLES = ['The Terminal Diva', 'The Mayor of Glam', 'The Lost Heiress', 'The Karaoke Queen', 'The Fierce Conductor', 'The Beauty Queen Next Door', 'The Tindera of Dreams', 'The Chismosa Narrator', 'The Disco Auntie', 'The Pageant Coach', 'The Secret Superstar', 'The Midnight Dancer', 'The Glam Inspector', 'The Heartbroken Host', 'The Festival Muse', 'The Rookie Diva', 'The Reunion Singer', 'The Royal Stylist', 'The Hometown Hero', 'The Last Passenger'];
  const VERSES = ['From the back of the jeep to the front of the show, dala ko ang sparkle wherever I go.', 'Walang shortcut sa crown, kaya watch me climb. Barangay girl, international shine.', 'Bawat tahi may kuwento, bawat step may tapang. My name on the marquee, yan ang aking laban.', 'Pag bukas ng curtain, ako ang eksena. Hindi extra sa story, ako ang reyna.', 'Dala ang pangarap at sapatos na mataas, the beat drops now and I bring the class.', 'Kanto to the spotlight, I made my own lane. Remember this face when you call out my name.'];
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
    s.twists = { shantay: random(s) < .4, sashay: random(s) < .3, usedShantay: false, usedSashay: false };
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
  function dialogue(s, participants) {
    const shuffled = shuffle(s, participants), scenes = [], used = new Set(), pairs = [];
    const talk = {
      showmance: [['Sa lahat ng ingay dito, ikaw ang gusto kong katabi. Pero crown muna, ha.', 'May spark, may competition. Puwede bang sabay nating kayanin?'], ['Kinilig ako, pero huwag mong nakawin ang focus ko sa runway.', 'Dito muna tayo. Hinga, retouch, tapos laban ulit.']],
      friend: [['Alam kong mahirap tonight. Proud ako sa ginawa mo.', 'I saved you a seat. Kuwento mo sa akin, walang judgment.'], ['Salamat. Kailangan ko lang ng kaunting lakas ng loob.', 'Whatever happens, nandito ako. Bukas, rehearsal tayo.']],
      ally: [['Compare notes tayo before the next challenge. We work better together.', 'Kung may vote, I want us to be honest with each other.'], ['Deal. Tulungan sa rehearsal, pero fair pa rin sa runway.', 'May strategy tayo, pero kailangan pa rin nating mag-deliver.']],
      neutral: [['Sino ang prediction mo for the win tonight?', 'May extra lashes ka ba? Emotional support lashes lang.'], ['Kahit sino, basta deserve. Pero sana ako.', 'One challenge at a time, sis. Hinga muna.']],
      tense: [['Kanina rehearsal pa lang, parang may judging panel ka na.', 'May notes ka sa performance ko. Gusto kong marinig muna ang judges.'], ['I hear you. Pero iba ang nakita ko sa rehearsal.', 'Sige, noted. Next week, performance na ang sasagot.']],
      enemy: [['If you have something to say about my drag, sabihin mo sa akin.', 'You keep calling my name. Sa runway mo patunayan.'], ['My opinion is my opinion. Sa runway naman tayo mag-usap.', 'Then let the track record do the talking. Hindi ako aatras.']],
    };
    for (let a = 0; a < shuffled.length; a++) for (let b = a + 1; b < shuffled.length; b++) pairs.push({ a: shuffled[a], b: shuffled[b], priority: Math.abs(relationship(s, shuffled[a], shuffled[b])) + random(s) * 65 });
    pairs.sort((a, b) => b.priority - a.priority);
    for (const pair of pairs) {
      if (used.has(pair.a) || used.has(pair.b)) continue;
      const { a, b } = pair, rel = relationship(s, a, b), type = relationshipType(rel);
      scenes.push({ a, b, tone: type.label, relationshipType: type.id, lines: talk[type.id].map(lines => pick(s, lines)), delta: rel >= 15 ? 3 : rel <= -15 ? -3 : 1 });
      used.add(a); used.add(b);
      if (scenes.length >= Math.min(3, Math.floor(shuffled.length / 2))) break;
    }
    const confessionals = shuffled.slice(0, 2).map((id, index) => {
      const scene = scenes.find(scene => scene.a === id || scene.b === id);
      const target = scene ? (scene.a === id ? scene.b : scene.a) : shuffled[(index + 1) % shuffled.length];
      const other = queen(s, target).name, type = relationshipType(relationship(s, id, target));
      const thoughts = {
        showmance: [`May chemistry kami ni ${other}. Pero I need to keep my head in this race.`, `${other} makes this room feel lighter. If a lipstick comes between us, that is a different conversation.`],
        friend: [`${other} checked on me before the runway. That kind of support matters.`, `I trust ${other}. We can celebrate each other and still want the same crown.`],
        ally: [`Working with ${other} is a good move. We push each other, and that helps my game.`, `${other} and I have an understanding. A vote is still a choice, and choices have consequences.`],
        neutral: [`I am still figuring out ${other}. One conversation at a time, sis.`, `Everyone is watching everyone, including ${other}. The track record will tell the story.`],
        tense: [`That conversation with ${other} felt pointed. I am keeping my guard up.`, `I do not know where I stand with ${other}. Next week, I want my performance to speak.`],
        enemy: [`${other} has plenty to say about my drag. I am not giving up my place for that.`, `The tension with ${other} is real in this game. If I get a strategic choice, I will remember tonight.`],
      };
      return { id, target, relationshipType: type.id, line: pick(s, thoughts[type.id]) };
    });
    return { scenes, confessionals };
  }
  function mini(s, ids) {
    return { title: pick(s, ['Quick Drag: Tindera of the Year', 'Palarong Pakak', 'The One-Take Photoshoot', 'Charades, Beks!', 'Drag Memory Game']), winner: pick(s, ids), reading: false, reads: [] };
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
  function casting(s, challenge, ids) {
    if (challenge.id === 'snatch') return shuffle(s, CELEBRITIES).slice(0, ids.length).map((role, i) => ({ id: ids[i], role, note: pick(s, ['Quick-witted answers keep the character alive.', 'Leans into a larger-than-life voice and improvised reactions.', 'Finds the joke in an unexpected answer.']) }));
    if (challenge.id === 'roast') return ids.map(id => ({ id, role: 'Roasting the imaginary Glam Council', note: pick(s, ['Councilor Glitter has been serving looks since dial-up. Unfortunately, the outfit is still loading.', 'The council promised a bigger budget for drag. They spent it all on one ring light.', 'Mayor Sparkle has a five-step plan for glamour. Step one: find the other four steps.', 'Our imaginary guest judge is so committed to suspense, even the zipper is on a cliffhanger.', 'The Glam Council called this a black-tie event. Their tie is the only thing with a clean finish.', 'Madam Chairwoman brought receipts. Unfortunately, they are all from the wig repair shop.']) }));
    if (challenge.id === 'rusical') return shuffle(s, ROLES).slice(0, ids.length).map((role, i) => ({ id: ids[i], role, note: 'An original role in this fictional Rusical.' }));
    if (challenge.id === 'girlgroup') { const order = shuffle(s, ids), cut = Math.ceil(ids.length / 2); return order.map((id, i) => ({ id, role: i < cut ? 'The Kanto Divas' : 'The Glitter Barkada', note: `${pick(s, VERSES)} ${queen(s, id).name} in the spotlight: ${pick(s, ['ready for my reign.', 'watch me own the stage.', 'the crown is calling my name.'])}` })); }
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
    const highCount = ep.participants.length >= 8 ? 2 : ep.participants.length >= 5 ? 1 : 0;
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
      if (s.twists.shantay && !s.twists.usedShantay && random(s) < .32) {
        ep.twist = 'Double shantay'; match.winners = [...bottom]; match.losers = []; match.outcome = 'double-shantay';
      } else if (s.twists.sashay && !s.twists.usedSashay && s.active.length - 2 >= s.finaleSize && !(s.active.length === 9 && ep.pendingEight) && random(s) < .38) {
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
    else if (!(s.groups.length === 2 && s.competitionCount < 2) && s.active.length === s.finaleSize && (s.options.season !== 'All Winners' || s.competitionCount >= s.allWinnersRounds)) ep = prepareFinale(s);
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
      ep.casting = casting(s, ep.challenge, ids);
      ep.runway = ep.challenge.id === 'design' ? 'Three looks: Daytime Diva / Festival Queen / Made in the Werk Room' : pick(s, RUNWAYS);
      ep.mini = mini(s, ids);
      const pending = CHALLENGES.filter(c => c.core && c.min >= 8 && !s.coreDone.includes(c.id) && c.id !== ep.challenge.id);
      ep.pendingEight = pending.length > 0;
      const protectEight = s.active.length === 8 && pending.length > 0;
      ep.nonElimination = s.options.season === 'All Winners' || (ep.premiere && s.options.premiere.includes('Non-Elimination')) || ids.length < 4 || protectEight;
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
  const api = { FORMATS, PPE, SONGS, CHALLENGES, RELATIONSHIPS, relationshipType, setRelationship, clearRelationships, randomizeRelationships, createSeason, prepareEpisode, completeEpisode, chooseReturn, ppe, wins, relationship, queen, coreNotes };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else scope.DRSeason = api;
})(typeof window !== 'undefined' ? window : globalThis);
