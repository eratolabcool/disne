/**
 * [INPUT]: 依赖 D1 (DB binding)
 * [OUTPUT]: POST /api/rooms/start — 房主开始游戏
 * [POS]: api/rooms/ 的开始入口，将房间状态改为 playing
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json() as { code?: string };
  const code = (body.code || '').toUpperCase().trim();
  if (!code) return Response.json({ error: 'Missing code' }, { status: 400 });

  const db = locals.runtime.env.DB;

  const room = await db.prepare('SELECT * FROM rooms WHERE code = ?').bind(code).first();
  if (!room) return Response.json({ error: 'Room not found' }, { status: 404 });
  if (room.status !== 'waiting') return Response.json({ error: 'Already started' }, { status: 400 });

  await db.prepare(
    "UPDATE rooms SET status = 'playing', started_at = datetime('now') WHERE code = ?"
  ).bind(code).run();

  return Response.json({ code, status: 'playing', seed: room.seed });
};
