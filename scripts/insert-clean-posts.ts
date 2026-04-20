/**
 * [INPUT]: 依赖 lib/db 的 PostgreSQL 连接和 uuid 包
 * [OUTPUT]: 对外提供清空并重新插入测试文章功能
 * [POS]: 数据库清理脚本，解决重复插入问题
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

async function cleanAndInsertPosts() {
  console.log("🧹 清空 posts 表并重新插入测试数据...\n");

  try {
    // 第一步：清空表
    const deleteQuery = "DELETE FROM posts;";
    await db.query(deleteQuery);
    console.log("✅ posts 表已清空");

    // 第二步：插入测试文章
    const testPosts = [
      {
        slug: "how-to-win-disney-solitaire-level-100",
        title: "How to Win Disney Solitaire Level 100: Advanced Strategies",
        description:
          "Master Disney Solitaire Level 100 with our comprehensive guide. Learn advanced strategies, power-up combinations, and expert tips to overcome the toughest challenges.",
        content:
          "Learn how to beat Level 100 in Disney Solitaire with advanced strategies...",
        status: "online",
        locale: "en",
        author_name: "Disney Solitaire Team",
      },
      {
        slug: "disney-solitaire-power-ups-guide",
        title: "Disney Solitaire Power-Ups Guide: Complete Strategy",
        description:
          "Discover all power-ups in Disney Solitaire and learn how to use them strategically to maximize your score and clear challenging levels.",
        content:
          "Complete guide to all power-ups in Disney Solitaire including wild cards, undo abilities, and connectors...",
        status: "online",
        locale: "en",
        author_name: "Disney Solitaire Team",
      },
      {
        slug: "free-solitaire-games-with-disney-characters",
        title: "Free Solitaire Games with Disney Characters: Top Picks",
        description:
          "Explore the best free solitaire games featuring beloved Disney characters. Compare gameplay, graphics, and magical experiences across different titles.",
        content:
          "Discover the top free solitaire games featuring your favorite Disney characters...",
        status: "online",
        locale: "en",
        author_name: "Disney Solitaire Team",
      },
    ];

    console.log("📝 开始插入测试文章...\n");

    for (const post of testPosts) {
      const uuid = uuidv4();
      const query = `
        INSERT INTO posts (uuid, slug, title, description, content, status, locale, author_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING slug, title
      `;

      try {
        const { rows } = await db.query(query, [
          uuid,
          post.slug,
          post.title,
          post.description,
          post.content,
          post.status,
          post.locale,
          post.author_name,
        ]);

        console.log(`✅ 插入成功: ${rows[0].title}`);
      } catch (error) {
        console.error(`❌ 插入失败: ${post.title}`, error);
      }
    }

    // 第三步：验证插入结果
    const countQuery = "SELECT COUNT(*) as count FROM posts;";
    const { rows } = await db.query(countQuery);
    const postCount = rows[0].count;

    console.log(`\n📊 当前文章数量: ${postCount}`);

    // 第四步：列出所有文章
    const listQuery = "SELECT slug, title, status, locale FROM posts ORDER BY created_at DESC;";
    const { rows: posts } = await db.query(listQuery);

    console.log("\n📚 文章列表:");
    posts.forEach((post: any, index: number) => {
      console.log(
        `  ${index + 1}. ${post.title} (${post.locale}) - ${post.status}`
      );
    });

    console.log("\n🎉 设置完成！");
    console.log("\n📚 下一步:");
    console.log("1. 运行 npm run dev 启动开发服务器");
    console.log("2. 访问 http://localhost:3000/posts 查看 SEO 文章列表");
    console.log("3. 访问 http://localhost:3000/posts/how-to-win-disney-solitaire-level-100 查看具体文章\n");
  } catch (error) {
    console.error("❌ 操作失败:", error);
    throw error;
  }
}

// 运行清理和插入
cleanAndInsertPosts()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 脚本执行失败:", error);
    process.exit(1);
  });
