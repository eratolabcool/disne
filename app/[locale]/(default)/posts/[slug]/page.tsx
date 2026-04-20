import { PostStatus, findPostBySlug, getRelatedPosts } from "@/models/post";
import { DEFAULT_POST_COVER_URL } from "@/lib/post-cover";

import BlogDetail from "@/components/blocks/blog-detail";
import Empty from "@/components/blocks/empty";
import { Post } from "@/types/post";

interface CrossSiteLink {
  label: string;
  href: string;
}

function parseCrossSiteLinks(
  raw: string | undefined,
  slug: string,
  locale: string
): CrossSiteLink[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, href] = item.split("|").map((part) => part?.trim());
      if (!label || !href) {
        return null;
      }

      try {
        const url = new URL(href);
        url.searchParams.set("utm_source", "disneysolitaire.net");
        url.searchParams.set("utm_medium", "referral");
        url.searchParams.set("utm_campaign", "related_sites");
        url.searchParams.set("utm_content", `${locale}-${slug}`);
        return { label, href: url.toString() };
      } catch {
        return null;
      }
    })
    .filter((item): item is CrossSiteLink => item !== null);
}

function buildPostSchemas(post: Post, locale: string, slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://disneysolitaire.net";
  const postPath = locale === "en" ? `/posts/${slug}` : `/${locale}/posts/${slug}`;
  const postUrl = `${baseUrl}${postPath}`;
  const postsUrl = locale === "en" ? `${baseUrl}/posts` : `${baseUrl}/${locale}/posts`;
  const homeUrl = locale === "en" ? `${baseUrl}/` : `${baseUrl}/${locale}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    inLanguage: locale,
    mainEntityOfPage: postUrl,
    url: postUrl,
    datePublished: post.created_at || undefined,
    dateModified: post.updated_at || post.created_at || undefined,
    author: {
      "@type": "Person",
      name: post.author_name || "Disney Solitaire Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Disney Solitaire",
      url: baseUrl,
    },
    image: post.cover_url || DEFAULT_POST_COVER_URL,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: postsUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return { articleSchema, breadcrumbSchema };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const post = await findPostBySlug(slug, locale);

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/posts/${slug}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/posts/${slug}`;
  }

  return {
    title: post?.title,
    description: post?.description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await findPostBySlug(slug, locale);

  if (!post || post.status !== PostStatus.Online) {
    return <Empty message="Post not found" />;
  }

  const relatedPosts = await getRelatedPosts(locale, slug, 6);
  const crossSiteLinks = parseCrossSiteLinks(
    process.env.NEXT_PUBLIC_CROSS_SITE_LINKS,
    slug,
    locale
  );
  const { articleSchema, breadcrumbSchema } = buildPostSchemas(post, locale, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogDetail
        post={post}
        relatedPosts={relatedPosts}
        crossSiteLinks={crossSiteLinks}
      />
    </>
  );
}
