"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface AdUnitProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export default function AdUnit({
  slot,
  format = "auto",
  className = "",
}: AdUnitProps) {
  const adClient =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-7627909166795192";
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE;
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!adClient || !adSlot) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore duplicate ad push errors from hydration or route transitions.
    }
  }, [adClient, adSlot]);

  useEffect(() => {
    if (!adRef.current || !adSlot) {
      return;
    }

    let reported = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!reported && entry.isIntersecting) {
            window.gtag?.("event", "ad_unit_view", {
              event_category: "adsense",
              event_label: adSlot,
            });
            reported = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, [adSlot]);

  if (!adClient || !adSlot) {
    return null;
  }

  return (
    <div className={className} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
