// ================================================================
// Solitaire Arena — 排行榜客户端
// 离线优先，localStorage 队列，网络恢复时上传
// [INPUT]: 后端 API /api/scores, /api/leaderboard
// [OUTPUT]: LeaderboardClient 类
// [POS]: shell/leaderboard-client.ts 是成绩提交和排行获取的客户端
// [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
// ================================================================

export interface ScoreSubmission {
  leaderboardId: string;
  score: number;
  moves: number;
  timeMs: number;
  seed?: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  score: number;
  moves: number;
  timeMs: number;
  playedAt: string;
}

const QUEUE_KEY = 'solitaire-score-queue';

export class LeaderboardClient {
  private playerId: string;

  constructor() {
    this.playerId = localStorage.getItem('solitaire-player-id') || crypto.randomUUID();
    localStorage.setItem('solitaire-player-id', this.playerId);
  }

  async submit(sub: ScoreSubmission): Promise<void> {
    const payload = { ...sub, playerId: this.playerId };
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) this.enqueueOffline(payload);
    } catch {
      this.enqueueOffline(payload);
    }
  }

  async getLeaderboard(leaderboardId: string, page = 1, size = 50): Promise<LeaderboardEntry[]> {
    try {
      const res = await fetch(`/api/leaderboard/${leaderboardId}?page=${page}&size=${size}`);
      if (res.ok) return res.json();
    } catch { /* offline */ }
    return [];
  }

  async flushOfflineQueue(): Promise<void> {
    const queue = this.getQueue();
    if (queue.length === 0) return;

    const failed: typeof queue = [];
    for (const payload of queue) {
      try {
        const res = await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) failed.push(payload);
      } catch {
        failed.push(payload);
      }
    }
    localStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
  }

  private enqueueOffline(payload: Record<string, unknown>): void {
    const queue = this.getQueue();
    queue.push(payload);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  private getQueue(): Record<string, unknown>[] {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    } catch { return []; }
  }
}
