import { getPostsByLocale } from "@/models/post";
import { locales } from "@/i18n/locale";
import type { Post } from "@/types/post";
import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL = "https://disneysolitaire.net";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_WEB_URL || DEFAULT_SITE_URL).replace(
    /\/+$/,
    ""
  );
}

function buildLocalizedPath(locale: string, path: string) {
  if (locale === "en") {
    return path;
  }

  return `/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const localizedBase = buildLocalizedPath(locale, "");
    const staticPaths = ["", "/about", "/posts"];

    for (const path of staticPaths) {
      entries.push({
        url: `${baseUrl}${buildLocalizedPath(locale, path) || localizedBase}`,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    let posts: Post[] = [];
    try {
      posts = await getPostsByLocale(locale, 1, 5000);
    } catch {
      posts = [];
    }

    for (const post of posts) {
      if (!post.slug) {
        continue;
      }

      entries.push({
        url: `${baseUrl}${buildLocalizedPath(locale, `/posts/${post.slug}`)}`,
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
