import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const games = [
  {
    title: "Disney Solitaire",
    description: "Magical Solitaire with beloved Disney characters.",
    image: "/imgs/maxresdefault.jpg",
    url: "/",
    badge: "Hot",
  },
  {
    title: "Classic Solitaire",
    description: "The timeless card game experience you know and love. Klondike, Spider, and more.",
    image: "/imgs/disney/hero-bg.jpg",
    url: "/classic-solitaire",
    badge: "New",
  },
  {
    title: "Spider Solitaire",
    description: "Challenge yourself with 1, 2, or 4 suits of Spider.",
    image: "/imgs/disney/disney-solitaire-guide.jpg",
    url: "/play/spider",
  },
  {
    title: "FreeCell",
    description: "Strategic card game where almost every deal is winnable.",
    image: "/imgs/disney/disney-solitaire-tips.jpg",
    url: "/play/freecell",
  },
];

export default function GameGrid() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Magical Card Game Collection</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-[700px] mx-auto">
            Explore our collection of the best free online solitaire games.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((game, i) => (
            <Link key={i} href={game.url} className="group transition-transform hover:-translate-y-1">
              <Card className="overflow-hidden h-full border-2 hover:border-primary/50 transition-colors">
                <div className="relative aspect-video">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                  {game.badge && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded">
                      {game.badge}
                    </span>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {game.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
