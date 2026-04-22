// ================================================================
// Solitaire Arena — JS Shell 入口
// 在 /play/[game] 页面加载，负责 WASM 初始化和模式管理
// [INPUT]: WASM 文件 (_framework/dotnet.js)
// [OUTPUT]: 全局 solitaireArena 对象，供页面脚本调用
// [POS]: shell/main.ts 是 JS Shell 的入口模块
// [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
// ================================================================

import { GameBridge } from './game-bridge';
import { ModeManager } from './mode-manager';
import { LeaderboardClient } from './leaderboard-client';
import { Stopwatch } from './stopwatch';
import { computeSeed } from './seed-utils';

// 全局单例
const leaderboard = new LeaderboardClient();
const bridge = new GameBridge();
const modes = new ModeManager(bridge, leaderboard);

// 暴露到 window，供内联脚本调用
(window as any).solitaireArena = {
  bridge,
  modes,
  leaderboard,
  computeSeed,
  Stopwatch,
};

export { bridge, modes, leaderboard, computeSeed, Stopwatch };
