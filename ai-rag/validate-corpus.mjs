import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const corpus = JSON.parse(readFileSync(new URL("./corpus.json", import.meta.url)));
const ids = new Set();

assert.equal(corpus.length, 8, "the MVP must contain exactly 8 chunks");

for (const chunk of corpus) {
  assert.match(chunk.id, /^[a-z0-9-]+$/);
  assert(!ids.has(chunk.id), `duplicate id: ${chunk.id}`);
  ids.add(chunk.id);

  for (const field of ["title", "text", "scope"]) {
    assert(chunk[field]?.zh?.trim(), `${chunk.id}: missing ${field}.zh`);
    assert(chunk[field]?.en?.trim(), `${chunk.id}: missing ${field}.en`);
  }

  assert(chunk.source?.page?.endsWith(".html"), `${chunk.id}: invalid source page`);
  const sourceFile = new URL(`../${chunk.source.page}`, import.meta.url);
  assert(existsSync(sourceFile), `${chunk.id}: source page not found`);
  const sourceHtml = readFileSync(sourceFile, "utf8");
  assert(chunk.source.section.split(" / ").some(section => sourceHtml.includes(section)), `${chunk.id}: source section not found`);
  assert.equal(new URL(chunk.source.url).pathname.slice(1), chunk.source.page, `${chunk.id}: source URL mismatch`);
  assert(chunk.standards?.length, `${chunk.id}: missing standards`);
}

console.log(`PASS: ${corpus.length} bilingual chunks, ${ids.size} unique IDs, all source pages found.`);
