import Hero from "@/components/blocks/hero";
import Feature1 from "@/components/blocks/feature1";
import FAQ from "@/components/blocks/faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classic Solitaire - Play Free Online Card Game",
  description: "Play the original Classic Solitaire (Klondike) for free online. No download required. Experience the timeless card game on any device.",
  keywords: "classic solitaire, klondike solitaire, play solitaire free, online card games, free solitaire no download",
};

export default function ClassicSolitairePage() {
  const heroData = {
    title: "Classic Solitaire",
    description: "The timeless Klondike solitaire experience. Play for free, master your strategy, and beat your high score.",
    background: {
      src: "/imgs/disney/hero-bg.jpg",
      alt: "Classic Solitaire Background"
    },
    buttons: [
      {
        title: "Play Now",
        url: "#game",
        variant: "default" as const,
        icon: "RiPlayFill"
      }
    ]
  };

  const introduceData = {
    title: "How to Play Classic Solitaire",
    description: "Klondike is the most popular version of solitaire. The goal is to move all cards to the four foundation piles, sorted by suit from Ace to King.",
    items: [
      {
        title: "The Objective",
        description: "Build four foundation piles (one for each suit) in ascending order from Ace to King."
      },
      {
        title: "The Tableau",
        description: "Arrange cards in descending order and alternating colors (e.g., a red 7 on a black 8)."
      },
      {
        title: "The Stock Pile",
        description: "Draw cards from the stock when you have no more moves on the tableau."
      }
    ]
  };

  const faqData = {
    title: "Classic Solitaire FAQ",
    items: [
      {
        title: "Is Classic Solitaire free?",
        description: "Yes, you can play Classic Solitaire for free right here in your browser."
      },
      {
        title: "Can I play on mobile?",
        description: "Absolutely! Our version of Classic Solitaire is fully responsive and works on any smartphone or tablet."
      }
    ]
  };

  return (
    <>
      <Hero hero={heroData} />
      <div id="game" className="container py-12 scroll-mt-20">
        <div className="bg-black aspect-[16/9] rounded-2xl shadow-2xl overflow-hidden relative border-4 border-primary/20">
           <iframe 
             src="/play/klondike/index.html" 
             className="w-full h-full border-none"
             title="Classic Solitaire Game"
             allow="autoplay; fullscreen"
           />
        </div>
      </div>
      <Feature1 section={introduceData} />
      <FAQ section={faqData} />
    </>
  );
}
