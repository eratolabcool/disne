import dynamic from "next/dynamic";
import { getLandingPage } from "@/services/page";
import Hero from "@/components/blocks/hero";
import Feature1 from "@/components/blocks/feature1";
import Feature2 from "@/components/blocks/feature2";
import Feature from "@/components/blocks/feature";
import Stats from "@/components/blocks/stats";
import FAQ from "@/components/blocks/faq";
import CTA from "@/components/blocks/cta";
import GameGrid from "@/components/blocks/game-grid";

// Components that need to be Client-only are now imported via next/dynamic 
// without ssr: false here, because this is a Server Component.
// The components themselves should handle their client-side only nature 
// (e.g., using useEffect or being marked with 'use client').
const LocalVideo = dynamic(() => import("@/components/blocks/video/local-video"));

const CharacterTable = dynamic(() => import("@/components/blocks/chractor"), {
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-gray-500">Loading Disney Characters...</div>
      </div>
    </div>
  ),
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLandingPage(locale);
  const faqSchema =
    page.faq?.items && page.faq.items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: locale,
          mainEntity: page.faq.items
            .filter((item) => item.title && item.description)
            .map((item) => ({
              "@type": "Question",
              name: item.title,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.description,
              },
            })),
        }
      : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {page.hero && <Hero hero={page.hero} />}
      <GameGrid />
      {/*page.branding && <Branding section={page.branding} />*/}
      {page.introduce && <Feature1 section={page.introduce} />}
      <LocalVideo />
      {page.benefit && <Feature2 section={page.benefit} />}
      {/*page.usage && <Feature3 section={page.usage} />*/}
      {page.feature && <Feature section={page.feature} />}
      {/*page.showcase && <Showcase section={page.showcase} />*/}
      {page.stats && <Stats section={page.stats} />}
      {/*page.pricing && <Pricing pricing={page.pricing} />*/}
      {/*page.testimonial && <Testimonial section={page.testimonial} />*/}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
      <CharacterTable />
    </>
  );
}
