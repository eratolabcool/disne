globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params, url, locals }) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const date = params.date;
  if (!date || !datePattern.test(date)) {
    return new Response(JSON.stringify({ error: "invalid date (YYYY-MM-DD)" }), { status: 400 });
  }
  const gameType = url.searchParams.get("game") || "klondike";
  const playerId = url.searchParams.get("playerId");
  const result = {
    date,
    game: gameType,
    leaderboards: [`DC-${gameType}`]
  };
  if (playerId) {
    const db = locals.runtime.env.DB;
    if (db) {
      const score = await db.prepare(
        `SELECT score, moves, time_ms, played_at FROM scores
         WHERE player_id = ? AND leaderboard_id = ?
         AND date(played_at) = ?
         ORDER BY score ASC LIMIT 1`
      ).bind(playerId, `DC-${gameType}`, date).first();
      result.playerBest = score;
    }
  }
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300"
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
