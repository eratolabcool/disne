import React from "react";
import { useTranslations } from "next-intl";

export default function TutorialsPage() {
  return (
    <div className="container py-16 px-4 md:px-6 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Disney Solitaire Tutorials & Guide</h1>
        <p className="text-xl text-muted-foreground">Master the magical card game with our comprehensive guides.</p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">1</span>
            Basic Rules
          </h2>
          <div className="bg-muted/30 rounded-xl p-6 border">
            <p className="mb-4">Disney Solitaire primarily follows the <strong>Tripeaks Solitaire</strong> rules with a magical twist. The goal is to clear the board by selecting cards that are one rank higher or lower than the card currently in the playing slot.</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Sequence: 2-3-4...10-J-Q-K-A-2 (Loops allowed)</li>
              <li>Clear cards to build combo multipliers for more points.</li>
              <li>Use the Stockpile when no moves are available on the board.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">2</span>
            Magical Power-Ups
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-muted/30 rounded-xl p-6 border">
              <h3 className="font-bold text-lg mb-2">Wild Cards ✨</h3>
              <p className="text-sm text-muted-foreground">These can be placed over any card on the board, regardless of rank. Use them strategically when you have a long sequence but no starting card.</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-6 border">
              <h3 className="font-bold text-lg mb-2">Undo Arrow ↩️</h3>
              <p className="text-sm text-muted-foreground">Made a mistake? Use the undo arrow to reverse your last move. It's free for the first few turns but may cost in-game currency later.</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-6 border">
              <h3 className="font-bold text-lg mb-2">Runner Cards 🏃</h3>
              <p className="text-sm text-muted-foreground">Special cards that change their rank with each move. "Runner Up" increases rank, "Runner Down" decreases rank. Plan ahead to catch them at the right moment!</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">3</span>
            Pro Strategy Tips
          </h2>
          <div className="bg-muted/30 rounded-xl p-6 border space-y-4">
            <div>
              <h3 className="font-bold mb-1">Uncover Hidden Cards Early</h3>
              <p className="text-sm text-muted-foreground">Focus on clearing columns that block the most face-down cards to increase your available move options.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Chain Long Combos</h3>
              <p className="text-sm text-muted-foreground">Try to chain at least 5-7 cards in a single run to activate massive magical multipliers and score bonuses.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Save Power-Ups for Boss Levels</h3>
              <p className="text-sm text-muted-foreground">Higher levels introduce "Cursed Cards" and "Frozen Blocks". Don't waste your Wild Cards on easy early stages!</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
