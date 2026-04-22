// ================================================================
// Solitaire Arena — 独立计时器
// 不依赖 WASM 内部计时器，JS Shell 自维护
// [INPUT]: performance.now()
// [OUTPUT]: Stopwatch 类
// [POS]: shell/stopwatch.ts 是模式计时器
// [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
// ================================================================

export class Stopwatch {
  private startMark = 0;
  private accumulated = 0;
  private running = false;

  start(): void {
    this.startMark = performance.now();
    this.running = true;
  }

  stop(): void {
    if (this.running) {
      this.accumulated += performance.now() - this.startMark;
      this.running = false;
    }
  }

  reset(): void {
    this.accumulated = 0;
    this.startMark = 0;
    this.running = false;
  }

  get elapsed(): number {
    return this.running ? this.accumulated + (performance.now() - this.startMark) : this.accumulated;
  }

  get isRunning(): boolean {
    return this.running;
  }
}
