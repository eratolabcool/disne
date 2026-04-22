-- ================================================================
-- Solitaire Arena — D1 数据库 Schema
-- Cloudflare Workers + D1 (SQLite)
-- ================================================================

CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id TEXT NOT NULL,
  leaderboard_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  moves INTEGER NOT NULL,
  time_ms INTEGER NOT NULL,
  seed INTEGER,
  played_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_scores_lb_score ON scores(leaderboard_id, score ASC);
CREATE INDEX IF NOT EXISTS idx_scores_player ON scores(player_id, leaderboard_id);
CREATE INDEX IF NOT EXISTS idx_scores_date ON scores(date(played_at), leaderboard_id);

-- ================================================================
-- 多人对战房间
-- 确定性种子同步：所有人玩同一副牌，各自上报进度
-- ================================================================

CREATE TABLE IF NOT EXISTS rooms (
  code TEXT PRIMARY KEY,
  game TEXT NOT NULL DEFAULT 'klondike',
  seed INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting',
  max_players INTEGER NOT NULL DEFAULT 8,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  started_at TEXT,
  finished_at TEXT
);

CREATE TABLE IF NOT EXISTS room_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_code TEXT NOT NULL REFERENCES rooms(code),
  player_id TEXT NOT NULL,
  moves INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  time_ms INTEGER NOT NULL DEFAULT 0,
  finished INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT,
  UNIQUE(room_code, player_id)
);

CREATE INDEX IF NOT EXISTS idx_rp_room ON room_players(room_code);
CREATE INDEX IF NOT EXISTS idx_rp_finished ON room_players(room_code, finished);
