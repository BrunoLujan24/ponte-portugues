/* ===================== NÚCLEO (sin DOM) ===================== */
const DAY_MS = 86400000;
function dayIndex(ts) { const d = new Date(ts - 4 * 3600000); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS); }
function dayKey(di) { return new Date(di * DAY_MS).toISOString().slice(0, 10); }
function todayIdx() { return dayIndex(Date.now()); }
function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }
function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
function shuffle(a, rng) { rng = rng || Math.random; a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function sample(a, n, rng) { return shuffle(a, rng).slice(0, n); }
function hashStr(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/* ---------- Texto ---------- */
function norm(s) {
  return String(s == null ? '' : s).normalize('NFC').toLowerCase()
    .replace(/[‘’ʼ]/g, "'").replace(/[–—…]/g, ' ')
    .replace(/[¿?¡!.,;:"“”«»()\[\]]/g, ' ').replace(/\s+/g, ' ').trim();
}
function fold(s) { return norm(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function lev(a, b) {
  if (a === b) return 0; if (!a.length) return b.length; if (!b.length) return a.length;
  let prev = new Array(b.length + 1); for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
function alts(s) { return String(s || '').split(/\s+\/\s+|\s*;\s*/).map(x => x.trim()).filter(Boolean); }
function tokens(s) { return norm(s).split(' ').filter(Boolean); }
const PT_ART = /^(o|a|os|as|um|uma)\s+/i;
const ES_ART = /^(el|la|los|las|un|una|lo)\s+/i;
function stripParen(s) { return s.replace(/\s*\([^)]*\)/g, '').trim(); }
function ptAnswers(list) {
  const out = [];
  for (const s of list) for (const a0 of alts(s)) {
    const a = stripParen(a0); out.push(a);
    const b = a.replace(PT_ART, ''); if (b !== a) out.push(b);
    const c = a.replace(/^eu\s+/i, ''); if (c !== a) out.push(c);
  }
  return [...new Set(out.filter(Boolean))];
}
function esAnswers(list) {
  const out = [];
  for (const s of list) for (const a0 of alts(s)) {
    const a = stripParen(a0); out.push(a);
    const b = a.replace(/^[¿¡]/, '').replace(ES_ART, ''); if (b !== a) out.push(b);
  }
  return [...new Set(out.filter(Boolean))];
}
const RANK = { wrong: 0, typo: 1, accent: 2, ok: 3 };
function grade(input, answers, opt) {
  opt = opt || {};
  const a = norm(input), af = fold(input);
  let best = { lvl: 'wrong', exp: answers[0] || '' };
  if (!a) return best;
  for (const e of answers) {
    const n = opt.es ? norm(e).replace(ES_ART, '') : norm(e);
    const f = opt.es ? fold(e).replace(ES_ART, '') : fold(e);
    const aa = opt.es ? a.replace(ES_ART, '') : a, aff = opt.es ? af.replace(ES_ART, '') : af;
    let lvl = 'wrong';
    if (aa === n) lvl = 'ok';
    else if (aff === f) lvl = opt.es ? 'ok' : 'accent';
    else {
      const d = lev(aff, f), L = f.length;
      let tol = opt.sentence ? Math.max(1, Math.floor(L * 0.07)) : (L >= 12 ? 2 : L >= 5 ? 1 : 0);
      if (opt.es) tol = Math.max(tol, Math.floor(L * 0.15));
      if (d <= tol) lvl = 'typo';
    }
    if (RANK[lvl] > RANK[best.lvl]) best = { lvl, exp: e };
    if (lvl === 'ok') break;
  }
  return best;
}
function isCorrect(lvl) { return lvl === 'ok' || lvl === 'accent' || lvl === 'typo'; }
function diffWords(input, expected) {
  const have = {}; for (const w of fold(input).split(' ')) have[w] = (have[w] || 0) + 1;
  return String(expected).split(/\s+/).filter(Boolean).map(w => { const f = fold(w); const ok = have[f] > 0; if (ok) have[f]--; return { w, ok }; });
}

/* ---------- FSRS-5 ---------- */
const FSRS = (() => {
  const W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
  const DECAY = -0.5, FACTOR = 19 / 81, RET = 0.9;
  const R = (t, S) => Math.pow(1 + FACTOR * t / S, DECAY);
  const I = S => S / FACTOR * (Math.pow(RET, 1 / DECAY) - 1);
  const D0 = g => clamp(W[4] - Math.exp(W[5] * (g - 1)) + 1, 1, 10);
  const nextD = (D, g) => { const dp = D + (-W[6] * (g - 3)) * (10 - D) / 9; return clamp(W[7] * D0(4) + (1 - W[7]) * dp, 1, 10); };
  const sRecall = (D, S, r, g) => S * (Math.exp(W[8]) * (11 - D) * Math.pow(S, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * (g === 2 ? W[15] : 1) * (g === 4 ? W[16] : 1) + 1);
  const sForget = (D, S, r) => Math.min(S, W[11] * Math.pow(D, -W[12]) * (Math.pow(S + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
  const sShort = (S, g) => S * Math.exp(W[17] * (g - 3 + W[18]));
  /* Primera exposición: tope de estabilidad inicial (días). Las parecidas reconocidas sin esfuerzo arrancan más alto. */
  const NEW_CAP = { 1: 0.3, 2: 1, 3: 2.4, 4: 4.5 };
  function next(card, g, now, opt) {
    opt = opt || {};
    const t = dayIndex(now); let S, D;
    if (!card || !card.reps) {
      const cap = (opt.cognate && g === 4) ? 7 : (opt.cognate && g === 3) ? 3.2 : NEW_CAP[g];
      S = Math.min(W[g - 1], cap); D = D0(g); if (opt.cognate) D = Math.max(1, D - 1.5);
    } else {
      const el = t - card.last; D = nextD(card.d, g);
      if (el < 1) S = sShort(card.s, g);
      else { const r = R(el, card.s); S = g === 1 ? sForget(card.d, card.s, r) : sRecall(card.d, card.s, r, g); }
    }
    S = clamp(S, 0.05, 36500);
    const iv = g === 1 ? 0 : clamp(Math.round(I(S)), 1, 365);
    return { s: S, d: D, iv };
  }
  function previews(card, now, opt) {
    const p = {}; for (const g of [1, 2, 3, 4]) p[g] = next(card, g, now, opt);
    if (p[2].iv > p[3].iv) p[2].iv = p[3].iv;
    if (p[4].iv <= p[3].iv) p[4].iv = p[3].iv + 1;
    return p;
  }
  function apply(card, g, now, opt) {
    const r = previews(card, now, opt)[g], t = dayIndex(now);
    const c = Object.assign({}, card || {});
    c.lapses = (c.lapses || 0) + (g === 1 && c.reps ? 1 : 0);
    c.reps = (c.reps || 0) + 1; c.s = +r.s.toFixed(3); c.d = +r.d.toFixed(3);
    c.last = t; c.due = t + r.iv; if (c.intro == null) c.intro = t;
    return c;
  }
  function retrievability(card, t) { if (!card || !card.reps) return 0; return R(Math.max(0, t - card.last), card.s); }
  return { next, previews, apply, retrievability };
})();
function fmtIv(iv) { if (iv <= 0) return 'hoy'; if (iv < 30) return iv + ' d'; if (iv < 365) return Math.round(iv / 30) + ' m'; return '1 a'; }

/* ---------- Contenido ---------- */
function buildContent(builtins, imported) {
  const units = {};
  for (const u of builtins) units[u.id] = u;
  for (const id in imported) if (imported[id]) units[id] = imported[id];
  const items = {};
  for (const id in units) {
    const u = units[id];
    (u.vocab || []).forEach((v, i) => { items[v.id] = { kind: 'v', unit: id, it: v, i }; });
    (u.exercises || []).forEach((e, i) => { items[e.id] = { kind: 'e', unit: id, it: e, i }; });
    (u.grammar || []).forEach(g => { items[g.id] = { kind: 'g', unit: id, it: g }; });
    (u.dialogues || []).forEach(d => { items[d.id] = { kind: 'd', unit: id, it: d }; });
    (u.production || []).forEach(p => { items[p.id] = { kind: 'p', unit: id, it: p }; });
  }
  const order = CURRICULUM.map(c => c.id).filter(id => units[id]);
  return { units, items, order, imported: new Set(Object.keys(imported)) };
}
function cu(id) { return CURRICULUM.find(c => c.id === id); }

/* ---------- Validación de paquetes ---------- */
const UNIT_ID_RE = /^(a1|a2|b1|b2)-u[1-8]$/;
const KINDS = ['nueva', 'parecida', 'falso'];
const TAGS = ['nasal', 'abierta', 'cerrada', 'final-e', 'final-o', 'ti-di', 'r', 'lh', 'nh', 's-z'];
const EX_TYPES = ['completar', 'elegir', 'traducir', 'ordenar', 'dictado', 'pronunciar'];
function isStr(x) { return typeof x === 'string' && x.trim().length > 0; }
function strList(x) { return Array.isArray(x) && x.every(isStr); }
function checkQ(x, q, E) {
  if (!x || typeof x !== 'object') { E.push(q + ': debe ser un objeto { q, options, answer }'); return; }
  if (!isStr(x.q)) E.push(q + '.q: falta la pregunta');
  if (!Array.isArray(x.options) || x.options.length < 2 || x.options.length > 5 || !x.options.every(isStr)) E.push(q + '.options: necesita de 2 a 5 opciones de texto');
  else if (!Number.isInteger(x.answer) || x.answer < 0 || x.answer >= x.options.length) E.push(q + '.answer: debe ser el índice (desde 0) de la opción correcta');
}
function validateUnit(u, p, E, W, seen, foreign) {
  if (!u || typeof u !== 'object') { E.push(p + ': debe ser un objeto'); return; }
  if (!UNIT_ID_RE.test(u.id || '')) { E.push(p + '.id: debe ser como "a1-u3" (nivel a1, a2, b1 o b2 y unidad 1 a 8)'); return; }
  const c = cu(u.id);
  if (u.level !== c.level) E.push(`${p}.level: debe ser "${c.level}"`);
  if (u.n !== c.n) E.push(`${p}.n: debe ser ${c.n}`);
  if (!isStr(u.title)) E.push(p + '.title: falta el título');
  if (u.goals != null && !strList(u.goals)) E.push(p + '.goals: debe ser una lista de textos');
  const pre = u.id + '-';
  const idOk = (x, q) => {
    if (!x || !isStr(x.id)) { E.push(q + '.id: falta'); return false; }
    if (!x.id.startsWith(pre)) { E.push(`${q}.id: "${x.id}" debe empezar con "${pre}"`); return false; }
    if (seen.has(x.id)) { E.push(`${q}.id: "${x.id}" está repetido`); return false; }
    if (foreign && foreign[x.id]) { E.push(`${q}.id: "${x.id}" ya existe en la unidad ${foreign[x.id]}`); return false; }
    seen.add(x.id); return true;
  };
  const vIds = new Set(), gIds = new Set();
  if (!Array.isArray(u.vocab) || !u.vocab.length) E.push(p + '.vocab: debe tener al menos una palabra');
  (Array.isArray(u.vocab) ? u.vocab : []).forEach((v, i) => {
    const q = `${p}.vocab[${i}]`;
    if (!v || typeof v !== 'object') { E.push(q + ': debe ser un objeto'); return; }
    if (idOk(v, q)) vIds.add(v.id);
    for (const f of ['pt', 'es', 'ex', 'exEs']) if (!isStr(v[f])) E.push(`${q}.${f}: falta`);
    if (v.kind != null && !KINDS.includes(v.kind)) E.push(`${q}.kind: usa ${KINDS.join(', ')}`);
    if (v.kind === 'falso' && !isStr(v.trap)) W.push(`${q}: falso amigo sin "trap"`);
    if (v.forms != null && !strList(v.forms)) E.push(`${q}.forms: debe ser una lista de textos`);
    if (v.tags != null && !(Array.isArray(v.tags) && v.tags.every(t => TAGS.includes(t)))) E.push(`${q}.tags: valores permitidos: ${TAGS.join(', ')}`);
    if (isStr(v.pt) && /\S\/\S/.test(v.pt)) W.push(`${q}.pt: usa " / " con espacios y la forma completa ("o médico / a médica")`);
  });
  if (u.grammar != null && !Array.isArray(u.grammar)) E.push(p + '.grammar: debe ser una lista');
  (Array.isArray(u.grammar) ? u.grammar : []).forEach((g, i) => {
    const q = `${p}.grammar[${i}]`;
    if (!g || typeof g !== 'object') { E.push(q + ': debe ser un objeto'); return; }
    if (idOk(g, q)) gIds.add(g.id);
    if (!isStr(g.title)) E.push(q + '.title: falta');
    if (!isStr(g.body)) E.push(q + '.body: falta');
    if (g.after != null && !vIds.has(g.after)) E.push(`${q}.after: "${g.after}" no es un id de vocab de esta unidad`);
    if (g.table != null && !(Array.isArray(g.table) && g.table.every(r => Array.isArray(r) && r.length === 2 && r.every(x => typeof x === 'string')))) E.push(q + '.table: debe ser [["pt","es"], …]');
    if (g.check != null) checkQ(g.check, q + '.check', E);
  });
  if (u.exercises != null && !Array.isArray(u.exercises)) E.push(p + '.exercises: debe ser una lista');
  (Array.isArray(u.exercises) ? u.exercises : []).forEach((e, i) => {
    const q = `${p}.exercises[${i}]`;
    if (!e || typeof e !== 'object') { E.push(q + ': debe ser un objeto'); return; }
    idOk(e, q);
    if (!EX_TYPES.includes(e.type)) { E.push(`${q}.type: usa ${EX_TYPES.join(', ')}`); return; }
    if (e.g != null && !gIds.has(e.g)) E.push(`${q}.g: "${e.g}" no es una nota de esta unidad`);
    if (e.after != null && !vIds.has(e.after)) E.push(`${q}.after: "${e.after}" no es un id de vocab de esta unidad`);
    if (e.accept != null && !strList(e.accept)) E.push(q + '.accept: debe ser una lista de textos');
    switch (e.type) {
      case 'completar':
        if (!isStr(e.pt) || (e.pt.match(/_{3,}/g) || []).length !== 1) E.push(q + '.pt: debe tener exactamente un hueco "___"');
        if (!isStr(e.answer)) E.push(q + '.answer: falta');
        if (!isStr(e.es)) E.push(q + '.es: falta la traducción');
        break;
      case 'elegir': checkQ(e, q, E); break;
      case 'traducir':
        if (e.dir !== 'es-pt' && e.dir !== 'pt-es') E.push(q + '.dir: usa "es-pt" o "pt-es"');
        if (!isStr(e.es) || !isStr(e.pt)) E.push(q + ': necesita "es" y "pt"');
        break;
      case 'ordenar': {
        if (!isStr(e.pt)) { E.push(q + '.pt: falta'); break; }
        const n = e.pt.split(/\s+/).filter(Boolean).length;
        if (n < 3 || n > 12) E.push(q + '.pt: debe tener entre 3 y 12 palabras');
        if (!isStr(e.es)) E.push(q + '.es: falta');
        break;
      }
      case 'dictado': if (!isStr(e.pt) || !isStr(e.es)) E.push(q + ': necesita "pt" y "es"'); break;
      case 'pronunciar':
        if (!isStr(e.pt)) E.push(q + '.pt: falta');
        if (!TAGS.includes(e.focus)) E.push(`${q}.focus: usa ${TAGS.join(', ')}`);
        if (!isStr(e.tip)) E.push(q + '.tip: falta');
        if (e.pair != null && !(strList(e.pair) && e.pair.length === 2)) E.push(q + '.pair: deben ser 2 palabras');
        if (e.quiz != null) checkQ(e.quiz, q + '.quiz', E); else W.push(q + ': sin "quiz", no podrá practicarse sin audio ni micrófono');
        break;
    }
  });
  if (u.dialogues != null && !Array.isArray(u.dialogues)) E.push(p + '.dialogues: debe ser una lista');
  (Array.isArray(u.dialogues) ? u.dialogues : []).forEach((d, i) => {
    const q = `${p}.dialogues[${i}]`;
    if (!d || typeof d !== 'object') { E.push(q + ': debe ser un objeto'); return; }
    idOk(d, q);
    if (!isStr(d.title)) E.push(q + '.title: falta');
    if (d.names != null && !strList(d.names)) E.push(q + '.names: debe ser una lista de textos');
    if (!Array.isArray(d.lines) || d.lines.length < 2) E.push(q + '.lines: necesita al menos 2 líneas');
    else d.lines.forEach((l, j) => { if (!l || !isStr(l.s) || !isStr(l.pt) || !isStr(l.es)) E.push(`${q}.lines[${j}]: necesita s, pt y es`); });
    if (!Array.isArray(d.questions) || !d.questions.length) E.push(q + '.questions: necesita al menos una pregunta');
    else d.questions.forEach((x, j) => checkQ(x, `${q}.questions[${j}]`, E));
  });
  if (u.production != null && !Array.isArray(u.production)) E.push(p + '.production: debe ser una lista');
  (Array.isArray(u.production) ? u.production : []).forEach((x, i) => {
    const q = `${p}.production[${i}]`;
    if (!x || typeof x !== 'object') { E.push(q + ': debe ser un objeto'); return; }
    idOk(x, q);
    if (!isStr(x.prompt)) E.push(q + '.prompt: falta');
    if (!isStr(x.model)) E.push(q + '.model: falta');
    if (x.keywords != null && !strList(x.keywords)) E.push(q + '.keywords: debe ser una lista de textos');
  });
  const size = JSON.stringify(u).length;
  if (size > 236000) E.push(`${p}: la unidad pesa ${Math.round(size / 1024)} KB y el máximo es 230 KB. Divide el contenido.`);
  if (!(u.dialogues || []).length) W.push(`${p}: no tiene diálogos`);
  if (!(u.production || []).length) W.push(`${p}: no tiene ejercicios de producción`);
}
function parseLooseJSON(text) {
  let t = String(text || '').trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim();
  const i = t.indexOf('{'), j = t.lastIndexOf('}');
  if (i < 0 || j < i) throw new Error('No encontré un objeto JSON. Debe empezar con «{» y terminar con «}».');
  try { return JSON.parse(t.slice(i, j + 1)); }
  catch (e) { throw new Error('El JSON tiene un error de sintaxis (' + e.message + '). Revisa comillas y comas.'); }
}
function validatePack(obj, C) {
  const E = [], W = [];
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return { errors: ['El contenido no es un objeto JSON.'], warnings: [], units: [] };
  if (obj.format !== 'ptbr-pack') E.push('format: debe ser "ptbr-pack"');
  if (obj.version !== 1) E.push('version: debe ser 1');
  if (!isStr(obj.packId)) E.push('packId: falta (texto, por ejemplo "a1-u3-u4")');
  if (!Array.isArray(obj.units) || obj.units.length < 1 || obj.units.length > 2) { E.push('units: debe ser una lista con 1 o 2 unidades'); return { errors: E, warnings: W, units: [] }; }
  const packUnitIds = new Set(obj.units.map(u => u && u.id));
  if (packUnitIds.size !== obj.units.length) E.push('units: hay dos unidades con el mismo id');
  const foreign = {};
  if (C) for (const id in C.items) { const it = C.items[id]; if (!packUnitIds.has(it.unit)) foreign[id] = it.unit; }
  const seen = new Set();
  obj.units.forEach((u, i) => validateUnit(u, `units[${i}]`, E, W, seen, foreign));
  return { errors: E, warnings: W, units: E.length ? [] : obj.units };
}
function validateBackup(obj) {
  const E = [];
  if (!obj || typeof obj !== 'object') return ['El respaldo no es un objeto JSON.'];
  if (obj.format !== 'ptbr-backup') E.push('format: debe ser "ptbr-backup"');
  if (obj.version === 1) {
    if (!obj.state || typeof obj.state !== 'object') E.push('state: falta el progreso');
    if (!obj.srs || typeof obj.srs !== 'object') E.push('srs: faltan las tarjetas de repaso');
  } else if (obj.version === 2) {
    if (!Array.isArray(obj.profiles) || !obj.profiles.length || obj.profiles.length > 4) E.push('profiles: debe tener de 1 a 4 perfiles');
    else {
      const ids = new Set();
      obj.profiles.forEach((p, i) => {
        if (!p || typeof p !== 'object') { E.push(`profiles[${i}]: debe ser un objeto`); return; }
        if (!isStr(p.id) || !/^p[a-z0-9]{1,20}$/.test(p.id) || ids.has(p.id)) E.push(`profiles[${i}].id: no es válido o está repetido`);
        ids.add(p.id);
        if (!isStr(p.name)) E.push(`profiles[${i}].name: falta el nombre`);
        if (p.state != null && typeof p.state !== 'object') E.push(`profiles[${i}].state: debe ser un objeto`);
        if (!p.srs || typeof p.srs !== 'object') E.push(`profiles[${i}].srs: faltan las tarjetas de repaso`);
      });
    }
  } else E.push('version: debe ser 1 o 2');
  if (obj.units != null && typeof obj.units !== 'object') E.push('units: debe ser un objeto');
  if (!E.length && obj.units) {
    const W = [], seen = new Set();
    for (const id in obj.units) validateUnit(obj.units[id], 'units.' + id, E, W, seen, null);
  }
  return E;
}

/* ---------- Progreso ---------- */
function levelUnlocked(L, st) {
  const i = LEVELS.indexOf(L); if (i <= 0) return true;
  if (LEVELS.indexOf(st.unlockedLevel || 'A1') >= i) return true;
  return !!(st.levels && st.levels[LEVELS[i - 1]] && st.levels[LEVELS[i - 1]].passedAt);
}
function unitProgress(u, cards, ust) {
  cards = cards || {};
  const nV = (u.vocab || []).length, nE = (u.exercises || []).length;
  let iV = 0, iE = 0;
  for (const v of u.vocab || []) if (cards[v.id]) iV++;
  for (const e of u.exercises || []) if (cards[e.id]) iE++;
  const total = nV + nE, intro = iV + iE, passed = !!(ust && ust.eval && ust.eval.passedAt);
  return { nV, nE, iV, iE, total, intro, allIntro: intro >= total, passed, pct: total ? (intro / total) * 0.85 + (passed ? 0.15 : 0) : 0 };
}
function currentUnitId(st, C, srsAll) {
  const ok = id => {
    const u = C.units[id]; if (!u || !levelUnlocked(u.level, st)) return false;
    return !unitProgress(u, srsAll[id], st.units[id]).allIntro;
  };
  if (st.focusUnit && ok(st.focusUnit)) return st.focusUnit;
  for (const c of CURRICULUM) { if (!levelUnlocked(c.level, st)) break; if (ok(c.id)) return c.id; }
  return null;
}
function firstPendingUnit(st, C) {
  for (const c of CURRICULUM) { if (!levelUnlocked(c.level, st)) break; if (!C.units[c.id]) return c.id; }
  return null;
}
function overallProgress(st, C, srsAll) {
  let sum = 0; const byLevel = {};
  for (const L of LEVELS) byLevel[L] = 0;
  for (const c of CURRICULUM) {
    const u = C.units[c.id]; if (!u) continue;
    const p = unitProgress(u, srsAll[c.id], st.units[c.id]).pct;
    sum += p; byLevel[c.level] += p / 8;
  }
  return { total: sum / CURRICULUM.length, byLevel };
}
function currentLevel(st, C, srsAll) {
  const uid = currentUnitId(st, C, srsAll); if (uid) return C.units[uid].level;
  let lv = 'A1'; for (const L of LEVELS) if (levelUnlocked(L, st)) lv = L; return lv;
}
function examReady(L, st, C, srsAll) {
  const units = CURRICULUM.filter(c => c.level === L);
  return units.every(c => C.units[c.id] && unitProgress(C.units[c.id], srsAll[c.id], st.units[c.id]).passed);
}

/* ---------- Tipos de ejercicio ---------- */
function clozeTarget(v) {
  const cands = [...(v.forms || []), ...alts(v.pt).map(a => stripParen(a).replace(PT_ART, '').replace(/[?!¿¡]/g, '').trim())]
    .filter(Boolean).sort((a, b) => b.length - a.length);
  for (const c of cands) {
    const re = new RegExp('(^|[^\\p{L}])(' + escRe(c) + ')(?=$|[^\\p{L}])', 'iu');
    const m = v.ex.match(re);
    if (m) { const start = m.index + m[1].length; return { start, end: start + m[2].length, word: m[2] }; }
  }
  return null;
}
function orderTokens(s) { return String(s).split(/\s+/).filter(w => w && !/^[–—-]+$/.test(w)); }
function vocabCan(t, v) {
  if (t === 'completar') return !!clozeTarget(v);
  if (t === 'ordenar') { const n = orderTokens(v.ex).length; return n >= 3 && n <= 10; }
  if (t === 'dictado' || t === 'traducir') return v.ex.length <= 90;
  return true;
}
function pronVariant(e, mode) {
  if (mode.speak && mode.sr) return 'pron-sr';
  if (mode.speak && !mode.test) return 'pron-self';
  if (mode.audio && e.pair) return 'pron-pair';
  if (e.quiz) return 'pron-quiz';
  if (mode.audio) return 'pron-listen';
  return null;
}
function pickType(ref, card, mode, rng) {
  rng = rng || Math.random;
  if (ref.kind === 'v') {
    const v = ref.it, S = card && card.reps ? card.s : 0, A = mode.audio;
    let pool;
    if (!card || !card.reps) pool = v.kind === 'parecida' && !mode.test ? ['reconocer'] : ['elegir', A && 'escuchar'];
    else if ((card.lapses || 0) >= 3 && S < 5) pool = ['elegir', A && 'escuchar'];
    else if (S < 3) pool = ['elegir', A && 'escuchar', 'escribir'];
    else if (S < 10) pool = ['escribir', 'completar', A && 'escuchar'];
    else if (S < 30) pool = ['completar', 'ordenar', 'escribir', A && 'dictado'];
    else pool = ['traducir', 'ordenar', A && 'dictado'];
    if (mode.test) pool = ['elegir', 'escribir', 'completar', 'ordenar', A && 'escuchar', A && 'dictado'];
    pool = pool.filter(Boolean).filter(t => vocabCan(t, v));
    if (pool.length > 1 && card && card.lt) { const p2 = pool.filter(t => t !== card.lt); if (p2.length) pool = p2; }
    return pool.length ? pool[Math.floor(rng() * pool.length)] : 'elegir';
  }
  if (ref.kind === 'e') {
    const e = ref.it;
    switch (e.type) {
      case 'dictado': return mode.audio ? 'dictado' : 'traducir';
      case 'pronunciar': return pronVariant(e, mode);
      default: return e.type;
    }
  }
  return null;
}
function statType(t) {
  if (!t) return 'otro';
  if (t.startsWith('pron')) return 'pronunciar';
  return t;
}
function easierType(task, C) {
  const ref = C.items[task.id];
  if (ref && ref.kind === 'v') return task.t === 'escuchar' ? 'escuchar' : 'elegir';
  return task.t;
}

/* ---------- Planificación de sesión ---------- */
function allCards(srsAll) { const out = []; for (const u in srsAll) { const cards = srsAll[u] || {}; for (const id in cards) out.push([id, cards[id], u]); } return out; }
function introducedVocab(C, srsAll) { const s = new Set(); for (const [id] of allCards(srsAll)) { const r = C.items[id]; if (r && r.kind === 'v') s.add(id); } return s; }
function knownTokens(C, ids) {
  const k = new Set();
  for (const id of ids) {
    const r = C.items[id]; if (!r || r.kind !== 'v') continue;
    for (const a of alts(r.it.pt)) for (const w of tokens(stripParen(a))) k.add(fold(w));
    for (const f of r.it.forms || []) for (const w of tokens(f)) k.add(fold(w));
  }
  return k;
}
function dialogueCoverage(d, known) {
  const names = new Set((d.names || []).map(n => fold(n)));
  let tot = 0, ok = 0;
  for (const l of d.lines) for (const w of tokens(l.pt)) {
    const f = fold(w); if (names.has(f) || f.length <= 1 || /^\d+$/.test(f)) continue;
    tot++; if (known.has(f)) ok++;
  }
  return tot ? ok / tot : 1;
}
function interleave(list, keyA, keyB, rng) {
  const pool = shuffle(list, rng), out = [];
  while (pool.length) {
    const last = out[out.length - 1]; let idx = 0;
    if (last) {
      idx = pool.findIndex(x => keyA(x) !== keyA(last) && keyB(x) !== keyB(last) && x.id !== last.id);
      if (idx < 0) idx = pool.findIndex(x => keyB(x) !== keyB(last) && x.id !== last.id);
      if (idx < 0) idx = pool.findIndex(x => x.id !== last.id);
      if (idx < 0) idx = 0;
    }
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}
function planNew(uid, ctx, budget, rng) {
  const { st, C, srsAll, mode } = ctx;
  const u = C.units[uid], cards = srsAll[uid] || {}, ust = st.units[uid] || {}, shown = new Set(ust.notes || []);
  const picked = []; let cost = 0;
  for (const v of u.vocab) { if (cost >= budget || picked.length >= 10) break; if (cards[v.id]) continue; picked.push(v); cost += v.kind === 'parecida' ? 0.5 : 1; }
  const introduced = new Set(Object.keys(cards)); picked.forEach(v => introduced.add(v.id));
  const notes = (u.grammar || []).filter(g => !shown.has(g.id) && (!g.after || introduced.has(g.after)));
  const vIntro = u.vocab.filter(v => introduced.has(v.id)).length;
  const half = vIntro >= u.vocab.length * 0.5;
  const noteOk = id => shown.has(id) || notes.some(n => n.id === id);
  const exAvail = (u.exercises || []).filter(e => !cards[e.id] && (e.g ? noteOk(e.g) : e.after ? introduced.has(e.after) : half));
  const exTasks = [], exCap = Math.min(8, 3 + Math.max(0, Math.floor((budget - cost) * 1.2)));
  for (const e of exAvail) {
    if (exTasks.length >= exCap) break;
    const t = pickType(C.items[e.id], null, mode, rng); if (t) exTasks.push({ k: 'card', ph: 'new', id: e.id, t, first: 1 });
  }
  const pickedIds = new Set(picked.map(v => v.id));
  const notesAt = id => notes.filter(n => n.after === id).map(n => ({ k: 'note', ph: 'new', id: n.id }));
  const seq = [];
  notes.filter(n => !n.after || !pickedIds.has(n.after)).forEach(n => seq.push({ k: 'note', ph: 'new', id: n.id }));
  const cog = picked.filter(v => v.kind === 'parecida'), reg = picked.filter(v => v.kind !== 'parecida');
  for (const v of cog) seq.push({ k: 'card', ph: 'new', id: v.id, t: 'reconocer', first: 1 });
  for (const v of cog) seq.push(...notesAt(v.id));
  const firstCheck = () => (mode.audio && rng() < 0.5) ? 'escuchar' : 'elegir';
  reg.forEach((v, i) => {
    seq.push({ k: 'intro', ph: 'new', id: v.id });
    seq.push(...notesAt(v.id));
    if (i >= 2) seq.push({ k: 'card', ph: 'new', id: reg[i - 2].id, t: firstCheck(), first: 1 });
  });
  for (let i = Math.max(0, reg.length - 2); i < reg.length; i++) {
    seq.push({ k: 'card', ph: 'new', id: reg[i].id, t: firstCheck(), first: 1 });
    if (exTasks.length) seq.push(exTasks.shift());
  }
  seq.push(...exTasks);
  return { tasks: seq, picked };
}
function pickDialogue(ctx, introduced, uid, rng) {
  const { st, C } = ctx, known = knownTokens(C, introduced);
  const cand = [];
  for (const id of C.order) {
    const u = C.units[id]; if (!levelUnlocked(u.level, st)) continue;
    if (!u.vocab.some(v => introduced.has(v.id))) continue;
    for (const d of u.dialogues || []) cand.push({ d, unit: id, cov: dialogueCoverage(d, known), use: (st.dlg[d.id] || {}).n || 0 });
  }
  if (!cand.length) return null;
  let good = cand.filter(c => c.cov >= 0.85);
  if (!good.length) { const best = cand.slice().sort((a, b) => b.cov - a.cov)[0]; good = [best]; }
  good.sort((a, b) => (a.use - b.use) || ((b.unit === uid) - (a.unit === uid)) || (b.cov - a.cov) || (rng() - 0.5));
  return good[0].d;
}
function pickShadowLines(d, rng) {
  const idx = d.lines.map((l, i) => i).filter(i => { const n = tokens(d.lines[i].pt).length; return n >= 2 && n <= 12; });
  return sample(idx.length ? idx : d.lines.map((l, i) => i), 2, rng).sort((a, b) => a - b);
}
function pickProduction(ctx, introduced, uid, n, rng) {
  const { st, C } = ctx, known = knownTokens(C, introduced);
  const cand = [];
  for (const id of C.order) {
    const u = C.units[id]; if (!levelUnlocked(u.level, st)) continue;
    if (!u.vocab.some(v => introduced.has(v.id))) continue;
    for (const p of u.production || []) {
      const kw = (p.keywords || []).flatMap(k => tokens(k));
      const cov = kw.length ? kw.filter(w => known.has(fold(w))).length / kw.length : 1;
      cand.push({ p, unit: id, cov, use: (st.prod && st.prod[p.id] || {}).n || 0 });
    }
  }
  const good = cand.filter(c => c.cov >= 0.75);
  const pool = good.length ? good : cand.sort((a, b) => b.cov - a.cov).slice(0, 1);
  pool.sort((a, b) => (a.use - b.use) || ((b.unit === uid) - (a.unit === uid)) || (rng() - 0.5));
  return pool.slice(0, n).map(c => c.p);
}
function planSession(ctx) {
  const { st, srsAll, C, mode, now } = ctx, rng = ctx.rng || Math.random, T = dayIndex(now);
  const due = [];
  for (const [id, card] of allCards(srsAll)) { const ref = C.items[id]; if (!ref || (ref.kind !== 'v' && ref.kind !== 'e')) continue; if (card.due <= T) due.push({ id, card, ref }); }
  due.sort((a, b) => (a.card.due - b.card.due) || (FSRS.retrievability(a.card, T) - FSRS.retrievability(b.card, T)));
  const backlog = due.length;
  const revs = [];
  for (const d of due) { if (revs.length >= 40) break; const t = pickType(d.ref, d.card, mode, rng); if (t) revs.push({ k: 'card', ph: 'rev', id: d.id, t }); }
  const revOrdered = interleave(revs, x => C.items[x.id].unit, x => x.t, rng);
  let budget = (st.settings && st.settings.newPer) || 8;
  if (backlog > 80) budget = 5; else if (backlog > 50) budget = Math.min(budget, 6);
  const uid = currentUnitId(st, C, srsAll);
  let newTasks = [], picked = [];
  if (uid) { const r = planNew(uid, ctx, budget, rng); newTasks = r.tasks; picked = r.picked; }
  const introduced = introducedVocab(C, srsAll); picked.forEach(v => introduced.add(v.id));
  const lis = [];
  const dlg = pickDialogue(ctx, introduced, uid, rng);
  if (dlg) { lis.push({ k: 'dlg', ph: 'lis', id: dlg.id }); for (const li of pickShadowLines(dlg, rng)) lis.push({ k: 'shadow', ph: 'lis', id: dlg.id, line: li }); }
  const prod = pickProduction(ctx, introduced, uid, revs.length < 15 ? 2 : 1, rng).map(p => ({ k: 'prod', ph: 'prod', id: p.id }));
  const tasks = [];
  const blocks = [['rev', revOrdered], ['new', newTasks], ['lis', lis], ['prod', prod]];
  for (const [ph, list] of blocks) {
    if (!list.length) { if (ph === 'new') tasks.push({ k: 'phase', ph, n: 0, empty: 1 }); continue; }
    tasks.push({ k: 'phase', ph, n: ph === 'new' ? picked.length : list.length, unit: ph === 'new' ? uid : null });
    tasks.push(...list);
  }
  return { tasks, info: { backlog, rev: revs.length, nw: picked.length, unit: uid } };
}

/* ---------- Evaluaciones ---------- */
function testTask(id, ref, mode, rng) {
  const t = pickType(ref, ref.kind === 'v' ? { reps: 1, s: 10 } : null, Object.assign({}, mode, { test: true }), rng);
  return t ? { k: 'card', id, t } : null;
}
function planUnitEval(uid, ctx) {
  const { C, mode, srsAll } = ctx, rng = ctx.rng || Math.random, u = C.units[uid], cards = srsAll[uid] || {};
  const vs = sample(u.vocab.filter(v => cards[v.id]), 8, rng), es = sample((u.exercises || []).filter(e => cards[e.id]), 8, rng);
  const out = [];
  for (const v of vs) { const t = testTask(v.id, C.items[v.id], mode, rng); if (t) out.push(t); }
  for (const e of es) { if (out.length >= 12) break; const t = testTask(e.id, C.items[e.id], mode, rng); if (t) out.push(t); }
  return shuffle(out, rng);
}
function planLevelExam(L, ctx) {
  const { C, mode } = ctx, rng = ctx.rng || Math.random, out = [];
  for (const c of CURRICULUM.filter(x => x.level === L)) {
    const u = C.units[c.id]; if (!u) continue;
    for (const v of sample(u.vocab, 2, rng)) { const t = testTask(v.id, C.items[v.id], mode, rng); if (t) out.push(t); }
    for (const e of sample(u.exercises || [], 3, rng)) { const t = testTask(e.id, C.items[e.id], mode, rng); if (t) { out.push(t); break; } }
  }
  return shuffle(out, rng);
}
function placementResult(answers) {
  const byL = {}; for (const L of LEVELS) byL[L] = 0;
  PLACEMENT.forEach((q, i) => { if (answers[i] === q.answer) byL[q.lvl]++; });
  let passed = null;
  for (const L of LEVELS) { if (byL[L] >= 3) passed = L; else break; }
  const start = passed ? (LEVELS[LEVELS.indexOf(passed) + 1] || 'B2') : 'A1';
  return { byL, passed, start };
}

/* ---------- Estadísticas ---------- */
function vocabStats(C, srsAll) {
  let seen = 0, learned = 0, mature = 0;
  for (const [id, card] of allCards(srsAll)) {
    const r = C.items[id]; if (!r || r.kind !== 'v') continue;
    seen++; if (card.reps && card.s >= 7) learned++; if (card.reps && card.s >= 21) mature++;
  }
  return { seen, learned, mature };
}
function forecast(C, srsAll, T, days) {
  const out = new Array(days).fill(0);
  for (const [id, card] of allCards(srsAll)) {
    if (!C.items[id]) continue;
    const d = Math.max(0, card.due - T); if (d < days) out[d]++;
  }
  return out;
}
