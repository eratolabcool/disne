/**
 * [INPUT]: Cloudflare D1 (env.DB), POST body (离线队列)
 * [OUTPUT]: 批量同步离线成绩
 * [POS]: pages/api/achievements/sync.ts 是离线成绩批量同步端点
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB unavailable' }), { status: 503 });

  const items = await request.json() as Array<{
    playerId: string;
    leaderboardId: string;
    score: number;
    moves: number;
    timeMs: number;
    seed?: number;
  }>;

  if (!Array.isArray(items) || items.length === 0) {
    return new Response(JSON.stringify({ error: 'empty batch' }), { status: 400 });
  }
  if (items.length > 50) {
    return new Response(JSON.stringify({ error: 'batch too large (max 50)' }), { status: 400 });
  }

  const batch = items.map(item =>
    db.prepare(
      `INSERT INTO scores (player_id, leaderboard_id, score, moves, time_ms, seed, played_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      item.playerId, item.leaderboardId, item.score,
      item.moves, item.timeMs, item.seed ?? null
    )
  );

  await db.batch(batch);

  return new Response(JSON.stringify({ ok: true, synced: items.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
