/**
 * [INPUT]: 依赖 D1 (DB binding)
 * [OUTPUT]: POST /api/rooms/create — 创建房间，返回 code + seed
 * [POS]: api/rooms/ 的创建入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { APIRoute } from 'astro';

export const prerender = false;

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function seedFromCode(code: string): Promise<number> {
  const data = new TextEncoder().encode(code + '-' + Date.now());
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Math.abs(new Int32Array(buf)[0]);
}

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json() as { game?: string };
  const game = body.game || 'klondike';
  const db = locals.runtime.env.DB;

  // 生成唯一房间码
  let code = '';
  for (let attempt = 0; attempt < 5; attempt++) {
    code = generateCode();
    const existing = await db.prepare('SELECT code FROM rooms WHERE code = ?').bind(code).first();
    if (!existing) break;
    code = '';
  }
  if (!code) return Response.json({ error: 'Failed to generate room code' }, { status: 500 });

  const seed = await seedFromCode(code);

  await db.prepare(
    'INSERT INTO rooms (code, game, seed, status) VALUES (?, ?, ?, ?)'
  ).bind(code, game, seed, 'waiting').run();

  return Response.json({ code, game, seed, status: 'waiting' });
};
