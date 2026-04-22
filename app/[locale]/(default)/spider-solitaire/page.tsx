import Hero from "@/components/blocks/hero";
import Feature1 from "@/components/blocks/feature1";
import FAQ from "@/components/blocks/faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spider Solitaire - Play Free Online Card Game",
  description: "Play Spider Solitaire for free online. Challenge yourself with 1, 2, or 4 suits. No download required. Experience the classic card game on any device.",
  keywords: "spider solitaire, play spider solitaire free, online card games, free solitaire no download, spider solitaire 2 suits, spider solitaire 4 suits",
};

export default function SpiderSolitairePage() {
  const heroData = {
    title: "Spider Solitaire",
    description: "The challenging and addictive Spider solitaire experience. Master your strategy and clear the board.",
    background: {
      src: "/imgs/disney/Image-02.jpg",
      alt: "Spider Solitaire Background"
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
    title: "How to Play Spider Solitaire",
    description: "Spider Solitaire is a popular type of solitaire game played with two decks of cards. The goal is to order all cards in descending runs from King down to Ace in the same suit.",
    items: [
      {
        title: "The Objective",
        description: "Assemble 8 sequences of cards in descending order from King to Ace within the same suit."
      },
      {
        title: "Building Runs",
        description: "You can move cards onto a card of the next higher rank, regardless of suit (e.g., a 7 of any suit on an 8 of any suit)."
      },
      {
        title: "Moving Groups",
        description: "A group of cards can only be moved if they are all in the same suit and in perfect descending order."
      }
    ]
  };

  const faqData = {
    title: "Spider Solitaire FAQ",
    items: [
      {
        title: "Is Spider Solitaire harder than Klondike?",
        description: "Generally, yes. Spider Solitaire requires more strategic planning, especially when playing with 2 or 4 suits."
      },
      {
        title: "Can I choose the number of suits?",
        description: "Yes, our version allows you to choose between 1, 2, or 4 suits to adjust the difficulty."
      }
    ]
  };

  return (
    <>
      <Hero hero={heroData} />
      <div id="game" className="container py-12 scroll-mt-20">
        <div className="bg-black aspect-[16/9] rounded-2xl shadow-2xl overflow-hidden relative border-4 border-primary/20">
           <iframe 
             src="/play/spider/index.html" 
             className="w-full h-full border-none"
             title="Spider Solitaire Game"
             allow="autoplay; fullscreen"
           />
        </div>
      </div>
      <Feature1 section={introduceData} />
      <FAQ section={faqData} />
    </>
  );
}
