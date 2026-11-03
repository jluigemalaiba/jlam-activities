(function (ATLAnac) {
  'use strict';

  const GROUPS = [
    'Water Tribe', 'Water Tribes', 'Northern Water Tribe', 'Southern Water Tribe', 'Southern Water Tribe rebels',
    'Earth Kingdom', 'Earth Kingdom Air Force', 'Earth Kingdom Army', 'Earth Kingdom military', 'Earth Kingdom Military',
    'Earth Kingdom government', 'Earth Kingdom Royal Family', 'Earth Empire', 'Military of the Earth Empire',
    'Fire Nation', 'Fire Nation Army', 'Fire Nation Navy', 'Fire Nation military', 'Fire Nation Royal Family',
    'Military of the Fire Nation', 'Fire Nation colonies', 'Fire Nation train', 'Fire Nation circus', 'Fire Nation school',
    'Fire Nation Air Force', 'Fire Sages', 'Fire Warriors', 'Fire Islands', 'Fire lion turtle city',
    'Air Nomads', 'Air Nation', 'Air Acolytes', 'Air Scouts', 'Air Temple Island', 'Council of Elders',
    'Team Avatar', 'Team Beifong', 'Order of the White Lotus', 'Spirit World', 'Physical World', 'Red Lotus',
    'Equalists', 'Metal Clan', 'Beifong family', 'Sato family', "Tenzin's family", 'Dai Li', 'Kyoshi Warriors',
    'Kyoshi Island', 'Kyoshi Island inhabitants', 'Freedom Fighters', 'Sun Warriors', 'Rough Rhinos', 'Yuyan Archers',
    'Triple Threat Triad', 'Terra Triad', 'Agni Kai Triad', 'Republic City', 'Republic City Police',
    'Republic City Police Department', 'Republic City press', 'Republic City power plant', 'Fire Ferrets',
    'United Republic Council', 'United Republic of Nations', 'United Republic Government', 'United Forces',
    'Foggy Swamp Tribe', 'Jasmine Dragon', 'Council of Chieftains', 'Council of Five', 'Earth Rumble VI',
    'Earthen Fire Refinery', 'Earthen Fire Industries', 'Metalbending Police Force', 'Beifong Metalbending Academy',
    'Bendless Boomerang Club', 'Official Avatar Aang Fan Club', 'Future Industries', 'Varrick Global Industries',
    'Cabbage Corp', "Kuvira's army", "Azula's team", "Azula's servants", 'Royal Fire Academy for Girls', 'Ty sisters',
    "Hira'a Acting Troupe", "Hakoda's forces", "Tarrlok's task force", 'Yu Dao', 'Yu Dao Resistance',
    'Yu Dao coalition government', 'Ba Sing Se', 'Ba Sing Se University', 'Ba Sing Se Zoo', 'Capital City Prison',
    'Boiling Rock', 'Southern Raiders', 'New Ozai Society', 'New Ozai', 'Safe Nation Society',
    'Five-Seven-Five Society', "Master Yu's Earthbending Academy", "Master Kunyo's Firebending Dojo",
    "Aunt Wu's Fortune Salon", 'Lee Family Pig Farm', 'Pao Family Tea House', 'White Falls Wolfbats',
    'The White Falls Wolfbats', 'Gan Jin', 'Gan Jin tribe', 'Zhang', 'Long Feng', 'Gaoling', 'Lao Beifong',
    'Zaofu dance troupe', 'Royal Procession', 'Pro-bending', 'Mother of Faces', 'Vaatu', 'Unnamed team',
    'Herbalist institute', 'Farming village hospital', 'Cranefish Town Business Council', 'Black Quarry Boar-q-pines',
    'Pirate crew', 'Four Elements', 'Earth King Kuei', 'Earth Queen Hou-Ting',
  ];

  const PROPER_PHRASES = [
    ...GROUPS,
    'Fire Lord', 'Fire Lord Zuko', 'Fire Lord Ozai', 'Earth King', 'Earth Queen', 'Air Nomad', 'Fire Sage',
    'Freedom Fighter', 'Kyoshi Warrior', 'Fully Realized Avatar', 'Crown Prince', 'President Raiko', 'United Republic',
    'Water Tribe chief', 'Avatar Aang', 'Avatar Korra', 'Avatar Roku', 'Avatar Kyoshi', 'Sun Warrior', 'Chin Village',
    'Air Acolyte', 'Great Sage', 'Moon Spirit', 'Crown Princess', 'Police Captain', 'Supreme Bureaucratic Administrator',
    'Hundred Year War', 'Suyin Beifong', 'Lin Beifong', 'Toph Beifong', 'Dark Avatar',
  ];

  const CONNECTORS = new Set(['of', 'the', 'and', 'in', 'for', 'to', 'by', 'with', 'on', 'at', 'from', 'a', 'an', 'or', '&']);
  const MODIFIERS = new Set([
    'former', 'first', 'upper-class', 'high', 'imprisoned', 'lead', 'head', 'grand', 'acting', 'crown',
    'interim', 'fully', 'supreme',
  ]);
  const ROLE_WORDS = new Set([
    'Member', 'Leader', 'Head', 'Chief', 'Co-founder', 'Co-owner', 'Founder', 'Owner', 'Prince', 'Princess', 'Crown',
    'King', 'Queen', 'Daughter', 'Son', 'Wife', 'Husband', 'Captain', 'Director', 'President', 'Chairman', 'Fully',
    'Former', 'Upper-class', 'High', 'Imprisoned', 'Prisoner', 'Agent', 'Patriarch', 'Matriarch', 'Host', 'Servant',
    'Commentator', 'Lead', 'Interim', 'General', 'Avatar', 'Inventor', 'Representative', 'Heir', 'Proprietor',
  ]);

  const toWords = (phrase) => phrase.split(' ');
  const GROUP_WORDS = GROUPS.map(toWords).sort((a, b) => b.length - a.length);
  const PROPER_WORDS = PROPER_PHRASES.map(toWords).sort((a, b) => b.length - a.length);

  const startsUpper = (word) => /^["“(]?[A-Z]/.test(word);
  const startsLower = (word) => /^["“]?[a-z]/.test(word);
  const stripPossessive = (word) => word.replace(/(['’]s?|[:;])$/, '');
  const isPossessive = (word) => /['’]s?$/.test(word);
  const isSkill = (word) => /^[A-Z][a-z]*(bending|bender)$/.test(word);

  function matchPhrase(tokens, index, dictionary) {
    for (const words of dictionary) {
      if (index + words.length > tokens.length) continue;
      const matches = words.every((word, k) => {
        const token = tokens[index + k];
        return k === words.length - 1 ? stripPossessive(token) === word || token === word : token === word;
      });
      if (matches) return words.length;
    }
    return 0;
  }

  function splitOutsideParens(text) {
    const chunks = [];
    let depth = 0;
    let current = '';
    for (const char of text) {
      if (char === '(') depth += 1;
      if (char === ')') depth = Math.max(0, depth - 1);
      if ((char === ',' || char === ';') && depth === 0) {
        chunks.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    chunks.push(current);
    return chunks.map((chunk) => chunk.trim()).filter(Boolean);
  }

  function shouldBreak(previous, next, isPhrase, mode, state) {
    if (!previous) return false;
    const prev = previous.toLowerCase();
    if (CONNECTORS.has(prev) || previous.endsWith(':')) return false;
    if (mode === 'groups') {
      return isPhrase || (startsUpper(next) && startsLower(previous));
    }
    if (!startsUpper(next) || isPossessive(previous) || MODIFIERS.has(prev)) return false;
    if (ROLE_WORDS.has(next) || isSkill(next)) return true;
    if (isPhrase && state.previousWasPhrase) return true;
    if (state.afterConnector) return startsLower(previous);
    if (isPhrase && startsLower(previous)) return false;
    return true;
  }

  function segment(text, mode) {
    const tokens = text.split(' ').filter(Boolean);
    const dictionary = mode === 'groups' ? GROUP_WORDS : PROPER_WORDS;
    const items = [];
    let current = [];
    const state = { afterConnector: false, previousWasPhrase: false };
    const flush = () => {
      if (current.length) items.push(current.join(' '));
      current = [];
      state.afterConnector = false;
      state.previousWasPhrase = false;
    };

    for (let i = 0; i < tokens.length; ) {
      if (tokens[i].startsWith('(')) {
        let j = i;
        const parts = [];
        while (j < tokens.length) {
          parts.push(tokens[j]);
          j += 1;
          if (parts[parts.length - 1].includes(')')) break;
        }
        const note = parts.join(' ');
        if (current.length) {
          current.push(note);
          flush();
        } else if (items.length) {
          items[items.length - 1] += ` ${note}`;
        } else {
          items.push(note);
        }
        i = j;
        continue;
      }

      const length = matchPhrase(tokens, i, dictionary);
      const unit = length ? tokens.slice(i, i + length) : [tokens[i]];
      if (shouldBreak(current[current.length - 1], unit[0], length > 0, mode, state)) flush();
      current.push(...unit);
      if (unit.some((word) => CONNECTORS.has(word.toLowerCase()))) state.afterConnector = true;
      state.previousWasPhrase = length > 0;
      if (length && mode === 'groups') flush();
      i += unit.length;
    }
    flush();
    return items;
  }

  function splitEntries(text, mode = 'prose') {
    if (!text) return [];
    const seen = new Set();
    return splitOutsideParens(text)
      .flatMap((chunk) => segment(chunk, mode))
      .map((entry) => entry.trim())
      .filter((entry) => {
        const key = entry.toLowerCase();
        if (!entry || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  ATLAnac.lists = {
    splitEntries,
  };
})((window.ATLAnac = window.ATLAnac || {}));
