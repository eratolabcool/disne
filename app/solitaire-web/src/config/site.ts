/**
 * [INPUT]: 无依赖
 * [OUTPUT]: 对外提供站点配置、游戏定义、配色常量
 * [POS]: solitaire-web/src/config/site.ts 是站点配置入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ============================================================
// Solitaire Arena - 站点配置
// 赌场绿主题 + Lichess 三栏布局
// ============================================================

export const SITE_NAME = 'Solitaire Arena';
export const SITE_DOMAIN = 'solitaire.arena';
export const SITE_ID = 'solitaire-arena';

export const siteConfig = {
  title: SITE_NAME,
  domain: SITE_DOMAIN,
  logo: '/logo.svg',
  primaryColor: '#1a472a',
  description: '在线纸牌竞技平台。每日挑战、计时竞速、闯关模式——Klondike、Spider、FreeCell 三大经典。',
  gameEngine: 'wasm',
};

// ============================================================
// 配色系统 — 赌场绿 + 金色强调
// ============================================================
export const COLORS = {
  green:       '#1a472a',
  greenDark:   '#0d2818',
  greenLight:  '#2d6a4f',
  gold:        '#d4af37',
  goldDark:    '#b8960c',
  red:         '#c0392b',
  cream:       '#f5f0e1',

  bgBody:      '#0a0f0d',
  bgSurface:   '#111a15',
  bgCard:      '#162219',
  textPrimary: '#e8e0d0',
  textSecondary: '#8a9a8e',
  textMuted:   '#5a6a5e',
  border:      '#1e2e24',
  borderLight: '#2a3e30',
} as const;

// ============================================================
// 游戏定义 — 三大经典纸牌
// ============================================================
export interface GameDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  shortDescription: string;
  color: string;
}

export const GAMES: GameDef[] = [
  {
    slug: 'klondike',
    name: 'Klondike',
    icon: '♠',
    description: '经典单人纸牌，将所有牌按花色从 A 到 K 移动到基础区。',
    shortDescription: '经典单人纸牌',
    color: '#2d6a4f',
  },
  {
    slug: 'spider',
    name: 'Spider',
    icon: '🕷️',
    description: '蜘蛛纸牌，将同花色的牌按从 K 到 A 的顺序排列来消除整列。',
    shortDescription: '蜘蛛纸牌',
    color: '#8B5CF6',
  },
  {
    slug: 'freecell',
    name: 'FreeCell',
    icon: '♣',
    description: '空当接龙，利用空闲单元格策略性移动所有牌到基础区。',
    shortDescription: '空当接龙',
    color: '#d4af37',
  },
];

export function getGameBySlug(slug: string): GameDef | undefined {
  return GAMES.find(g => g.slug === slug);
}
