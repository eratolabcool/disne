import { Post } from "@/types/post";
import { getSupabaseClient } from "./db";

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
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("posts").insert(post);

  if (error) {
    throw error;
  }

  return data;
}

export async function updatePost(uuid: string, post: Partial<Post>) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .update(post)
    .eq("uuid", uuid);

  if (error) {
    throw error;
  }

  return data;
}

export async function findPostByUuid(uuid: string): Promise<Post | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("uuid", uuid)
    .limit(1)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

export async function findPostBySlug(
  slug: string,
  locale: string
): Promise<Post | undefined> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .limit(1)
      .single();

    if (error) {
      return undefined;
    }

    return data;
  } catch {
    return undefined;
  }
}

export async function getAllPosts(
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    return [];
  }

  return data;
}

export async function getPostsByLocale(
  locale: string,
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("locale", locale)
      .eq("status", PostStatus.Online)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

export async function getRelatedPosts(
  locale: string,
  slug: string,
  limit: number = 6
): Promise<Post[]> {
  try {
    const supabase = getSupabaseClient();
    const currentPost = await findPostBySlug(slug, locale);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("locale", locale)
      .eq("status", PostStatus.Online)
      .neq("slug", slug)
      .order("created_at", { ascending: false })
      .limit(Math.max(limit * 4, 24));

    if (error) {
      return [];
    }

    if (!currentPost) {
      return data.slice(0, limit);
    }

    return [...data]
      .sort((left, right) => {
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
  } catch {
    return [];
  }
}
