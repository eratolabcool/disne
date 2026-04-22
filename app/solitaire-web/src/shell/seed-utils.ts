// ================================================================
// Solitaire Arena — 确定性种子计算
// SHA-256 hash → int32 绝对值，与 C# ComputeSeed 一致
// [INPUT]: 任意字符串
// [OUTPUT]: 32-bit 种子数
// [POS]: shell/seed-utils.ts 是种子生成工具
// [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
// ================================================================

export async function computeSeed(seedString: string): Promise<number> {
  const data = new TextEncoder().encode(seedString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Int32Array(hashBuffer);
  return Math.abs(hashArray[0]);
}
