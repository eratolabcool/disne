globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  const body = await request.json();
  const code = (body.code || "").toUpperCase().trim();
  if (!code) return Response.json({ error: "Missing code" }, { status: 400 });
  const db = locals.runtime.env.DB;
  const room = await db.prepare("SELECT * FROM rooms WHERE code = ?").bind(code).first();
  if (!room) return Response.json({ error: "Room not found" }, { status: 404 });
  if (room.status !== "waiting") return Response.json({ error: "Already started" }, { status: 400 });
  await db.prepare(
    "UPDATE rooms SET status = 'playing', started_at = datetime('now') WHERE code = ?"
  ).bind(code).run();
  return Response.json({ code, status: "playing", seed: room.seed });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
