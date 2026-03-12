"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface GameVersion {
  title: string;
  image: string;
  url: string;
}

interface DisplayProps {
  className?: string;
  title?: string;
  description?: string;
  versions?: GameVersion[];
}

export default function Display({
  className,
  title = "Choose Your Favorite Subway Surfers Version",
  description = "Experience different cities and themes in Subway Surfers, each version has unique scenes and characters!",
  versions = [
    {
      title: "Zurich",
      image: "/imgs/subway-surfers-zurich.jpg",
      url: "/subway-surfers-zurich"
    },
    {
      title: "Winter Holiday",
      image: "/imgs/Subway-surfers-winter-holyday.jpg",
      url: "/subway-surfers-winter-holiday"
    },
    {
      title: "Saint Petersburg",
      image: "/imgs/subway-surfer-saint-petersburg.jpg",
      url: "/subway-surfers?version=saint-petersburg"
    },
    {
      title: "Venice",
      image: "/imgs/Subway-surfers-venice.jpg",
      url: "/subway-surfers?version=venice"
    },
    {
      title: "Singapore",
      image: "/imgs/Subway-surfers-singapore.jpg",
      url: "/subway-surfers?version=singapore"
    },
    {
      title: "Berlin",
      image: "/imgs/subway-surfer-berlin.jpg",
      url: "/subway-surfers?version=berlin"
    }
  ]
}: DisplayProps) {
  return (
    <section className={`py-12 ${className || ""}`}>
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {versions.map((version, index) => (
            <Link href={version.url} key={index}>
              <Card className="overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                <div className="aspect-[4/3] w-full relative bg-blue-600">
                  <img
                    src={version.image}
                    alt={`Subway Surfers ${version.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="text-xl font-semibold">{version.title}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}