import corpus from "../corpus.json" with { type: "json" };

const model = "@cf/baai/bge-m3";
const allowedOrigin = "https://xtyengineering.github.io";

const embeddingText = chunk => [
  chunk.title.zh,
  chunk.title.en,
  chunk.text.zh,
  chunk.text.en,
  chunk.scope.zh,
  chunk.scope.en
].join("\n");

export const cosineSimilarity = (left, right) => {
  if (!left.length || left.length !== right.length) throw new Error("Embedding dimensions do not match");
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  return dot / Math.sqrt(leftMagnitude * rightMagnitude);
};

export const rankVectors = (queryVector, vectors) => vectors
  .map((vector, index) => ({ index, score: cosineSimilarity(queryVector, vector) }))
  .sort((left, right) => right.score - left.score);

const headers = origin => ({
  "Access-Control-Allow-Origin": origin === allowedOrigin ? origin : allowedOrigin,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Vary": "Origin"
});

const json = (body, status = 200, origin = allowedOrigin) => new Response(JSON.stringify(body), {
  status,
  headers: headers(origin)
});

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || allowedOrigin;
    if (origin !== allowedOrigin) return json({ error: "Origin not allowed" }, 403, origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(origin) });

    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, model, chunks: corpus.length }, 200, origin);
    }
    if (request.method !== "POST" || url.pathname !== "/search") {
      return json({ error: "Use POST /search" }, 404, origin);
    }

    const { query } = await request.json().catch(() => ({}));
    if (typeof query !== "string" || query.trim().length < 2 || query.length > 300) {
      return json({ error: "Query must contain 2 to 300 characters" }, 400, origin);
    }

    // ponytail: re-embed 8 documents per query; cache vectors when the corpus grows.
    const embeddings = await env.AI.run(model, {
      text: [query.trim(), ...corpus.map(embeddingText)]
    });
    if (!Array.isArray(embeddings.data) || embeddings.data.length !== corpus.length + 1) {
      throw new Error("Unexpected embedding response");
    }

    const [queryVector, ...documentVectors] = embeddings.data;
    const matches = rankVectors(queryVector, documentVectors).slice(0, 3).map(({ index, score }) => ({
      id: corpus[index].id,
      score: Number(score.toFixed(4)),
      title: corpus[index].title,
      text: corpus[index].text,
      scope: corpus[index].scope,
      source: corpus[index].source
    }));

    return json({ model, matches }, 200, origin);
  }
};
