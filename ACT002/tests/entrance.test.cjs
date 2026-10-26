const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Exercise the same dependency-free state functions that the browser uses.
const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function shuffleEntranceCast('), source.indexOf('function entranceSet(')), context);
const { createEntranceSession, advanceEntranceSession, shuffleEntranceCast } = context;
const premieres = ['Normal Premiere', 'Normal Premiere (Non-Elimination)', 'Double Premiere', 'Double Premiere (Non-Elimination)'];
const seasons = ['Regular', 'Lipsync For Your Legacy', 'All Winners'];
const returns = ['None', 'Choose who returns', 'LaLaPaRuZa', 'Remaining Queens Vote'];
const finales = ['Top 4', 'Top 3'];
const makeCast = (size) => Array.from({ length: size }, (_, i) => Object.freeze({ id: `q-${i}`, name: `Queen ${i}` }));

test('every cast size and option combination introduces each queen once, then reaches the lineup', () => {
  for (let size = 4; size <= 20; size++) {
    for (const premiere of premieres) for (const season of seasons) for (const returning of returns) for (const finale of finales) {
      const cast = Object.freeze(makeCast(size));
      const options = Object.freeze({ premiere, season, returning, finale });
      const session = createEntranceSession(cast, options);
      assert.equal(session.phase, 'countdown');
      assert.equal(session.groups.length, premiere.startsWith('Double') ? 2 : 1);
      assert.equal(session.groups.flat().length, size);
      assert.equal(session.options.season, season);
      assert.equal(session.options.returning, returning);
      assert.equal(session.options.finale, finale);
      if (session.groups.length === 2) assert.ok(Math.abs(session.groups[0].length - session.groups[1].length) <= 1);
      session.phase = 'entrances';
      const introduced = [];
      let boundaries = 0;
      while (session.phase !== 'lineup') {
        assert.ok(introduced.length <= size);
        if (session.phase === 'between-premieres') {
          boundaries++;
          advanceEntranceSession(session);
          assert.equal(session.queenIndex, 0);
        } else {
          introduced.push(session.groups[session.groupIndex][session.queenIndex].id);
          advanceEntranceSession(session);
        }
      }
      assert.equal(introduced.length, size);
      assert.equal(new Set(introduced).size, size);
      assert.equal(boundaries, session.groups.length - 1);
      assert.deepEqual(Array.from(session.arrived), introduced);
      assert.deepEqual(Array.from(cast, q => q.id), Array.from({ length: size }, (_, i) => `q-${i}`));
      assert.equal(advanceEntranceSession(session), 'ready');
      advanceEntranceSession(session);
      assert.equal(session.arrived.length, size);
    }
  }
});

test('shuffling preserves the source cast and can produce different orders', () => {
  const cast = Object.freeze(makeCast(20));
  const signatures = new Set();
  for (let i = 0; i < 12; i++) {
    const order = shuffleEntranceCast(cast);
    assert.equal(order.length, cast.length);
    assert.equal(new Set(order.map(q => q.id)).size, cast.length);
    signatures.add(order.map(q => q.id).join(','));
  }
  assert.ok(signatures.size > 1);
  assert.equal(cast[0].id, 'q-0');
});

test('running season keeps its own option snapshot', () => {
  const options = { premiere: 'Normal Premiere', season: 'Regular', returning: 'None', finale: 'Top 4' };
  const session = createEntranceSession(makeCast(4), options);
  options.premiere = 'Double Premiere';
  options.season = 'All Winners';
  assert.equal(session.groups.length, 1);
  assert.equal(session.options.season, 'Regular');
});
