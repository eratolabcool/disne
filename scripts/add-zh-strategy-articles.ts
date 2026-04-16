import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });

import { insertPost, PostStatus } from "../models/post";
import { getUuid } from "../lib/hash";
import { getIsoTimestr } from "../lib/time";
import { Post } from "../types/post";

const zhStrategyArticles: Omit<Post, "uuid" | "created_at">[] = [
  {
    title: "Disney Solitaire 游戏攻略：从新手入门到稳定通关",
    slug: "disney-solitaire-you-xi-gong-lue-xin-shou-ru-men",
    description:
      "这篇 Disney Solitaire 游戏攻略从基础规则、关卡判断、留牌思路到道具节奏，帮助新手快速建立稳定通关的方法。",
    locale: "zh",
    status: PostStatus.Online,
    author_name: "纸牌玩法编辑部",
    author_avatar_url: "/imgs/users/disney-expert.jpg",
    cover_url: "/imgs/disney/disney-solitaire-guide.jpg",
    content: `# Disney Solitaire 游戏攻略：从新手入门到稳定通关

如果你刚开始接触 Disney Solitaire，最容易遇到的问题不是不会点牌，而是不知道每一步到底该优先做什么。真正有效的游戏攻略，不是死记规则，而是建立一套稳定的判断顺序。

## 先理解核心玩法

Disney Solitaire 的底层逻辑来自 TriPeaks 纸牌玩法。你需要根据当前牌面，点击比当前牌点数高一张或低一张的明牌，连续消除来清空牌阵。连续出牌越长，得分越高，资源收益也越多。

## 新手最该掌握的三件事

### 1. 优先翻开被压住的牌
每次移动前，都先看哪张牌能解锁更多覆盖牌。能打开新信息的操作，通常比眼前多拿一点分数更重要。

### 2. 不急着抽牌
很多新手一断连就抽牌，但高手会先把场上所有可能路线都看一遍。只要还能延续，就尽量别动牌堆，因为抽牌会打断节奏。

### 3. 留住万能牌和关键道具
万能牌最适合用于以下场景：
- 差一步就能翻开一大片被压住的牌
- 可以延续长连击
- 终局只剩少量难处理牌时

## 一套实用的通关判断顺序

每回合可以按这个顺序思考：

1. 哪一步能翻开最多新牌
2. 哪一步能保留更多后续连接
3. 哪一步能形成更长的连击
4. 如果都不理想，再考虑抽牌或使用道具

## 前中后期打法区别

### 前期
前期目标不是拿高分，而是快速展开局面。优先清理覆盖层，尽可能把隐藏牌翻出来。

### 中期
中期开始要考虑路线管理。不要只看当前能不能出，还要看打完这一步后，下一步会不会直接断掉。

### 后期
后期最重要的是收尾。此时如果只剩几个孤立牌，万能牌、撤销和额外道具的价值会明显提升。不要把资源浪费在前期简单局面上。

## 常见失误

- 只看当前可出的牌，不看后续两三步
- 过早使用万能牌
- 为了短分数放弃翻开关键覆盖牌
- 连击断掉后立刻抽牌，没有先检查全场

## 适合新手的练习方法

建议连续练 10 局时只专注一个目标，例如：
- 只练“尽量少抽牌”
- 只练“优先翻开覆盖牌”
- 只练“万能牌留到最后三分之一关卡再用”

这样提升会比盲打更快。

## 总结

Disney Solitaire 最有效的游戏攻略，其实就是一句话：先扩展信息，再追求连击，最后才是赌运气。只要你把每一步都围绕“翻牌、续连、留资源”来做判断，通关会越来越稳定。`,
  },
  {
    title: "Disney Solitaire 高分技巧：连击、留牌与道具节奏",
    slug: "disney-solitaire-gao-fen-ji-qiao",
    description:
      "想在 Disney Solitaire 打出更高分？这篇高分技巧文章重点讲清楚连击长度、路线选择、抽牌控制和道具使用节奏。",
    locale: "zh",
    status: PostStatus.Online,
    author_name: "高分研究员",
    author_avatar_url: "/imgs/users/strategy-expert.jpg",
    cover_url: "/imgs/disney/disney-solitaire-tips.jpg",
    content: `# Disney Solitaire 高分技巧：连击、留牌与道具节奏

很多玩家能过关，但分数总是不高。问题通常不在操作速度，而在于你有没有把每一步都服务于“更长连击”。

## 高分从哪里来

Disney Solitaire 的高分主要依赖三部分：
- 长连击带来的倍率
- 少抽牌带来的节奏收益
- 收尾时保留资源的额外价值

所以真正的高分技巧，不是见牌就点，而是控制节奏。

## 技巧一：优先选择能延长链条的牌

当场上同时有两张都能接上的牌时，不要只看当前收益，要看哪一张打出去后，后续还能继续接。能打出 5 步和只能打出 2 步，价值完全不同。

## 技巧二：少抽牌就是高分基础

抽牌会让连击归零，也会让可控局面变成随机局面。高分玩家通常会在抽牌前多做一次检查：

1. 场上有没有被忽略的小连接
2. 当前选择会不会解锁新的接牌点
3. 是否可以用撤销修正路线

## 技巧三：保留大牌转折点

像 A、2、Q、K 这类边界牌，经常能改变路线衔接。看到它们时，不要急着打空，要思考它们是不是后续长链的桥梁。

## 技巧四：道具不要用来“救普通失误”

道具最值钱的时候，是它能做到下面任意一件事：
- 直接续上长连击
- 打开被压住的核心牌区
- 避免一次低质量抽牌
- 帮你完成终局清台

如果只是为了消掉一张普通孤牌，往往不划算。

## 技巧五：中盘要学会留牌

很多高分局的关键不是“马上能打什么”，而是“先不打什么”。保留某张牌，可能会让你在两步后形成更长的双向连接。

## 技巧六：终局优先清风险点

残局经常只差一两张牌就能完美收尾。这时候优先处理：
- 被孤立的边缘牌
- 只剩单一路线的卡点
- 会逼迫你抽牌的断层

## 一套适合冲榜的实战思路

### 开局
快速翻牌，建立更多可选路线。

### 中盘
围绕“最长连击”做选择，不轻易抽牌。

### 收尾
优先确保清台，再考虑把剩余道具转化为高分。

## 总结

高分技巧的核心并不复杂：减少无意义抽牌，延长连击，保留关键转折牌，把道具留给真正能放大收益的节点。只要你的每一步都围绕倍率和连锁思考，分数就会明显提升。`,
  },
  {
    title: "纸牌游戏历史：从传统接龙到 Disney Solitaire 的演变",
    slug: "zhi-pai-you-xi-li-shi-cong-jie-long-dao-disney-solitaire",
    description:
      "这篇文章梳理纸牌游戏历史，从传统扑克牌、经典接龙、TriPeaks，到 Disney Solitaire 这种现代主题化纸牌玩法的演变过程。",
    locale: "zh",
    status: PostStatus.Online,
    author_name: "游戏史研究者",
    author_avatar_url: "/imgs/users/gaming-specialist.jpg",
    cover_url: "/imgs/disney/disney-solitaire-guide.jpg",
    content: `# 纸牌游戏历史：从传统接龙到 Disney Solitaire 的演变

纸牌游戏之所以能流行几百年，是因为它同时满足了规则清晰、随机性强、策略空间足够大的三项条件。今天我们玩的 Disney Solitaire，其实就是传统纸牌玩法长期演变后的一个现代分支。

## 纸牌游戏的早期形态

最早的纸牌游戏起源可以追溯到更早期的纸质娱乐形式，后来在不同地区发展出各自的花色、规则和玩法。随着扑克牌逐渐标准化，围绕比大小、出牌顺序和牌组管理的游戏开始变得越来越丰富。

## 接龙为什么能成为经典

接龙类玩法之所以能长久存在，是因为它兼顾了：
- 单人可玩
- 规则容易理解
- 运气与策略并存
- 每局时间可长可短

这类特性非常适合日常碎片化娱乐，因此从实体纸牌时代一路延续到了电脑时代。

## 电脑时代让接龙真正大众化

数字化把接龙从桌面搬进了屏幕，也降低了入门门槛。系统自动洗牌、自动提示、撤销功能的加入，让更多玩家愿意接触原本略显“传统”的纸牌玩法。

## TriPeaks 带来了更强节奏感

相比经典接龙，TriPeaks 更强调连续消除、节奏推进和局面展开。它的乐趣不只是“整理牌堆”，而是不断寻找上下衔接的机会，让一局游戏更像连锁反应。

## 现代纸牌游戏的变化方向

近年来，纸牌游戏主要往三个方向发展：

### 1. 主题化
加入角色、美术和故事背景，让玩法不再只是规则本身。

### 2. 关卡化
每一关有不同布局和目标，带来持续挑战。

### 3. 资源化
加入道具、活动、奖励和成长系统，提高长期留存。

## Disney Solitaire 为什么有代表性

Disney Solitaire 正是这种演变的典型结果。它保留了 TriPeaks 的核心消除逻辑，同时加入迪士尼角色主题、场景收集、关卡推进和更鲜明的视觉反馈。

这意味着现代玩家进入纸牌游戏，不再只是为了“消磨时间”，而是为了：
- 获得轻度策略挑战
- 收集角色和场景内容
- 在熟悉 IP 中获得情绪价值

## 从历史看它的吸引力

如果把纸牌游戏历史看成一条线，那么 Disney Solitaire 的位置很清楚：
- 它继承了传统接龙的易上手
- 借用了 TriPeaks 的强节奏
- 叠加了现代手游的内容运营能力

## 总结

从纸牌到接龙，从桌面到数字化，再到 Disney Solitaire 这样的主题化作品，变化的是包装和系统，不变的是“在有限信息里寻找最优出牌路线”的核心乐趣。这也是纸牌游戏历史能够不断延续的重要原因。`,
  },
  {
    title: "Disney Solitaire 新手指南：卡关时最有用的 8 个思路",
    slug: "disney-solitaire-xin-shou-zhi-nan-ka-guan-si-lu",
    description:
      "这篇 Disney Solitaire 新手指南专门解决卡关问题，整理了 8 个最常用的破局思路，适合刚上手或经常失败的玩家。",
    locale: "zh",
    status: PostStatus.Online,
    author_name: "新手导师",
    author_avatar_url: "/imgs/users/tutorial-expert.jpg",
    cover_url: "/imgs/disney/how-to-play-disney-solitaire.jpg",
    content: `# Disney Solitaire 新手指南：卡关时最有用的 8 个思路

很多玩家不是不会玩，而是每次卡关时不知道该怎么重新整理思路。下面这 8 个方法，能帮你在 Disney Solitaire 里更快找到破局点。

## 1. 先找“能翻两层”的位置

如果一张牌打掉后能同时解锁两张甚至更多隐藏牌，它的优先级通常最高。

## 2. 断连之前先把全场看完

不要因为眼前没看到明显连接就立刻抽牌。很多时候，真正的机会藏在边角位置。

## 3. 把撤销当成信息工具

撤销不只是补救失误，也可以帮助你测试不同路线哪一条更优。

## 4. 卡住时优先保命，不要硬冲分

如果当前局面风险很高，就先以通关为目标，不必强求高连击。

## 5. 留意边界牌

A、2、Q、K 这种牌很容易影响路线衔接。它们既可能救场，也可能让你提前断线。

## 6. 道具要围绕“翻牌”和“续连”

凡是不能帮你做到这两点的道具使用，往往收益有限。

## 7. 观察失败局的共同点

如果你总在某种布局失败，说明问题不是运气，而是处理方式固定。复盘比多打一局更有价值。

## 8. 给自己设单一练习目标

比如今天只练少抽牌，明天只练保留万能牌。把技能拆开练，比一味通关效率更高。

## 总结

新手最需要的不是更多规则，而是可重复使用的判断框架。只要你把卡关时的思路固定下来，很多原本看起来靠运气的局面，其实都能慢慢拆开。`,
  },
  {
    title: "Disney Solitaire 道具使用指南：什么时候用最划算",
    slug: "disney-solitaire-dao-ju-shi-yong-zhi-nan",
    description:
      "Disney Solitaire 道具什么时候用才最值？这篇文章从万能牌、撤销、清除类道具和残局处理角度，讲清楚使用时机。",
    locale: "zh",
    status: PostStatus.Online,
    author_name: "道具策略顾问",
    author_avatar_url: "/imgs/users/mobile-expert.jpg",
    cover_url: "/imgs/disney/disney-solitaire-powerups.jpg",
    content: `# Disney Solitaire 道具使用指南：什么时候用最划算

很多玩家手上明明有道具，还是会卡关，原因通常不是道具太少，而是使用时机不对。

## 道具最常见的三个浪费点

- 关卡前半段就急着使用
- 只是为了消掉一张普通牌
- 没想清楚用完后能不能带来连续收益

## 万能牌什么时候最值

万能牌最适合以下三种局面：
- 可以直接翻出一整片隐藏牌
- 能把断掉的长连击接回来
- 终局只差一两步就能清台

如果只是为了接一张普通过渡牌，往往不划算。

## 撤销什么时候最有意义

撤销的最佳用途不是“手滑修正”，而是：
- 对比两条不同路线
- 避免一次错误抽牌
- 重新规划中盘节奏

## 清除类道具怎么判断目标

优先清理这几类牌：
- 压住关键区域的牌
- 单张阻断多条路径的牌
- 明显会逼你马上抽牌的卡点

## 收尾阶段为什么更适合用道具

前期信息不完整，道具价值不容易放大。到了后期，牌面结构清楚，你更容易判断一个道具能不能直接换来通关或高分。

## 一个简单判断公式

在使用前问自己三个问题：

1. 这个道具能不能帮我翻更多牌
2. 能不能延长连击
3. 能不能减少一次低质量抽牌

如果三个都不能，通常就不急着用。

## 总结

Disney Solitaire 的道具不是为了“看起来安全”而使用，而是为了在关键节点放大收益。学会把道具留给翻牌、续连和收尾，你的通关率和资源效率都会一起提高。`,
  },
  {
    title: "TriPeaks 规则详解：为什么 Disney Solitaire 比传统接龙更有节奏",
    slug: "tripeaks-gui-ze-xiang-jie-disney-solitaire",
    description:
      "想看懂 Disney Solitaire 的核心玩法，可以先理解 TriPeaks 规则。这篇文章解释其基础规则、节奏优势和与传统接龙的区别。",
    locale: "zh",
    status: PostStatus.Online,
    author_name: "规则说明员",
    author_avatar_url: "/imgs/users/character-expert.jpg",
    cover_url: "/imgs/disney/disney-solitaire-download.jpg",
    content: `# TriPeaks 规则详解：为什么 Disney Solitaire 比传统接龙更有节奏

很多玩家喜欢 Disney Solitaire，却说不清它和传统接龙到底哪里不一样。关键答案就在它采用的 TriPeaks 规则。

## TriPeaks 的基本结构

TriPeaks 通常由三座牌峰组成，玩家需要根据当前底牌，连接点数相邻的明牌进行连续消除。目标是在有限牌堆内尽量清空场上牌阵。

## 和传统接龙最大的区别

### 传统接龙
- 更强调花色与顺序整理
- 玩法偏静态
- 单局时间相对更长

### TriPeaks
- 更强调连续消除
- 节奏更快
- 更适合手游关卡化设计

## 为什么它更适合 Disney 主题

Disney 题材强调视觉反馈、收集驱动和轻松节奏。TriPeaks 本身就适合做成：
- 更快的胜负反馈
- 更明显的连击爽感
- 更容易理解的关卡目标

这和 Disney Solitaire 的产品设计非常契合。

## 你在实战中需要理解的重点

### 1. 连续性比单步正确更重要
能多连几张，通常比单步最优更关键。

### 2. 翻牌效率决定上限
如果你一直只处理表面牌，局面会越来越窄。

### 3. 牌堆就是你的容错空间
每次抽牌都在消耗容错，所以不要随便用。

## 为什么很多人会觉得“上头”

因为 TriPeaks 的反馈非常直接：
- 看到长链会立刻产生正反馈
- 翻开隐藏牌会不断获得新希望
- 每一局都短，但总让人想再来一局

## 总结

想真正玩懂 Disney Solitaire，不一定要先背很多技巧，但一定要理解 TriPeaks 的节奏本质。它不是慢慢整理牌，而是在有限资源里不断延续连锁，这也是它比传统接龙更有爽感的原因。`,
  },
];

export async function addZhStrategyArticles() {
  console.log("开始插入中文纸牌策略文章...");

  for (const article of zhStrategyArticles) {
    try {
      const post: Post = {
        ...article,
        uuid: getUuid(),
        created_at: getIsoTimestr(),
      };

      await insertPost(post);
      console.log(`已插入: ${article.title}`);
    } catch (error) {
      console.error(`插入失败: ${article.title}`, error);
    }
  }

  console.log("中文纸牌策略文章插入完成。");
}

if (require.main === module) {
  addZhStrategyArticles().catch(console.error);
}
