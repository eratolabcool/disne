globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  const db = locals.runtime.env.DB;
  if (!db) return new Response(JSON.stringify({ error: "DB unavailable" }), { status: 503 });
  const items = await request.json();
  if (!Array.isArray(items) || items.length === 0) {
    return new Response(JSON.stringify({ error: "empty batch" }), { status: 400 });
  }
  if (items.length > 50) {
    return new Response(JSON.stringify({ error: "batch too large (max 50)" }), { status: 400 });
  }
  const batch = items.map(
    (item) => db.prepare(
      `INSERT INTO scores (player_id, leaderboard_id, score, moves, time_ms, seed, played_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      item.playerId,
      item.leaderboardId,
      item.score,
      item.moves,
      item.timeMs,
      item.seed ?? null
    )
  );
  await db.batch(batch);
  return new Response(JSON.stringify({ ok: true, synced: items.length }), {
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
