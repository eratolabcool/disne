globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  const body = await request.json();
  const code = (body.code || "").toUpperCase().trim();
  const { playerId, moves = 0, score = 0, timeMs = 0, finished = false } = body;
  if (!code || !playerId) return Response.json({ error: "Missing code or playerId" }, { status: 400 });
  const db = locals.runtime.env.DB;
  if (finished) {
    await db.prepare(
      `UPDATE room_players
       SET moves = ?, score = ?, time_ms = ?, finished = 1,
           finished_at = datetime('now'),
           rank = (SELECT COUNT(*) FROM room_players WHERE room_code = ? AND finished = 1) + 1
       WHERE room_code = ? AND player_id = ?`
    ).bind(moves, score, timeMs, code, code, playerId).run();
    const total = await db.prepare(
      "SELECT COUNT(*) as cnt FROM room_players WHERE room_code = ?"
    ).bind(code).first();
    const done = await db.prepare(
      "SELECT COUNT(*) as cnt FROM room_players WHERE room_code = ? AND finished = 1"
    ).bind(code).first();
    if (total && done && total.cnt === done.cnt) {
      await db.prepare(
        "UPDATE rooms SET status = 'finished', finished_at = datetime('now') WHERE code = ?"
      ).bind(code).run();
    }
  } else {
    await db.prepare(
      `UPDATE room_players SET moves = ?, score = ?, time_ms = ?
       WHERE room_code = ? AND player_id = ? AND finished = 0`
    ).bind(moves, score, timeMs, code, playerId).run();
  }
  return Response.json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
