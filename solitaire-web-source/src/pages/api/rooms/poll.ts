/**
 * [INPUT]: 依赖 D1 (DB binding)
 * [OUTPUT]: GET /api/rooms/poll — 轮询房间内所有玩家进度
 * [POS]: api/rooms/ 的轮询入口，game-bridge.js 每 1s 调用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { APIRoute } from 'astro';

export const prerender = false;

interface PlayerResult {
  player_id: string;
  moves: number;
  score: number;
  time_ms: number;
  finished: number;
  rank: number | null;
}

export const GET: APIRoute = async ({ url, locals }) => {
  const code = (url.searchParams.get('code') || '').toUpperCase().trim();
  if (!code) return Response.json({ error: 'Missing code' }, { status: 400 });

  const db = locals.runtime.env.DB;

  const room = await db.prepare('SELECT * FROM rooms WHERE code = ?').bind(code).first();
  if (!room) return Response.json({ error: 'Room not found' }, { status: 404 });

  const players = await db.prepare(
    'SELECT player_id, moves, score, time_ms, finished, rank FROM room_players WHERE room_code = ?'
  ).bind(code).all();

  return Response.json({
    code: room.code,
    game: room.game,
    seed: room.seed,
    status: room.status,
    players: players.results.map((p: PlayerResult) => ({
      playerId: p.player_id,
      moves: p.moves as number,
      score: p.score as number,
      timeMs: p.time_ms as number,
      finished: !!(p.finished),
      rank: p.rank as number | null,
    })),
  });
};
