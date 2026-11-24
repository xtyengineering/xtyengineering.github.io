import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const model = "text-embedding-3-small";
const dimensions = 256;
const corpus = JSON.parse(readFileSync(new URL("./corpus.json", import.meta.url)));
const inputs = corpus.map(chunk => [
  chunk.title.zh,
  chunk.title.en,
  chunk.text.zh,
  chunk.text.en,
  `Scope: ${chunk.scope.zh} ${chunk.scope.en}`
].join("\n"));

assert.equal(inputs.length, 8);
assert(inputs.every(text => text.length > 100));

if (process.argv.includes("--dry-run")) {
  console.log(`DRY RUN: ${inputs.length} chunks -> ${model} (${dimensions} dimensions)`);
  console.log(`Payload text: ${inputs.reduce((total, text) => total + text.length, 0)} characters`);
  console.log(`First chunk: ${corpus[0].id}, ${inputs[0].length} characters`);
  process.exit(0);
}

assert(process.env.OPENAI_API_KEY, "Set OPENAI_API_KEY before generating embeddings");

const response = await fetch("https://api.openai.com/v1/embeddings", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ model, dimensions, encoding_format: "float", input: inputs })
});

if (!response.ok) throw new Error(`OpenAI embeddings request failed (${response.status}): ${await response.text()}`);

const result = await response.json();
assert.equal(result.data.length, corpus.length);

const items = result.data
  .sort((a, b) => a.index - b.index)
  .map((item, index) => {
    assert.equal(item.embedding.length, dimensions);
    assert(item.embedding.every(Number.isFinite));
    return { id: corpus[index].id, embedding: item.embedding };
  });

writeFileSync(new URL("./embeddings.json", import.meta.url), `${JSON.stringify({
  model,
  dimensions,
  created_at: new Date().toISOString(),
  usage: result.usage,
  items
}, null, 2)}\n`);

console.log(`PASS: wrote ${items.length} embeddings with ${dimensions} dimensions to ai-rag/embeddings.json`);
