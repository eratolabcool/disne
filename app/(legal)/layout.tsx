import "@/app/globals.css";

import { MdOutlineHome } from "react-icons/md";
import { Metadata } from "next";
import React from "react";
import Script from "next/script";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `%s | Disney Solitaire - Legal`,
      default: "Disney Solitaire - Legal Information",
    },
    description: "Legal information and policies for Disney Solitaire game including privacy policy and terms of service.",
    keywords: "disney solitaire legal, privacy policy, terms of service, legal information",
  };
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </head>
      <body>
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7627909166795192"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <div>
          <Link
            className="text-base-content cursor-pointer hover:opacity-80 transition-opacity"
            href="/"
          >
            <MdOutlineHome className="text-2xl mx-8 my-8" />
            {/* <img className="w-10 h-10 mx-4 my-4" src="/logo.png" /> */}
          </Link>
          <div className="text-md max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8 prose prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-base-content prose-code:text-base-content prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
