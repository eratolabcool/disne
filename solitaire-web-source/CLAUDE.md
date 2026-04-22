# solitaire-web/
> L2 | 父级: /CLAUDE.md

## Solitaire Arena — 在线纸牌竞技平台

成员清单:
- astro.config.mjs: Astro配置，hybrid模式，Cloudflare adapter
- wrangler.toml: Cloudflare Workers/D1 配置
- schema.sql: D1 数据库建表语句
- package.json: 项目依赖 (astro, @astrojs/cloudflare)
- src/config/site.ts: 站点配置，赌场绿配色常量，三大游戏定义
- src/data/campaign.ts: 50关闯关数据，确定性种子，星级阈值
- src/layouts/Layout.astro: Lichess风格布局，顶部导航，主题切换
- src/pages/index.astro: 首页 (Hero + 游戏卡片 + 模式介绍 + CTA)
- src/pages/play/[game].astro: 游戏页 (三栏布局: 模式|WASM|排行)
- src/pages/leaderboard.astro: 排行榜页 (6个Tab: DC/TT × 3游戏)
- src/pages/campaign.astro: 闯关地图页 (5章 × 10关)
- src/pages/api/scores.ts: POST 提交成绩 (含反作弊阈值)
- src/pages/api/leaderboard/[id].ts: GET 排行榜查询 (分页)
- src/pages/api/daily/[date].ts: GET 每日挑战元信息
- src/pages/api/achievements/sync.ts: POST 离线成绩批量同步
- src/shell/main.ts: JS Shell 入口，挂载全局 solitaireArena 对象
- src/shell/game-bridge.ts: WASM 加载 + 种子注入 + DOM MutationObserver
- src/shell/mode-manager.ts: 模式状态机 (freeplay/daily/timetrial/campaign)
- src/shell/stopwatch.ts: performance.now() 计时器
- src/shell/seed-utils.ts: SHA-256 确定性种子计算
- src/shell/leaderboard-client.ts: 离线优先排行榜客户端 (localStorage队列)

架构理念:
- 参考 Lichess 三栏式布局：左侧模式栏 + 中间 WASM 游戏区 + 右侧排行
- 赌场绿主题: --sol-green #1a472a, --sol-gold #d4af37, --sol-red #c0392b
- Astro hybrid SSG: 静态页面预渲染 + API 路由 SSR on Cloudflare Workers
- JS Shell 模式: TypeScript 管理在线功能，C# WASM 仅负责纸牌渲染
- 确定性种子: SHA256 → int32，每日挑战全球同局
- 离线优先: localStorage 队列，网络恢复时批量同步
- DOM MutationObserver: C#→JS 胜利检测，零 C# 侵入
- 反作弊 MVP: 异常阈值检测 (最低步数/速度)

法则: Lichess架构·赌场绿配色·Hybrid SSG·离线优先·JS Shell模式

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
