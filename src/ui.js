/* ===================== INTERFAZ ===================== */
const app = document.getElementById('app');
let ST = null, C = null, EX = null;
const ui = {
  view: 'home', mode: null, unit: null, ready: false, checkin: null, test: null, place: null, result: null,
  add: { text: '', report: null, parsed: null }, backup: { text: '', report: null, parsed: null, confirm: false, out: '' },
  confirmReset: false, confirmDiscard: false, toast: null, toastT: 0, prof: { edit: null, editName: '', editColor: 0, del: null, newName: '', newColor: 1 }, inputForm: { type: 'Podcast', title: '', min: '', note: '' }
};
const Caps = { downloads: null };
const IN_ARTIFACT = !!(window.claude && typeof window.claude.use === 'function');
const HOST_THEME = document.documentElement.getAttribute('data-theme');
const GOAL_MIN = 15;
const PHASES = { rev: 'Repaso', new: 'Nuevo', lis: 'Escucha', prod: 'Producción' };
const TYPE_LABEL = {
  elegir: 'Elegir el significado', escuchar: 'Escuchar y elegir', reconocer: 'Ronda rápida (parecidas)', escribir: 'Escribir en portugués',
  completar: 'Completar', ordenar: 'Ordenar frases', dictado: 'Dictado', traducir: 'Traducción', pronunciar: 'Pronunciación',
  dialogo: 'Comprensión de diálogos', shadowing: 'Shadowing', produccion: 'Producción'
};

/* ---------- utilidades ---------- */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function md(s) {
  const inline = t => t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em class="pt">$1</em>');
  const lines = esc(s).split(/\n/); let out = '', list = false;
  for (const ln of lines) {
    const m = ln.match(/^\s*-\s+(.*)/);
    if (m) { if (!list) { out += '<ul>'; list = true; } out += '<li>' + inline(m[1]) + '</li>'; }
    else { if (list) { out += '</ul>'; list = false; } if (ln.trim()) out += '<p>' + inline(ln) + '</p>'; }
  }
  if (list) out += '</ul>';
  return out;
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function unitLabel(id) { const c = cu(id); return c ? `${c.level} · U${c.n}` : id; }
function plural(n, a, b) { return n + ' ' + (n === 1 ? a : b); }

const I = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/></svg>',
  more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true" class="fill"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  stop: '<svg viewBox="0 0 24 24" aria-hidden="true" class="fill"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>',
  mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  cross: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c.8 3.6 5 5.2 5 10a5 5 0 0 1-10 0c0-2.2 1-3.7 2.2-4.8.1 2 1 3.1 2 3.3-.4-3 .1-5.6.8-8.5z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  box: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/></svg>',
  save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16a8 8 0 1 1 16 0M12 16l4-5"/></svg>',
  ear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10a5 5 0 0 1 10 0c0 3-3 3.5-3 6.5a2.5 2.5 0 0 1-5 0M10 10a2 2 0 0 1 4 0"/></svg>',
  gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM17 20h2V6"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>'
};
function waves(h, id) {
  return `<svg class="waves" width="100%" height="${h}" style="width:100%;height:${h}px" aria-hidden="true"><defs><pattern id="${id}" width="84" height="26" patternUnits="userSpaceOnUse"><path d="M0 -13 C21 -24 21 -24 42 -13 S63 -2 84 -13 M0 13 C21 2 21 2 42 13 S63 24 84 13 M0 39 C21 28 21 28 42 39 S63 50 84 39" style="fill:none;stroke:var(--wave);stroke-width:12"/></pattern></defs><rect width="100%" height="100%" style="fill:var(--wave-bg)"/><rect width="100%" height="100%" style="fill:url(#${id})"/></svg>`;
}

/* ---------- almacenamiento ---------- */
const Store = {
  db: null, uid: null, cloud: false, docs: {}, pending: new Set(), busy: new Set(), dels: new Set(), timer: null, status: 'loading', warned: false,
  key(k) { return 'ponte:v1:' + k; },
  lsGet(k) { try { const s = localStorage.getItem(this.key(k)); return s ? JSON.parse(s) : null; } catch (e) { return null; } },
  lsSet(k, v) { try { localStorage.setItem(this.key(k), JSON.stringify(v)); } catch (e) { } },
  lsDel(k) { try { localStorage.removeItem(this.key(k)); } catch (e) { } },
  loadLocal() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('ponte:v1:')) { const v = this.lsGet(k.slice(9)); if (v) this.docs[k.slice(9)] = v; }
      }
    } catch (e) { }
  },
  async connect() {
    if (!(window.claude && typeof window.claude.use === 'function')) { this.setStatus('local'); return false; }
    try {
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      if (!db || !user) { this.setStatus('local'); return false; }
      const uid = await user.id();
      if (!uid) { this.setStatus('local'); return false; }
      this.db = db; this.uid = uid;
      const snap = await db.collection('data/users/' + uid).limit(500).get();
      const remote = {};
      for (const d of snap.docs) if (d.exists) remote[d.id] = d.data();
      const keys = new Set([...Object.keys(remote), ...Object.keys(this.docs)]);
      for (const k of keys) {
        const r = remote[k], l = this.docs[k];
        if (r && (!l || (r.updatedAt || 0) >= (l.updatedAt || 0))) { this.docs[k] = clone(r); this.lsSet(k, r); }
        else if (l) this.pending.add(k);
      }
      this.cloud = true; this.setStatus('saved');
      if (this.pending.size) this.flushSoon(300);
      return true;
    } catch (e) { console.warn('db', e); this.setStatus('local'); return false; }
  },
  get(k) { return this.docs[k]; },
  put(k, v) { v.updatedAt = Date.now(); this.docs[k] = v; this.lsSet(k, v); this.dels.delete(k); this.pending.add(k); this.flushSoon(); },
  del(k) { delete this.docs[k]; this.lsDel(k); this.pending.delete(k); this.dels.add(k); this.flushSoon(300); },
  flushSoon(ms) { clearTimeout(this.timer); this.timer = setTimeout(() => this.flush(), ms == null ? 900 : ms); },
  flush() {
    if (!this.cloud) { if (this.status !== 'local' && this.status !== 'loading') this.setStatus('local'); this.pending.clear(); this.dels.clear(); return; }
    for (const k of [...this.dels]) { if (this.busy.has(k)) continue; this.dels.delete(k); this.removeOne(k); }
    for (const k of [...this.pending]) { if (this.busy.has(k)) continue; this.pending.delete(k); this.writeOne(k, 0); }
  },
  async removeOne(k) {
    this.busy.add(k);
    try { await this.db.doc('data/users/' + this.uid + '/' + k).delete(); } catch (e) { }
    this.busy.delete(k);
    if (this.pending.size || this.dels.size) this.flushSoon(200);
  },
  async writeOne(k, attempt) {
    if (!this.docs[k]) return;
    this.busy.add(k); this.setStatus('saving');
    try { await this.db.doc('data/users/' + this.uid + '/' + k).set(clone(this.docs[k])); }
    catch (e) {
      const code = e && e.code;
      if (code === 'unavailable' && attempt < 1) { await sleep(700 + Math.random() * 1300); this.busy.delete(k); return this.writeOne(k, attempt + 1); }
      if (['revoked', 'not_granted', 'capability_disabled', 'capability_removed', 'invalid_argument', 'transform_error'].includes(code)) {
        this.cloud = false; this.setStatus('local');
        if (!this.warned) { this.warned = true; toast('Tu progreso se guardará solo en este navegador: esta cuenta no puede guardar en la app.'); }
      }
      else if (code === 'quota_exceeded') { toast('Ya no hay espacio para guardar en tu cuenta. Tu progreso quedó en este navegador.'); this.setStatus('error'); }
      else { this.pending.add(k); this.setStatus('error'); this.flushSoon(5000); }
    }
    this.busy.delete(k);
    if ((this.pending.has(k) || this.dels.has(k)) && this.cloud) { this.flushSoon(50); return; }
    if (!this.busy.size && !this.pending.size && this.status === 'saving') this.setStatus('saved');
  },
  setStatus(s) { this.status = s; const el = document.getElementById('sync'); if (el) { el.className = 'sync s-' + syncClass(); el.textContent = syncLabel(); } }
};
function syncClass() { return Store.status === 'local' && !IN_ARTIFACT ? 'device' : Store.status; }
function syncLabel() {
  return { loading: 'Cargando…', saved: 'Guardado', saving: 'Guardando…', local: IN_ARTIFACT ? 'Solo en este navegador' : 'Guardado en este equipo', error: 'Sin guardar en la nube' }[Store.status] || '';
}
function freshState() {
  return {
    v: 1, createdAt: Date.now(), settings: { newPer: 8, slowRate: 0.65, voice: '', theme: 'auto' },
    streak: { n: 0, last: null, best: 0 }, days: {}, byType: {}, units: {}, levels: {}, unlockedLevel: 'A1',
    placement: null, placementSkip: false, dlg: {}, prod: {}, prodLog: [], inputLog: [], session: null, focusUnit: null, srBlocked: false, lastSummary: null
  };
}
function migrate(s) {
  const f = freshState();
  for (const k in f) if (s[k] === undefined) s[k] = f[k];
  s.settings = Object.assign(f.settings, s.settings || {});
  return s;
}
/* ---------- perfiles ---------- */
const MAX_PROFILES = 4;
const Profiles = {
  doc() { return Store.get('profiles'); },
  list() { const d = this.doc(); return d && Array.isArray(d.list) && d.list.length ? d.list : [{ id: 'p1', name: 'Perfil 1', color: 0 }]; },
  activeId() { const d = this.doc(), l = this.list(); return d && l.some(p => p.id === d.active) ? d.active : l[0].id; },
  active() { const id = this.activeId(); return this.list().find(p => p.id === id); },
  save(list, active) { Store.put('profiles', { list: clone(list), active: active || this.activeId() }); }
};
function pfx(id) { id = id || Profiles.activeId(); return id === 'p1' ? '' : id + '.'; }
function P(k, id) { return pfx(id) + k; }
function ownsKey(id, k) { if (k === 'profiles' || k.startsWith('unit.')) return false; return id === 'p1' ? (k === 'state' || k.startsWith('srs.')) : k.startsWith(id + '.'); }
function purgeProfileDocs(id) { for (const k of Object.keys(Store.docs)) if (ownsKey(id, k)) Store.del(k); }
function initialOf(name) { const s = String(name || '?').trim(); return (s[0] || '?').toUpperCase(); }
function avatar(p, cls) { return `<span class="av pc${(p.color || 0) % 4} ${cls || ''}" aria-hidden="true">${esc(initialOf(p.name))}</span>`; }
function loadProfile() {
  const s = Store.get(P('state'));
  ST = s ? migrate(s) : freshState();
  if (!s && ui.ready) saveState();
  applyTheme(); SR.detect();
}
function switchProfile(id) {
  Speech.stop(); SR.stop();
  Profiles.save(Profiles.list(), id);
  EX = null; ui.mode = null; ui.test = null; ui.confirmReset = false; ui.confirmDiscard = false;
  loadProfile();
}
function deleteProfile(id) {
  const list = Profiles.list(); if (list.length <= 1) return;
  purgeProfileDocs(id);
  const rest = list.filter(p => p.id !== id), wasActive = Profiles.activeId() === id;
  Profiles.save(rest, wasActive ? rest[0].id : Profiles.activeId());
  if (wasActive) loadProfile();
}
function profileSummary(p) {
  const raw = p.id === Profiles.activeId() ? ST : Store.get(P('state', p.id));
  const s = raw ? migrate(clone(raw)) : freshState(), sa = srsAll(p.id), T = todayIdx();
  const streak = (s.streak.last === T || s.streak.last === T - 1) ? s.streak.n : 0;
  return { lvl: currentLevel(s, C, sa), streak, due: countDue(sa, T), seen: vocabStats(C, sa).seen };
}
function saveState() { Store.put(P('state'), ST); }
function srsAll(id) { const pre = P('srs.', id), o = {}; for (const k in Store.docs) if (k.startsWith(pre)) o[k.slice(pre.length)] = Store.docs[k].cards || {}; return o; }
function getCard(id) { const r = C.items[id]; if (!r) return null; const d = Store.get(P('srs.' + r.unit)); return d && d.cards ? d.cards[id] || null : null; }
function setCard(id, card) { const k = P('srs.' + C.items[id].unit); const d = Store.get(k) || { cards: {} }; d.cards = d.cards || {}; d.cards[id] = card; Store.put(k, d); }
function rebuildContent() {
  const imp = {};
  for (const k in Store.docs) if (k.startsWith('unit.') && Store.docs[k].unit) imp[k.slice(5)] = Store.docs[k].unit;
  C = buildContent(BUILTIN_UNITS, imp);
}
function ustate(uid) { return ST.units[uid] || (ST.units[uid] = {}); }
function dayRec() { const k = dayKey(todayIdx()); return ST.days[k] || (ST.days[k] = { ms: 0, ans: 0, ok: 0, nw: 0, ses: 0 }); }
function touchStreak() { const t = todayIdx(), s = ST.streak; if (s.last === t) return; s.n = s.last === t - 1 ? s.n + 1 : 1; s.last = t; s.best = Math.max(s.best || 0, s.n); }
function currentStreak() { const s = ST.streak, t = todayIdx(); return (s.last === t || s.last === t - 1) ? s.n : 0; }
function record(type, ok) {
  const k = statType(type); const b = ST.byType[k] || (ST.byType[k] = { n: 0, ok: 0 }); b.n++; if (ok) b.ok++;
  const d = dayRec(); d.ans++; if (ok) d.ok++;
  if (ui.mode === 'session' && ST.session) { ST.session.counts.ans++; if (ok) ST.session.counts.ok++; }
}
function pruneDays() { const keys = Object.keys(ST.days).sort(); while (keys.length > 420) delete ST.days[keys.shift()]; }

/* ---------- actividad ---------- */
const Activity = {
  last: 0,
  ping() {
    if (ui.view !== 'practice' || !ST) return;
    const now = Date.now(), gap = this.last ? now - this.last : 3000; this.last = now;
    const dt = gap > 180000 ? 4000 : Math.min(gap, 60000);
    const d = dayRec(); d.ms += dt;
    const s = ui.mode === 'session' ? ST.session : null;
    if (s) { s.activeMs = (s.activeMs || 0) + dt; const t = s.tasks[s.i]; if (t) { s.phaseMs = s.phaseMs || {}; s.phaseMs[t.ph] = (s.phaseMs[t.ph] || 0) + dt; } }
    if (d.ms >= 600000) touchStreak();
  }
};

/* ---------- voz ---------- */
const Speech = {
  ok: typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined',
  pt: [], token: 0, chain: 0,
  init() {
    if (!this.ok) return;
    const load = () => {
      const all = speechSynthesis.getVoices() || [];
      let pt = all.filter(v => /^pt[-_]BR/i.test(v.lang));
      if (!pt.length) pt = all.filter(v => /^pt/i.test(v.lang));
      const score = v => (/pt[-_]BR/i.test(v.lang) ? 4 : 0) + (/google|luciana|felipe|francisca|antonio|thalita|natural|premium|enhanced|neural/i.test(v.name) ? 2 : 0) + (v.localService ? 1 : 0);
      this.pt = pt.sort((a, b) => score(b) - score(a));
      if (ui.view === 'settings') render();
    };
    load();
    try { speechSynthesis.addEventListener('voiceschanged', load); } catch (e) { speechSynthesis.onvoiceschanged = load; }
  },
  voice(i) {
    let list = this.pt.slice(); const pref = ST && ST.settings.voice;
    if (pref) { const v = list.find(x => x.voiceURI === pref); if (v) list = [v, ...list.filter(x => x !== v)]; }
    return list.length ? list[(i || 0) % list.length] : null;
  },
  stop() { if (!this.ok) return; this.token++; this.chain++; try { speechSynthesis.cancel(); } catch (e) { } },
  say(text, o) {
    o = o || {};
    if (!this.ok) { o.onend && o.onend(); return; }
    if (!o.keepChain) this.chain++;
    this.token++; try { speechSynthesis.cancel(); } catch (e) { }
    const tk = ++this.token;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR'; const v = this.voice(o.voice || 0); if (v) u.voice = v;
    u.rate = o.slow ? (ST ? ST.settings.slowRate : 0.65) : 0.95; u.pitch = o.pitch || 1;
    let done = false;
    const fin = () => { if (done) return; done = true; clearTimeout(to); if (tk === this.token && o.onend) o.onend(); };
    u.onend = fin; u.onerror = fin;
    const to = setTimeout(fin, 1800 + text.length * (o.slow ? 150 : 90));
    try { speechSynthesis.speak(u); } catch (e) { fin(); }
  },
  sayLines(lines, o) {
    o = o || {}; this.chain++; const ch = this.chain; let i = 0;
    const next = () => {
      if (ch !== this.chain) return;
      if (i >= lines.length) { o.onDone && o.onDone(); return; }
      const L = lines[i]; o.onLine && o.onLine(i);
      this.say(L.text, { slow: o.slow, pitch: L.pitch, voice: L.voice, keepChain: true, onend: () => { i++; setTimeout(next, 320); } });
    };
    next();
  }
};
function dialogueVoices(d) {
  const sp = [...new Set(d.lines.map(l => l.s))]; const pitches = [0.95, 1.18, 1.05, 0.88];
  return d.lines.map(l => { const k = sp.indexOf(l.s); return { text: l.pt, pitch: Speech.pt.length > 1 ? 1 : pitches[k % 4], voice: k }; });
}

/* ---------- reconocimiento de voz ---------- */
const SR = {
  C: window.SpeechRecognition || window.webkitSpeechRecognition || null, state: 'off', reason: '', active: null,
  detect() {
    if (!this.C) { this.state = 'off'; this.reason = 'Este navegador no ofrece reconocimiento de voz.'; return; }
    try {
      const pol = document.permissionsPolicy || document.featurePolicy;
      if (pol && typeof pol.allowsFeature === 'function' && !pol.allowsFeature('microphone')) { this.state = 'off'; this.reason = 'La página no tiene permiso para usar el micrófono.'; return; }
    } catch (e) { }
    if (ST && ST.srBlocked) { this.state = 'off'; this.reason = 'El micrófono no estuvo disponible en un intento anterior.'; return; }
    this.state = 'on'; this.reason = '';
  },
  available() { return this.state === 'on'; },
  listen(h) {
    if (!this.available()) { h.onError && h.onError('off'); return; }
    try {
      const r = new this.C(); this.active = r;
      r.lang = 'pt-BR'; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
      r.onresult = e => { const res = e.results[0]; const out = []; for (let i = 0; i < res.length; i++) out.push(res[i].transcript); h.onResult && h.onResult(out); };
      r.onerror = e => { if (['not-allowed', 'service-not-allowed', 'audio-capture'].includes(e.error)) this.block(e.error); h.onError && h.onError(e.error); };
      r.onend = () => { this.active = null; h.onEnd && h.onEnd(); };
      r.start();
    } catch (e) { this.block('exception'); h.onError && h.onError('off'); }
  },
  stop() { try { this.active && this.active.stop(); } catch (e) { } this.active = null; },
  block(why) {
    this.state = 'off';
    this.reason = why === 'audio-capture' ? 'No se detectó un micrófono.' : 'El micrófono no está permitido en esta página.';
    if (ST) { ST.srBlocked = true; saveState(); }
  }
};
function srMatch(alternatives, target) {
  const want = tokens(target).map(fold);
  let best = 0, heard = alternatives[0] || '';
  for (const a of alternatives) {
    const have = new Set(tokens(a).map(fold));
    const hit = want.filter(w => have.has(w)).length / Math.max(1, want.length);
    if (hit > best) { best = hit; heard = a; }
  }
  return { score: best, heard };
}

/* ---------- avisos ---------- */
function toast(msg) {
  ui.toast = msg; clearTimeout(ui.toastT);
  ui.toastT = setTimeout(() => { ui.toast = null; const el = document.getElementById('toast'); if (el) el.remove(); }, 3800);
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg;
}
function applyTheme() {
  const t = (ST && ST.settings.theme) || 'auto', el = document.documentElement;
  if (t === 'auto') { if (HOST_THEME) el.setAttribute('data-theme', HOST_THEME); else el.removeAttribute('data-theme'); }
  else el.setAttribute('data-theme', t);
}

/* ---------- render ---------- */
let lastView = null;
function render() {
  let html = '';
  try {
    switch (ui.view) {
      case 'practice': html = vPractice(); break;
      case 'checkin': html = vCheckin(); break;
      case 'summary': html = vSummary(); break;
      case 'testresult': html = vTestResult(); break;
      case 'placement': html = vPlacement(); break;
      case 'who': html = vWho(); break;
      default: html = vShell();
    }
  } catch (e) {
    console.error(e);
    html = `<main class="main"><div class="panel"><h2>Algo salió mal al mostrar esta pantalla</h2><p class="muted">${esc(e.message)}</p><button class="btn primary" data-a="nav" data-v="home">Volver al inicio</button></div></main>`;
  }
  if (html === null) return;
  app.innerHTML = html;
  if (lastView !== ui.view) { window.scrollTo(0, 0); lastView = ui.view; }
  const af = app.querySelector('[data-autofocus]');
  if (af) { try { af.focus({ preventScroll: true }); } catch (e) { af.focus(); } }
}
function go(view, extra) { Speech.stop(); SR.stop(); Object.assign(ui, extra || {}); ui.view = view; render(); window.scrollTo(0, 0); }

function vShell() {
  let main = '';
  switch (ui.view) {
    case 'map': main = vMap(); break;
    case 'unit': main = vUnit(); break;
    case 'stats': main = vStats(); break;
    case 'more': main = vMore(); break;
    case 'add': main = vAdd(); break;
    case 'backup': main = vBackup(); break;
    case 'settings': main = vSettings(); break;
    case 'input': main = vInput(); break;
    case 'method': main = vMethod(); break;
    case 'profiles': main = vProfiles(); break;
    default: ui.view = 'home'; main = vHome();
  }
  const tab = (v, label, icon) => {
    const on = ui.view === v || (v === 'map' && ui.view === 'unit') || (v === 'more' && ['add', 'backup', 'settings', 'input', 'method', 'profiles'].includes(ui.view));
    return `<button class="tab ${on ? 'on' : ''}" data-a="nav" data-v="${v}" ${on ? 'aria-current="page"' : ''}>${icon}<span>${label}</span></button>`;
  };
  return `<div class="shell"><main class="main">${main}</main><nav class="tabbar" aria-label="Secciones"><div class="tabbar-in">${tab('home', 'Inicio', I.home)}${tab('map', 'Temario', I.map)}${tab('stats', 'Progreso', I.chart)}${tab('more', 'Más', I.more)}</div></nav></div>`;
}
function pageHead(title, back) {
  return `<header class="phead">${back ? `<button class="icon-btn" data-a="nav" data-v="${back}" aria-label="Volver">${I.back}</button>` : ''}<h1>${esc(title)}</h1><span id="sync" class="sync s-${syncClass()}">${syncLabel()}</span></header>`;
}

/* ---------- Inicio ---------- */
function countDue(sa, T) { let n = 0; for (const [id, c] of allCards(sa)) { const r = C.items[id]; if (r && (r.kind === 'v' || r.kind === 'e') && c.due <= T) n++; } return n; }
function greeting() { const h = new Date().getHours(); return h >= 4 && h < 12 ? 'Bom dia!' : h >= 12 && h < 18 ? 'Boa tarde!' : 'Boa noite!'; }
function vHome() {
  const sa = srsAll(), T = todayIdx(), due = countDue(sa, T), day = ST.days[dayKey(T)] || {};
  const mins = Math.floor((day.ms || 0) / 60000), streak = currentStreak();
  const uid = currentUnitId(ST, C, sa), lvl = currentLevel(ST, C, sa), prog = overallProgress(ST, C, sa);
  const pending = firstPendingUnit(ST, C);
  const date = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const s = ST.session;
  const ringPct = Math.min(1, mins / GOAL_MIN), R = 22, CIRC = 2 * Math.PI * R;
  let startBtn;
  if (!ui.ready) startBtn = `<button class="btn primary xl" disabled><span>Cargando tu progreso…</span></button>`;
  else if (s) {
    const ph = (s.tasks[s.i] || {}).ph, order = ['rev', 'new', 'lis', 'prod'].filter(p => s.tasks.some(t => t.ph === p));
    startBtn = `<button class="btn primary xl" data-a="start"><span>Continuar sesión</span><small>Fase ${Math.max(1, order.indexOf(ph) + 1)} de ${order.length} · ${PHASES[ph] || ''}</small></button>
      ${ui.confirmDiscard ? `<div class="confirm"><p>¿Descartar la sesión pausada? Lo que ya respondiste se queda guardado.</p><div class="row"><button class="btn danger" data-a="discard">Descartar</button><button class="btn ghost" data-a="discardNo">Cancelar</button></div></div>` : `<button class="link" data-a="discardAsk">Descartar sesión pausada</button>`}`;
  } else startBtn = `<button class="btn primary xl" data-a="start"><span>Empezar sesión</span><small>15–20 min · ${plural(due, 'repaso', 'repasos')}${uid ? ' · palabras nuevas' : ''}</small></button>`;

  const prof = Profiles.active();
  let unitCard = '';
  if (uid) {
    const u = C.units[uid], p = unitProgress(u, sa[uid], ST.units[uid]);
    unitCard = `<button class="panel unit-card" data-a="unit" data-id="${uid}">
      <span class="eyebrow">${unitLabel(uid)} · unidad actual</span>
      <span class="unit-title">${esc(u.title)}</span>
      <span class="bar"><i style="width:${Math.round(p.intro / p.total * 100)}%"></i></span>
      <span class="muted small">${p.intro} de ${p.total} ítems presentados</span></button>`;
  } else {
    const nextL = LEVELS.find(L => !levelUnlocked(L, ST)), prevL = nextL ? LEVELS[LEVELS.indexOf(nextL) - 1] : null;
    const msg = pending ? `La siguiente unidad, <strong>${unitLabel(pending)} · ${esc(cu(pending).title)}</strong>, aún no tiene contenido. Mientras tanto, tus sesiones siguen con repasos, escucha y producción.`
      : nextL ? `Ya viste todo el contenido de ${prevL}. Aprueba la mini evaluación de cada unidad y el examen ${prevL} para desbloquear ${nextL}. Mientras, tus sesiones siguen con repasos, escucha y producción.`
      : 'Terminaste todo el temario. Tus sesiones siguen con repasos, escucha y producción para que no olvides nada.';
    unitCard = `<div class="panel notice"><span class="eyebrow">Sin palabras nuevas por ahora</span><p>${msg}</p>
      ${pending ? `<button class="btn" data-a="nav" data-v="add">${I.box}<span>Agregar contenido</span></button>` : ''}</div>`;
  }
  const extra = [];
  for (const id of C.order) {
    const u = C.units[id]; if (!levelUnlocked(u.level, ST)) continue;
    const p = unitProgress(u, sa[id], ST.units[id]);
    if (p.allIntro && !p.passed) extra.push(`<button class="panel cta" data-a="evalStart" data-id="${id}"><span class="eyebrow">Mini evaluación lista</span><span class="cta-title">${unitLabel(id)} · ${esc(u.title)}</span><span class="muted small">12 preguntas · aprueba con 75 %</span></button>`);
  }
  for (const L of LEVELS) {
    if (levelUnlocked(L, ST) && examReady(L, ST, C, sa) && !(ST.levels[L] && ST.levels[L].passedAt))
      extra.push(`<button class="panel cta strong" data-a="examStart" data-l="${L}"><span class="eyebrow">Examen de nivel</span><span class="cta-title">Examen ${L}</span><span class="muted small">Apruébalo para desbloquear ${LEVELS[LEVELS.indexOf(L) + 1] || 'el certificado de cierre'}</span></button>`);
  }
  const totalAns = Object.values(ST.byType).reduce((a, b) => a + b.n, 0);
  if (!ST.placement && !ST.placementSkip && totalAns < 30) extra.push(`<div class="panel notice"><span class="eyebrow">Opcional</span><p>¿Ya sabes algo de portugués? La prueba de nivel tiene 16 preguntas y te dice dónde empezar.</p><div class="row"><button class="btn" data-a="placeStart">Hacer la prueba</button><button class="btn ghost" data-a="placeSkip">Empiezo desde cero</button></div></div>`);
  const lv = LEVELS.map(L => `<div class="lv ${levelUnlocked(L, ST) ? '' : 'locked'}"><span class="lv-name">${L}</span><span class="lv-bar"><i style="width:${Math.round(prog.byLevel[L] * 100)}%"></i></span><span class="lv-pct mono">${Math.round(prog.byLevel[L] * 100)}%</span></div>`).join('');
  return `<section class="hero">${waves(30, 'wh')}<div class="hero-in">
      <div class="brand"><span class="logo">Ponte</span><span class="logo-sub mono">pt-BR</span><button class="pchip" data-a="nav" data-v="${Profiles.list().length > 1 ? 'who' : 'profiles'}" aria-label="Perfil: ${esc(prof.name)}. Cambiar de perfil">${avatar(prof, 'sm')}<span>${esc(prof.name)}</span></button></div>
      <p class="greet pt">${greeting()}</p><p class="date"><span>${esc(date)}</span><span id="sync" class="sync s-${syncClass()}">${syncLabel()}</span></p></div></section>
    <div class="tiles">
      <div class="tile"><span class="tile-ic sun">${I.flame}</span><span class="tile-num">${streak}</span><span class="tile-lbl">${streak === 1 ? 'día de racha' : 'días de racha'}</span></div>
      <div class="tile"><svg class="ring" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="${R}" class="ring-bg"/><circle cx="26" cy="26" r="${R}" class="ring-fg" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC * (1 - ringPct)}"/></svg><span class="tile-num">${mins}<small>/${GOAL_MIN}</small></span><span class="tile-lbl">min hoy</span></div>
      <div class="tile"><span class="tile-num">${due}</span><span class="tile-lbl">${due === 1 ? 'repaso pendiente' : 'repasos pendientes'}</span></div>
    </div>
    <div class="stack">${startBtn}${unitCard}${extra.join('')}
      <div class="panel"><div class="row between"><span class="eyebrow">Nivel actual: ${lvl}</span><span class="mono small">${(prog.total * 100).toFixed(1)}% del camino a B2</span></div><div class="levels">${lv}</div></div>
    </div>`;
}

/* ---------- Temario ---------- */
function unitStatus(id, sa) {
  const c = cu(id), u = C.units[id];
  if (!u) return { key: 'pend', label: 'Pendiente' };
  if (!levelUnlocked(c.level, ST)) return { key: 'lock', label: 'Bloqueada' };
  const p = unitProgress(u, sa[id], ST.units[id]);
  if (p.passed) return { key: 'done', label: 'Completada' };
  if (p.allIntro) return { key: 'eval', label: 'Mini evaluación' };
  if (p.intro > 0) return { key: 'go', label: Math.round(p.intro / p.total * 100) + ' %' };
  return { key: 'new', label: 'Disponible' };
}
function vMap() {
  const sa = srsAll(), prog = overallProgress(ST, C, sa);
  const sections = LEVELS.map(L => {
    const unlocked = levelUnlocked(L, ST), ex = ST.levels[L] || {};
    const rows = CURRICULUM.filter(c => c.level === L).map(c => {
      const s = unitStatus(c.id, sa), u = C.units[c.id];
      return `<button class="urow st-${s.key}" data-a="unit" data-id="${c.id}"><span class="un mono">${c.n}</span><span class="ut"><strong>${esc(c.title)}</strong><small>${esc(c.desc)}</small></span><span class="chip c-${s.key}">${s.key === 'lock' ? I.lock : ''}${s.label}</span></button>`;
    }).join('');
    const ready = examReady(L, ST, C, sa);
    const exRow = `<div class="urow exam ${ex.passedAt ? 'st-done' : ''}"><span class="un mono">✦</span><span class="ut"><strong>Examen ${L}</strong><small>${ex.passedAt ? `Aprobado con ${ex.best} %` : ready ? 'Disponible: 24 preguntas, aprueba con 75 %' : 'Se activa al completar las 8 unidades'}</small></span>${ready && !ex.passedAt && unlocked ? `<button class="btn small" data-a="examStart" data-l="${L}">Empezar</button>` : `<span class="chip ${ex.passedAt ? 'c-done' : 'c-pend'}">${ex.passedAt ? 'Aprobado' : 'Cerrado'}</span>`}</div>`;
    return `<section class="lvsec"><div class="lvhead"><h2>${L} <span class="muted">· ${LEVEL_INFO[L].name}</span></h2><span class="mono small">${unlocked ? Math.round(prog.byLevel[L] * 100) + ' %' : 'bloqueado'} · ~${LEVEL_INFO[L].words.toLocaleString('es-MX')} palabras</span></div><div class="ulist">${rows}${exRow}</div></section>`;
  }).join('');
  return pageHead('Temario') + `<p class="lede">El mapa completo de A1 a B2. Avanzas unidad por unidad; cada nivel se desbloquea al aprobar el examen del anterior.</p>` + sections;
}
function vUnit() {
  const id = ui.unit, c = cu(id), u = C.units[id], sa = srsAll();
  if (!c) { ui.view = 'map'; return vMap(); }
  let body;
  if (!u) {
    body = `<div class="panel notice"><span class="eyebrow">Pendiente</span><p>Esta unidad aún no tiene contenido. Pídela en otro chat con la especificación del paquete y pégala en «Agregar contenido».</p><div class="row"><button class="btn" data-a="nav" data-v="add">${I.box}<span>Agregar contenido</span></button><button class="btn ghost" data-a="copySpec">${I.copy}<span>Copiar especificación</span></button></div></div>`;
  } else {
    const p = unitProgress(u, sa[id], ST.units[id]), ust = ST.units[id] || {}, unlocked = levelUnlocked(u.level, ST);
    const cards = sa[id] || {};
    const seenV = u.vocab.filter(v => cards[v.id]);
    const shown = (u.grammar || []).filter(g => (ust.notes || []).includes(g.id));
    const isFocus = currentUnitId(ST, C, sa) === id;
    body = `<div class="panel">
        <div class="ustats"><div><span class="big mono">${u.vocab.length}</span><small>palabras</small></div><div><span class="big mono">${(u.exercises || []).length}</span><small>ejercicios</small></div><div><span class="big mono">${(u.dialogues || []).length}</span><small>diálogos</small></div></div>
        <span class="bar"><i style="width:${Math.round(p.intro / p.total * 100)}%"></i></span>
        <p class="muted small">${p.intro} de ${p.total} ítems presentados${ust.eval ? ` · mejor evaluación: ${ust.eval.best} %` : ''}${p.passed ? ' · completada' : ''}${C.imported.has(id) ? ' · contenido importado' : ''}</p>
        ${u.goals ? `<ul class="goals">${u.goals.map(g => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}
        <div class="stack-s">
          ${!unlocked ? `<p class="muted">${I.lock} Se desbloquea al aprobar el examen del nivel anterior.</p>` : ''}
          ${unlocked && !p.allIntro ? (isFocus ? `<p class="chip c-go">Es tu unidad actual</p>` : `<button class="btn" data-a="focus" data-id="${id}">Estudiar esta unidad ahora</button>`) : ''}
          ${unlocked && p.allIntro ? `<button class="btn primary" data-a="evalStart" data-id="${id}">${p.passed ? 'Repetir la mini evaluación' : 'Hacer la mini evaluación'}</button>` : ''}
        </div></div>
      ${shown.length ? `<h2 class="sec">Notas de gramática</h2>${shown.map(g => `<details class="panel det"><summary><span>${esc(g.title)}</span>${g.divergent ? '<span class="chip c-div">Distinto del español</span>' : ''}</summary><div class="prose">${md(g.body)}</div>${g.table ? gTable(g.table) : ''}</details>`).join('')}` : ''}
      ${seenV.length ? `<h2 class="sec">Vocabulario presentado <span class="muted">(${seenV.length})</span></h2><p class="muted small">Referencia. Para memorizar, la práctica de recuperación de las sesiones funciona mejor que releer esta lista.</p><div class="vlist">${seenV.map(v => `<div class="vrow"><button class="icon-btn small" data-a="say" data-t="${esc(alts(v.pt)[0])}" aria-label="Escuchar">${I.play}</button><span class="pt">${esc(v.pt)}</span><span class="muted">${esc(v.es)}</span></div>`).join('')}</div>` : ''}`;
  }
  return pageHead(`${c.level} · Unidad ${c.n}`, 'map') + `<h2 class="utitle">${esc(c.title)}</h2><p class="lede">${esc(c.desc)}</p>` + body;
}
function gTable(rows) { return `<div class="tbl-wrap"><table class="gtbl"><thead><tr><th>Portugués</th><th>Español</th></tr></thead><tbody>${rows.map(r => `<tr><td class="pt">${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></div>`; }

/* ---------- Progreso ---------- */
function vStats() {
  const sa = srsAll(), T = todayIdx(), vs = vocabStats(C, sa), fc = forecast(C, sa, T, 7);
  let ans30 = 0, ok30 = 0;
  for (let d = T - 29; d <= T; d++) { const r = ST.days[dayKey(d)]; if (r) { ans30 += r.ans; ok30 += r.ok; } }
  const week = []; for (let d = T - 6; d <= T; d++) { const r = ST.days[dayKey(d)] || {}; week.push({ d, min: Math.round((r.ms || 0) / 60000), ans: r.ans || 0 }); }
  const wmax = Math.max(GOAL_MIN * 1.25, ...week.map(w => w.min));
  const wd = d => new Date(d * DAY_MS + 43200000).toLocaleDateString('es-MX', { weekday: 'short', timeZone: 'UTC' }).replace('.', '');
  const weeks = []; for (let w = 7; w >= 0; w--) { let m = 0; for (let d = T - w * 7 - 6; d <= T - w * 7; d++) { const r = ST.days[dayKey(d)]; if (r) m += r.ms || 0; } weeks.push(Math.round(m / 60000)); }
  const wkmax = Math.max(60, ...weeks);
  const types = Object.keys(TYPE_LABEL).filter(k => ST.byType[k] && ST.byType[k].n);
  const fmax = Math.max(1, ...fc);
  return pageHead('Progreso') + `
    <div class="tiles four">
      <div class="tile"><span class="tile-num">${vs.seen}</span><span class="tile-lbl">palabras vistas</span></div>
      <div class="tile"><span class="tile-num">${vs.learned}</span><span class="tile-lbl">aprendidas<br><small>estables 7+ días</small></span></div>
      <div class="tile"><span class="tile-num">${vs.mature}</span><span class="tile-lbl">consolidadas<br><small>21+ días</small></span></div>
      <div class="tile"><span class="tile-num">${ans30 ? Math.round(ok30 / ans30 * 100) + '<small>%</small>' : '–'}</span><span class="tile-lbl">aciertos<br><small>últimos 30 días</small></span></div>
    </div>
    <section class="panel"><div class="row between"><h2 class="sec0">Esta semana</h2><span class="mono small">meta ${GOAL_MIN} min/día</span></div>
      <div class="bars" role="img" aria-label="Minutos por día de los últimos 7 días">
        <span class="goal" style="bottom:calc(22px + (100% - 22px) * ${(GOAL_MIN / wmax).toFixed(3)})"></span>
        ${week.map(w => `<div class="barcol"><span class="bv mono">${w.min || ''}</span><span class="b ${w.min >= GOAL_MIN ? 'hit' : ''}" style="height:${w.min / wmax * 100}%"></span><span class="bl">${esc(wd(w.d))}</span></div>`).join('')}
      </div>
      <p class="muted small">${week.reduce((a, w) => a + w.ans, 0)} respuestas en 7 días · racha máxima: ${ST.streak.best || 0} días</p></section>
    <section class="panel"><h2 class="sec0">Precisión por tipo de ejercicio</h2>
      ${types.length ? `<div class="accl">${types.map(k => { const b = ST.byType[k], p = Math.round(b.ok / b.n * 100); return `<div class="accrow"><span>${TYPE_LABEL[k]}</span><span class="accbar"><i style="width:${p}%" class="${p >= 85 ? 'hi' : p >= 65 ? 'mid' : 'lo'}"></i></span><span class="mono small">${p}% · ${b.n}</span></div>`; }).join('')}</div>` : '<p class="muted">Aún no hay respuestas. Aparecerán al terminar tu primera sesión.</p>'}
    </section>
    <section class="panel"><h2 class="sec0">Repasos de los próximos 7 días</h2>
      <div class="fc">${fc.map((n, i) => `<div class="fccol"><span class="fcb" style="height:${n / fmax * 100}%"></span><span class="mono small">${n}</span><span class="bl">${i === 0 ? 'hoy' : esc(wd(T + i))}</span></div>`).join('')}</div></section>
    <section class="panel"><h2 class="sec0">Últimas 8 semanas</h2>
      <div class="wk">${weeks.map((m, i) => `<div class="wkcol"><span class="wkb" style="height:${m / wkmax * 100}%"></span><span class="mono small">${m}</span><span class="bl">${i === 7 ? 'esta' : '−' + (7 - i)}</span></div>`).join('')}</div>
      <p class="muted small">Minutos de práctica por semana.</p></section>`;
}

/* ---------- Más ---------- */
function vMore() {
  const b1 = LEVELS.indexOf(currentLevel(ST, C, srsAll())) >= 2 || levelUnlocked('B1', ST);
  const row = (v, icon, t, s) => `<button class="mrow" data-a="nav" data-v="${v}"><span class="mic">${icon}</span><span class="mt"><strong>${t}</strong><small>${s}</small></span>${I.chev}</button>`;
  return pageHead('Más') + `<div class="mlist">
    ${row('profiles', I.user, 'Perfiles', plural(Profiles.list().length, 'perfil', 'perfiles') + ' · en uso: ' + esc(Profiles.active().name))}
    ${row('add', I.box, 'Agregar contenido', 'Opcional: unidades extra en formato JSON')}
    ${row('backup', I.save, 'Respaldo', 'Exporta o restaura tu progreso y paquetes')}
    <button class="mrow" data-a="placeStart"><span class="mic">${I.gauge}</span><span class="mt"><strong>Prueba de nivel</strong><small>${ST.placement ? 'Resultado: puedes empezar en ' + ST.placement.start : '16 preguntas, unos 4 minutos'}</small></span>${I.chev}</button>
    ${row('input', I.ear, 'Input externo', b1 ? 'Registra podcasts, series y lecturas' : 'Se activa en B1')}
    ${row('settings', I.gear, 'Ajustes', 'Voz, palabras por sesión, tema, micrófono')}
    ${row('method', I.book, 'Cómo funciona', 'Las técnicas detrás de cada sesión')}
  </div>`;
}
function vMethod() {
  return pageHead('Cómo funciona', 'more') + `<div class="panel prose">
    <p><strong>Repetición espaciada.</strong> Cada palabra y ejercicio tiene una tarjeta programada con FSRS-5, un algoritmo que estima cuánto tiempo recordarás algo. Tus respuestas (otra vez, difícil, bien, fácil) ajustan su próxima fecha para repasarla justo antes de olvidarla, con 90 % de retención objetivo.</p>
    <p><strong>Recuperación activa.</strong> Siempre respondes antes de ver la solución: eliges, escribes, ordenas o dices. Recordar con esfuerzo fija mejor que releer.</p>
    <p><strong>Dificultad progresiva.</strong> Una palabra nueva empieza con reconocimiento; cuando se vuelve estable pasa a escribirla, completar frases, dictado y traducción de frases completas.</p>
    <p><strong>Intercalado.</strong> Los repasos mezclan tipos de ejercicio y unidades para que no respondas en piloto automático.</p>
    <p><strong>Pre-prueba con parecidas.</strong> Las palabras parecidas al español primero se adivinan en una ronda rápida y después se presentan con audio, traducción y ejemplo. Si las reconoces rápido, su intervalo crece más rápido.</p>
    <p><strong>Input comprensible.</strong> Los diálogos se eligen cuando ya conoces la mayor parte de sus palabras (objetivo 90–95 %).</p>
    <p><strong>Escucha y shadowing.</strong> Desde el primer día escuchas un diálogo, respondes preguntas sin ver el texto y repites líneas a velocidad lenta y normal.</p>
    <p><strong>Producción.</strong> Cada sesión cierra con una o dos frases tuyas, comparadas con un modelo.</p></div>`;
}

/* ---------- Agregar contenido ---------- */
function vAdd() {
  const r = ui.add.report;
  let rep = '';
  if (r) {
    if (r.error) rep = `<div class="panel bad"><strong>No se pudo leer</strong><p>${esc(r.error)}</p></div>`;
    else if (r.errors.length) rep = `<div class="panel bad"><strong>${plural(r.errors.length, 'problema', 'problemas')} en el paquete</strong><ul class="errs">${r.errors.slice(0, 30).map(e => `<li class="mono">${esc(e)}</li>`).join('')}</ul>${r.errors.length > 30 ? `<p class="muted small">…y ${r.errors.length - 30} más.</p>` : ''}</div>`;
    else rep = `<div class="panel okp"><strong>Paquete válido</strong>${r.summary.map(s => `<p><span class="mono">${unitLabel(s.id)}</span> · ${esc(s.title)}<br><span class="muted small">${s.v} palabras · ${s.g} notas · ${s.e} ejercicios · ${s.d} diálogos · ${s.status}</span></p>`).join('')}${r.warnings.length ? `<details><summary class="small">${plural(r.warnings.length, 'aviso', 'avisos')} (no impiden importar)</summary><ul class="errs">${r.warnings.map(w => `<li class="mono">${esc(w)}</li>`).join('')}</ul></details>` : ''}<p class="muted small">Importar no borra ni cambia tu progreso. Los ítems que ya existían conservan su historial.</p><button class="btn primary block" data-a="packImport" ${ui.ready ? '' : 'disabled'}>Importar ${plural(r.summary.length, 'unidad', 'unidades')}</button></div>`;
  }
  const imported = Object.keys(Store.docs).filter(k => k.startsWith('unit.')).map(k => Store.docs[k]).sort((a, b) => (a.unit.id > b.unit.id ? 1 : -1));
  return pageHead('Agregar contenido', 'more') + `
    <p class="lede">Pega un paquete JSON con una o dos unidades. Si lo pediste en otro chat, puedes pegar la respuesta completa: la app busca el JSON dentro.</p>
    <div class="panel"><label class="lbl" for="pack-text">Paquete</label>
      <textarea id="pack-text" class="ta mono" data-bind="add.text" rows="8" spellcheck="false" placeholder='{ "format": "ptbr-pack", "version": 1, … }'>${esc(ui.add.text)}</textarea>
      <div class="row"><button class="btn primary" data-a="packCheck">Validar</button><label class="btn ghost file">Abrir archivo .json<input id="pack-file" type="file" accept=".json,application/json,text/plain" data-file="pack"></label></div></div>
    ${rep}
    <section class="panel"><div class="row between"><h2 class="sec0">Pedir unidades nuevas</h2></div>
      <p class="small">Copia la especificación y pégala en otro chat junto con lo que necesitas, por ejemplo: <em>«Genera el paquete de A1 unidades 3 y 4 siguiendo esta especificación»</em>.</p>
      <div class="row"><button class="btn" data-a="copySpec">${I.copy}<span>Copiar especificación</span></button><button class="btn ghost" data-a="copyAsk">${I.copy}<span>Copiar pedido de la siguiente unidad</span></button></div>
      <details><summary class="small">Ver especificación</summary><pre class="spec">${esc(PACK_SPEC)}</pre></details></section>
    <section class="panel"><h2 class="sec0">Contenido incluido e importado</h2>
      <ul class="plain"><li><span class="mono">A1–B2</span> · ${BUILTIN_UNITS.length} unidades incluidas en la app</li>${imported.map(d => `<li><span class="mono">${unitLabel(d.unit.id)}</span> · ${esc(d.unit.title)} <span class="muted small">· paquete ${esc(d.packId)} · ${new Date(d.importedAt).toLocaleDateString('es-MX')}</span></li>`).join('')}</ul></section>`;
}
function nextAsk() {
  const pend = CURRICULUM.filter(c => !C.units[c.id]).slice(0, 2);
  if (!pend.length) return 'Ya tengo todas las unidades.';
  return `Genera el paquete de contenido para ${pend.map(c => `${c.level} unidad ${c.n} («${c.title}»: ${c.desc})`).join(' y ')}, para hispanohablantes que aprenden portugués de Brasil. Sigue exactamente esta especificación y devuelve solo el JSON:\n\n${PACK_SPEC}`;
}

/* ---------- Respaldo ---------- */
function buildBackup() {
  const units = {}, profiles = [];
  for (const k in Store.docs) if (k.startsWith('unit.')) units[k.slice(5)] = Store.docs[k].unit;
  for (const p of Profiles.list()) {
    const st = p.id === Profiles.activeId() ? ST : Store.get(P('state', p.id));
    profiles.push({ id: p.id, name: p.name, color: p.color || 0, state: st || null, srs: srsAll(p.id) });
  }
  return { format: 'ptbr-backup', version: 2, app: 'Ponte Português', exportedAt: new Date().toISOString(), active: Profiles.activeId(), profiles, units };
}
function restoreInto(id, state, srs) {
  srs = srs || {}; const pre = P('srs.', id);
  for (const k of Object.keys(Store.docs)) if (k.startsWith(pre) && !srs[k.slice(pre.length)]) Store.del(k);
  for (const u in srs) Store.put(pre + u, { cards: srs[u] || {} });
  if (state) { const s2 = migrate(clone(state)); s2.session = null; Store.put(P('state', id), s2); } else Store.del(P('state', id));
}
function vBackup() {
  const b = ui.backup, r = b.report;
  let rep = '';
  if (r) {
    if (r.errors && r.errors.length) rep = `<div class="panel bad"><strong>Respaldo no válido</strong><ul class="errs">${r.errors.slice(0, 20).map(e => `<li class="mono">${esc(e)}</li>`).join('')}</ul></div>`;
    else rep = `<div class="panel okp"><strong>Respaldo válido</strong><p class="small">Exportado el ${esc(new Date(r.at).toLocaleString('es-MX'))} · ${esc(r.who)} · ${r.cards} tarjetas · ${r.units} unidades importadas</p>
      ${b.confirm ? `<div class="confirm"><p>${r.obj.version === 1 ? `Esto reemplaza el progreso de ${esc(Profiles.active().name)} por el del respaldo.` : 'Esto reemplaza todos los perfiles y su progreso por los del respaldo.'} Los paquetes del respaldo se agregan a los que ya tienes.</p><div class="row"><button class="btn danger" data-a="restoreGo">Sí, restaurar</button><button class="btn ghost" data-a="restoreNo">Cancelar</button></div></div>` : `<button class="btn primary block" data-a="restoreAsk" ${ui.ready ? '' : 'disabled'}>Restaurar este respaldo</button>`}</div>`;
  }
  return pageHead('Respaldo', 'more') + `
    <section class="panel"><h2 class="sec0">Exportar</h2><p class="small">Incluye todos los perfiles con su progreso, fechas de repaso y estadísticas, más los paquetes importados.</p>
      <div class="row">${(Caps.downloads || !IN_ARTIFACT) ? `<button class="btn primary" data-a="backupDownload">${I.save}<span>Descargar .json</span></button>` : ''}<button class="btn" data-a="backupCopy">${I.copy}<span>Copiar al portapapeles</span></button><button class="btn ghost" data-a="backupShow">Mostrar texto</button></div>
      ${b.out ? `<textarea class="ta mono" rows="6" readonly id="backup-out">${esc(b.out)}</textarea>` : ''}</section>
    <section class="panel"><h2 class="sec0">Restaurar</h2>
      <label class="lbl" for="backup-text">Pega aquí un respaldo</label>
      <textarea id="backup-text" class="ta mono" data-bind="backup.text" rows="6" spellcheck="false">${esc(b.text)}</textarea>
      <div class="row"><button class="btn" data-a="backupCheck">Validar</button><label class="btn ghost file">Abrir archivo<input id="backup-file" type="file" accept=".json,application/json,text/plain" data-file="backup"></label></div></section>
    ${rep}`;
}

/* ---------- Ajustes ---------- */
function vSettings() {
  const s = ST.settings;
  const seg = (key, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button class="${String(s[key]) === String(v) ? 'on' : ''}" data-a="set" data-k="${key}" data-v="${v}" aria-pressed="${String(s[key]) === String(v)}">${l}</button>`).join('')}</div>`;
  const voices = Speech.pt;
  return pageHead('Ajustes', 'more') + `
    <section class="panel set"><div><strong>Palabras nuevas por sesión</strong><small>Las parecidas al español cuentan como media. Si se acumulan muchos repasos, la app baja a 5 sola.</small></div>
      <div class="stepper"><button class="icon-btn" data-a="newPer" data-d="-1" aria-label="Menos">${I.minus}</button><span class="mono big">${s.newPer}</span><button class="icon-btn" data-a="newPer" data-d="1" aria-label="Más">${I.plus}</button></div></section>
    <section class="panel set col"><div><strong>Voz en portugués</strong><small>${Speech.ok ? (voices.length ? `${voices.length} voz(es) pt disponibles en este dispositivo.` : 'No encontré una voz en portugués. Instala una: en Android, Ajustes › Texto a voz › Google › portugués (Brasil); en iPhone, Ajustes › Accesibilidad › Contenido leído › Voces › Portugués (Brasil).') : 'Este navegador no puede leer texto en voz alta. Los ejercicios de audio se cambian por lectura.'}</small></div>
      ${voices.length ? `<select id="voice" class="sel" data-set="voice"><option value="">Automática</option>${voices.map(v => `<option value="${esc(v.voiceURI)}" ${s.voice === v.voiceURI ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select>` : ''}
      <div class="row"><span class="small muted">Velocidad lenta</span>${seg('slowRate', [[0.55, '0.55×'], [0.65, '0.65×'], [0.75, '0.75×']])}</div>
      ${Speech.ok ? `<button class="btn" data-a="say" data-t="Olá! Tudo bem? Eu sou a sua voz em português.">${I.play}<span>Probar voz</span></button>` : ''}</section>
    <section class="panel set col"><div><strong>Reconocimiento de voz</strong><small>${SR.available() ? 'Disponible. Se usa en pronunciación, shadowing y producción hablada.' : esc(SR.reason || 'No disponible.') + ' Los ejercicios de pronunciación usan autoevaluación o discriminación auditiva.'}</small></div>
      ${SR.C ? `<button class="btn" data-a="srTest">${I.mic}<span>Probar micrófono</span></button>` : ''}</section>
    <section class="panel set col"><div><strong>Tema</strong></div>${seg('theme', [['auto', 'Sistema'], ['light', 'Claro'], ['dark', 'Oscuro']])}</section>
    <section class="panel set col"><div><strong>Dónde se guarda</strong><small>${Store.cloud ? 'En el almacenamiento privado de este artefacto en tu cuenta de Claude, más una copia en este navegador.' : IN_ARTIFACT ? 'Solo en este navegador. Abre la app desde su enlace de Claude para guardar en tu cuenta, y exporta respaldos de vez en cuando.' : 'En este teléfono, dentro de la app. Si borras los datos de Safari o eliminas la app de la pantalla de inicio, se pierde: exporta un respaldo cada semana o dos.'}</small></div></section>
    <section class="panel set col"><div><strong>Borrar progreso</strong><small>Reinicia tarjetas, racha y estadísticas de ${esc(Profiles.active().name)}. Los demás perfiles no cambian.</small></div>
      ${ui.confirmReset ? `<div class="confirm"><p>¿Seguro? No se puede deshacer. Exporta un respaldo antes si lo quieres conservar.</p><div class="row"><button class="btn danger" data-a="resetGo">Borrar progreso</button><button class="btn ghost" data-a="resetNo">Cancelar</button></div></div>` : `<button class="btn danger ghosty" data-a="resetAsk">Borrar progreso…</button>`}</section>`;
}

/* ---------- Input externo ---------- */
function vInput() {
  const lvl = currentLevel(ST, C, srsAll()), active = LEVELS.indexOf(lvl) >= 2 || levelUnlocked('B1', ST);
  const sugL = LEVELS.indexOf(lvl) >= 3 ? 'B2' : 'B1';
  const T = todayIdx(), log = ST.inputLog || [];
  const weekMin = log.filter(x => x.d > T - 7).reduce((a, x) => a + (+x.min || 0), 0);
  const f = ui.inputForm;
  const sugs = (L) => INPUT_SUGGESTIONS[L].map(s => `<div class="sugg"><span class="chip c-new">${esc(s.type)}</span><strong>${esc(s.name)}</strong><small>${esc(s.why)}</small></div>`).join('');
  if (!active) return pageHead('Input externo', 'more') + `<div class="panel notice"><span class="eyebrow">${I.lock} Se activa en B1</span><p>A partir de B1, escuchar y leer material real acelera mucho el avance. Aquí podrás registrar podcasts, series y lecturas, con sugerencias para tu nivel.</p></div><h2 class="sec">Vista previa de sugerencias B1</h2><div class="sugs">${sugs('B1')}</div>`;
  return pageHead('Input externo', 'more') + `
    <div class="tiles"><div class="tile"><span class="tile-num">${weekMin}</span><span class="tile-lbl">min esta semana</span></div><div class="tile"><span class="tile-num">${log.length}</span><span class="tile-lbl">registros</span></div></div>
    <form class="panel stack-s" data-f="inputAdd">
      <label class="lbl" for="in-type">Tipo</label>
      <select id="in-type" class="sel" data-bind="inputForm.type">${['Podcast', 'Serie o película', 'Video', 'Lectura', 'Música', 'Conversación'].map(t => `<option ${f.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
      <label class="lbl" for="in-title">Título</label><input id="in-title" class="input" data-bind="inputForm.title" value="${esc(f.title)}" placeholder="Ej.: Café da Manhã, episodio de hoy" required>
      <label class="lbl" for="in-min">Minutos</label><input id="in-min" class="input" type="number" inputmode="numeric" min="1" max="600" data-bind="inputForm.min" value="${esc(f.min)}" required>
      <label class="lbl" for="in-note">Nota (opcional)</label><input id="in-note" class="input" data-bind="inputForm.note" value="${esc(f.note)}" placeholder="Palabras nuevas, qué entendiste…">
      <button class="btn primary">Registrar</button></form>
    ${log.length ? `<h2 class="sec">Historial</h2><div class="vlist">${log.slice(0, 30).map(x => `<div class="vrow"><span class="mono small">${dayKey(x.d).slice(5)}</span><span><strong>${esc(x.title)}</strong> <span class="muted small">· ${esc(x.type)} · ${x.min} min</span>${x.note ? `<br><small class="muted">${esc(x.note)}</small>` : ''}</span></div>`).join('')}</div>` : ''}
    <h2 class="sec">Sugerencias para ${sugL}</h2><div class="sugs">${sugs(sugL)}</div>`;
}

/* ---------- Perfiles ---------- */
function vWho() {
  const list = Profiles.list(), act = Profiles.activeId();
  return `<div class="whoscreen">${waves(30, 'ww')}<div class="solo">
    <div class="brand who-brand"><span class="logo">Ponte</span><span class="logo-sub mono">pt-BR</span></div>
    <div><h1 class="pt who-t">Quem vai estudar?</h1><p class="muted">¿Quién va a practicar ahora?</p></div>
    <div class="plist">${list.map(p => { const s = profileSummary(p); return `<button class="pcard ${p.id === act ? 'last' : ''}" data-a="pickProfile" data-id="${esc(p.id)}">${avatar(p, 'lg')}<span class="pmeta"><strong>${esc(p.name)}</strong><small>${s.lvl} · ${plural(s.streak, 'día', 'días')} de racha · ${plural(s.due, 'repaso', 'repasos')}</small></span>${I.chev}</button>`; }).join('')}</div>
    <button class="btn ghost" data-a="nav" data-v="profiles">${I.user}<span>Administrar perfiles</span></button></div></div>`;
}
function colorPick(bind, val) { return `<div class="colors" role="group" aria-label="Color">${[0, 1, 2, 3].map(c => `<button type="button" class="cdot pc${c} ${+val === c ? 'on' : ''}" data-a="pickColor" data-bind="${bind}" data-c="${c}" aria-label="Color ${c + 1}" aria-pressed="${+val === c}"></button>`).join('')}</div>`; }
function vProfiles() {
  const list = Profiles.list(), act = Profiles.activeId(), pf = ui.prof;
  const rows = list.map(p => {
    const s = profileSummary(p), on = p.id === act;
    let actions;
    if (pf.edit === p.id) actions = `<form class="stack-s" data-f="profRename" data-id="${esc(p.id)}"><label class="lbl" for="pf-name">Nombre</label><input id="pf-name" class="input" maxlength="24" data-bind="prof.editName" value="${esc(pf.editName)}" required data-autofocus>${colorPick('prof.editColor', pf.editColor)}<div class="row"><button class="btn primary">Guardar</button><button type="button" class="btn ghost" data-a="profEditNo">Cancelar</button></div></form>`;
    else if (pf.del === p.id) actions = `<div class="confirm"><p>¿Borrar el perfil «${esc(p.name)}» y todo su progreso? No se puede deshacer.</p><div class="row"><button class="btn danger" data-a="profDelGo" data-id="${esc(p.id)}">Borrar perfil</button><button class="btn ghost" data-a="profDelNo">Cancelar</button></div></div>`;
    else actions = `<div class="row">${on ? '<span class="chip c-go">En uso</span>' : `<button class="btn small primary" data-a="pickProfile" data-id="${esc(p.id)}">Usar este perfil</button>`}<button class="btn small" data-a="profEdit" data-id="${esc(p.id)}">Editar</button>${list.length > 1 ? `<button class="btn small ghost" data-a="profDel" data-id="${esc(p.id)}">Borrar</button>` : ''}</div>`;
    return `<div class="panel prow"><div class="prow-h">${avatar(p, 'lg')}<span class="pmeta"><strong>${esc(p.name)}</strong><small>Nivel ${s.lvl} · ${s.seen} palabras vistas · ${plural(s.streak, 'día', 'días')} de racha</small></span></div>${actions}</div>`;
  }).join('');
  const add = list.length < MAX_PROFILES ? `<form class="panel stack-s" data-f="profAdd"><h2 class="sec0">Nuevo perfil</h2><label class="lbl" for="pf-new">Nombre</label><input id="pf-new" class="input" maxlength="24" placeholder="Ej.: Ana" data-bind="prof.newName" value="${esc(pf.newName)}" required>${colorPick('prof.newColor', pf.newColor)}<button class="btn primary">Agregar perfil</button></form>` : `<p class="muted small">Puedes tener hasta ${MAX_PROFILES} perfiles.</p>`;
  return pageHead('Perfiles', 'more') + `<p class="lede">Cada perfil tiene su propio progreso, repasos, racha, estadísticas y ajustes. El temario es el mismo para todos. Con más de un perfil, la app pregunta quién va a practicar cada vez que la abres.</p>${rows}${add}`;
}

/* ---------- Check-in ---------- */
function vCheckin() {
  const c = ui.checkin;
  const q = (key, label, help) => `<div class="ci"><p class="ci-q">${label}</p>${help ? `<p class="muted small">${help}</p>` : ''}<div class="ci-opts"><button class="btn big ${c[key] === true ? 'sel' : ''}" data-a="ci" data-q="${key}" data-v="1" aria-pressed="${c[key] === true}">Sí</button><button class="btn big ${c[key] === false ? 'sel' : ''}" data-a="ci" data-q="${key}" data-v="0" aria-pressed="${c[key] === false}">No</button></div></div>`;
  const title = c.for === 'session' ? 'Antes de empezar' : c.for === 'unit' ? 'Mini evaluación · ' + unitLabel(c.ref) : 'Examen ' + c.ref;
  return `<div class="solo"><header class="phead"><button class="icon-btn" data-a="nav" data-v="home" aria-label="Cancelar">${I.x}</button><h1>${esc(title)}</h1></header>
    ${q('speak', '¿Puedes hablar ahora?', 'Si no, la pronunciación y el shadowing se cambian por escritura.')}
    ${q('audio', '¿Puedes escuchar audio?', Speech.ok ? 'Si no, verás transcripciones en lugar de audio.' : 'Este navegador no tiene voz: se usarán transcripciones.')}
    <p class="muted small">Tu respuesta vale solo para esta ${c.for === 'session' ? 'sesión' : 'evaluación'} y no afecta tu progreso ni tu racha.</p>
    <div class="ci-prof">${avatar(Profiles.active(), 'sm')}<span>Practicando como <strong>${esc(Profiles.active().name)}</strong></span>${Profiles.list().length > 1 ? '<button class="link inline" data-a="nav" data-v="who">Cambiar</button>' : ''}</div>
    <button class="btn primary xl" data-a="ciGo" ${c.speak == null || c.audio == null ? 'disabled' : ''}><span>Empezar</span></button></div>`;
}

/* ---------- práctica ---------- */
function curTask() { if (ui.mode === 'session') return ST.session && ST.session.tasks[ST.session.i]; if (ui.mode === 'test') return ui.test.tasks[ui.test.i]; return null; }
function pmode() { const m = ui.mode === 'session' ? ST.session.mode : ui.test.mode; return { speak: !!m.speak, audio: !!m.audio && Speech.ok, sr: !!m.speak && SR.available(), test: ui.mode === 'test' }; }
function enterPractice(mode) { ui.mode = mode; ui.view = 'practice'; EX = null; Activity.last = Date.now(); render(); window.scrollTo(0, 0); }
function vPractice() {
  let guard = 0;
  while (guard++ < 200) {
    const task = curTask();
    if (!task) { if (ui.mode === 'session') { finishSession(); } else finishTest(); return null; }
    const key = (ui.mode === 'session' ? ST.session.i : ui.test.i) + ':' + JSON.stringify(task);
    if (!EX || EX.key !== key) EX = makeEx(task, key);
    if (!EX.skip) break;
    if (ui.mode === 'session') ST.session.i++; else ui.test.i++;
    EX = null;
  }
  const S = ui.mode === 'session' ? ST.session : ui.test;
  const pct = Math.round(S.i / Math.max(1, S.tasks.length) * 100);
  const tag = ui.mode === 'session' ? (PHASES[EX.task.ph] || '') : (ui.test.kind === 'unit' ? 'Mini evaluación' : 'Examen ' + ui.test.ref);
  const content = vEx();
  const hasSheet = EX.phase === 'fb' && EX.task.k === 'card';
  return `<div class="prac"><header class="ptop"><button class="icon-btn" data-a="pause" aria-label="${ui.mode === 'session' ? 'Pausar sesión' : 'Salir de la evaluación'}">${I.x}</button><div class="pbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div><span class="ptag">${esc(tag)}</span></header>
    <main class="pmain ${hasSheet ? 'has-sheet' : ''}">${content}</main>${hasSheet ? vSheet() : ''}</div>`;
}
function makeEx(task, key) {
  const M = pmode(), ex = { task, key, phase: 'ask', t: task.t, start: Date.now(), M };
  const ref = C.items[task.id];
  if (task.k !== 'phase' && !ref) { ex.skip = true; return ex; }
  switch (task.k) {
    case 'card': ex.ref = ref; ex.item = ref.it; prepCard(ex, M); break;
    case 'intro': ex.item = ref.it; if (M.audio) setTimeout(() => Speech.say(alts(ref.it.pt)[0]), 60); break;
    case 'note': ex.item = ref.it; ex.ans = null; break;
    case 'dlg': ex.item = ref.it; ex.stage = M.audio ? 'listen' : 'read'; ex.qi = 0; ex.ans = null; ex.open = {}; ex.playing = -1; ex.plays = 0; break;
    case 'shadow': ex.item = ref.it; ex.line = ref.it.lines[task.line]; if (!ex.line) { ex.skip = true; break; } ex.stage = 'ask'; ex.showEs = false; break;
    case 'prod': ex.item = ref.it; ex.text = ''; ex.stage = 'ask'; break;
  }
  return ex;
}
function distractors(v, n) {
  const ref = C.items[v.id], u = C.units[ref.unit];
  let pool = u.vocab.filter(x => x.id !== v.id).map(x => x.es);
  if (pool.length < 10) for (const id of C.order) if (id !== ref.unit) pool.push(...C.units[id].vocab.map(x => x.es));
  const bad = new Set(alts(v.es).map(fold)); bad.add(fold(v.es));
  pool = [...new Set(pool)].filter(x => !alts(x).some(a => bad.has(fold(a))) && !bad.has(fold(x)));
  const wc = s => s.split(/\s+/).length, tw = wc(v.es);
  pool = shuffle(pool).sort((a, b) => Math.abs(wc(a) - tw) - Math.abs(wc(b) - tw)).slice(0, 8);
  const out = []; if (v.kind === 'falso' && v.trap) out.push(v.trap);
  for (const x of shuffle(pool)) { if (out.length >= n) break; if (!out.includes(x)) out.push(x); }
  return out;
}
function setupOrder(ex, sentence) {
  ex.tokens = orderTokens(sentence); ex.sentenceText = sentence;
  const idx = ex.tokens.map((_, i) => i); let pool = shuffle(idx);
  for (let k = 0; k < 6 && pool.every((x, i) => ex.tokens[x] === ex.tokens[i]); k++) pool = shuffle(idx);
  ex.pool = pool; ex.picked = [];
}
function prepCard(ex, M) {
  const { ref, item } = ex; let t = ex.t;
  if (t === 'escuchar' && !M.audio) t = 'elegir';
  if (t === 'dictado' && !M.audio) t = ref.kind === 'v' ? (vocabCan('completar', item) ? 'completar' : 'escribir') : 'traducir';
  if (t === 'pron-sr' && !M.sr) t = pronVariant(item, Object.assign({}, M, { sr: false }));
  if ((t === 'pron-pair' || t === 'pron-listen') && !M.audio) t = item.quiz ? 'pron-quiz' : null;
  if (t === 'pron-self' && M.test) t = item.quiz ? 'pron-quiz' : null;
  if (ref.kind === 'v' && t === 'completar' && !vocabCan('completar', item)) t = 'escribir';
  if (ref.kind === 'v' && t === 'ordenar' && !vocabCan('ordenar', item)) t = 'escribir';
  if (!t) { ex.skip = true; return; }
  ex.t = t;
  if (ref.kind === 'v') {
    const v = item;
    if (t === 'elegir' || t === 'escuchar' || t === 'reconocer') {
      ex.opts = shuffle([{ txt: v.es, ok: true }, ...distractors(v, 3).map(x => ({ txt: x, ok: false }))]);
      if (M.audio && t !== 'elegir') setTimeout(() => Speech.say(alts(v.pt)[0]), 60);
    } else if (t === 'escribir') { ex.answers = ptAnswers([v.pt]); }
    else if (t === 'completar') { const c = clozeTarget(v); ex.before = v.ex.slice(0, c.start); ex.after = v.ex.slice(c.end); ex.answers = [c.word]; ex.hint = alts(v.es)[0]; ex.es = v.exEs; }
    else if (t === 'ordenar') { setupOrder(ex, v.ex); ex.es = v.exEs; }
    else if (t === 'dictado') { ex.text = v.ex; ex.answers = [v.ex]; ex.sentence = true; setTimeout(() => Speech.say(v.ex), 60); }
    else if (t === 'traducir') { ex.prompt = v.exEs; ex.answers = [v.ex]; ex.sentence = true; ex.dir = 'es-pt'; }
  } else {
    const e = item;
    switch (t) {
      case 'completar': { const m = e.pt.match(/_{3,}/); ex.before = e.pt.slice(0, m.index); ex.after = e.pt.slice(m.index + m[0].length); ex.answers = [e.answer, ...(e.accept || [])]; ex.hint = e.hint; ex.es = e.es; break; }
      case 'elegir': ex.opts = shuffle(e.options.map((o, i) => ({ txt: o, ok: i === e.answer }))); break;
      case 'traducir':
        if (e.type === 'dictado' || e.dir !== 'pt-es') { ex.prompt = e.es; ex.answers = [e.pt, ...(e.accept || [])]; ex.dir = 'es-pt'; }
        else { ex.prompt = e.pt; ex.answers = [e.es, ...(e.accept || [])]; ex.dir = 'pt-es'; }
        ex.sentence = true; break;
      case 'ordenar': setupOrder(ex, e.pt); ex.es = e.es; break;
      case 'dictado': ex.text = e.pt; ex.answers = [e.pt]; ex.sentence = true; setTimeout(() => Speech.say(e.pt), 60); break;
      case 'pron-pair': ex.target = Math.random() < 0.5 ? 0 : 1; ex.opts = e.pair.map((w, i) => ({ txt: w, ok: i === ex.target })); setTimeout(() => Speech.say(e.pair[ex.target]), 60); break;
      case 'pron-quiz': ex.opts = shuffle(e.quiz.options.map((o, i) => ({ txt: o, ok: i === e.quiz.answer }))); break;
      case 'pron-listen': {
        const word = alts(e.pt)[0]; const u = C.units[ref.unit];
        const others = shuffle(u.vocab.map(v => alts(v.pt)[0].replace(PT_ART, '')).filter(w => fold(w) !== fold(word))).slice(0, 2);
        ex.opts = shuffle([{ txt: word, ok: true }, ...others.map(w => ({ txt: w, ok: false }))]); ex.sayText = word;
        setTimeout(() => Speech.say(word), 60); break;
      }
      case 'pron-sr': case 'pron-self': ex.sayText = e.pt.replace(/\s+\/\s+/g, ', '); ex.heard = null; ex.tries = 0; break;
    }
  }
}
const sayRow = (text, M, big) => (M && M.audio) ? `<div class="say ${big ? 'big' : ''}"><button class="say-btn" data-a="say" data-t="${esc(text)}">${I.play}<span>Escuchar</span></button><button class="say-btn alt" data-a="say" data-t="${esc(text)}" data-slow="1"><span class="mono">${ST.settings.slowRate}×</span><span>Lento</span></button></div>` : '';
const accentBar = () => `<div class="accents" aria-label="Letras con acento">${['ã', 'õ', 'á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'ô', 'à', 'ç'].map(c => `<button type="button" class="acc" data-a="acc" data-c="${c}" tabindex="-1">${c}</button>`).join('')}</div>`;
function typeForm(placeholder, multi) {
  const field = multi
    ? `<textarea id="ans" class="ta input pt" rows="2" lang="pt-BR" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="${esc(placeholder)}" data-autofocus></textarea>`
    : `<input id="ans" class="input pt" lang="pt-BR" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${esc(placeholder)}" data-autofocus>`;
  return `<form class="typeform" data-f="type">${field}${EX.dir === 'pt-es' ? '' : accentBar()}<div class="row"><button class="btn primary grow">Comprobar</button><button type="button" class="btn ghost" data-a="giveup">No lo sé</button></div></form>`;
}
function optsHtml(opts, cls) {
  const fb = EX.phase === 'fb';
  return `<div class="opts ${cls || ''}">${opts.map((o, i) => {
    let st = ''; if (fb) { if (o.ok) st = 'right'; else if (EX.pick === i) st = 'wrong'; else st = 'dim'; }
    return `<button class="opt ${st}" data-a="pick" data-i="${i}" ${fb ? 'disabled' : ''}><span class="okey mono">${i + 1}</span><span>${esc(o.txt)}</span></button>`;
  }).join('')}</div>`;
}
function vEx() {
  const t = EX.task;
  switch (t.k) {
    case 'phase': return vPhase();
    case 'intro': return vIntro();
    case 'note': return vNote();
    case 'dlg': return vDlg();
    case 'shadow': return vShadow();
    case 'prod': return vProd();
    default: return vCard();
  }
}
function vPhase() {
  const t = EX.task, S = ST.session;
  const order = ['rev', 'new', 'lis', 'prod'].filter(p => S.tasks.some(x => x.ph === p && x.k === 'phase'));
  const num = order.indexOf(t.ph) + 1;
  const info = {
    rev: [`${plural(t.n, 'tarjeta', 'tarjetas')} para hoy`, 'Recupera de memoria y califica con honestidad: así la app calcula la próxima fecha.'],
    new: t.empty ? ['Sin palabras nuevas hoy', ST.session.info.unit ? '' : 'Agrega el paquete de la siguiente unidad en «Más › Agregar contenido». Mientras, seguimos con escucha y producción.'] : [`${plural(t.n, 'palabra nueva', 'palabras nuevas')} de ${unitLabel(t.unit)}`, 'Las parecidas al español van primero en ronda rápida: adivina su significado sin pensar demasiado.'],
    lis: ['Diálogo y shadowing', EX.M.audio ? 'Escucha sin leer, responde y luego repite líneas en voz alta.' : 'Lee el diálogo, responde y luego practica las líneas por escrito.'],
    prod: ['Tus propias frases', EX.M.speak ? 'Di una o dos frases y compáralas con un modelo.' : 'Escribe una o dos frases y compáralas con un modelo.']
  }[t.ph];
  return `<div class="phase"><span class="phase-num mono">${num}<small>/${order.length}</small></span><h2>${esc(PHASES[t.ph])}</h2><p class="phase-t">${esc(info[0])}</p>${info[1] ? `<p class="muted">${esc(info[1])}</p>` : ''}<button class="btn primary xl" data-a="next" data-autofocus><span>Continuar</span></button></div>`;
}
function kindChip(v) { return v.kind === 'falso' ? '<span class="chip c-false">Falso amigo</span>' : v.kind === 'parecida' ? '<span class="chip c-cog">Parecida al español</span>' : ''; }
function presentation(v, M) {
  return `<div class="pres">
    <div class="word pt">${esc(v.pt)}</div>${v.ipa ? `<div class="ipa mono">${esc(v.ipa)}</div>` : ''}
    ${sayRow(alts(v.pt)[0], M, true)}
    <div class="gloss">${esc(v.es)}</div>
    ${v.kind === 'falso' && v.trap ? `<p class="trap">Ojo: no significa «${esc(v.trap)}».</p>` : ''}
    <div class="exbox"><p class="pt">${esc(v.ex)}</p>${M.audio ? `<button class="icon-btn small" data-a="say" data-t="${esc(v.ex)}" aria-label="Escuchar la frase">${I.play}</button>` : ''}<p class="es">${esc(v.exEs)}</p></div>
    ${v.note ? `<p class="note">${esc(v.note)}</p>` : ''}
    ${(v.tags || []).length ? `<div class="tags">${v.tags.map(t => `<span class="chip c-tag">${esc(TAG_LABEL[t] || t)}</span>`).join('')}</div>` : ''}</div>`;
}
function vIntro() {
  const v = EX.item;
  return `<div class="ex"><div class="eyebrow">Palabra nueva ${kindChip(v)}</div>${presentation(v, EX.M)}
    <div class="actions"><button class="btn primary xl" data-a="introDone" data-autofocus><span>Entendido</span><small>Te la preguntaré en un momento</small></button></div></div>`;
}
function vNote() {
  const g = EX.item, c = g.check;
  let check = '';
  if (c) {
    const fb = EX.ans != null;
    check = `<div class="check"><p class="q">${esc(c.q)}</p><div class="opts">${c.options.map((o, i) => `<button class="opt ${fb ? (i === c.answer ? 'right' : i === EX.ans ? 'wrong' : 'dim') : ''}" data-a="npick" data-i="${i}" ${fb ? 'disabled' : ''}><span class="okey mono">${i + 1}</span><span class="pt">${esc(o)}</span></button>`).join('')}</div>
      ${fb ? `<p class="${EX.ans === c.answer ? 'okt' : 'badt'}">${EX.ans === c.answer ? 'Correcto.' : 'La respuesta es «' + esc(c.options[c.answer]) + '».'}</p>` : ''}</div>`;
  }
  const canGo = !c || EX.ans != null;
  return `<div class="ex note-ex"><div class="eyebrow">Nota de gramática ${g.divergent ? '<span class="chip c-div">Distinto del español</span>' : ''}</div><h2 class="ntitle">${esc(g.title)}</h2><div class="prose">${md(g.body)}</div>${g.table ? gTable(g.table) : ''}${check}
    ${canGo ? `<div class="actions"><button class="btn primary xl" data-a="noteDone" data-autofocus><span>Continuar</span></button></div>` : ''}</div>`;
}
function vCard() {
  const ex = EX, t = ex.t, M = ex.M, it = ex.item, isV = ex.ref.kind === 'v';
  let h = '';
  switch (t) {
    case 'reconocer':
      h = `<div class="eyebrow">Ronda rápida · ¿qué significa?</div><div class="word pt center">${esc(it.pt)}</div>${sayRow(alts(it.pt)[0], M)}<p class="muted small center">Se parece al español. Responde rápido.</p>${optsHtml(ex.opts)}`; break;
    case 'elegir':
      if (isV) h = `<div class="eyebrow">¿Qué significa?</div><div class="word pt center">${esc(it.pt)}</div>${sayRow(alts(it.pt)[0], M)}${optsHtml(ex.opts)}`;
      else h = `<div class="eyebrow">Elige</div><p class="q">${esc(it.q)}</p>${it.pt ? `<p class="pt big">${esc(it.pt)}</p>` : ''}${optsHtml(ex.opts)}`;
      break;
    case 'escuchar':
      h = `<div class="eyebrow">Escucha y elige el significado</div><div class="listen">${sayRow(alts(it.pt)[0], M, true)}</div>${ex.phase === 'fb' ? `<div class="word pt center">${esc(it.pt)}</div>` : ''}${optsHtml(ex.opts)}`; break;
    case 'escribir':
      h = `<div class="eyebrow">Escribe en portugués</div><p class="prompt">${esc(it.es)}</p>${ex.phase === 'ask' ? typeForm('Tu respuesta') : ''}`; break;
    case 'completar':
      h = `<div class="eyebrow">Completa la frase</div><p class="cloze pt">${esc(ex.before)}<span class="gap">${ex.phase === 'fb' ? esc(ex.answers[0]) : '____'}</span>${esc(ex.after)}</p><p class="es">${esc(ex.es)}</p>${ex.hint && ex.phase === 'ask' ? `<p class="muted small">Pista: ${esc(ex.hint)}</p>` : ''}${ex.phase === 'ask' ? typeForm('Palabra que falta') : ''}`; break;
    case 'ordenar': {
      const fb = ex.phase === 'fb';
      h = `<div class="eyebrow">Ordena la frase</div><p class="es prompt">${esc(ex.es)}</p>
        <div class="oline ${fb ? (ex.correct ? 'ok' : 'bad') : ''}" aria-label="Tu frase">${ex.picked.length ? ex.picked.map((ti, j) => `<button class="tok on pt" data-a="ounpick" data-j="${j}" ${fb ? 'disabled' : ''}>${esc(ex.tokens[ti])}</button>`).join('') : '<span class="muted small">Toca las palabras en orden</span>'}</div>
        <div class="otoks">${ex.pool.map(ti => ex.picked.includes(ti) ? `<span class="tok ghost pt" aria-hidden="true">${esc(ex.tokens[ti])}</span>` : `<button class="tok pt" data-a="opick" data-i="${ti}" ${fb ? 'disabled' : ''}>${esc(ex.tokens[ti])}</button>`).join('')}</div>
        ${fb ? '' : `<div class="row"><button class="btn primary grow" data-a="ocheck" ${ex.picked.length === ex.tokens.length ? '' : 'disabled'}>Comprobar</button><button class="btn ghost" data-a="giveup">No lo sé</button></div>`}`;
      break;
    }
    case 'dictado':
      h = `<div class="eyebrow">Dictado · escribe lo que oyes</div><div class="listen">${sayRow(ex.text, M, true)}</div>${ex.phase === 'ask' ? typeForm('Escribe la frase', true) : ''}`; break;
    case 'traducir':
      h = `<div class="eyebrow">${ex.dir === 'pt-es' ? 'Traduce al español' : 'Traduce al portugués'}</div><p class="prompt ${ex.dir === 'pt-es' ? 'pt' : ''}">${esc(ex.prompt)}</p>${ex.phase === 'ask' ? typeForm(ex.dir === 'pt-es' ? 'Tu traducción' : 'Em português', true) : ''}`; break;
    case 'pron-pair':
      h = `<div class="eyebrow">Pronunciación · ¿qué palabra oyes?</div><div class="listen">${sayRow(it.pair[ex.target], M, true)}</div><p class="muted small center">${esc(TAG_LABEL[it.focus] || '')}</p>${optsHtml(ex.opts, 'pt-opts')}`; break;
    case 'pron-quiz':
      h = `<div class="eyebrow">Pronunciación</div><div class="word pt center">${esc(it.pt)}</div><p class="q">${esc(it.quiz.q)}</p>${optsHtml(ex.opts)}`; break;
    case 'pron-listen':
      h = `<div class="eyebrow">Pronunciación · ¿qué palabra oyes?</div><div class="listen">${sayRow(ex.sayText, M, true)}</div>${optsHtml(ex.opts, 'pt-opts')}`; break;
    case 'pron-sr': {
      h = `<div class="eyebrow">Pronunciación · dilo en voz alta</div><div class="word pt center">${esc(it.pt)}</div>${sayRow(ex.sayText, M)}<p class="tip">${esc(it.tip)}</p>
        ${ex.phase === 'ask' ? `<button class="mic-btn ${ex.listening ? 'live' : ''}" data-a="mic" aria-label="Hablar">${I.mic}<span>${ex.listening ? 'Escuchando…' : 'Toca y habla'}</span></button>${ex.heard != null ? `<p class="heard">Entendí: «<span class="pt">${esc(ex.heard || '…')}</span>». ${ex.tries < 2 ? 'Prueba otra vez.' : ''}</p>` : ''}${ex.tries >= 1 ? `<button class="link center" data-a="srSelf">Calificarme yo</button>` : ''}` : ''}`;
      break;
    }
    case 'pron-self': {
      const p = FSRS.previews(getCard(ex.task.id), Date.now());
      h = `<div class="eyebrow">Pronunciación · escucha y repite</div><div class="word pt center">${esc(it.pt)}</div>${sayRow(ex.sayText, M, true)}<p class="tip">${esc(it.tip)}</p>
        <p class="muted small center">${M.audio ? 'Escúchala, repítela en voz alta dos veces y compara.' : 'Léela en voz alta dos veces siguiendo el consejo.'} ¿Cómo te salió?</p>
        ${ui.mode === 'test' ? '' : `<div class="rate">${[1, 2, 3, 4].map(g => `<button class="rbtn r${g}" data-a="rate" data-g="${g}"><span>${['', 'Me costó', 'Regular', 'Bien', 'Perfecto'][g]}</span><small class="mono">${g === 1 ? 'repite hoy' : fmtIv(p[g].iv)}</small></button>`).join('')}</div>`}`;
      break;
    }
  }
  return `<div class="ex">${h}</div>`;
}
function statusText() {
  const l = EX.lvl;
  if (l === 'ok') return 'Correcto';
  if (l === 'accent') return 'Correcto, pero revisa los acentos';
  if (l === 'typo') return 'Casi: un pequeño error';
  if (l === 'self') return 'Calificación automática';
  return EX.input === '' ? 'Esta es la respuesta' : 'No es correcto';
}
function suggestGrade() {
  const l = EX.lvl;
  if (!EX.correct) return 1;
  if (l === 'typo') return 2;
  const fast = EX.opts ? EX.ms < 3500 : EX.ms < 7000;
  return l === 'ok' && fast && !EX.task.first ? 4 : 3;
}
function cognateOpt() { return { cognate: EX.ref && EX.ref.kind === 'v' && EX.item.kind === 'parecida' && EX.t === 'reconocer' }; }
function vSheet() {
  const ex = EX, it = ex.item, isV = ex.ref.kind === 'v', M = ex.M;
  let d = '';
  if (isV && (ex.t === 'reconocer' || ex.task.first)) d = presentation(it, M);
  else if (isV) {
    d = `<div class="fbw"><span class="pt fbword">${esc(it.pt)}</span>${M.audio ? `<button class="icon-btn small" data-a="say" data-t="${esc(alts(it.pt)[0])}" aria-label="Escuchar">${I.play}</button>` : ''}<span class="muted">${esc(it.es)}</span></div>`;
    if (['dictado', 'traducir', 'ordenar'].includes(ex.t) && ex.input != null && !ex.correct) d += `<p class="diff pt">${diffWords(ex.input, ex.exp || ex.answers[0]).map(w => `<span class="${w.ok ? '' : 'miss'}">${esc(w.w)}</span>`).join(' ')}</p>`;
    if (ex.input && !ex.correct && ex.t !== 'ordenar') d += `<p class="small muted">Tu respuesta: <span class="pt">${esc(ex.input)}</span></p>`;
    d += `<div class="exbox sm"><p class="pt">${esc(it.ex)}</p>${M.audio ? `<button class="icon-btn small" data-a="say" data-t="${esc(it.ex)}" aria-label="Escuchar la frase">${I.play}</button>` : ''}<p class="es">${esc(it.exEs)}</p></div>`;
    if (it.kind === 'falso' && it.trap) d += `<p class="trap">Ojo: no significa «${esc(it.trap)}».</p>`;
  } else {
    let main = '';
    if (ex.answers) {
      const exp = ex.exp || ex.answers[0];
      const full = ex.t === 'completar' ? ex.before + exp + ex.after : exp;
      main = `<p class="fbsent ${ex.dir === 'pt-es' ? '' : 'pt'}">${esc(full)}</p>${M.audio && ex.dir !== 'pt-es' ? `<button class="icon-btn small" data-a="say" data-t="${esc(ex.dir === 'pt-es' ? it.pt : full)}" aria-label="Escuchar">${I.play}</button>` : ''}`;
      if (!ex.correct && ex.input && ex.sentence) main += `<p class="diff pt">${diffWords(ex.input, exp).map(w => `<span class="${w.ok ? '' : 'miss'}">${esc(w.w)}</span>`).join(' ')}</p><p class="small muted">Tu respuesta: <span class="pt">${esc(ex.input)}</span></p>`;
      else if (!ex.correct && ex.input) main += `<p class="small muted">Tu respuesta: <span class="pt">${esc(ex.input)}</span></p>`;
      if (ex.es && ex.t === 'completar') main += `<p class="es">${esc(ex.es)}</p>`;
      if (ex.dir === 'pt-es') main += `<p class="pt small">${esc(it.pt)}</p>`;
    } else if (ex.t === 'ordenar') {
      main = `<p class="fbsent pt">${esc(ex.sentenceText)}</p>${M.audio ? `<button class="icon-btn small" data-a="say" data-t="${esc(ex.sentenceText)}" aria-label="Escuchar">${I.play}</button>` : ''}<p class="es">${esc(ex.es)}</p>`;
    } else if (ex.opts) {
      const right = ex.opts.find(o => o.ok);
      main = `<p class="fbsent">${esc(right.txt)}</p>`;
      if (ex.t === 'pron-pair' || ex.t === 'pron-listen' || ex.t === 'pron-quiz') main += `<p class="tip">${esc(it.tip)}</p>`;
    } else if (ex.t === 'pron-sr') main = `<p class="tip">${esc(it.tip)}</p>`;
    if (it.explain) main += `<p class="note">${esc(it.explain)}</p>`;
    d = main;
  }
  let foot;
  if (ui.mode === 'test') foot = `<button class="btn primary block" data-a="next" data-autofocus>Siguiente</button>`;
  else if (ex.auto && !ex.showRates) {
    const p = FSRS.previews(getCard(ex.task.id), Date.now(), cognateOpt());
    foot = `<div class="row between"><span class="small">${['', 'Otra vez', 'Difícil', 'Bien', 'Fácil'][ex.auto]} · próximo repaso: <strong class="mono">${ex.auto === 1 ? 'hoy' : fmtIv(p[ex.auto].iv)}</strong></span><button class="link" data-a="showRates">Cambiar</button></div><button class="btn primary block" data-a="rate" data-g="${ex.auto}" data-autofocus>Siguiente</button>`;
  } else {
    const p = FSRS.previews(getCard(ex.task.id), Date.now(), cognateOpt()), sug = ex.auto || suggestGrade();
    foot = `<div class="rate">${[1, 2, 3, 4].map(g => `<button class="rbtn r${g} ${g === sug ? 'sug' : ''}" data-a="rate" data-g="${g}" ${g === sug ? 'data-autofocus' : ''}><span>${['', 'Otra vez', 'Difícil', 'Bien', 'Fácil'][g]}</span><small class="mono">${g === 1 ? 'repite hoy' : fmtIv(p[g].iv)}</small></button>`).join('')}</div>`;
  }
  return `<div class="sheet ${ex.correct ? 'is-ok' : 'is-bad'}" role="region" aria-live="polite" aria-label="Resultado"><div class="sheet-in"><div class="sheet-head">${ex.correct ? I.check : I.cross}<strong>${esc(statusText())}</strong></div><div class="sheet-body">${d}</div>${foot}</div></div>`;
}
function vDlg() {
  const ex = EX, d = ex.item, M = ex.M, sp = d.speakers || {};
  const name = s => esc(sp[s] || s);
  const lines = (showPt, showEs) => `<ol class="dlines">${d.lines.map((l, i) => `<li class="dl ${ex.playing === i ? 'now' : ''} s-${esc(l.s)}"><span class="who">${name(l.s)}</span><div class="dtext">${showPt ? `<p class="pt">${esc(l.pt)}</p>` : '<p class="dots" aria-label="Texto oculto">• • •</p>'}${showEs || ex.open[i] ? `<p class="es small">${esc(l.es)}</p>` : ''}</div>${showPt ? `<span class="dact">${M.audio ? `<button class="icon-btn small" data-a="say" data-t="${esc(l.pt)}" aria-label="Escuchar línea">${I.play}</button>` : ''}${showEs ? '' : `<button class="icon-btn small tr" data-a="dline" data-i="${i}" aria-label="Ver traducción">es</button>`}</span>` : ''}</li>`).join('')}</ol>`;
  const head = `<div class="eyebrow">Diálogo · ${unitLabel(C.items[d.id].unit)}</div><h2 class="dtitle pt">${esc(d.title)}</h2>${d.setting ? `<p class="muted small">${esc(d.setting)}</p>` : ''}`;
  if (ex.stage === 'listen') {
    return `<div class="ex">${head}<p class="small">Escucha sin leer. Puedes repetirlo las veces que quieras.</p>
      <div class="row"><button class="btn primary" data-a="dplay" data-slow="0">${I.play}<span>${ex.plays ? 'Otra vez' : 'Escuchar'}</span></button><button class="btn" data-a="dplay" data-slow="1"><span class="mono">${ST.settings.slowRate}×</span><span>Lento</span></button>${ex.playing >= 0 ? `<button class="btn ghost" data-a="dstop">${I.stop}<span>Parar</span></button>` : ''}</div>
      ${lines(false, false)}<div class="actions"><button class="btn primary xl" data-a="dq"><span>Responder preguntas</span></button></div></div>`;
  }
  if (ex.stage === 'read') {
    return `<div class="ex">${head}<p class="small">Lee el diálogo. Toca «es» solo si de verdad no entiendes una línea.</p>${lines(true, false)}<div class="actions"><button class="btn primary xl" data-a="dq"><span>Responder preguntas</span></button></div></div>`;
  }
  if (ex.stage === 'q') {
    const q = d.questions[ex.qi], fb = ex.ans != null;
    return `<div class="ex">${head}<p class="eyebrow">Pregunta ${ex.qi + 1} de ${d.questions.length}</p><p class="q">${esc(q.q)}</p>
      <div class="opts">${q.options.map((o, i) => `<button class="opt ${fb ? (i === q.answer ? 'right' : i === ex.ans ? 'wrong' : 'dim') : ''}" data-a="dpick" data-i="${i}" ${fb ? 'disabled' : ''}><span class="okey mono">${i + 1}</span><span>${esc(o)}</span></button>`).join('')}</div>
      ${fb ? `<p class="${ex.ans === q.answer ? 'okt' : 'badt'}">${ex.ans === q.answer ? 'Correcto.' : 'Era: «' + esc(q.options[q.answer]) + '».'}</p><div class="actions"><button class="btn primary xl" data-a="dnext" data-autofocus><span>${ex.qi + 1 < d.questions.length ? 'Siguiente pregunta' : 'Ver el diálogo completo'}</span></button></div>` : (M.audio ? `<button class="link" data-a="dplay" data-slow="0">Escuchar otra vez</button>` : `<button class="link" data-a="dback">Volver a leer</button>`)}</div>`;
  }
  return `<div class="ex">${head}<p class="small">Transcripción y traducción. Escucha cada línea y fíjate en lo que no entendiste.</p>${lines(true, true)}<div class="actions"><button class="btn primary xl" data-a="dlgDone" data-autofocus><span>Continuar</span></button></div></div>`;
}
function vShadow() {
  const ex = EX, l = ex.line, M = ex.M, d = ex.item, sp = (d.speakers || {})[l.s] || l.s;
  const head = `<div class="eyebrow">Shadowing · línea ${ex.task.line + 1} de ${d.lines.length}</div><p class="muted small">${esc(sp)} en «${esc(d.title)}»</p>`;
  const esLine = `<button class="link" data-a="sEs">${ex.showEs ? esc(l.es) : 'Ver traducción'}</button>`;
  if (ex.stage === 'result') {
    return `<div class="ex">${head}<p class="sline pt">${esc(l.pt)}</p><p class="es">${esc(l.es)}</p>
      ${ex.input != null ? `<p class="diff pt">${diffWords(ex.input, l.pt).map(w => `<span class="${w.ok ? '' : 'miss'}">${esc(w.w)}</span>`).join(' ')}</p><p class="${ex.correct ? 'okt' : 'badt'}">${ex.correct ? 'Muy bien.' : 'Las palabras marcadas faltaron o cambiaron.'}</p>` : ''}
      ${ex.heard != null ? `<p class="heard">Entendí: «<span class="pt">${esc(ex.heard)}</span>» · ${Math.round(ex.score * 100)} % de las palabras</p>` : ''}
      <div class="actions"><button class="btn primary xl" data-a="shDone" data-autofocus><span>Continuar</span></button></div></div>`;
  }
  if (M.speak) {
    const srBlock = M.sr ? `<button class="mic-btn ${ex.listening ? 'live' : ''}" data-a="smic">${I.mic}<span>${ex.listening ? 'Escuchando…' : 'Toca y repite'}</span></button>` : '';
    return `<div class="ex">${head}<p class="sline pt">${esc(l.pt)}</p>${esLine}
      ${M.audio ? `<ol class="steps"><li>Escúchala lento y sigue el texto.</li><li>Escúchala a velocidad normal.</li><li>Repítela en voz alta al mismo tiempo o justo después, imitando ritmo y entonación.</li></ol>${sayRow(l.pt, M, true)}` : `<ol class="steps"><li>Léela en silencio una vez.</li><li>Léela en voz alta dos veces, cuidando los sonidos nasales y las vocales finales.</li></ol>`}
      ${srBlock}<p class="muted small center">${M.sr ? 'O califícate tú:' : '¿Cómo te salió?'}</p>
      <div class="row three"><button class="btn" data-a="sself" data-v="2">Bien</button><button class="btn" data-a="sself" data-v="1">Más o menos</button><button class="btn ghost" data-a="sself" data-v="0">Repetir</button></div></div>`;
  }
  if (M.audio) {
    return `<div class="ex">${head}<p class="small">Sin hablar: escucha la línea y escríbela.</p><div class="listen">${sayRow(l.pt, M, true)}</div><form class="typeform" data-f="shType"><textarea id="ans" class="ta input pt" rows="2" lang="pt-BR" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Escribe lo que oyes" data-autofocus></textarea>${accentBar()}<button class="btn primary block">Comprobar</button></form></div>`;
  }
  if (!ex.covered) return `<div class="ex">${head}<p class="small">Lee la línea con atención. Después se ocultará y la escribirás de memoria.</p><p class="sline pt">${esc(l.pt)}</p>${esLine}<div class="actions"><button class="btn primary xl" data-a="sCover" data-autofocus><span>Ocultar y escribir</span></button></div></div>`;
  return `<div class="ex">${head}<p class="small">Escribe la línea de memoria.</p><p class="es">${esc(l.es)}</p><form class="typeform" data-f="shType"><textarea id="ans" class="ta input pt" rows="2" lang="pt-BR" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Em português" data-autofocus></textarea>${accentBar()}<button class="btn primary block">Comprobar</button></form></div>`;
}
function vProd() {
  const ex = EX, p = ex.item, M = ex.M;
  if (ex.stage === 'result') {
    const kws = p.keywords || [], txt = fold(ex.text || '');
    return `<div class="ex"><div class="eyebrow">Producción</div><p class="prompt">${esc(p.prompt)}</p>
      ${ex.text ? `<div class="mine"><span class="eyebrow">Tu frase</span><p class="pt">${esc(ex.text)}</p></div>` : ''}
      <div class="model"><span class="eyebrow">Un modelo posible</span><p class="pt">${esc(p.model)}</p>${M.audio ? sayRow(p.model, M) : ''}</div>
      ${kws.length && ex.text ? `<div class="kws">${kws.map(k => { const ok = txt.includes(fold(k)); return `<span class="chip ${ok ? 'c-done' : 'c-pend'}">${ok ? '✓' : '·'} ${esc(k)}</span>`; }).join('')}</div>` : ''}
      <p class="muted small">Tu frase puede ser distinta al modelo y estar bien. ¿Cómo te fue?</p>
      <div class="row three"><button class="btn" data-a="pself" data-v="2">Bien</button><button class="btn" data-a="pself" data-v="1">Regular</button><button class="btn ghost" data-a="pself" data-v="0">Me costó</button></div></div>`;
  }
  return `<div class="ex"><div class="eyebrow">Producción · ${M.speak ? 'habla' : 'escribe'}</div><p class="prompt">${esc(p.prompt)}</p>
    <p class="muted small">${M.speak ? (M.sr ? 'Toca el micrófono y di 1 o 2 frases. Puedes corregir el texto reconocido.' : 'Di 1 o 2 frases en voz alta. Si quieres, escríbelas también para compararlas.') : 'Escribe 1 o 2 frases en portugués.'}</p>
    ${M.sr ? `<button class="mic-btn ${ex.listening ? 'live' : ''}" data-a="pmic">${I.mic}<span>${ex.listening ? 'Escuchando…' : 'Toca y habla'}</span></button>` : ''}
    <textarea id="prodtext" class="ta input pt" rows="3" lang="pt-BR" autocapitalize="sentences" autocorrect="off" spellcheck="false" data-bind="EX.text" placeholder="Em português…" ${M.speak ? '' : 'data-autofocus'}>${esc(ex.text)}</textarea>${accentBar()}
    <button class="btn primary block" data-a="pModel">Ver modelo</button></div>`;
}

/* ---------- sesión: acciones ---------- */
function startSession(mode) {
  const m = { speak: mode.speak, audio: mode.audio && Speech.ok, sr: mode.speak && SR.available() };
  const plan = planSession({ st: ST, srsAll: srsAll(), C, mode: m, now: Date.now() });
  ST.session = { id: Date.now(), day: todayIdx(), startedAt: Date.now(), mode: { speak: mode.speak, audio: mode.audio }, tasks: plan.tasks, i: 0, activeMs: 0, phaseMs: {}, counts: { ans: 0, ok: 0, nw: 0 }, info: plan.info };
  if (ST.focusUnit && plan.info.unit !== ST.focusUnit) ST.focusUnit = null;
  saveState(); enterPractice('session');
}
function advance() {
  Speech.stop(); SR.stop();
  if (ui.mode === 'session') {
    const s = ST.session; s.i++;
    while (s.i < s.tasks.length && s.tasks[s.i].ph === 'rev' && s.tasks[s.i].k === 'card' && (s.phaseMs.rev || 0) > 450000) s.i++;
    if (s.i >= s.tasks.length) return finishSession();
    saveState();
  } else if (ui.mode === 'test') {
    ui.test.i++;
    if (ui.test.i >= ui.test.tasks.length) return finishTest();
  }
  EX = null; render(); window.scrollTo(0, 0);
}
function requeue(task) {
  const s = ST.session, n = (task.rq || 0) + 1; if (n > 2) return;
  let end = s.tasks.length; for (let j = s.i + 1; j < s.tasks.length; j++) if (s.tasks[j].k === 'phase') { end = j; break; }
  const pos = Math.min(s.i + 5, end);
  s.tasks.splice(pos, 0, { k: 'card', ph: task.ph, id: task.id, t: easierType(task, C), rq: n });
}
function finishSession() {
  const s = ST.session; if (!s) { go('home'); return null; }
  touchStreak(); dayRec().ses++;
  const sa = srsAll(), fc = forecast(C, sa, todayIdx(), 2);
  ST.lastSummary = { ms: s.activeMs || 0, ans: s.counts.ans, ok: s.counts.ok, nw: s.counts.nw, unit: s.info.unit, tomorrow: fc[1], day: todayIdx() };
  ST.session = null; pruneDays(); saveState(); Store.flushSoon(100);
  ui.mode = null; ui.view = 'summary'; EX = null; render(); window.scrollTo(0, 0);
  return null;
}
function rate(g) {
  const ex = EX; if (!ex || ex.rated) return; ex.rated = true;
  if (ui.mode === 'test') { advance(); return; }
  const id = ex.task.id, card = getCard(id);
  if (ex.t === 'pron-self') ex.correct = g >= 2;
  if (ex.correct == null) ex.correct = g >= 2;
  const nc = FSRS.apply(card, g, Date.now(), cognateOpt()); nc.lt = ex.t;
  setCard(id, nc);
  if (!card) { dayRec().nw++; if (ST.session) ST.session.counts.nw++; }
  record(ex.t, ex.correct);
  if (g === 1 && ui.mode === 'session') requeue(ex.task);
  advance();
}
function finishAsk(lvl, extra) {
  const ex = EX; ex.phase = 'fb'; ex.lvl = lvl; ex.correct = isCorrect(lvl); ex.ms = Date.now() - ex.start;
  Object.assign(ex, extra || {});
  if (ui.mode === 'test') { ui.test.results.push({ id: ex.task.id, ok: ex.correct, t: ex.t, input: ex.input, exp: ex.exp }); }
  if (ex.t === 'reconocer' && ui.mode === 'session') ex.auto = !ex.correct ? 1 : ex.ms < 3500 ? 4 : 3;
  if (ex.M.audio && ex.ref && ex.ref.kind === 'v' && ['escribir', 'completar', 'reconocer', 'elegir'].includes(ex.t)) setTimeout(() => Speech.say(alts(ex.item.pt)[0]), 120);
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  render();
}
function checkTyped(input) {
  const ex = EX, es = ex.dir === 'pt-es';
  const answers = es ? esAnswers(ex.answers) : ex.answers;
  const r = grade(input, answers, { sentence: !!ex.sentence, es });
  finishAsk(r.lvl, { input, exp: r.exp });
}
function finishTest() {
  const t = ui.test; if (!t) { go('home'); return null; }
  const n = t.results.length, ok = t.results.filter(r => r.ok).length, pct = n ? Math.round(ok / n * 100) : 0, pass = pct >= 75;
  if (t.kind === 'unit') {
    const us = ustate(t.ref); const e = us.eval || {}; e.last = pct; e.best = Math.max(e.best || 0, pct); e.n = (e.n || 0) + 1; if (pass && !e.passedAt) e.passedAt = Date.now(); us.eval = e;
    const T = todayIdx();
    for (const r of t.results) if (!r.ok) { const c = getCard(r.id); if (c && c.due > T) { c.due = T; setCard(r.id, c); } }
  } else {
    const ls = ST.levels[t.ref] || (ST.levels[t.ref] = {}); ls.last = pct; ls.best = Math.max(ls.best || 0, pct);
    if (pass && !ls.passedAt) { ls.passedAt = Date.now(); const nx = LEVELS[LEVELS.indexOf(t.ref) + 1]; if (nx && LEVELS.indexOf(ST.unlockedLevel) < LEVELS.indexOf(nx)) ST.unlockedLevel = nx; }
  }
  saveState();
  ui.result = { kind: t.kind, ref: t.ref, pct, ok, n, pass, wrong: t.results.filter(r => !r.ok) };
  ui.test = null; ui.mode = null; ui.view = 'testresult'; EX = null; render(); window.scrollTo(0, 0);
  return null;
}
function vSummary() {
  const s = ST.lastSummary || { ms: 0, ans: 0, ok: 0, nw: 0 };
  const sa = srsAll(), uid = s.unit, p = uid && C.units[uid] ? unitProgress(C.units[uid], sa[uid], ST.units[uid]) : null;
  return `<div class="summary">${waves(34, 'ws')}<div class="solo"><p class="eyebrow">Sesión terminada</p><h1 class="pt done-t">Sessão concluída!</h1>
    <div class="tiles four">
      <div class="tile"><span class="tile-num">${Math.max(1, Math.round(s.ms / 60000))}</span><span class="tile-lbl">minutos</span></div>
      <div class="tile"><span class="tile-num">${s.ok}<small>/${s.ans}</small></span><span class="tile-lbl">respuestas correctas</span></div>
      <div class="tile"><span class="tile-num">${s.nw}</span><span class="tile-lbl">ítems nuevos</span></div>
      <div class="tile"><span class="tile-ic sun">${I.flame}</span><span class="tile-num">${currentStreak()}</span><span class="tile-lbl">días de racha</span></div>
    </div>
    <p class="muted">${s.tomorrow ? `Mañana te esperan unos ${s.tomorrow} repasos.` : 'Mañana no tienes repasos programados todavía.'} Volver a diario es lo que más ayuda a la memoria.</p>
    ${p && p.allIntro && !p.passed ? `<button class="btn primary xl" data-a="evalStart" data-id="${uid}"><span>Mini evaluación de ${unitLabel(uid)}</span><small>Ya viste todo el contenido · 12 preguntas</small></button>` : ''}
    <button class="btn ${p && p.allIntro && !p.passed ? '' : 'primary'} xl" data-a="nav" data-v="home"><span>Volver al inicio</span></button></div></div>`;
}
function vTestResult() {
  const r = ui.result; if (!r) { ui.view = 'home'; return vShell(); }
  const title = r.kind === 'unit' ? 'Mini evaluación · ' + unitLabel(r.ref) : 'Examen ' + r.ref;
  const nx = LEVELS[LEVELS.indexOf(r.ref) + 1];
  return `<div class="solo"><header class="phead"><button class="icon-btn" data-a="nav" data-v="home" aria-label="Cerrar">${I.x}</button><h1>${esc(title)}</h1></header>
    <div class="score ${r.pass ? 'pass' : 'fail'}"><span class="score-n mono">${r.pct}<small>%</small></span><span class="chip ${r.pass ? 'c-done' : 'c-false'}">${r.pass ? 'Aprobado' : 'Aún no'}</span><p>${r.ok} de ${r.n} correctas · se aprueba con 75 %</p>
    ${r.pass ? `<p class="muted">${r.kind === 'unit' ? 'Unidad completada. ¡Muito bem!' : (nx ? `Desbloqueaste el nivel ${nx}.` : 'Cerraste el nivel B2. Parabéns!')}</p>` : `<p class="muted">${r.kind === 'unit' ? 'Las preguntas falladas volvieron a tus repasos de hoy. Inténtalo de nuevo en uno o dos días.' : 'Repasa unos días y vuelve a intentarlo.'}</p>`}</div>
    ${r.wrong.length ? `<h2 class="sec">Para repasar</h2><div class="vlist">${r.wrong.map(w => { const it = C.items[w.id] && C.items[w.id].it; return it ? `<div class="vrow"><span class="pt">${esc(it.pt || it.q || '')}</span><span class="muted">${esc(it.es || (it.options ? it.options[it.answer] : '') || '')}</span></div>` : ''; }).join('')}</div>` : ''}
    <button class="btn primary xl" data-a="nav" data-v="home"><span>Volver al inicio</span></button></div>`;
}

/* ---------- prueba de nivel ---------- */
function vPlacement() {
  const p = ui.place;
  if (p.stage === 'intro') return `<div class="solo"><header class="phead"><button class="icon-btn" data-a="nav" data-v="home" aria-label="Cerrar">${I.x}</button><h1>Prueba de nivel</h1></header>
    <p class="lede">16 preguntas de A1 a B2, unos 4 minutos. No hay retroalimentación hasta el final. Si no sabes una respuesta, elige «No lo sé»: adivinar distorsiona el resultado.</p>
    <button class="btn primary xl" data-a="placeGo"><span>Empezar</span></button></div>`;
  if (p.stage === 'q') {
    const q = PLACEMENT[p.i];
    return `<div class="solo"><header class="ptop"><button class="icon-btn" data-a="nav" data-v="home" aria-label="Salir">${I.x}</button><div class="pbar"><i style="width:${Math.round(p.i / PLACEMENT.length * 100)}%"></i></div><span class="ptag mono">${p.i + 1}/${PLACEMENT.length}</span></header>
      <div class="ex"><p class="q pt">${esc(q.q)}</p><div class="opts">${q.options.map((o, i) => `<button class="opt" data-a="placePick" data-i="${i}"><span class="okey mono">${i + 1}</span><span class="pt">${esc(o)}</span></button>`).join('')}<button class="opt ghost" data-a="placePick" data-i="-1"><span class="okey mono">?</span><span>No lo sé</span></button></div></div></div>`;
  }
  const r = p.result;
  return `<div class="solo"><header class="phead"><button class="icon-btn" data-a="nav" data-v="home" aria-label="Cerrar">${I.x}</button><h1>Tu resultado</h1></header>
    <div class="panel">${LEVELS.map(L => `<div class="lv"><span class="lv-name">${L}</span><span class="lv-bar"><i style="width:${r.byL[L] / 4 * 100}%"></i></span><span class="lv-pct mono">${r.byL[L]}/4</span></div>`).join('')}</div>
    <p class="lede">${r.start === 'A1' ? 'Lo mejor es empezar por A1. Las palabras parecidas al español avanzarán rápido.' : `Dominas lo esencial de ${r.passed}. Puedes desbloquear hasta ${r.start}.`}</p>
    ${r.start !== 'A1' ? `<p class="muted small">Desbloquear no borra nada: A1 sigue disponible. Las unidades de ${r.start} se activan cuando importes su paquete.</p><button class="btn primary xl" data-a="placeApply"><span>Desbloquear hasta ${r.start}</span></button>` : ''}
    <button class="btn ${r.start === 'A1' ? 'primary' : ''} xl" data-a="placeKeep"><span>${r.start === 'A1' ? 'Empezar en A1' : 'Empezar en A1 de todos modos'}</span></button></div>`;
}

/* ---------- acciones ---------- */
function getPath(path) { return path.split('.').reduce((o, k) => (o ? o[k] : undefined), path.startsWith('EX.') ? { EX } : ui); }
function setPath(path, val) {
  const parts = path.split('.'); let o = path.startsWith('EX.') ? { EX } : ui;
  for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
  if (o) o[parts[parts.length - 1]] = val;
}
async function copyText(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg || 'Copiado'); }
  catch (e) {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e2) { } ta.remove();
    toast(ok ? (okMsg || 'Copiado') : 'No pude copiar. Usa «Mostrar texto» y cópialo a mano.');
  }
}
function packReport(text) {
  let obj;
  try { obj = parseLooseJSON(text); } catch (e) { return { error: e.message }; }
  const v = validatePack(obj, C);
  const summary = v.units.map(u => {
    const old = C.units[u.id];
    let status = 'nueva';
    if (old) {
      const oldIds = new Set([...(old.vocab || []), ...(old.exercises || [])].map(x => x.id));
      const nw = [...(u.vocab || []), ...(u.exercises || [])].filter(x => !oldIds.has(x.id)).length;
      const same = Store.get('unit.' + u.id) && Store.get('unit.' + u.id).hash === hashStr(JSON.stringify(u));
      status = same ? 'sin cambios (ya importada)' : `actualiza la versión actual · ${plural(nw, 'ítem nuevo', 'ítems nuevos')}, el progreso se conserva`;
    }
    return { id: u.id, title: u.title, v: (u.vocab || []).length, g: (u.grammar || []).length, e: (u.exercises || []).length, d: (u.dialogues || []).length, status };
  });
  return { errors: v.errors, warnings: v.warnings, summary, units: v.units, packId: obj.packId };
}
function backupReport(text) {
  let obj; try { obj = parseLooseJSON(text); } catch (e) { return { errors: [e.message] }; }
  const errs = validateBackup(obj); if (errs.length) return { errors: errs };
  let cards = 0; const cnt = srs => { for (const u in srs || {}) cards += Object.keys(srs[u] || {}).length; };
  let who;
  if (obj.version === 1) { cnt(obj.srs); who = '1 perfil'; }
  else { obj.profiles.forEach(p => cnt(p.srs)); who = obj.profiles.map(p => p.name).join(', '); }
  return { errors: [], obj, at: obj.exportedAt, cards, units: Object.keys(obj.units || {}).length, who };
}
const A = {
  nav(el) { ui.confirmReset = false; ui.confirmDiscard = false; go(el.dataset.v); },
  unit(el) { go('unit', { unit: el.dataset.id }); },
  say(el) { Speech.say(el.dataset.t, { slow: el.dataset.slow === '1' }); },
  start() {
    if (!ui.ready) return;
    if (ST.session) { enterPractice('session'); return; }
    go('checkin', { checkin: { for: 'session', speak: null, audio: null } });
  },
  discardAsk() { ui.confirmDiscard = true; render(); },
  discardNo() { ui.confirmDiscard = false; render(); },
  discard() { ST.session = null; ui.confirmDiscard = false; saveState(); render(); },
  ci(el) { ui.checkin[el.dataset.q] = el.dataset.v === '1'; render(); },
  ciGo() {
    const c = ui.checkin; if (c.speak == null || c.audio == null) return;
    if (c.audio && !Speech.ok) toast('Este navegador no tiene voz: usaré transcripciones.');
    if (c.for === 'session') startSession(c);
    else {
      const mode = { speak: c.speak, audio: c.audio && Speech.ok, sr: c.speak && SR.available() };
      const ctx = { st: ST, srsAll: srsAll(), C, mode, now: Date.now() };
      const tasks = c.for === 'unit' ? planUnitEval(c.ref, ctx) : planLevelExam(c.ref, ctx);
      if (!tasks.length) { toast('No hay suficientes preguntas disponibles para esta evaluación.'); go('home'); return; }
      ui.test = { kind: c.for, ref: c.ref, mode: { speak: c.speak, audio: c.audio }, tasks, i: 0, results: [] };
      enterPractice('test');
    }
  },
  evalStart(el) { if (!ui.ready) return; go('checkin', { checkin: { for: 'unit', ref: el.dataset.id, speak: null, audio: null } }); },
  examStart(el) { if (!ui.ready) return; go('checkin', { checkin: { for: 'level', ref: el.dataset.l, speak: null, audio: null } }); },
  pause() { Speech.stop(); SR.stop(); if (ui.mode === 'session') { saveState(); Store.flushSoon(50); toast('Sesión pausada. Puedes continuar cuando quieras.'); } ui.mode = null; ui.test = null; EX = null; go('home'); },
  next() { advance(); },
  pick(el) {
    if (!EX || EX.phase !== 'ask') return;
    const i = +el.dataset.i, o = EX.opts[i]; EX.pick = i;
    finishAsk(o.ok ? 'ok' : 'wrong', { input: o.txt });
  },
  rate(el) { rate(+el.dataset.g); },
  showRates() { EX.showRates = true; render(); },
  introDone() {
    const id = EX.task.id;
    if (!getCard(id)) { const T = todayIdx(); setCard(id, { reps: 0, s: 0, d: 0, due: T, last: T, lapses: 0, intro: T }); dayRec().nw++; if (ST.session) ST.session.counts.nw++; }
    advance();
  },
  npick(el) { if (EX.ans != null) return; EX.ans = +el.dataset.i; render(); },
  noteDone() { const uid = C.items[EX.task.id].unit, us = ustate(uid); us.notes = us.notes || []; if (!us.notes.includes(EX.task.id)) us.notes.push(EX.task.id); advance(); },
  acc(el) {
    const inp = document.getElementById('ans') || document.getElementById('prodtext'); if (!inp) return;
    const c = el.dataset.c, s = inp.selectionStart != null ? inp.selectionStart : inp.value.length, e = inp.selectionEnd != null ? inp.selectionEnd : inp.value.length;
    inp.value = inp.value.slice(0, s) + c + inp.value.slice(e); inp.focus(); try { inp.setSelectionRange(s + 1, s + 1); } catch (x) { }
    if (inp.id === 'prodtext' && EX) EX.text = inp.value;
  },
  giveup() { if (!EX || EX.phase !== 'ask') return; finishAsk('wrong', { input: '', exp: EX.answers ? EX.answers[0] : EX.sentenceText }); },
  opick(el) { EX.picked.push(+el.dataset.i); render(); },
  ounpick(el) { EX.picked.splice(+el.dataset.j, 1); render(); },
  ocheck() {
    const built = EX.picked.map(i => EX.tokens[i]).join(' ');
    const r = grade(built, [EX.sentenceText], { sentence: false });
    finishAsk(r.lvl === 'ok' || r.lvl === 'accent' ? 'ok' : 'wrong', { input: built });
  },
  mic() {
    const ex = EX; if (ex.listening) { SR.stop(); return; }
    ex.listening = true; render();
    SR.listen({
      onResult(altsList) { const m = srMatch(altsList, ex.sayText); ex.heard = m.heard; ex.tries++; if (m.score >= 0.8) { ex.listening = false; finishAsk('ok', { input: m.heard }); } else if (ex.tries >= 3) { ex.listening = false; finishAsk('wrong', { input: m.heard }); } },
      onError(err) { ex.listening = false; if (SR.state === 'off') { toast('Reconocimiento de voz no disponible: cambio a autoevaluación.'); ex.t = 'pron-self'; } render(); },
      onEnd() { if (ex.listening) { ex.listening = false; if (EX === ex && ex.phase === 'ask') render(); } }
    });
  },
  srSelf() { EX.t = 'pron-self'; render(); },
  dplay(el) {
    const ex = EX, d = ex.item, slow = el.dataset.slow === '1';
    ex.plays++; ex.playing = 0; render();
    Speech.sayLines(dialogueVoices(d), {
      slow, onLine(i) { if (EX !== ex) return; ex.playing = i; const els = app.querySelectorAll('.dl'); els.forEach((n, j) => n.classList.toggle('now', j === i)); },
      onDone() { if (EX !== ex) return; ex.playing = -1; render(); }
    });
  },
  dstop() { Speech.stop(); EX.playing = -1; render(); },
  dq() { Speech.stop(); EX.playing = -1; EX.stage = 'q'; EX.qi = 0; EX.ans = null; render(); },
  dback() { EX.stage = 'read'; render(); },
  dpick(el) { if (EX.ans != null) return; const q = EX.item.questions[EX.qi]; EX.ans = +el.dataset.i; record('dialogo', EX.ans === q.answer); render(); },
  dnext() { if (EX.qi + 1 < EX.item.questions.length) { EX.qi++; EX.ans = null; } else EX.stage = 'review'; render(); },
  dline(el) { const i = +el.dataset.i; EX.open[i] = !EX.open[i]; render(); },
  dlgDone() { const id = EX.task.id, r = ST.dlg[id] || {}; ST.dlg[id] = { n: (r.n || 0) + 1, last: todayIdx() }; advance(); },
  sEs() { EX.showEs = !EX.showEs; render(); },
  sCover() { EX.covered = true; render(); },
  smic() {
    const ex = EX; if (ex.listening) { SR.stop(); return; }
    ex.listening = true; render();
    SR.listen({
      onResult(a) { const m = srMatch(a, ex.line.pt); ex.listening = false; ex.heard = m.heard; ex.score = m.score; ex.correct = m.score >= 0.75; ex.stage = 'result'; record('shadowing', ex.correct); render(); },
      onError() { ex.listening = false; if (SR.state === 'off') { toast('Reconocimiento de voz no disponible: califícate tú.'); ex.M.sr = false; } render(); },
      onEnd() { if (ex.listening) { ex.listening = false; if (EX === ex) render(); } }
    });
  },
  sself(el) {
    const v = +el.dataset.v;
    if (v === 0) { if (EX.M.audio) Speech.say(EX.line.pt, { slow: true }); toast('Escúchala otra vez y repite.'); return; }
    record('shadowing', v === 2); EX.correct = v === 2; advance();
  },
  shDone() { advance(); },
  pmic() {
    const ex = EX; if (ex.listening) { SR.stop(); return; }
    const ta = document.getElementById('prodtext'); if (ta) ex.text = ta.value;
    ex.listening = true; render();
    SR.listen({
      onResult(a) { ex.listening = false; ex.text = (ex.text ? ex.text + ' ' : '') + (a[0] || ''); render(); },
      onError() { ex.listening = false; if (SR.state === 'off') { toast('Reconocimiento de voz no disponible: escribe o di tu frase en voz alta.'); ex.M.sr = false; } render(); },
      onEnd() { if (ex.listening) { ex.listening = false; if (EX === ex) render(); } }
    });
  },
  pModel() {
    const ta = document.getElementById('prodtext'); if (ta) EX.text = ta.value.trim();
    if (!EX.M.speak && !EX.text) { toast('Escribe al menos una frase antes de ver el modelo.'); return; }
    EX.stage = 'result'; render();
  },
  pself(el) {
    const v = +el.dataset.v, ex = EX, id = ex.task.id;
    record('produccion', v >= 1);
    const r = ST.prod[id] || {}; ST.prod[id] = { n: (r.n || 0) + 1, last: todayIdx() };
    if (ex.text) { ST.prodLog.unshift({ d: todayIdx(), id, text: ex.text.slice(0, 400), self: v }); ST.prodLog = ST.prodLog.slice(0, 60); }
    advance();
  },
  focus(el) { ST.focusUnit = el.dataset.id; saveState(); toast('Tus próximas palabras nuevas vendrán de ' + unitLabel(el.dataset.id) + '.'); render(); },
  placeStart() { go('placement', { place: { stage: 'intro', i: 0, answers: [] } }); },
  placeSkip() { ST.placementSkip = true; saveState(); render(); },
  placeGo() { ui.place.stage = 'q'; render(); },
  placePick(el) { const p = ui.place; p.answers[p.i] = +el.dataset.i; p.i++; if (p.i >= PLACEMENT.length) { p.result = placementResult(p.answers); p.stage = 'result'; } render(); },
  placeApply() {
    const r = ui.place.result; ST.placement = { doneAt: Date.now(), start: r.start, byL: r.byL };
    if (LEVELS.indexOf(r.start) > LEVELS.indexOf(ST.unlockedLevel)) ST.unlockedLevel = r.start;
    const first = CURRICULUM.find(c => c.level === r.start && C.units[c.id]); if (first) ST.focusUnit = first.id;
    saveState(); toast('Desbloqueado hasta ' + r.start + '.'); go('home');
  },
  placeKeep() { const r = ui.place.result; ST.placement = { doneAt: Date.now(), start: r.start, byL: r.byL }; saveState(); go('home'); },
  packCheck() { const ta = document.getElementById('pack-text'); ui.add.text = ta ? ta.value : ui.add.text; ui.add.report = packReport(ui.add.text); render(); },
  packImport() {
    const r = ui.add.report; if (!r || r.errors.length || !ui.ready) return;
    const done = [];
    for (const u of r.units) {
      const h = hashStr(JSON.stringify(u)), prev = Store.get('unit.' + u.id);
      if (prev && prev.hash === h) { done.push(unitLabel(u.id) + ' (sin cambios)'); continue; }
      Store.put('unit.' + u.id, { unit: u, packId: r.packId, importedAt: Date.now(), hash: h });
      done.push(unitLabel(u.id));
    }
    rebuildContent(); ui.add = { text: '', report: null };
    toast('Importado: ' + done.join(', ')); render();
  },
  copySpec() { copyText(PACK_SPEC, 'Especificación copiada'); },
  pickProfile(el) { switchProfile(el.dataset.id); go('home'); toast('Perfil: ' + Profiles.active().name); },
  profEdit(el) { const p = Profiles.list().find(x => x.id === el.dataset.id); if (!p) return; Object.assign(ui.prof, { edit: p.id, editName: p.name, editColor: p.color || 0, del: null }); render(); },
  profEditNo() { ui.prof.edit = null; render(); },
  profDel(el) { ui.prof.del = el.dataset.id; ui.prof.edit = null; render(); },
  profDelNo() { ui.prof.del = null; render(); },
  profDelGo(el) { const p = Profiles.list().find(x => x.id === el.dataset.id); deleteProfile(el.dataset.id); ui.prof.del = null; toast('Perfil «' + (p ? p.name : '') + '» borrado'); render(); },
  pickColor(el) { setPath(el.dataset.bind, +el.dataset.c); render(); },
  copyAsk() { copyText(nextAsk(), 'Pedido copiado: pégalo en otro chat'); },
  backupCopy() { copyText(JSON.stringify(buildBackup()), 'Respaldo copiado'); },
  backupShow() { ui.backup.out = JSON.stringify(buildBackup()); render(); const el = document.getElementById('backup-out'); if (el) el.select(); },
  async backupDownload() {
    const name = 'ponte-respaldo-' + dayKey(todayIdx()) + '.json', data = JSON.stringify(buildBackup(), null, 1);
    if (Caps.downloads) {
      try { await Caps.downloads.save({ filename: name, data }); toast('Respaldo guardado'); }
      catch (e) { if (e && e.code === 'declined') return; toast('No se pudo descargar. Usa «Copiar al portapapeles».'); }
      return;
    }
    if (IN_ARTIFACT) return;
    const blob = new Blob([data], { type: 'application/json' });
    try {
      const file = new File([blob], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Respaldo de Ponte' }); toast('Respaldo listo'); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try {
      const url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000); toast('Respaldo descargado');
    } catch (e) { toast('No se pudo descargar. Usa «Copiar al portapapeles».'); }
  },
  backupCheck() { const ta = document.getElementById('backup-text'); ui.backup.text = ta ? ta.value : ui.backup.text; ui.backup.report = backupReport(ui.backup.text); ui.backup.confirm = false; render(); },
  restoreAsk() { ui.backup.confirm = true; render(); },
  restoreNo() { ui.backup.confirm = false; render(); },
  restoreGo() {
    const r = ui.backup.report; if (!r || !r.obj) return; const o = r.obj;
    if (o.version === 1) restoreInto(Profiles.activeId(), o.state, o.srs);
    else {
      const keep = new Set(o.profiles.map(p => p.id));
      for (const p of Profiles.list()) if (!keep.has(p.id)) purgeProfileDocs(p.id);
      Profiles.save(o.profiles.map(p => ({ id: p.id, name: String(p.name).slice(0, 24), color: (+p.color || 0) % 4 })), keep.has(o.active) ? o.active : o.profiles[0].id);
      for (const p of o.profiles) restoreInto(p.id, p.state, p.srs);
    }
    for (const id in (o.units || {})) Store.put('unit.' + id, { unit: o.units[id], packId: 'respaldo', importedAt: Date.now(), hash: hashStr(JSON.stringify(o.units[id])) });
    rebuildContent(); loadProfile();
    ui.backup = { text: '', report: null, confirm: false, out: '' }; toast('Respaldo restaurado'); go('home');
  },
  newPer(el) { ST.settings.newPer = clamp(ST.settings.newPer + (+el.dataset.d), 5, 10); saveState(); render(); },
  set(el) { const k = el.dataset.k; let v = el.dataset.v; if (k === 'slowRate') v = +v; ST.settings[k] = v; saveState(); if (k === 'theme') applyTheme(); render(); },
  srTest() {
    ST.srBlocked = false; SR.detect(); render();
    if (!SR.available()) { toast(SR.reason); return; }
    toast('Di «bom dia»…');
    SR.listen({ onResult(a) { toast('Entendí: «' + (a[0] || '') + '». Funciona.'); render(); }, onError(e) { toast(SR.state === 'off' ? SR.reason : 'No te escuché (' + e + '). Intenta otra vez.'); render(); } });
  },
  resetAsk() { ui.confirmReset = true; render(); },
  resetNo() { ui.confirmReset = false; render(); },
  resetGo() {
    const keepTheme = ST.settings;
    ST = freshState(); ST.settings = keepTheme;
    for (const k of Object.keys(Store.docs)) if (k.startsWith(P('srs.'))) Store.put(k, { cards: {} });
    saveState(); ui.confirmReset = false; toast('Progreso borrado'); go('home');
  }
};
const F = {
  type() { const inp = document.getElementById('ans'); if (!inp || !EX || EX.phase !== 'ask') return; const v = inp.value; if (!v.trim()) { inp.focus(); return; } checkTyped(v); },
  shType() {
    const inp = document.getElementById('ans'); const v = inp ? inp.value : ''; if (!v.trim()) return;
    const r = grade(v, [EX.line.pt], { sentence: true }); EX.input = v; EX.correct = isCorrect(r.lvl); EX.stage = 'result'; record('shadowing', EX.correct); render();
  },
  profAdd() {
    const name = String(ui.prof.newName || '').trim().slice(0, 24); if (!name) { toast('Escribe un nombre para el perfil.'); return; }
    const list = Profiles.list().slice(); if (list.length >= MAX_PROFILES) return;
    list.push({ id: 'p' + Date.now().toString(36), name, color: (+ui.prof.newColor || 0) % 4 });
    Profiles.save(list); ui.prof.newName = ''; ui.prof.newColor = list.length % 4;
    toast('Perfil «' + name + '» creado'); render();
  },
  profRename(f) {
    const id = f.dataset.id, name = String(ui.prof.editName || '').trim().slice(0, 24); if (!name) return;
    Profiles.save(Profiles.list().map(p => p.id === id ? Object.assign({}, p, { name, color: (+ui.prof.editColor || 0) % 4 }) : p));
    ui.prof.edit = null; render();
  },
  inputAdd() {
    const f = ui.inputForm, min = parseInt(f.min, 10);
    if (!f.title.trim() || !(min > 0)) { toast('Escribe un título y los minutos.'); return; }
    ST.inputLog.unshift({ d: todayIdx(), type: f.type, title: f.title.trim().slice(0, 120), min: Math.min(600, min), note: (f.note || '').trim().slice(0, 200) });
    ST.inputLog = ST.inputLog.slice(0, 200); saveState();
    ui.inputForm = { type: f.type, title: '', min: '', note: '' }; toast('Registrado'); render();
  }
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el || el.disabled) return;
  const fn = A[el.dataset.a]; if (!fn) return;
  e.preventDefault(); fn(el, e);
});
document.addEventListener('submit', e => { const f = e.target; if (f.dataset && f.dataset.f) { e.preventDefault(); const fn = F[f.dataset.f]; if (fn) fn(f); } });
document.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('.acc')) e.preventDefault(); Activity.ping(); }, true);
document.addEventListener('input', e => { const t = e.target; if (t.dataset && t.dataset.bind) setPath(t.dataset.bind, t.value); });
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset && t.dataset.bind) setPath(t.dataset.bind, t.value);
  if (t.dataset && t.dataset.set) { ST.settings[t.dataset.set] = t.value; saveState(); }
  if (t.dataset && t.dataset.file && t.files && t.files[0]) {
    const which = t.dataset.file, rd = new FileReader();
    rd.onload = () => { const txt = String(rd.result || ''); if (which === 'pack') { ui.add.text = txt; ui.add.report = packReport(txt); } else { ui.backup.text = txt; ui.backup.report = backupReport(txt); } render(); };
    rd.readAsText(t.files[0]);
  }
});
document.addEventListener('keydown', e => {
  Activity.ping();
  if (ui.view !== 'practice' || !EX) return;
  const tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
  if (EX.phase === 'fb' && EX.task.k === 'card' && ui.mode === 'session' && /^[1-4]$/.test(e.key) && !(EX.auto && !EX.showRates)) { e.preventDefault(); rate(+e.key); return; }
  if (EX.phase === 'ask' && EX.opts && /^[1-5]$/.test(e.key)) { const b = app.querySelector(`.opt[data-i="${+e.key - 1}"]`); if (b) { e.preventDefault(); b.click(); } }
});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && ST) { saveState(); Store.flush(); } });

/* ---------- arranque ---------- */
async function boot() {
  Store.loadLocal();
  rebuildContent(); loadProfile(); Speech.init();
  render();
  if (window.claude && typeof window.claude.use === 'function') window.claude.use('downloads').then(d => { Caps.downloads = d; if (ui.view === 'backup') render(); }).catch(() => { });
  await Store.connect();
  if (!IN_ARTIFACT) {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
    try { if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js'); } catch (e) { }
  }
  rebuildContent(); ui.ready = true; loadProfile();
  if (Profiles.list().length > 1 && ui.view === 'home') ui.view = 'who';
  if (ui.view !== 'practice') render();
}
boot();
