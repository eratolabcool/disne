/**
 * [INPUT]: 依赖 astro, @astrojs/cloudflare
 * [OUTPUT]: 导出 Astro 站点配置
 * [POS]: solitaire-web/astro.config.mjs 是站点配置入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// ============================================================
// Astro 配置 - Solitaire Arena
// Lichess-inspired architecture with hybrid pre-rendering
// ============================================================

export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare(),
  build: {
    format: 'directory',
  },
});
