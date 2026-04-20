/**
 * [INPUT]: 依赖 models/post 的 insertPost 和 Post 类型
 * [OUTPUT]: 对外提供测试文章插入功能
 * [POS]: 开发测试脚本，用于验证 Supabase 连接和 SEO 文章系统
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { insertPost } from "@/models/post";
import { Post } from "@/types/post";

async function testInsertPost() {
  console.log("🧪 测试 Supabase 连接和文章插入...\n");

  const testPost: Post = {
    slug: "how-to-win-disney-solitaire-level-100",
    title: "How to Win Disney Solitaire Level 100: Advanced Strategies",
    description: "Master Disney Solitaire Level 100 with our comprehensive guide. Learn advanced strategies, power-up combinations, and expert tips to overcome the toughest challenges.",
    content: `
# How to Win Disney Solitaire Level 100

## Understanding the Challenge
Level 100 in Disney Solitaire represents a significant milestone that tests your card game skills to the limit. This guide will help you develop the strategies needed to succeed.

## Key Strategies

### 1. Power-Up Management
- Save your most powerful power-ups for critical moments
- Combine wild cards with undo abilities for maximum effect
- Use the connector strategically to create long card chains

### 2. Resource Optimization
- Focus on clearing lower cards first to maximize chain potential
- Don't waste coins on unnecessary hints
- Practice patience - sometimes waiting for the right move is better than forcing a play

### 3. Pattern Recognition
- Learn to identify card distribution patterns early
- Track which suits have been depleted
- Use the draw pile strategically based on remaining cards

## Advanced Techniques

### The "Connector Cascade"
Master the art of creating cascading chain reactions by:
1. Identifying multiple connector opportunities
2. Planning 3-4 moves ahead
3. Using power-ups to extend chain length

### Risk Assessment
Calculate the risk-to-reward ratio for each move:
- High risk: Using premium power-ups early
- Medium risk: Drawing from the pile with few cards left
- Low risk: Playing obvious safe moves

## Common Mistakes to Avoid

1. **Overusing Premium Power-Ups**: Save these for level 100+
2. **Ignoring Card Count**: Track remaining cards in each suit
3. **Playing Too Fast**: Speed leads to mistakes in challenging levels
4. **Neglecting Daily Challenges**: These provide valuable practice

## Conclusion

Mastering Level 100 requires patience, strategy, and practice. Use these techniques to improve your win rate and prepare for even more challenging levels ahead.

Remember: Every expert was once a beginner. Keep practicing!
    `.trim(),
    status: "online",
    locale: "en",
    author_name: "Disney Solitaire Team",
    author_avatar_url: "/imgs/disney/og-image.jpg",
    cover_url: "/imgs/disney/twitter-card.jpg",
  };

  try {
    console.log("📝 准备插入测试文章...");
    console.log(`标题: ${testPost.title}`);
    console.log(`Slug: ${testPost.slug}`);
    console.log(`Locale: ${testPost.locale}\n`);

    const result = await insertPost(testPost);

    console.log("✅ 成功！文章已插入数据库");
    console.log("📊 文章数据:", JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error("❌ 错误：插入失败");
    console.error("详细错误:", error);

    if (error instanceof Error) {
      if (error.message.includes("Supabase")) {
        console.log("\n🔧 修复建议：");
        console.log("1. 检查 .env.development 中的 SUPABASE_URL");
        console.log("2. 检查 .env.development 中的 SUPABASE_ANON_KEY");
        console.log("3. 确保 Supabase 项目已启动");
        console.log("4. 验证 posts 表是否存在");
      }
    }

    throw error;
  }
}

// 运行测试
testInsertPost()
  .then(() => {
    console.log("\n🎉 测试完成！");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 测试失败：", error);
    process.exit(1);
  });
