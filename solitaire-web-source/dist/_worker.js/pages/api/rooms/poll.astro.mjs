globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ url, locals }) => {
  const code = (url.searchParams.get("code") || "").toUpperCase().trim();
  if (!code) return Response.json({ error: "Missing code" }, { status: 400 });
  const db = locals.runtime.env.DB;
  const room = await db.prepare("SELECT * FROM rooms WHERE code = ?").bind(code).first();
  if (!room) return Response.json({ error: "Room not found" }, { status: 404 });
  const players = await db.prepare(
    "SELECT player_id, moves, score, time_ms, finished, rank FROM room_players WHERE room_code = ?"
  ).bind(code).all();
  return Response.json({
    code: room.code,
    game: room.game,
    seed: room.seed,
    status: room.status,
    players: players.results.map((p) => ({
      playerId: p.player_id,
      moves: p.moves,
      score: p.score,
      timeMs: p.time_ms,
      finished: !!p.finished,
      rank: p.rank
    }))
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
