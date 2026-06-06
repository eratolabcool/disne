import {
  buildNetworkGameUrl,
  gameCategoryLabels,
  getGamesByCategory,
  networkGames,
} from "@/lib/game-network";
import { ArrowRight, Gamepad2 } from "lucide-react";

export default function MoreGames() {
  return (
    <section id="more-games" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
              More Games
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Explore the EratoGame network
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              Disney Solitaire connects into EratoGame, then opens a wider
              network of daily word games, puzzle games, and casual game tools.
            </p>
          </div>
          <a
            href={buildNetworkGameUrl(networkGames[0], "more_games_primary")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            EratoGame
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {(Object.keys(gameCategoryLabels) as Array<
            keyof typeof gameCategoryLabels
          >).map((category) => (
            <a
              key={category}
              href={`/games#${category}-games`}
              className="flex items-center justify-between rounded-md border bg-background px-4 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
            >
              {gameCategoryLabels[category]}
              <span className="text-muted-foreground">
                {getGamesByCategory(category).length}
              </span>
            </a>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {networkGames.map((game) => (
            <a
              key={game.domain}
              href={buildNetworkGameUrl(game, "more_games")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-40 flex-col justify-between rounded-md border bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <span>
                <span className="mb-4 inline-flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Gamepad2 className="size-5" aria-hidden="true" />
                </span>
                <span className="block text-lg font-bold text-slate-950 group-hover:text-primary">
                  {game.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {game.domain}
                </span>
              </span>
              <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
                Play now
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
