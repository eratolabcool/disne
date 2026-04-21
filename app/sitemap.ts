import { getPostsByLocale } from "@/models/post";
import { locales, defaultLocale } from "@/i18n/locale";
import type { Post } from "@/types/post";
import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL = "https://disneysolitaire.net";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_WEB_URL || DEFAULT_SITE_URL).replace(
    /\/+$/,
    ""
  );
}

/**
 * 为不同语言构建正确的 URL 路径
 * 遵循 localePrefix: "as-needed" 逻辑
 */
function buildLocalizedUrl(baseUrl: string, locale: string, path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // 如果是默认语言且逻辑是 as-needed，不加前缀
  if (locale === defaultLocale) {
    return `${baseUrl}${cleanPath === "/" ? "" : cleanPath}`;
  }

  // 其他语言加前缀
  return `${baseUrl}/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // 1. 静态页面
  const staticPaths = ["/", "/about", "/posts", "/classic-solitaire"];
  
  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: buildLocalizedUrl(baseUrl, locale, path),
        lastModified: now,
        changeFrequency: path === "/" ? "daily" : "weekly",
        priority: path === "/" ? 1.0 : 0.8,
      });
    }

    // 2. 动态文章页面
    // 只为数据库中有内容的语言生成文章链接
    let posts: Post[] = [];
    try {
      posts = await getPostsByLocale(locale, 1, 5000);
    } catch (error) {
      console.error(`Failed to fetch posts for sitemap (locale: ${locale}):`, error);
      posts = [];
    }

    for (const post of posts) {
      if (!post.slug) continue;

      entries.push({
        url: buildLocalizedUrl(baseUrl, locale, `/posts/${post.slug}`),
        lastModified: post.updated_at
          ? new Date(post.updated_at)
          : post.created_at
            ? new Date(post.created_at)
            : now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
