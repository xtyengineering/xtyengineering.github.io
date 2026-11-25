import corpus from "../corpus.json" with { type: "json" };

const embeddingModel = "@cf/baai/bge-m3";
const generationModel = "@cf/google/gemma-4-26b-a4b-it";
const minimumScore = 0.55;
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

export const isCovered = matches => Boolean(matches[0] && matches[0].score >= minimumScore);

export const buildMessages = (query, matches) => {
  const language = /[\u3400-\u9fff]/.test(query) ? "Chinese" : "English";
  const evidence = matches.map((match, index) => [
    `[${index + 1}] ${match.title.zh} / ${match.title.en}`,
    match.text.zh,
    match.text.en,
    `Scope: ${match.scope.zh} / ${match.scope.en}`
  ].join("\n")).join("\n\n");
  return [
    {
      role: "system",
      content: `You are a cautious welding knowledge-base assistant. Answer in ${language}. Use only the supplied evidence. Cite claims with [1], [2] or [3]. Do not invent requirements, parameters, standards or approvals. Keep the answer concise.`
    },
    { role: "user", content: `Question:\n${query}\n\nEvidence:\n${evidence}` }
  ];
};

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
      return json({ ok: true, embeddingModel, generationModel, chunks: corpus.length }, 200, origin);
    }
    if (request.method !== "POST" || url.pathname !== "/search") {
      return json({ error: "Use POST /search" }, 404, origin);
    }

    const { query } = await request.json().catch(() => ({}));
    if (typeof query !== "string" || query.trim().length < 2 || query.length > 300) {
      return json({ error: "Query must contain 2 to 300 characters" }, 400, origin);
    }

    // ponytail: re-embed 8 documents per query; cache vectors when the corpus grows.
    const embeddings = await env.AI.run(embeddingModel, {
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

    if (!isCovered(matches)) {
      return json({ embeddingModel, generationModel, covered: false, generated: false, answer: null, matches }, 200, origin);
    }

    // ponytail: one grounded generation call; add streaming only when latency becomes a real problem.
    const completion = await env.AI.run(generationModel, {
      messages: buildMessages(query.trim(), matches),
      max_completion_tokens: 240,
      temperature: 0.1,
      chat_template_kwargs: { enable_thinking: false }
    });
    const answer = completion.response || completion.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) throw new Error("Unexpected generation response");

    return json({
      embeddingModel,
      generationModel,
      covered: true,
      generated: true,
      answer: answer.trim(),
      matches
    }, 200, origin);
  }
};
