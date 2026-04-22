import Hero from "@/components/blocks/hero";
import Feature1 from "@/components/blocks/feature1";
import FAQ from "@/components/blocks/faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FreeCell Solitaire - Play Free Online Card Game",
  description: "Play FreeCell Solitaire for free online. Use the four free cells to organize your strategy. Almost every deal is winnable! No download required.",
  keywords: "freecell solitaire, play freecell free, online card games, free solitaire no download, winnable solitaire deals",
};

export default function FreeCellSolitairePage() {
  const heroData = {
    title: "FreeCell Solitaire",
    description: "The strategic FreeCell solitaire experience. Use your skills to solve every puzzle.",
    background: {
      src: "/imgs/disney/Image-03.jpg",
      alt: "FreeCell Solitaire Background"
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
    title: "How to Play FreeCell Solitaire",
    description: "FreeCell is a solitaire card game played using a standard 52-card deck. It is fundamentally different from most solitaire games because nearly all deals can be won.",
    items: [
      {
        title: "The Objective",
        description: "Move all 52 cards to the four foundation piles, one for each suit, from Ace to King."
      },
      {
        title: "The Free Cells",
        description: "Use the four free cells in the top-left to temporarily store cards. Each cell can hold only one card."
      },
      {
        title: "Tableau Rules",
        description: "Cards can be moved to a tableau pile if the card being moved is one rank lower and of a different color."
      }
    ]
  };

  const faqData = {
    title: "FreeCell Solitaire FAQ",
    items: [
      {
        title: "Is every FreeCell game winnable?",
        description: "Nearly all deals are winnable. In the classic Windows collection, only one deal (number 11982) was known to be unwinnable."
      },
      {
        title: "How many cards can I move at once?",
        description: "The number of cards you can move is limited by the number of empty free cells and empty tableau piles you have available."
      }
    ]
  };

  return (
    <>
      <Hero hero={heroData} />
      <div id="game" className="container py-12 scroll-mt-20">
        <div className="bg-black aspect-[16/9] rounded-2xl shadow-2xl overflow-hidden relative border-4 border-primary/20">
           <iframe 
             src="/play/freecell/index.html" 
             className="w-full h-full border-none"
             title="FreeCell Solitaire Game"
             allow="autoplay; fullscreen"
           />
        </div>
      </div>
      <Feature1 section={introduceData} />
      <FAQ section={faqData} />
    </>
  );
}
