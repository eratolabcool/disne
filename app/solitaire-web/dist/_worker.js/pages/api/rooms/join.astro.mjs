globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  const body = await request.json();
  const code = (body.code || "").toUpperCase().trim();
  const playerId = body.playerId;
  if (!code || code.length !== 6) return Response.json({ error: "Invalid room code" }, { status: 400 });
  if (!playerId) return Response.json({ error: "Missing playerId" }, { status: 400 });
  const db = locals.runtime.env.DB;
  const room = await db.prepare("SELECT * FROM rooms WHERE code = ?").bind(code).first();
  if (!room) return Response.json({ error: "Room not found" }, { status: 404 });
  if (room.status === "finished") return Response.json({ error: "Game already finished" }, { status: 410 });
  await db.prepare(
    "INSERT OR IGNORE INTO room_players (room_code, player_id) VALUES (?, ?)"
  ).bind(code, playerId).run();
  const count = await db.prepare(
    "SELECT COUNT(*) as cnt FROM room_players WHERE room_code = ?"
  ).bind(code).first();
  return Response.json({
    code: room.code,
    game: room.game,
    seed: room.seed,
    status: room.status,
    playerCount: count?.cnt || 0
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
