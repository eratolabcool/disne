// ================================================================
// Solitaire Arena — WASM 游戏桥
// 管理 Avalonia WASM 加载、种子注入、胜利检测
// [INPUT]: _framework/dotnet.js (Avalonia WASM 运行时)
// [OUTPUT]: GameBridge 类，供 ModeManager 调用
// [POS]: shell/game-bridge.ts 是 WASM 与 JS 的通信层
// [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
// ================================================================

export class GameBridge {
  private wasmReady = false;
  private container: HTMLElement | null = null;

  async loadWasm(containerId: string): Promise<void> {
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error(`Container #${containerId} not found`);

    // @ts-ignore
    const { dotnet } = await import('/_framework/dotnet.js');
    const runtime = await dotnet
      .withDiagnosticTracing(false)
      .withApplicationArgumentsFromQuery()
      .create();
    const config = runtime.getConfig();
    await runtime.runMain(config.mainAssemblyName, [globalThis.location.href]);
    this.wasmReady = true;
  }

  async injectSeed(seed: number): Promise<void> {
    // @ts-ignore
    const { SetSeed } = await import('/_framework/dotnet.js');
    SetSeed(seed);
  }

  async getMoves(): Promise<number> {
    // @ts-ignore
    const { GetMoves } = await import('/_framework/dotnet.js');
    return GetMoves();
  }

  async getScore(): Promise<number> {
    // @ts-ignore
    const { GetScore } = await import('/_framework/dotnet.js');
    return GetScore();
  }

  async getTimeMs(): Promise<number> {
    // @ts-ignore
    const { GetTimeMs } = await import('/_framework/dotnet.js');
    return GetTimeMs();
  }

  async getFinished(): Promise<boolean> {
    // @ts-ignore
    const { GetFinished } = await import('/_framework/dotnet.js');
    return GetFinished();
  }

  async getGameState(): Promise<string> {
    // @ts-ignore
    const { GetGameState } = await import('/_framework/dotnet.js');
    return GetGameState();
  }

  async clearSeed(): Promise<void> {
    // @ts-ignore
    const { ClearSeed } = await import('/_framework/dotnet.js');
    ClearSeed();
  }

  onGameWon(callback: () => void): void {
    if (!this.container) return;

    const observer = new MutationObserver(() => {
      // Avalonia WASM 将 IsGameWon=true 后渲染胜利 UI
      const wonIndicator = this.container!.querySelector('[data-is-game-won="True"]');
      if (wonIndicator) {
        callback();
        observer.disconnect();
      }
    });
    observer.observe(this.container, { childList: true, subtree: true, attributes: true });
  }

  get isReady(): boolean {
    return this.wasmReady;
  }
}
