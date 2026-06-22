// functions/api/scores.js — Cloudflare Pages Function backing the breakout leaderboard.
//
//   GET  /api/scores?pseudo=NAME      → { top, me, around }
//   POST /api/scores { pseudo, score, level, time }
//        → upsert best-per-pseudo, returns { top, me, around, updated }
//
// `top`    : top 10 rows (rank 1..10)
// `me`     : the queried pseudo's row { rank, pseudo, score } or null
// `around` : 3 rows centred on `me` (rank me-1..me+1), only when me.rank > 10
//            (lets the client render top3 + "…" + neighbourhood)
//
// Bound to a D1 database via the `DB` binding (see wrangler.toml).
// Anti-cheat is deliberately light: the game runs client-side so any score is forgeable.
// We sanity-cap, rate-limit per IP, and filter pseudos — enough for a fun easter-egg board.

const PSEUDO_RE = /^[A-Za-z0-9_-]{2,16}$/;
const MAX_SCORE = 25000;
const MAX_LEVEL = 3;
const RATE_MAX = 30;          // max rows from one IP within the window
const RATE_WINDOW = 3600;     // seconds

const BLOCKLIST = [
  'fuck', 'shit', 'bitch', 'asshole', 'nigger', 'faggot', 'cunt', 'whore', 'rape',
  'putain', 'merde', 'connard', 'connasse', 'salope', 'encule', 'enculer', 'pute',
  'batard', 'nique', 'pd',
];

function isProfane(lower) {
  return BLOCKLIST.some((w) => lower.includes(w));
}

async function hashIp(ip, salt) {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// Rows in canonical order (score DESC, oldest first), with absolute rank attached.
async function rows(env, offset, limit) {
  const off = Math.max(0, offset);
  const { results } = await env.DB.prepare(
    'SELECT display AS pseudo, score, level FROM scores ORDER BY score DESC, created_at ASC LIMIT ? OFFSET ?'
  ).bind(limit, off).all();
  return (results || []).map((r, i) => ({ rank: off + 1 + i, ...r }));
}

async function rankOf(env, score) {
  const r = await env.DB.prepare('SELECT COUNT(*) + 1 AS rank FROM scores WHERE score > ?').bind(score).first();
  return r ? r.rank : 1;
}

// Assemble the leaderboard view for an optional "me" key (lowercased pseudo).
async function viewFor(env, meKey) {
  const top = await rows(env, 0, 10);
  let me = null, around = null;
  if (meKey) {
    const meRow = await env.DB.prepare('SELECT display, score FROM scores WHERE pseudo = ?').bind(meKey).first();
    if (meRow) {
      const rank = await rankOf(env, meRow.score);
      me = { rank, pseudo: meRow.display, score: meRow.score };
      if (rank > 10) around = await rows(env, rank - 2, 3); // ranks me-1 .. me+1
    }
  }
  return { top, me, around };
}

export async function onRequestGet({ request, env }) {
  const raw = (new URL(request.url).searchParams.get('pseudo') || '').trim();
  const meKey = PSEUDO_RE.test(raw) ? raw.toLowerCase() : null;
  return json(await viewFor(env, meKey));
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }

  const display = String(body.pseudo ?? '').trim();
  const score = Math.floor(Number(body.score));
  const level = Math.floor(Number(body.level));
  const timeMs = Math.max(0, Math.floor(Number(body.time) || 0));

  // ── Validation ────────────────────────────────────────────────
  if (!PSEUDO_RE.test(display)) return json({ error: 'bad_pseudo' }, 400);
  const key = display.toLowerCase();
  if (isProfane(key)) return json({ error: 'pseudo_rejected' }, 400);
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) return json({ error: 'bad_score' }, 400);
  if (!Number.isFinite(level) || level < 1 || level > MAX_LEVEL) return json({ error: 'bad_level' }, 400);

  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const ipHash = await hashIp(ip, env.IP_SALT || 'breakout-leaderboard');
  const now = Math.floor(Date.now() / 1000);

  // ── Rate limit per IP (blocks pseudo-flooding) ────────────────
  const rl = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM scores WHERE ip_hash = ? AND created_at > ?'
  ).bind(ipHash, now - RATE_WINDOW).first();
  if (rl && rl.n >= RATE_MAX) return json({ error: 'rate_limited' }, 429);

  // ── Upsert best-per-pseudo (only overwrite when the new score is higher) ──
  await env.DB.prepare(
    `INSERT INTO scores (pseudo, display, score, level, time_ms, ip_hash, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(pseudo) DO UPDATE SET
       display    = excluded.display,
       score      = excluded.score,
       level      = excluded.level,
       time_ms    = excluded.time_ms,
       ip_hash    = excluded.ip_hash,
       created_at = excluded.created_at
     WHERE excluded.score > scores.score`
  ).bind(key, display, score, level, timeMs, ipHash, now).run();

  const stored = await env.DB.prepare('SELECT score FROM scores WHERE pseudo = ?').bind(key).first();
  const view = await viewFor(env, key);
  return json({ ...view, updated: stored ? stored.score === score : false });
}
