import { Post } from "@/types/post";
import { db } from "@/lib/db";
import { DEFAULT_POST_COVER_URL } from "@/lib/post-cover";

export enum PostStatus {
  Created = "created",
  Deleted = "deleted",
  Online = "online",
  Offline = "offline",
}

const RELATED_POST_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "best",
  "cards",
  "classic",
  "disney",
  "for",
  "from",
  "game",
  "games",
  "get",
  "guide",
  "how",
  "in",
  "is",
  "it",
  "more",
  "of",
  "play",
  "player",
  "players",
  "solitaire",
  "still",
  "that",
  "the",
  "tips",
  "to",
  "use",
  "what",
  "why",
  "without",
]);

const RELATED_POST_TOPIC_GROUPS = [
  ["beginner", "beginners", "stuck", "easy", "start"],
  ["high", "score", "chain", "chains"],
  ["history", "classic", "modern", "matter"],
  ["power", "powerup", "powerups", "wild", "undo", "tool", "tools"],
  ["daily", "event", "events", "challenge", "challenges", "rewards"],
  ["coin", "coins", "resource", "resources", "save", "saving"],
  ["free", "spending", "overspending", "money"],
  ["deck", "draw", "draws", "connector", "connectors"],
  ["hard", "difficult", "tough", "levels", "level"],
  ["family", "families", "browser", "mobile", "casual"],
  ["win", "wins", "streak", "streaks", "losing"],
  ["strategy", "advanced", "mistakes", "timing", "value"],
];

function tokenizeRelatedPostText(value: string | undefined) {
  if (!value) {
    return new Set<string>();
  }

  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((token) => token && !RELATED_POST_STOPWORDS.has(token))
  );
}

function getPostTokens(post: Post) {
  return new Set([
    ...tokenizeRelatedPostText(post.slug),
    ...tokenizeRelatedPostText(post.title),
    ...tokenizeRelatedPostText(post.description),
  ]);
}

function getTopicGroupMatches(tokens: Set<string>) {
  return RELATED_POST_TOPIC_GROUPS.reduce((matches, group, index) => {
    if (group.some((keyword) => tokens.has(keyword))) {
      matches.add(index);
    }

    return matches;
  }, new Set<number>());
}

function countIntersection<T>(left: Set<T>, right: Set<T>) {
  let count = 0;

  for (const value of left) {
    if (right.has(value)) {
      count += 1;
    }
  }

  return count;
}

function getRelatedPostScore(source: Post, candidate: Post) {
  const sourceTokens = getPostTokens(source);
  const candidateTokens = getPostTokens(candidate);
  const sharedTokens = countIntersection(sourceTokens, candidateTokens);

  const sourceGroups = getTopicGroupMatches(sourceTokens);
  const candidateGroups = getTopicGroupMatches(candidateTokens);
  const sharedGroups = countIntersection(sourceGroups, candidateGroups);

  let score = sharedTokens * 4 + sharedGroups * 6;

  if (source.author_name && source.author_name === candidate.author_name) {
    score += 1;
  }

  return score;
}

export async function insertPost(post: Post) {
  const query = `
    INSERT INTO posts (
      uuid,
      slug,
      title,
      description,
      content,
      created_at,
      updated_at,
      status,
      locale,
      cover_url,
      author_name,
      author_avatar_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;

  const values = [
    post.uuid,
    post.slug,
    post.title,
    post.description,
    post.content,
    post.created_at || new Date().toISOString(),
    post.updated_at || post.created_at || new Date().toISOString(),
    post.status || PostStatus.Created,
    post.locale || "en",
    post.cover_url || DEFAULT_POST_COVER_URL,
    post.author_name,
    post.author_avatar_url,
  ];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error inserting post:", error);
    throw error;
  }
}

export async function updatePost(uuid: string, post: Partial<Post>) {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (post.slug !== undefined) {
    updates.push(`slug = $${paramIndex++}`);
    values.push(post.slug);
  }
  if (post.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    values.push(post.title);
  }
  if (post.description !== undefined) {
    updates.push(`description = $${paramIndex++}`);
    values.push(post.description);
  }
  if (post.content !== undefined) {
    updates.push(`content = $${paramIndex++}`);
    values.push(post.content);
  }
  if (post.status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    values.push(post.status);
  }
  if (post.locale !== undefined) {
    updates.push(`locale = $${paramIndex++}`);
    values.push(post.locale);
  }
  if (post.cover_url !== undefined) {
    updates.push(`cover_url = $${paramIndex++}`);
    values.push(post.cover_url);
  }
  if (post.author_name !== undefined) {
    updates.push(`author_name = $${paramIndex++}`);
    values.push(post.author_name);
  }
  if (post.author_avatar_url !== undefined) {
    updates.push(`author_avatar_url = $${paramIndex++}`);
    values.push(post.author_avatar_url);
  }

  updates.push(`updated_at = NOW()`);

  const query = `
    UPDATE posts
    SET ${updates.join(", ")}
    WHERE uuid = $${paramIndex++}
    RETURNING *
  `;

  values.push(uuid);

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function findPostByUuid(uuid: string): Promise<Post | undefined> {
  const query = `SELECT * FROM posts WHERE uuid = $1 LIMIT 1`;

  try {
    const { rows } = await db.query(query, [uuid]);
    return rows[0];
  } catch (error) {
    console.error("Error finding post by uuid:", error);
    return undefined;
  }
}

export async function findPostBySlug(
  slug: string,
  locale: string
): Promise<Post | undefined> {
  const query = `
    SELECT * FROM posts
    WHERE slug = $1 AND locale = $2
    LIMIT 1
  `;

  try {
    const { rows } = await db.query(query, [slug, locale]);
    return rows[0];
  } catch (error) {
    console.error("Error finding post by slug:", error);
    return undefined;
  }
}

export async function getAllPosts(
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const offset = (page - 1) * limit;
  const query = `
    SELECT * FROM posts
    WHERE status != 'deleted'
    ORDER BY created_at DESC NULLS LAST
    LIMIT $1 OFFSET $2
  `;

  try {
    const { rows } = await db.query(query, [limit, offset]);
    return rows;
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
}

export async function getPostsByLocale(
  locale: string,
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const offset = (page - 1) * limit;
  const query = `
    SELECT * FROM posts
    WHERE locale = $1 AND status = 'online'
    ORDER BY created_at DESC NULLS LAST
    LIMIT $2 OFFSET $3
  `;

  try {
    const { rows } = await db.query(query, [locale, limit, offset]);
    return rows;
  } catch (error) {
    console.error("Error getting posts by locale:", error);
    return [];
  }
}

export async function getRelatedPosts(
  locale: string,
  slug: string,
  limit: number = 6
): Promise<Post[]> {
  try {
    const currentPost = await findPostBySlug(slug, locale);

    const query = `
      SELECT * FROM posts
      WHERE locale = $1 AND status = 'online' AND slug != $2
      ORDER BY created_at DESC NULLS LAST
      LIMIT $3
    `;

    const { rows } = await db.query(query, [locale, slug, limit * 4]);

    if (!currentPost) {
      return rows.slice(0, limit);
    }

    return [...rows]
      .sort((left: any, right: any) => {
        const scoreDiff =
          getRelatedPostScore(currentPost, right) -
          getRelatedPostScore(currentPost, left);

        if (scoreDiff !== 0) {
          return scoreDiff;
        }

        return (
          new Date(right.created_at || 0).getTime() -
          new Date(left.created_at || 0).getTime()
        );
      })
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting related posts:", error);
    return [];
  }
}
