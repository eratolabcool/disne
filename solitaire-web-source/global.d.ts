// Avalonia WASM 模块声明（运行时动态加载）
declare module '/_framework/dotnet.js' {
  export const dotnet: {
    withDiagnosticTracing(value: boolean): {
      withApplicationArgumentsFromQuery(): {
        create(): Promise<{
          getConfig(): { mainAssemblyName: string };
          runMain(assemblyName: string, args: string[]): Promise<void>;
        }>;
      };
    };
  };
  export const SetSeed: (seed: number) => void;
  export const ClearSeed: () => void;
  export const GetMoves: () => number;
  export const GetScore: () => number;
  export const GetTimeMs: () => number;
  export const GetFinished: () => boolean;
  export const GetGameState: () => string;
}
