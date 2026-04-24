import React from "react";

export default function UpdatesPage() {
  const updates = [
    {
      version: "1.8.0",
      date: "Nov 11, 2025",
      title: "The Magic Continues Update!",
      highlights: [
        "New Levels: Prepare for a bunch of new magical levels to explore!",
        "New Disney Characters: Unlock more beloved characters and their special abilities.",
        "Disney Features: Introducing New Disney Features for even more card-matching fun!",
        "Performance Improvements: Smoother gameplay and faster loading times for all devices."
      ],
      type: "Major Update"
    },
    {
      version: "1.7.1",
      date: "Oct 23, 2025",
      title: "Performance Fixes",
      highlights: [
        "Addressed minor glitches on mid-tier Android devices.",
        "Faster transition effects for card movement.",
        "Stability improvements for online leaderboards."
      ],
      type: "Minor Update"
    },
    {
      version: "1.13.0",
      date: "Sep 2025",
      title: "Visual Overhaul",
      highlights: [
        "Polished scene unlock rewards with richer postcard collections based on classic Disney moments.",
        "Improved animations for combo streaks and magical effects.",
        "Difficulty balancing: early levels are now more accessible, while later levels challenge your strategic depth."
      ],
      type: "Visual Update"
    }
  ];

  return (
    <div className="container py-16 px-4 md:px-6 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Latest Disney Solitaire Updates</h1>
        <p className="text-xl text-muted-foreground">Keep up with the latest magical features and gameplay improvements.</p>
      </div>

      <div className="space-y-8">
        {updates.map((update, idx) => (
          <div key={idx} className="bg-muted/30 rounded-2xl p-8 border hover:shadow-lg transition-shadow">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full mb-2">
                  {update.type}
                </span>
                <h2 className="text-2xl font-bold">{update.title}</h2>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">v{update.version}</p>
                <p className="text-sm text-muted-foreground">{update.date}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Key Highlights</h3>
              <ul className="grid gap-3">
                {update.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 text-primary">✨</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
