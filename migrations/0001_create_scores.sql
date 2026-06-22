-- Breakout leaderboard — best score per pseudo.
-- `pseudo` is the lowercased key (case-insensitive uniqueness); `display` keeps the casing entered.
CREATE TABLE IF NOT EXISTS scores (
  pseudo     TEXT    PRIMARY KEY,   -- lowercased, unique key
  display    TEXT    NOT NULL,      -- pseudo as entered (for rendering)
  score      INTEGER NOT NULL,
  level      INTEGER NOT NULL DEFAULT 1,
  time_ms    INTEGER,
  ip_hash    TEXT,                  -- salted SHA-256, never the raw IP (GDPR)
  created_at INTEGER NOT NULL       -- epoch seconds
);

CREATE INDEX IF NOT EXISTS idx_scores_score   ON scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_ip_time ON scores(ip_hash, created_at);
