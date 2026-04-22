globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  const db = locals.runtime.env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB unavailable" }), { status: 503 });
  const body = await request.json();
  if (!body.playerId || !body.leaderboardId || body.score == null) {
    return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
  }
  if (body.moves < 50 && body.leaderboardId === "DC-klondike") {
    return new Response(JSON.stringify({ error: "anomaly" }), { status: 400 });
  }
  if (body.timeMs < 3e4 && body.moves > 100) {
    return new Response(JSON.stringify({ error: "anomaly" }), { status: 400 });
  }
  await db.prepare(
    `INSERT INTO scores (player_id, leaderboard_id, score, moves, time_ms, seed, played_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
  ).bind(
    body.playerId,
    body.leaderboardId,
    body.score,
    body.moves,
    body.timeMs,
    body.seed ?? null
  ).run();
  const rankResult = await db.prepare(
    `SELECT COUNT(*) + 1 as rank FROM scores
     WHERE leaderboard_id = ? AND score < ?`
  ).bind(body.leaderboardId, body.score).first();
  return new Response(JSON.stringify({ ok: true, rank: rankResult?.rank ?? -1 }), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
