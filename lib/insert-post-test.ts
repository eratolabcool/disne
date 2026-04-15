import { db } from './db';

const newPost = {
  title: '解锁魔法：迪士尼纸牌游戏新手指南',
  content: `欢迎，各位迪士尼粉丝和纸牌游戏爱好者！

如果您正在寻找一款既轻松又引人入胜的游戏，那么《迪士尼纸牌》将是您的完美选择。这不仅仅是任何普通的纸牌游戏；这是一场穿越经典迪士尼世界的奇妙旅程，充满了您喜爱的角色和迷人的主题。

### 游戏玩法基础

《迪士尼纸牌》的核心玩法遵循经典的单人纸牌规则，但加入了独特的魔法元素。您的目标是按照顺序清理桌面上的所有纸牌。一路上，您将解锁强大的魔法道具，帮助您克服挑战性的关卡。

### 为什么它如此迷人？

*   **怀旧的角色**：与来自《冰雪奇缘》、《狮子王》、《小美人鱼》等电影的角色一起玩耍。
*   **美丽的场景**：每个关卡都带您进入一个制作精美的迪士尼场景。
*   **收集与奖励**：完成挑战，收集独特的卡牌，并解锁专属奖励。

准备好开始您的冒险了吗？立即加入，体验最神奇的纸牌游戏！`
};

async function insertPost() {
  try {
    // Assuming a table named 'posts' with 'title' and 'content' columns
    const query = 'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id;';
    const values = [newPost.title, newPost.content];
    
    const { rows } = await db.query(query, values);
    
    console.log('✅ Blog post successfully inserted! Post ID:', rows[0].id);
  } catch (error) {
    console.error('❌ Error inserting blog post:', error);
    console.log("\n🤔 Hint: Does the 'posts' table with 'title' and 'content' columns exist?");
  }
}

insertPost();
