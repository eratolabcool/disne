import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommunityActions from "@/components/community/actions";
import CommunitySidebar from "@/components/community/sidebar";

export default function CommunityPage() {
  const topics = [
    {
      title: "How to beat level 450? (Cursed Cards)",
      author: "MickeyFan99",
      replies: 24,
      lastPost: "2 hours ago",
      tags: ["Strategy", "Levels"]
    },
    {
      title: "New Elsa character power-up is OP!",
      author: "FrozenKing",
      replies: 12,
      lastPost: "5 hours ago",
      tags: ["Characters", "Balance"]
    },
    {
      title: "Tutorial: Chaining 10+ Combos for Max Score",
      author: "SolitairePro",
      replies: 56,
      lastPost: "Yesterday",
      tags: ["Tutorial", "Combo"]
    },
    {
      title: "Best Disney Card Designs - What's your favorite?",
      author: "ArtLover",
      replies: 8,
      lastPost: "2 days ago",
      tags: ["Art", "Discussion"]
    }
  ];

  return (
    <div className="container py-16 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Disney Solitaire Community Hub</h1>
        <p className="text-xl text-muted-foreground">Exchange tips, strategies, and tutorials with fellow magical card game fans.</p>
        <CommunityActions />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Discussion List */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold">Trending Discussions</h2>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="font-bold text-primary border-b-2 border-primary pb-4 -mb-4.5 cursor-pointer">Hot</span>
              <span className="cursor-pointer">Latest</span>
              <span className="cursor-pointer">Top</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {topics.map((topic, idx) => (
              <Card key={idx} className="hover:border-primary/50 transition-colors cursor-pointer group shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {topic.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground rounded group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{topic.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-black">@{topic.author}</span>
                      <span>•</span>
                      <span>{topic.replies} replies</span>
                    </div>
                    <span>{topic.lastPost}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <CommunitySidebar />
      </div>
    </div>
  );
}
