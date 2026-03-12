import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeroBg from "@/components/blocks/hero/bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import Link from "next/link";

export function HeroText({ hero }: { hero: HeroType }) {
  if (!hero) return null;
  
  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  return (
    <section className="relative z-10 py-24">
      <div className="container">
        <div className="text-center">
          {hero.announcement && (
            <a
              href={hero.announcement.url}
              className="mx-auto mb-3 inline-flex items-center gap-3 rounded-full border px-2 py-1 text-sm"
            >
              {hero.announcement.label && (
                <Badge>{hero.announcement.label}</Badge>
              )}
              {hero.announcement.title}
            </a>
          )}

          {texts && texts.length > 1 ? (
            <h1 className="mx-auto mb-3 mt-4 max-w-3xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              {texts[0]}
              <span className="bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
                {highlightText}
              </span>
              {texts[1]}
            </h1>
          ) : (
            <h1 className="mx-auto mb-3 mt-4 max-w-3xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              {hero.title}
            </h1>
          )}

          <p
            className="mx-auto max-w-3xl text-muted-foreground lg:text-xl"
            dangerouslySetInnerHTML={{ __html: hero.description || "" }}
          />
          {hero.buttons && (
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              {hero.buttons.map((item, i) => {
                return (
                  <Link
                    key={i}
                    href={item.url || ""}
                    target={item.target || ""}
                    className="flex items-center"
                  >
                    <Button
                      className="w-full"
                      size="lg"
                      variant={item.variant || "default"}
                    >
                      {item.title}
                      {item.icon && (
                        <Icon name={item.icon} className="ml-1" />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
          {hero.tip && (
            <p className="mt-8 text-md text-muted-foreground">{hero.tip}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Hero({ hero }: { hero: HeroType }) {
  if (!hero) return null;
  
  return (
    <>
      <HeroBg />
      <HeroText hero={hero} />
    </>
  );
}
