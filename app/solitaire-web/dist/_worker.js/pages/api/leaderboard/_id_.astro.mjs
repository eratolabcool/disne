globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params, url, locals }) => {
  const db = locals.runtime.env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB unavailable" }), { status: 503 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: "missing id" }), { status: 400 });
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const size = Math.min(100, Math.max(1, parseInt(url.searchParams.get("size") || "50")));
  const offset = (page - 1) * size;
  const { results } = await db.prepare(
    `SELECT player_id, score, moves, time_ms, played_at,
            RANK() OVER (ORDER BY score ASC) as rank
     FROM scores
     WHERE leaderboard_id = ?
     ORDER BY score ASC
     LIMIT ? OFFSET ?`
  ).bind(id, size, offset).run();
  return new Response(JSON.stringify(results), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=30"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
