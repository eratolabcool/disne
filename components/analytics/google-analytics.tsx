"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const analyticsId =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "G-SN0W7YDXBG";
  if (!analyticsId) {
    return null;
  }

  return (
    <>
      <Script
        id="google-gtag-src"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${analyticsId}');
          `,
        }}
      />
    </>
  );
}
