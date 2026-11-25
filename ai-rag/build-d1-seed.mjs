import { readFileSync } from "node:fs";

const corpus = JSON.parse(readFileSync(new URL("./corpus.json", import.meta.url)));
const sql = value => `'${String(value).replaceAll("'", "''")}'`;

for (const chunk of corpus) {
  const values = [
    chunk.id,
    chunk.title.zh,
    chunk.title.en,
    chunk.text.zh,
    chunk.text.en,
    chunk.scope.zh,
    chunk.scope.en,
    chunk.source.page,
    chunk.source.url,
    chunk.source.section,
    JSON.stringify(chunk.standards)
  ].map(sql).join(", ");
  console.log(`INSERT INTO chunks (
    id, title_zh, title_en, text_zh, text_en, scope_zh, scope_en,
    source_page, source_url, source_section, standards_json
  ) VALUES (${values}) ON CONFLICT(id) DO UPDATE SET
    title_zh=excluded.title_zh, title_en=excluded.title_en,
    text_zh=excluded.text_zh, text_en=excluded.text_en,
    scope_zh=excluded.scope_zh, scope_en=excluded.scope_en,
    source_page=excluded.source_page, source_url=excluded.source_url,
    source_section=excluded.source_section, standards_json=excluded.standards_json,
    updated_at=CURRENT_TIMESTAMP;`);
}
