/**
 * [INPUT]: Cloudflare D1 (env.DB), POST body (ScoreSubmission)
 * [OUTPUT]: 提交分数到 D1，返回 { ok, rank }
 * [POS]: pages/api/scores.ts 是成绩提交端点
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const db = (locals.runtime.env as Record<string, unknown>).DB as D1Database | undefined;
  if (!db) return new Response(JSON.stringify({ error: 'DB unavailable' }), { status: 503 });

  const body = await request.json() as {
    playerId: string;
    leaderboardId: string;
    score: number;
    moves: number;
    timeMs: number;
    seed?: number;
  };

  if (!body.playerId || !body.leaderboardId || body.score == null) {
    return new Response(JSON.stringify({ error: 'missing fields' }), { status: 400 });
  }

  // 反作弊: 基础异常阈值
  if (body.moves < 50 && body.leaderboardId === 'DC-klondike') {
    // Klondike 最少约 76 步通关
    return new Response(JSON.stringify({ error: 'anomaly' }), { status: 400 });
  }
  if (body.timeMs < 30000 && body.moves > 100) {
    // 100步30秒内 = 机器速度
    return new Response(JSON.stringify({ error: 'anomaly' }), { status: 400 });
  }

  await db.prepare(
    `INSERT INTO scores (player_id, leaderboard_id, score, moves, time_ms, seed, played_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
  ).bind(
    body.playerId, body.leaderboardId, body.score,
    body.moves, body.timeMs, body.seed ?? null
  ).run();

  // 查询排名
  const rankResult = await db.prepare(
    `SELECT COUNT(*) + 1 as rank FROM scores
     WHERE leaderboard_id = ? AND score < ?`
  ).bind(body.leaderboardId, body.score).first();

  return new Response(JSON.stringify({ ok: true, rank: rankResult?.rank ?? -1 }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
