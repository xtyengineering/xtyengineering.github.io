import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("./index.js", import.meta.url), "utf8");
const corpus = JSON.parse(readFileSync(new URL("../corpus.json", import.meta.url), "utf8"));
const bundled = source.replace(
  'import corpus from "../corpus.json" with { type: "json" };',
  `const corpus = ${JSON.stringify(corpus)};`
);

writeFileSync(new URL("./dashboard.js", import.meta.url), bundled);
