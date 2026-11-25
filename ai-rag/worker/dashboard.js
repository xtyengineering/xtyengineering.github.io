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

const rowToChunk = row => ({
  id: row.id,
  title: { zh: row.title_zh, en: row.title_en },
  text: { zh: row.text_zh, en: row.text_en },
  scope: { zh: row.scope_zh, en: row.scope_en },
  source: { page: row.source_page, url: row.source_url, section: row.source_section }
});

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
      content: `You are a cautious welding knowledge-base assistant. Answer in ${language}. Use only the supplied evidence. Cite claims with [1], [2] or [3]. Do not invent requirements, parameters, standards or approvals. Keep the answer concise. Return plain text only: no Markdown, LaTeX, dollar-delimited math or backslash commands. Write formulas with Unicode symbols and /, for example: Arc energy = 60 × U × I / (1000 × v) kJ/mm.`
    },
    { role: "user", content: `Question:\n${query}\n\nEvidence:\n${evidence}` }
  ];
};

const headers = origin => ({
  "Access-Control-Allow-Origin": origin === allowedOrigin ? origin : allowedOrigin,
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Vary": "Origin"
});

const json = (body, status = 200, origin = allowedOrigin) => new Response(JSON.stringify(body), {
  status,
  headers: headers(origin)
});

const getChunksByIds = async (db, ids) => {
  if (!ids.length) return [];
  const placeholders = ids.map(() => "?").join(",");
  const { results } = await db.prepare(`SELECT * FROM chunks WHERE is_public = 1 AND id IN (${placeholders})`)
    .bind(...ids)
    .all();
  const byId = new Map(results.map(row => [row.id, rowToChunk(row)]));
  return ids.map(id => byId.get(id)).filter(Boolean);
};

const reindex = async env => {
  const { results } = await env.DB.prepare("SELECT * FROM chunks WHERE is_public = 1 ORDER BY id").all();
  const chunks = results.map(rowToChunk);
  const embeddings = await env.AI.run(embeddingModel, { text: chunks.map(embeddingText) });
  if (!Array.isArray(embeddings.data) || embeddings.data.length !== chunks.length) {
    throw new Error("Unexpected embedding response");
  }
  await env.VECTOR_INDEX.upsert(chunks.map((chunk, index) => ({ id: chunk.id, values: embeddings.data[index] })));
  return chunks.length;
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || allowedOrigin;
    if (origin !== allowedOrigin) return json({ error: "Origin not allowed" }, 403, origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(origin) });

    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM chunks WHERE is_public = 1").first();
      return json({ ok: true, dataBackend: "Cloudflare Vectorize + D1", embeddingModel, generationModel, chunks: row?.count || 0 }, 200, origin);
    }

    if (request.method === "POST" && url.pathname === "/admin/reindex") {
      if (!env.ADMIN_TOKEN || request.headers.get("Authorization") !== `Bearer ${env.ADMIN_TOKEN}`) {
        return json({ error: "Unauthorized" }, 401, origin);
      }
      const indexed = await reindex(env);
      return json({ ok: true, indexed, embeddingModel }, 200, origin);
    }

    if (request.method !== "POST" || url.pathname !== "/search") {
      return json({ error: "Use POST /search" }, 404, origin);
    }

    const { query } = await request.json().catch(() => ({}));
    if (typeof query !== "string" || query.trim().length < 2 || query.length > 300) {
      return json({ error: "Query must contain 2 to 300 characters" }, 400, origin);
    }

    const embeddings = await env.AI.run(embeddingModel, { text: [query.trim()] });
    const queryVector = embeddings.data?.[0];
    if (!Array.isArray(queryVector)) throw new Error("Unexpected embedding response");

    const vectorResult = await env.VECTOR_INDEX.query(queryVector, { topK: 3 });
    const vectorMatches = vectorResult.matches || [];
    const chunks = await getChunksByIds(env.DB, vectorMatches.map(match => match.id));
    const scores = new Map(vectorMatches.map(match => [match.id, Number(match.score.toFixed(4))]));
    const matches = chunks.map(chunk => ({ ...chunk, score: scores.get(chunk.id) || 0 }));

    if (!isCovered(matches)) {
      return json({ dataBackend: "Cloudflare Vectorize + D1", embeddingModel, generationModel, covered: false, generated: false, answer: null, matches }, 200, origin);
    }

    const completion = await env.AI.run(generationModel, {
      messages: buildMessages(query.trim(), matches),
      max_completion_tokens: 240,
      temperature: 0.1,
      chat_template_kwargs: { enable_thinking: false }
    });
    const answer = completion.response || completion.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) throw new Error("Unexpected generation response");

    return json({ dataBackend: "Cloudflare Vectorize + D1", embeddingModel, generationModel, covered: true, generated: true, answer: answer.trim(), matches }, 200, origin);
  }
};
