# Breakout leaderboard — Cloudflare Pages Function + D1

The breakout game (`src/components/ui/KonamiGame.astro`, desktop only) posts scores to
`/api/scores`, backed by a D1 database. Mobile gets tic-tac-toe instead — no leaderboard.

## API

- `GET /api/scores?limit=20` → `{ top: [{ pseudo, score, level }] }`
- `POST /api/scores { pseudo, score, level, time }` → `{ rank, best, updated, top }`

Best-per-pseudo (case-insensitive key, original casing kept for display). Light anti-cheat:
score sanity-cap (`MAX_SCORE`), per-IP rate limit, FR/EN pseudo blocklist. IPs stored only as
a salted SHA-256 hash.

## Scoring (client, `KonamiGame.astro`)

`Σ brick points` (dominant) `+ 200×lives_left + 200×level_cleared + 5×seconds_under_par`,
across 3 levels of rising difficulty (ball speed, paddle width, share of 2-hp bricks).

## One-time setup

```bash
# 1. Create the D1 database, paste the returned database_id into wrangler.toml
npm run db:create

# 2. Apply the schema to the remote (production) database
npm run db:migrate

# 3. Bind it in the Cloudflare Pages project:
#    Dashboard → Pages → your project → Settings → Functions → D1 bindings
#    Variable name: DB   →   Database: breakout_leaderboard
#    (wrangler.toml covers local dev; the dashboard binding covers production)

# 4. (recommended) Set an IP hashing salt secret in the Pages project:
#    Settings → Environment variables → IP_SALT = <random string>
```

## Local development

```bash
npm run db:migrate:local   # seed the local (miniflare) D1 once
npm run cf:dev             # build + wrangler pages dev (serves Functions + static)
```

`npm run dev` (plain `astro dev`) does **not** serve `/functions` — the leaderboard fetch
fails gracefully (board shows "unavailable", the game stays playable). Use `cf:dev` to
exercise the API locally.
