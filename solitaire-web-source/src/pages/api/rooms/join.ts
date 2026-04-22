/**
 * [INPUT]: 依赖 D1 (DB binding)
 * [OUTPUT]: POST /api/rooms/join — 加入房间
 * [POS]: api/rooms/ 的加入入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json() as { code?: string; playerId?: string };
  const code = (body.code || '').toUpperCase().trim();
  const playerId = body.playerId;

  if (!code || code.length !== 6) return Response.json({ error: 'Invalid room code' }, { status: 400 });
  if (!playerId) return Response.json({ error: 'Missing playerId' }, { status: 400 });

  const db = locals.runtime.env.DB;

  // 查房间
  const room = await db.prepare('SELECT * FROM rooms WHERE code = ?').bind(code).first();
  if (!room) return Response.json({ error: 'Room not found' }, { status: 404 });
  if (room.status === 'finished') return Response.json({ error: 'Game already finished' }, { status: 410 });

  // 加入（INSERT OR IGNORE 防止重复）
  await db.prepare(
    'INSERT OR IGNORE INTO room_players (room_code, player_id) VALUES (?, ?)'
  ).bind(code, playerId).run();

  // 查玩家数
  const count = await db.prepare(
    'SELECT COUNT(*) as cnt FROM room_players WHERE room_code = ?'
  ).bind(code).first();

  return Response.json({
    code: room.code,
    game: room.game,
    seed: room.seed,
    status: room.status,
    playerCount: (count as any)?.cnt || 0,
  });
};
