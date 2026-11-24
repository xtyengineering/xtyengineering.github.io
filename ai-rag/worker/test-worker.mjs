import assert from "node:assert/strict";
import { cosineSimilarity, rankVectors } from "./index.js";

assert.equal(cosineSimilarity([1, 0], [1, 0]), 1);
assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
assert.deepEqual(rankVectors([1, 0], [[0, 1], [0.8, 0.2]]).map(result => result.index), [1, 0]);

console.log("PASS: cosine similarity and ranking order are correct.");
