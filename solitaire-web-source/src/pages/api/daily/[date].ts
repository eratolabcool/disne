/**
 * [INPUT]: Cloudflare D1 (env.DB), URL params (date: YYYY-MM-DD)
 * [OUTPUT]: 每日挑战种子信息 + 玩家成绩
 * [POS]: pages/api/daily/[date].ts 是每日挑战端点
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, url, locals }) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const date = params.date;
  if (!date || !datePattern.test(date)) {
    return new Response(JSON.stringify({ error: 'invalid date (YYYY-MM-DD)' }), { status: 400 });
  }

  const gameType = url.searchParams.get('game') || 'klondike';
  const playerId = url.searchParams.get('playerId');

  // 返回每日挑战元信息（种子由客户端 JS 端计算，服务端不需要存）
  const result: Record<string, unknown> = {
    date,
    game: gameType,
    leaderboards: [`DC-${gameType}`],
  };

  // 如果有 playerId，查询该玩家当日成绩
  if (playerId) {
    const db = (locals as any).runtime?.env?.DB;
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
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
