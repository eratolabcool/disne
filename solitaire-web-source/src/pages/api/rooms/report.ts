/**
 * [INPUT]: 依赖 D1 (DB binding)
 * [OUTPUT]: POST /api/rooms/report — 上报游戏进度
 * [POS]: api/rooms/ 的进度上报入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json() as {
    code?: string;
    playerId?: string;
    moves?: number;
    score?: number;
    timeMs?: number;
    finished?: boolean;
  };

  const code = (body.code || '').toUpperCase().trim();
  const { playerId, moves = 0, score = 0, timeMs = 0, finished = false } = body;

  if (!code || !playerId) return Response.json({ error: 'Missing code or playerId' }, { status: 400 });

  const db = locals.runtime.env.DB;

  if (finished) {
    // 标记完成 + 计算排名
    await db.prepare(
      `UPDATE room_players
       SET moves = ?, score = ?, time_ms = ?, finished = 1,
           finished_at = datetime('now'),
           rank = (SELECT COUNT(*) FROM room_players WHERE room_code = ? AND finished = 1) + 1
       WHERE room_code = ? AND player_id = ?`
    ).bind(moves, score, timeMs, code, code, playerId).run();

    // 检查是否所有人都完成了
    const total = await db.prepare(
      'SELECT COUNT(*) as cnt FROM room_players WHERE room_code = ?'
    ).bind(code).first();
    const done = await db.prepare(
      'SELECT COUNT(*) as cnt FROM room_players WHERE room_code = ? AND finished = 1'
    ).bind(code).first();

    if (total && done && (total as any).cnt === (done as any).cnt) {
      await db.prepare(
        "UPDATE rooms SET status = 'finished', finished_at = datetime('now') WHERE code = ?"
      ).bind(code).run();
    }
  } else {
    // 更新进度
    await db.prepare(
      `UPDATE room_players SET moves = ?, score = ?, time_ms = ?
       WHERE room_code = ? AND player_id = ? AND finished = 0`
    ).bind(moves, score, timeMs, code, playerId).run();
  }

  return Response.json({ ok: true });
};
