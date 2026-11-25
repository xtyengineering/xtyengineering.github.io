import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const corpus = JSON.parse(readFileSync(new URL("./corpus.json", import.meta.url)));
const ids = new Set();

assert(corpus.length > 0, "the corpus must contain at least one chunk");

for (const chunk of corpus) {
  assert.match(chunk.id, /^[a-z0-9-]+$/);
  assert(!ids.has(chunk.id), `duplicate id: ${chunk.id}`);
  ids.add(chunk.id);

  for (const field of ["title", "text", "scope"]) {
    assert(chunk[field]?.zh?.trim(), `${chunk.id}: missing ${field}.zh`);
    assert(chunk[field]?.en?.trim(), `${chunk.id}: missing ${field}.en`);
  }

  assert(chunk.source?.page?.trim(), `${chunk.id}: missing source page`);
  assert(chunk.source?.section?.trim(), `${chunk.id}: missing source section`);
  assert.equal(new URL(chunk.source.url).protocol, "https:", `${chunk.id}: source URL must use HTTPS`);
  assert(chunk.standards?.length, `${chunk.id}: missing standards`);
}

console.log(`PASS: ${corpus.length} bilingual chunks, ${ids.size} unique IDs, all sources and boundaries present.`);
