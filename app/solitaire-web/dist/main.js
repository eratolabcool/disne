import { dotnet } from './_framework/dotnet.js'

const is_browser = typeof window != "undefined";
if (!is_browser) throw new Error(`Expected to be running in a browser`);

// ── 创建 .NET WASM Runtime ──
const runtime = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

const config = runtime.getConfig();

// ── 确保 game-bridge.js 的回调对象存在 ──
if (!globalThis.solitaireArena) {
  globalThis.solitaireArena = { onGameWon: null };
}

// ── 获取 Assembly Exports ──
// .NET 9: getAssemblyExports 是 runtime 对象的方法
try {
  const exports = await runtime.getAssemblyExports('Solitaire.Browser');
  globalThis.__wasmBridge = exports?.Solitaire?.Browser || null;
  console.log('[main.js] WASM bridge ready:', !!globalThis.__wasmBridge);
} catch (e) {
  console.warn('[main.js] getAssemblyExports failed:', e);
}

// ── 启动 C# 应用（Avalonia 渲染循环）──
await runtime.runMain(config.mainAssemblyName, [globalThis.location.href]);
