import "@/app/globals.css";

import { getMessages } from "next-intl/server";

import { AppContextProvider } from "@/contexts/app";
import { Inter as FontSans } from "next/font/google";
import { Metadata } from "next";
import { NextAuthSessionProvider } from "@/auth/session";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme";
import { cn } from "@/lib/utils";
import Script from "next/script";
import Analytics from "@/components/analytics";

import { locales } from "@/i18n/locale";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://disneysolitaire.net";
  
  // 构建当前语言的规范链接
  const canonicalUrl = locale === "en" ? baseUrl : `${baseUrl}/${locale}`;

  // 构建所有语言的备用链接
  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[l] = l === "en" ? baseUrl : `${baseUrl}/${l}`;
  });
  languages["x-default"] = baseUrl;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | Disney Solitaire - Play Magical Free Online Card Game`,
      default: "Disney Solitaire - Play Magical Free Online Card Game",
    },
    description: "Play Disney Solitaire free online! Experience the magic of Disney in this enchanting card game adventure with your favorite characters. No download required for the best online experience.",
    keywords: "disney solitaire, play disney solitaire, disney solitaire free online, disney card game, solitaire game unblocked, disney characters card game",
    alternates: {
      canonical: canonicalUrl,
      languages: languages,
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/favicon.ico",
      apple: "/logo.jpg",
    },
    appleWebApp: {
      capable: true,
      title: "Disney Solitaire",
      statusBarStyle: "default",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Performance Optimization: Resource Hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.supabase.co" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.supabase.co" crossOrigin="" />

        {/* Critical Image Preloading */}
        <link rel="preload" href="/imgs/badges/phdaily.svg" as="image" />
        <link rel="preload" href="/imgs/disney/og-image.jpg" as="image" />
        <link rel="preload" href="/imgs/disney/twitter-card.jpg" as="image" />

        {/* Analytics & Scripts */}
        <script defer data-domain="disneysolitaire.net" src="https://plausible.riftrunner.art/js/script.js"></script>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Game",
              "name": "Disney Solitaire",
              "description": "Experience the magic of Disney in this enchanting solitaire card game adventure!",
              "url": process.env.NEXT_PUBLIC_WEB_URL || "https://disneysolitaire.net",
              "applicationCategory": "Game",
              "operatingSystem": "Web Browser",
              "author": {
                "@type": "Organization",
                "name": "Disney Solitaire Team"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "genre": ["Card Game", "Puzzle", "Family Game"],
              "keywords": "disney solitaire, disney card game, solitaire game, disney characters"
            })
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          fontSans.variable
        )}
      >
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7627909166795192"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />

        {/* Service Worker Registration */}
        <Script
          id="service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                  .then(registration => {
                    console.log('SW registered: ', registration);
                  })
                  .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                  });
              }
            `,
          }}
        />

        {/* Web Vitals Monitoring */}
        <Script
          id="web-vitals"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Basic Web Vitals tracking
              const reportWebVitals = (metric) => {
                console.log('[Performance]', metric.name, ':', Math.round(metric.value));

                // Send to analytics if available
                if (typeof gtag !== 'undefined') {
                  gtag('event', metric.name, {
                    event_category: 'Web Vitals',
                    value: Math.round(metric.value),
                    event_label: metric.id,
                    non_interaction: true,
                  });
                }
              };

              // Simple performance monitoring
              const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (entry.entryType === 'largest-contentful-paint') {
                    reportWebVitals({
                      name: 'LCP',
                      value: entry.startTime,
                      id: 'lcp'
                    });
                  } else if (entry.entryType === 'first-input') {
                    reportWebVitals({
                      name: 'FID',
                      value: entry.processingStart - entry.startTime,
                      id: 'fid'
                    });
                  }
                }
              });

              observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });

              // CLS monitoring
              let clsValue = 0;
              const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                  }
                }
                reportWebVitals({
                  name: 'CLS',
                  value: clsValue,
                  id: 'cls'
                });
              });
              clsObserver.observe({ entryTypes: ['layout-shift'] });
            `,
          }}
        />

        {/* Performance Optimization Script */}
        <Script
          id="performance-optimizations"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Preload critical resources
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              }

              // Optimize font loading
              if ('fonts' in document) {
                Promise.all([
                  document.fonts.load('400 1em Inter'),
                  document.fonts.load('500 1em Inter'),
                  document.fonts.load('600 1em Inter'),
                  document.fonts.load('700 1em Inter')
                ]).then(() => {
                  document.documentElement.classList.add('fonts-loaded');
                });
              }

              // Lazy loading optimization
              const lazyImages = document.querySelectorAll('img[loading="lazy"]');
              if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target;
                      if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                      }
                    }
                  });
                });

                lazyImages.forEach(img => imageObserver.observe(img));
              }

              // Reduce JavaScript execution time
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  // Load non-critical scripts during idle time
                  console.log('[Performance] Loading non-critical resources during idle time');
                });
              }
            `,
          }}
        />

        {/* Skip Links for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Skip to navigation
        </a>

        <NextIntlClientProvider messages={messages}>
          <NextAuthSessionProvider>
            <AppContextProvider>
              <ThemeProvider attribute="class" disableTransitionOnChange>
                {children}
                <Analytics />
              </ThemeProvider>
            </AppContextProvider>
          </NextAuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
