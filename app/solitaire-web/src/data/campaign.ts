/**
 * [INPUT]: 纯数据，无外部依赖
 * [OUTPUT]: 50 关闯关数据 (CampaignLevel[])
 * [POS]: data/campaign.ts 是闯关模式的关卡定义
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export interface CampaignLevel {
  levelId: number;
  chapter: number;
  name: string;
  gameType: string;
  seed: number;
  starMoves2: number;
  starMoves3: number;
  starTime2Sec: number;
  starTime3Sec: number;
  moveLimit?: number;
}

// 种子确定性: 每关固定种子，全球玩家同一牌局
// 评分: starMoves2/3 = 达到2星/3星的最大步数
//       starTime2/3  = 达到2星/3星的最大秒数
// moveLimit: Boss 关步数限制

const CHAPTERS = [
  { id: 1, name: '新手牌桌', game: 'klondike' },
  { id: 2, name: '花色迷宫', game: 'klondike' },
  { id: 3, name: '蜘蛛巢穴', game: 'spider' },
  { id: 4, name: '终极试炼', game: 'klondike' },
  { id: 5, name: '传奇牌局', game: 'klondike' },
] as const;

function generateLevels(): CampaignLevel[] {
  const levels: CampaignLevel[] = [];
  let id = 1;

  for (const ch of CHAPTERS) {
    for (let i = 0; i < 10; i++) {
      const isBoss = i === 9;
      const difficulty = ch.id + (i / 10);

      // 基于章节和关卡计算确定性种子
      const seed = ch.id * 1000 + i * 137 + 42;

      // 步数阈值随难度递减（更难获得高星）
      const baseMoves3 = Math.max(80, 150 - Math.floor(difficulty * 15));
      const baseMoves2 = Math.max(100, 200 - Math.floor(difficulty * 15));

      levels.push({
        levelId: id,
        chapter: ch.id,
        name: `${ch.name} ${i + 1}${isBoss ? ' (Boss)' : ''}`,
        gameType: ch.game,
        seed,
        starMoves3: baseMoves3,
        starMoves2: baseMoves2,
        starTime2Sec: Math.max(120, 300 - Math.floor(difficulty * 30)),
        starTime3Sec: Math.max(90, 240 - Math.floor(difficulty * 30)),
        ...(isBoss ? { moveLimit: Math.max(150, 300 - Math.floor(difficulty * 20)) } : {}),
      });
      id++;
    }
  }
  return levels;
}

export const CAMPAIGN_LEVELS: CampaignLevel[] = generateLevels();

export function getLevelById(id: number): CampaignLevel | undefined {
  return CAMPAIGN_LEVELS.find(l => l.levelId === id);
}

export function getLevelsByChapter(chapter: number): CampaignLevel[] {
  return CAMPAIGN_LEVELS.filter(l => l.chapter === chapter);
}
