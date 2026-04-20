/**
 * [INPUT]: 依赖 lib/db 的 PostgreSQL 连接
 * [OUTPUT]: 对外提供 posts 表创建和测试数据插入功能
 * [POS]: 数据库迁移脚本，一次性运行
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { db } from "@/lib/db";

async function setupPostsTable() {
  console.log("🚀 开始设置 posts 表...\n");

  try {
    // 创建 posts 表
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS posts (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        content TEXT,
        status VARCHAR(50) DEFAULT 'created',
        locale VARCHAR(10) DEFAULT 'en',
        cover_url VARCHAR(500),
        author_name VARCHAR(255),
        author_avatar_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await db.query(createTableQuery);
    console.log("✅ posts 表创建成功");

    // 创建索引
    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);",
      "CREATE INDEX IF NOT EXISTS idx_posts_locale ON posts(locale);",
      "CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);",
      "CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);",
      "CREATE INDEX IF NOT EXISTS idx_posts_locale_status ON posts(locale, status, created_at DESC);",
    ];

    for (const indexQuery of indexes) {
      await db.query(indexQuery);
    }

    console.log("✅ 索引创建成功");

    // 检查表是否存在
    const checkQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'posts'
      );
    `;

    const { rows } = await db.query(checkQuery);
    const tableExists = rows[0].exists;

    console.log(`\n📊 表存在检查: ${tableExists ? "✅ 存在" : "❌ 不存在"}`);

    if (tableExists) {
      // 检查现有文章数量
      const countQuery = "SELECT COUNT(*) as count FROM posts;";
      const { rows: countRows } = await db.query(countQuery);
      const postCount = countRows[0].count;

      console.log(`📝 现有文章数量: ${postCount}\n`);
    }

    return tableExists;
  } catch (error) {
    console.error("❌ 设置失败:", error);
    throw error;
  }
}

async function insertTestData() {
  console.log("📝 插入测试文章...\n");

  const testPosts = [
    {
      slug: "how-to-win-disney-solitaire-level-100",
      title: "How to Win Disney Solitaire Level 100: Advanced Strategies",
      description: "Master Disney Solitaire Level 100 with our comprehensive guide. Learn advanced strategies, power-up combinations, and expert tips to overcome the toughest challenges.",
      content:
        "Learn how to beat Level 100 in Disney Solitaire with advanced strategies...",
      status: "online",
      locale: "en",
      author_name: "Disney Solitaire Team",
    },
    {
      slug: "disney-solitaire-power-ups-guide",
      title: "Disney Solitaire Power-Ups Guide: Complete Strategy",
      description: "Discover all power-ups in Disney Solitaire and learn how to use them strategically to maximize your score and clear challenging levels.",
      content:
        "Complete guide to all power-ups in Disney Solitaire including wild cards, undo abilities, and connectors...",
      status: "online",
      locale: "en",
      author_name: "Disney Solitaire Team",
    },
    {
      slug: "free-solitaire-games-with-disney-characters",
      title: "Free Solitaire Games with Disney Characters: Top Picks",
      description: "Explore the best free solitaire games featuring beloved Disney characters. Compare gameplay, graphics, and magical experiences across different titles.",
      content:
        "Discover the top free solitaire games featuring your favorite Disney characters...",
      status: "online",
      locale: "en",
      author_name: "Disney Solitaire Team",
    },
  ];

  for (const post of testPosts) {
    const query = `
      INSERT INTO posts (slug, title, description, content, status, locale, author_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING slug, title
    `;

    try {
      const { rows } = await db.query(query, [
        post.slug,
        post.title,
        post.description,
        post.content,
        post.status,
        post.locale,
        post.author_name,
      ]);

      if (rows.length > 0) {
        console.log(`✅ 插入成功: ${rows[0].title}`);
      } else {
        console.log(`⏭️  跳过（已存在）: ${post.title}`);
      }
    } catch (error) {
      console.error(`❌ 插入失败: ${post.title}`, error);
    }
  }

  console.log("\n📝 测试文章插入完成\n");
}

async function main() {
  console.log("🎯 Disney Solitaire - Posts 表设置脚本");
  console.log("========================================\n");

  try {
    // 第一步：创建表
    const tableExists = await setupPostsTable();

    if (tableExists) {
      // 第二步：插入测试数据
      await insertTestData();

      console.log("🎉 设置完成！");
      console.log("\n📚 下一步:");
      console.log("1. 访问 http://localhost:3000/posts 查看 SEO 文章列表");
      console.log("2. 访问 http://localhost:3000/posts/how-to-win-disney-solitaire-level-100 查看具体文章");
      console.log("3. 开始创建更多 SEO 优化内容\n");
    }
  } catch (error) {
    console.error("\n💥 设置失败:", error);
    process.exit(1);
  }
}

// 运行设置
main();
