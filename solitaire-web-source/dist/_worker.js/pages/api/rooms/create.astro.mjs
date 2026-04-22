globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
async function seedFromCode(code) {
  const data = new TextEncoder().encode(code + "-" + Date.now());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Math.abs(new Int32Array(buf)[0]);
}
const POST = async ({ request, locals }) => {
  const body = await request.json();
  const game = body.game || "klondike";
  const db = locals.runtime.env.DB;
  let code = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    code = generateCode();
    const existing = await db.prepare("SELECT code FROM rooms WHERE code = ?").bind(code).first();
    if (!existing) break;
    code = "";
  }
  if (!code) return Response.json({ error: "Failed to generate room code" }, { status: 500 });
  const seed = await seedFromCode(code);
  await db.prepare(
    "INSERT INTO rooms (code, game, seed, status) VALUES (?, ?, ?, ?)"
  ).bind(code, game, seed, "waiting").run();
  return Response.json({ code, game, seed, status: "waiting" });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
