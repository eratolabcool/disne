/**
 * [INPUT]: Cloudflare D1 (env.DB), URL params (leaderboard id), query (page, size)
 * [OUTPUT]: 排行榜 JSON 数组
 * [POS]: pages/api/leaderboard/[id].ts 是排行查询端点
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, url, locals }) => {
  const db = (locals.runtime.env as Record<string, unknown>).DB as D1Database | undefined;
  if (!db) return new Response(JSON.stringify({ error: 'DB unavailable' }), { status: 503 });

  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: 'missing id' }), { status: 400 });

  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const size = Math.min(100, Math.max(1, parseInt(url.searchParams.get('size') || '50')));
  const offset = (page - 1) * size;

  const { results } = await db.prepare(
    `SELECT player_id, score, moves, time_ms, played_at,
            RANK() OVER (ORDER BY score ASC) as rank
     FROM scores
     WHERE leaderboard_id = ?
     ORDER BY score ASC
     LIMIT ? OFFSET ?`
  ).bind(id, size, offset).run();

  return new Response(JSON.stringify(results), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30',
    },
  });
};
