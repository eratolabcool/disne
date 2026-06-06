export type GameCategory = "word" | "puzzle" | "daily";

export interface NetworkGame {
  title: string;
  domain: string;
  url: string;
  categories: GameCategory[];
  description: string;
}

export const networkGames: NetworkGame[] = [
  {
    title: "EratoGame",
    domain: "eratogame.com",
    url: "https://eratogame.com",
    categories: ["puzzle", "daily"],
    description: "Unified game hub for the full casual game network.",
  },
  {
    title: "PathWordle",
    domain: "pathwordle.com",
    url: "https://pathwordle.com",
    categories: ["word", "daily"],
    description: "Daily word-path puzzles for quick brain training.",
  },
  {
    title: "Pinpoint Answer",
    domain: "pinpointanswer.pro",
    url: "https://pinpointanswer.pro",
    categories: ["word", "puzzle"],
    description: "Answer helpers and pinpoint puzzle solutions.",
  },
  {
    title: "Strands Hint",
    domain: "strandshint.org",
    url: "https://strandshint.org",
    categories: ["word", "daily"],
    description: "Daily Strands clues, hints, and puzzle guidance.",
  },
  {
    title: "Pips Hint",
    domain: "pips-hint.com",
    url: "https://pips-hint.com",
    categories: ["puzzle", "daily"],
    description: "Pips puzzle hints and solving support.",
  },
  {
    title: "Flipping Is Hard",
    domain: "flippingishard.com",
    url: "https://flippingishard.com",
    categories: ["puzzle"],
    description: "A tricky puzzle game for players who enjoy precision.",
  },
  {
    title: "Escape Tsunami for Brainrots",
    domain: "escapestsunamiforbrainrots.com",
    url: "https://escapestsunamiforbrainrots.com",
    categories: ["puzzle"],
    description: "Fast escape gameplay with chaotic puzzle energy.",
  },
  {
    title: "Grouded Game",
    domain: "groudedgame.org",
    url: "https://groudedgame.org",
    categories: ["puzzle"],
    description: "Puzzle and game guides from the network.",
  },
  {
    title: "Deltarune Live",
    domain: "deltarune.live",
    url: "https://deltarune.live",
    categories: ["puzzle"],
    description: "Game resources and fan-friendly puzzle content.",
  },
  {
    title: "Lovemaniac",
    domain: "lovemaniac.net",
    url: "https://lovemaniac.net",
    categories: ["puzzle"],
    description: "Casual puzzle gameplay and light game discovery.",
  },
  {
    title: "Minesweeper Plus",
    domain: "minesweeper-plus.org",
    url: "https://minesweeper-plus.org",
    categories: ["puzzle", "daily"],
    description: "Classic minesweeper logic with upgraded play modes.",
  },
  {
    title: "Neonerdle",
    domain: "neonerdle.com",
    url: "https://neonerdle.com",
    categories: ["word", "daily"],
    description: "A bright daily puzzle for word and logic fans.",
  },
  {
    title: "Pokopia",
    domain: "pokopia.uk",
    url: "https://pokopia.uk",
    categories: ["puzzle"],
    description: "Casual game content and playful puzzle discovery.",
  },
  {
    title: "Sprunki",
    domain: "sprunki.org.uk",
    url: "https://sprunki.org.uk",
    categories: ["puzzle"],
    description: "Creative casual play from the wider game network.",
  },
  {
    title: "Speed Stars 1",
    domain: "speedstars1.com",
    url: "https://speedstars1.com",
    categories: ["puzzle"],
    description: "Fast reaction gameplay and competitive casual fun.",
  },
  {
    title: "Square Face Icon Generator",
    domain: "squarefaceicongenerator.uk",
    url: "https://squarefaceicongenerator.uk",
    categories: ["puzzle"],
    description: "A playful generator tool connected to the network.",
  },
  {
    title: "STS2 Calc",
    domain: "sts2calc.com",
    url: "https://sts2calc.com",
    categories: ["puzzle"],
    description: "Calculator and guide tools for strategy players.",
  },
  {
    title: "Wordle Hint",
    domain: "wordlehint.cc",
    url: "https://wordlehint.cc",
    categories: ["word", "daily"],
    description: "Wordle hints, clues, and daily solving support.",
  },
  {
    title: "X BTI",
    domain: "x-bti.com",
    url: "https://x-bti.com",
    categories: ["puzzle"],
    description: "Casual game resources in the broader network.",
  },
  {
    title: "Your AI Slop",
    domain: "youraislop.com",
    url: "https://youraislop.com",
    categories: ["puzzle"],
    description: "Experimental casual content and game discovery.",
  },
];

export const gameCategoryLabels: Record<GameCategory, string> = {
  word: "Word Games",
  puzzle: "Puzzle Games",
  daily: "Daily Games",
};

export function buildNetworkGameUrl(game: NetworkGame, medium: string) {
  const url = new URL(game.url);
  url.searchParams.set("utm_source", "disneysolitaire.net");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", "game_network");
  return url.toString();
}

export function getGamesByCategory(category: GameCategory) {
  return networkGames.filter((game) => game.categories.includes(category));
}
