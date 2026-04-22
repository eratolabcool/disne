// ================================================================
// Solitaire Arena — 模式状态机
// 管理自由模式 / 每日挑战 / 计时竞速 / 闯关模式
// [INPUT]: GameBridge, LeaderboardClient
// [OUTPUT]: ModeManager 类，供页面 UI 绑定
// [POS]: shell/mode-manager.ts 是游戏模式的核心控制器
// [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
// ================================================================

import { GameBridge } from './game-bridge';
import { LeaderboardClient } from './leaderboard-client';
import { Stopwatch } from './stopwatch';
import { computeSeed } from './seed-utils';

export type GameMode = 'freeplay' | 'daily' | 'timetrial' | 'campaign';
export type ModeState = 'idle' | 'playing' | 'won' | 'lost' | 'paused';

export interface CampaignLevel {
  levelId: number;
  chapter: string;
  name: string;
  gameType: string;
  seed: number;
  starMoves2: number;
  starMoves3: number;
  starTime2Sec: number;
  starTime3Sec: number;
  moveLimit?: number;
}

// 评分公式: moves * 100 + timeSeconds，值越低越好
export function computeScore(moves: number, timeMs: number): number {
  return moves * 100 + Math.floor(timeMs / 1000);
}

export class ModeManager {
  mode: GameMode = 'freeplay';
  state: ModeState = 'idle';
  private timer = new Stopwatch();
  private currentGame = '';
  private currentSeed = 0;
  private currentLevel: CampaignLevel | null = null;
  private moveCount = 0;

  constructor(
    private bridge: GameBridge,
    private leaderboard: LeaderboardClient
  ) {}

  get elapsed(): number {
    return this.timer.elapsed;
  }

  get moves(): number {
    return this.moveCount;
  }

  async startDaily(gameType: string, date: string): Promise<void> {
    this.mode = 'daily';
    this.currentGame = gameType;
    this.currentSeed = await computeSeed(`${date}-${gameType}`);
    await this.bridge.injectSeed(this.currentSeed);
    this.state = 'playing';
    this.moveCount = 0;
    this.timer.reset();
    this.timer.start();
  }

  async startCampaign(level: CampaignLevel): Promise<void> {
    this.mode = 'campaign';
    this.currentLevel = level;
    this.currentGame = level.gameType;
    this.currentSeed = level.seed;
    await this.bridge.injectSeed(level.seed);
    this.state = 'playing';
    this.moveCount = 0;
    this.timer.reset();
    this.timer.start();
  }

  startFreeplay(): void {
    this.mode = 'freeplay';
    this.state = 'playing';
    this.currentSeed = 0;
    this.moveCount = 0;
    this.timer.reset();
  }

  startTimetrial(gameType: string): void {
    this.mode = 'timetrial';
    this.currentGame = gameType;
    this.state = 'playing';
    this.moveCount = 0;
    this.timer.reset();
    this.timer.start();
  }

  onMoveCompleted(moves: number): void {
    this.moveCount = moves;
    if (this.mode === 'campaign' && this.currentLevel?.moveLimit) {
      if (moves >= this.currentLevel.moveLimit) {
        this.state = 'lost';
        this.timer.stop();
        this.bridge.clearSeed();
      }
    }
  }

  onGameWon(): void {
    if (this.state !== 'playing') return;
    this.timer.stop();
    this.state = 'won';
    this.bridge.clearSeed();

    const moves = this.moveCount;
    const elapsedMs = this.timer.elapsed;

    if (this.mode === 'daily') {
      this.leaderboard.submit({
        leaderboardId: `DC-${this.currentGame}`,
        score: computeScore(moves, elapsedMs),
        moves,
        timeMs: elapsedMs,
        seed: this.currentSeed,
      });
    }

    if (this.mode === 'campaign' && this.currentLevel) {
      const stars = this.computeStars(moves, elapsedMs);
      this.saveCampaignProgress(this.currentLevel.levelId, stars);
    }
  }

  abort(): void {
    this.timer.stop();
    this.state = 'idle';
    this.bridge.clearSeed();
  }

  private computeStars(moves: number, timeMs: number): number {
    if (!this.currentLevel) return 1;
    const secs = timeMs / 1000;
    if (moves <= this.currentLevel.starMoves3 && secs <= this.currentLevel.starTime3Sec) return 3;
    if (moves <= this.currentLevel.starMoves2 || secs <= this.currentLevel.starTime2Sec) return 2;
    return 1;
  }

  private saveCampaignProgress(levelId: number, stars: number): void {
    const key = 'solitaire-campaign';
    const raw = localStorage.getItem(key);
    const progress = raw ? JSON.parse(raw) : {};
    const prev = progress[levelId] || { stars: 0 };
    progress[levelId] = { stars: Math.max(prev.stars, stars), bestMoves: this.moveCount, bestTime: this.timer.elapsed };
    localStorage.setItem(key, JSON.stringify(progress));
  }
}
