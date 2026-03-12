"use client";

import AdUnit from "@/components/adsense/ad-unit";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

import Crumb from "./crumb";
import Markdown from "@/components/markdown";
import { Post } from "@/types/post";
import moment from "moment";

interface CrossSiteLink {
  label: string;
  href: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function BlogDetail({
  post,
  relatedPosts = [],
  crossSiteLinks = [],
}: {
  post: Post;
  relatedPosts?: Post[];
  crossSiteLinks?: CrossSiteLink[];
}) {
  const onCrossSiteClick = (label: string, href: string) => {
    window.gtag?.("event", "outbound_click", {
      event_category: "cross_site_referral",
      event_label: label,
      destination: href,
    });
  };

  const onRelatedClick = (title: string, slug: string | undefined) => {
    window.gtag?.("event", "related_post_click", {
      event_category: "internal_navigation",
      event_label: title,
      post_slug: slug,
    });
  };

  return (
    <section className="py-16">
      <div className="container">
        <Crumb post={post} />
        <h1 className="mb-7 mt-9 max-w-3xl text-2xl font-bold md:mb-10 md:text-4xl">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm md:text-base">
          {post.author_avatar_url && (
            <Avatar className="h-8 w-8 border">
              <AvatarImage
                src={post.author_avatar_url}
                alt={post.author_name}
              />
            </Avatar>
          )}
          <div>
            {post.author_name && (
              <span className="font-medium">{post.author_name}</span>
            )}

            <span className="ml-2 text-muted-foreground">
              on {post.created_at && moment(post.created_at).fromNow()}
            </span>
          </div>
        </div>
        <div className="relative py-8 grid max-w-screen-xl gap-4 lg:mt-0 lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="order-2 lg:order-none lg:col-span-8">
            <AdUnit className="mb-6" />
            {post.content && <Markdown content={post.content} />}
            <AdUnit className="mt-8" />
          </div>
          <aside className="order-1 flex h-fit flex-col gap-6 text-sm lg:sticky lg:top-8 lg:order-none lg:col-span-3 lg:col-start-10 lg:text-xs">
            <AdUnit />
            {relatedPosts.length > 0 && (
              <div className="rounded-xl border p-4">
                <h3 className="mb-3 text-sm font-semibold md:text-base">
                  Related Guides
                </h3>
                <ul className="space-y-3">
                  {relatedPosts.map((item) => (
                    <li key={item.uuid || item.slug}>
                      <Link
                        href={
                          item.locale === "en"
                            ? `/posts/${item.slug}`
                            : `/${item.locale}/posts/${item.slug}`
                        }
                        className="line-clamp-2 text-sm hover:underline"
                        onClick={() => onRelatedClick(item.title || "", item.slug)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {crossSiteLinks.length > 0 && (
              <div className="rounded-xl border p-4">
                <h3 className="mb-3 text-sm font-semibold md:text-base">
                  Recommended Sites
                </h3>
                <ul className="space-y-3">
                  {crossSiteLinks.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="line-clamp-2 text-sm hover:underline"
                        onClick={() => onCrossSiteClick(item.label, item.href)}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
