CREATE TABLE IF NOT EXISTS chunks (
  id TEXT PRIMARY KEY,
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  text_zh TEXT NOT NULL,
  text_en TEXT NOT NULL,
  scope_zh TEXT NOT NULL,
  scope_en TEXT NOT NULL,
  source_page TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_section TEXT NOT NULL,
  standards_json TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
