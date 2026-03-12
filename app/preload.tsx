// Resource preloading component for performance optimization
import Head from 'next/head';

interface ResourcePreloaderProps {
  locale: string;
}

export default function ResourcePreloader({
  locale,
}: ResourcePreloaderProps) {
  void locale;

  return (
    <Head>
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />

      {/* Preconnect for critical resources */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      {/* Preload critical fonts */}
      <link
        rel="preload"
        href="/fonts/Inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin=""
      />

      {/* Preload critical images */}
      <link rel="preload" href="/imgs/badges/phdaily.svg" as="image" />

      {/* Preload critical stylesheets */}
      <link rel="preload" href="/theme.css" as="style" />

      {/* Modulepreload for critical JavaScript */}
      <link rel="modulepreload" href="/_next/static/chunks/main-app.js" />
      <link rel="modulepreload" href="/_next/static/chunks/app-pages-internals.js" />

      {/* Hints for browser */}
      <link rel="prefetch" href="/api/ping" as="fetch" crossOrigin="use-credentials" />
    </Head>
  );
}
