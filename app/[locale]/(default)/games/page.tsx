import MoreGames from "@/components/blocks/more-games";
import {
  buildNetworkGameUrl,
  gameCategoryLabels,
  getGamesByCategory,
  networkGames,
} from "@/lib/game-network";
import { ArrowRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "";
  const canonicalUrl =
    locale === "en" ? `${baseUrl}/games` : `${baseUrl}/${locale}/games`;

  return {
    title: "EratoGame Network - Word, Puzzle & Daily Games",
    description:
      "Explore the EratoGame network of word games, puzzle games, daily games, and casual game tools connected from Disney Solitaire.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function GamesPage() {
  const eratoGame = networkGames[0];

  return (
    <>
      <section className="network-hero bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <p className="network-hero-eyebrow mb-3 text-sm font-semibold uppercase tracking-wide !text-violet-300">
            Unified Game Entrance
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight !text-white md:text-6xl">
            EratoGame connects the full casual game network
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Use EratoGame as the central hub: Disney Solitaire sends players to
            EratoGame, then EratoGame routes them into word games, puzzle games,
            daily games, and partner game tools.
          </p>
          <a
            href={buildNetworkGameUrl(eratoGame, "games_hub_hero")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Open EratoGame
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="border-b bg-background py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
          {(Object.keys(gameCategoryLabels) as Array<
            keyof typeof gameCategoryLabels
          >).map((category) => (
            <div
              key={category}
              id={`${category}-games`}
              className="rounded-md border p-5"
            >
              <h2 className="text-xl font-bold">
                {gameCategoryLabels[category]}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {getGamesByCategory(category).map((game) => (
                  <a
                    key={game.domain}
                    href={buildNetworkGameUrl(game, `games_${category}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary"
                  >
                    {game.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <MoreGames />
    </>
  );
}
