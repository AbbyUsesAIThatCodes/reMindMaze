export const VERSION = 1;
export const SIZE = 10;
export const DIRECTIONS = [
  { id: 'n', label: 'North', dx: 0, dy: -1, key: 'ArrowUp' },
  { id: 'e', label: 'East', dx: 1, dy: 0, key: 'ArrowRight' },
  { id: 's', label: 'South', dx: 0, dy: 1, key: 'ArrowDown' },
  { id: 'w', label: 'West', dx: -1, dy: 0, key: 'ArrowLeft' },
];
export const TIERS = ['Wanderer', 'Apprentice', 'Scholar', 'Sage'];
export function random(seed) {
  let n = seed >>> 0;
  return () => {
    n += 0x6D2B79F5;
    let t = Math.imul(n ^ n >>> 15, 1 | n);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
export function shuffle(items, rng = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function adjacent(index, size = SIZE) {
  const x = index % size, y = Math.floor(index / size);
  return DIRECTIONS.flatMap(d => {
    const xx = x + d.dx, yy = y + d.dy;
    return xx >= 0 && xx < size && yy >= 0 && yy < size ? [{ ...d, to: yy * size + xx }] : [];
  });
}
export const edge = (a, b) => [Math.min(a, b), Math.max(a, b)].join(':');
export function pathTo(maze, start, end) {
  const previous = new Map([[start, null]]), queue = [start];
  for (let i = 0; i < queue.length; i++) {
    const room = queue[i];
    if (room === end) break;
    for (const n of maze[room]) if (!previous.has(n)) { previous.set(n, room); queue.push(n); }
  }
  if (!previous.has(end)) return [];
  const route = [end];
  while (route[route.length - 1] !== start) route.push(previous.get(route[route.length - 1]));
  return route.reverse();
}
export function makeFloor(seed, floor = 1) {
  const rng = random(seed + floor * 3571), maze = Array.from({ length: SIZE * SIZE }, () => []);
  const start = 90, stack = [start], visited = new Set(stack);
  const connect = (a, b) => { maze[a].push(b); maze[b].push(a); };
  while (stack.length) {
    const a = stack[stack.length - 1];
    const neighbors = shuffle(adjacent(a).map(d => d.to).filter(n => !visited.has(n)), rng);
    if (!neighbors.length) { stack.pop(); continue; }
    const b = neighbors[0]; connect(a, b); visited.add(b); stack.push(b);
  }
  // A handful of loops give players alternate routes, not only a single winding corridor.
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(rng() * maze.length);
    const b = shuffle(adjacent(a).map(d => d.to).filter(n => !maze[a].includes(n)), rng)[0];
    if (b !== undefined) connect(a, b);
  }
  let exit = start, longest = 0;
  for (let n = 0; n < maze.length; n++) {
    const length = pathTo(maze, start, n).length;
    if (length > longest) { exit = n; longest = length; }
  }
  return { maze, pos: start, exit, visited: [start], unlocked: [] };
}
export function newGame(settings = {}, seed = Date.now() >>> 0) {
  return {
    version: VERSION, seed, floor: 1, score: 0, torches: 5, solved: 0, attempts: 0,
    name: String(settings.name || 'Traveler').trim().slice(0, 24) || 'Traveler',
    difficulty: Math.min(4, Math.max(1, Number(settings.difficulty) || 2)),
    categories: settings.categories?.length ? [...settings.categories] : [],
    mode: settings.mode === 'study' ? 'study' : 'classic',
    goal: settings.goal === 5000 ? 5000 : 20000,
    seen: [], journal: [], pending: null, won: false,
    ...makeFloor(seed),
  };
}
export function exits(state) {
  return adjacent(state.pos).filter(d => state.maze[state.pos].includes(d.to))
    .map(d => ({ ...d, open: state.unlocked.includes(edge(state.pos, d.to)) }));
}
export function questionPool(state, questions) {
  return questions.filter(q => q.level <= state.difficulty && (!state.categories.length || state.categories.includes(q.category)));
}
export function beginDoor(state, to, questions, rng = Math.random) {
  if (state.won || state.pending || !state.maze[state.pos].includes(to)) return false;
  if (state.unlocked.includes(edge(state.pos, to))) { enter(state, to); return 'moved'; }
  const pool = questionPool(state, questions);
  if (!pool.length) throw new Error('No questions match these subjects.');
  let remaining = pool.filter(q => !state.seen.includes(q.id));
  if (!remaining.length) {
    const last = state.seen.at(-1);
    state.seen = [];
    remaining = pool.filter(q => q.id !== last);
    if (!remaining.length) remaining = pool;
  }
  const q = remaining[Math.floor(rng() * remaining.length)];
  state.seen.push(q.id);
  state.pending = { id: q.id, from: state.pos, to, options: shuffle(q.choices, rng), wrong: [], elapsed: 0, status: 'asking', researched: false, payout: 0 };
  return 'question';
}
export function pointsFor(state, question) {
  const base = [0, 150, 250, 400, 600][question.level];
  const p = state.pending;
  const bonus = state.mode === 'classic' && !p.researched ? Math.max(0, 200 - Math.floor(p.elapsed / 1000) * 4) : 0;
  return Math.max(50, base + bonus - p.wrong.length * 50);
}
export function answer(state, choice, questions) {
  const p = state.pending;
  if (!p || p.status !== 'asking' || !p.options.includes(choice) || p.wrong.includes(choice)) return null;
  const q = questions.find(q => q.id === p.id);
  state.attempts++;
  if (choice === q.answer) {
    p.payout = pointsFor(state, q);
    p.status = 'correct';
    state.score += p.payout;
    state.solved++;
    const key = edge(p.from, p.to);
    if (!state.unlocked.includes(key)) state.unlocked.push(key);
  } else {
    p.wrong.push(choice);
    if (p.wrong.length === 2) p.status = 'failed';
  }
  if (p.status !== 'asking') state.journal.unshift({ id: q.id, correct: p.status === 'correct', floor: state.floor, points: p.payout });
  state.journal = state.journal.slice(0, 200);
  return p.status;
}
export function enter(state, to) {
  if (!state.maze[state.pos].includes(to) || !state.unlocked.includes(edge(state.pos, to))) return false;
  state.pos = to;
  if (!state.visited.includes(to)) state.visited.push(to);
  state.pending = null;
  return true;
}
export function ascend(state) {
  if (state.pos !== state.exit || state.pending || state.won) return false;
  if (state.score >= state.goal) { state.won = true; return 'won'; }
  state.floor++;
  Object.assign(state, makeFloor(state.seed, state.floor));
  return 'floor';
}
export function useTorch(state) {
  if (state.torches <= 0 || state.won) return [];
  state.torches--;
  return pathTo(state.maze, state.pos, state.exit);
}
export function validSave(value, questions, categories) {
  try {
    const s = value;
    if (s.version !== VERSION || !Number.isInteger(s.seed) || s.seed < 0 || s.seed > 0xFFFFFFFF) return false;
    const nonnegative = ['score', 'solved', 'attempts', 'floor', 'torches', 'pos', 'exit'];
    if (nonnegative.some(k => !Number.isSafeInteger(s[k]) || s[k] < 0)) return false;
    if (s.floor < 1 || s.floor > 10000 || s.torches > 5 || s.pos > 99 || s.exit > 99) return false;
    if (![1,2,3,4].includes(s.difficulty) || ![5000,20000].includes(s.goal) || !['study','classic'].includes(s.mode)) return false;
    if (typeof s.name !== 'string' || s.name.length > 24 || typeof s.won !== 'boolean') return false;
    if (!Array.isArray(s.categories) || s.categories.some(c => !categories.includes(c))) return false;
    if (!Array.isArray(s.maze) || s.maze.length !== 100) return false;
    const generated = makeFloor(s.seed, s.floor);
    if (JSON.stringify(s.maze) !== JSON.stringify(generated.maze) || s.exit !== generated.exit) return false;
    if (!Array.isArray(s.visited) || !s.visited.includes(s.pos) || s.visited.some(n => !Number.isInteger(n) || n < 0 || n > 99)) return false;
    if (!Array.isArray(s.unlocked) || s.unlocked.some(e => {
      if (typeof e !== 'string') return true;
      const [a,b] = e.split(':').map(Number);
      return !s.maze[a]?.includes(b) || edge(a,b) !== e;
    })) return false;
    const ids = new Set(questions.map(q => q.id));
    if (!Array.isArray(s.seen) || s.seen.length > questions.length || s.seen.some(id => !ids.has(id))) return false;
    if (!Array.isArray(s.journal) || s.journal.length > 200 || s.journal.some(j => !ids.has(j.id) || typeof j.correct !== 'boolean' || !Number.isSafeInteger(j.points) || j.points < 0 || !Number.isSafeInteger(j.floor) || j.floor < 1)) return false;
    if (s.pending) {
      const p = s.pending, q = questions.find(q => q.id === p.id);
      if (!q || p.from !== s.pos || !s.maze[s.pos].includes(p.to)) return false;
      if (!Array.isArray(p.options) || p.options.length !== 4 || new Set(p.options).size !== 4 || p.options.some(x => !q.choices.includes(x))) return false;
      if (!Array.isArray(p.wrong) || p.wrong.length > 2 || p.wrong.some(x => !q.choices.includes(x) || x === q.answer) || new Set(p.wrong).size !== p.wrong.length) return false;
      if (!['asking','correct','failed'].includes(p.status) || !Number.isFinite(p.elapsed) || p.elapsed < 0 || typeof p.researched !== 'boolean' || !Number.isSafeInteger(p.payout) || p.payout < 0) return false;
      if ((p.status === 'asking' && p.wrong.length > 1) || (p.status === 'failed' && p.wrong.length !== 2)) return false;
      if (p.status === 'correct' && !s.unlocked.includes(edge(p.from,p.to))) return false;
    }
    return true;
  } catch { return false; }
}
