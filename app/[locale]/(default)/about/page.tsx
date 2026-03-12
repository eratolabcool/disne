import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "About Disney Solitaire - Game Guide & Platform Information",
    description: "Learn about Disney Solitaire card game, how to play, game features, and our platform’s mission. Complete guide to Disney Solitaire gameplay, characters, and strategies.",
    keywords: "Disney Solitaire, about Disney Solitaire, how to play Disney Solitaire, Disney card game, Disney Solitaire guide, Disney Solitaire characters, Disney Solitaire gameplay",
    openGraph: {
      title: "About Disney Solitaire - Game Guide & Platform Information",
      description: "Learn about Disney Solitaire card game, how to play, game features, and our platform’s mission. Complete guide to Disney Solitaire gameplay, characters, and strategies.",
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: "About Disney Solitaire - Game Guide & Platform Information",
      description: "Learn about Disney Solitaire card game, how to play, game features, and our platform’s mission. Complete guide to Disney Solitaire gameplay, characters, and strategies.",
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          About Disney Solitaire
        </h1>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-foreground">
            What is Disney Solitaire?
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Disney Solitaire is a magical twist on the classic Tripeaks Solitaire card game, featuring beloved Disney characters, enchanting storylines, and immersive gameplay experiences. This mobile card game combines traditional solitaire mechanics with Disney’s iconic characters and worlds, creating an engaging adventure for players of all ages.
            </p>
            <p>
              The game features stunning visuals from Disney movies, character-specific power-ups, and themed levels that take you through various Disney universes. From Frozen’s icy landscapes to Moana’s tropical islands, each world offers unique challenges and rewards.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Key Features:</h3>
              <ul className="list-disc list-inside space-y-2 text-blue-700">
                <li>Classic Tripeaks Solitaire gameplay with Disney magic</li>
                <li>Beloved Disney characters including Elsa, Moana, Buzz Lightyear, and more</li>
                <li>Character-specific power-ups and special abilities</li>
                <li>Themed levels across multiple Disney worlds</li>
                <li>Seasonal events and limited-time challenges</li>
                <li>Collection and upgrade systems for characters and cards</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-foreground">
            How to Play Disney Solitaire
          </h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Basic Gameplay</h3>
              <p>
                Disney Solitaire follows the traditional Tripeaks Solitaire rules with Disney-themed enhancements:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Clear cards from the tableau by selecting cards one rank higher or lower than the foundation card</li>
                <li>Use the stock pile when no moves are available on the tableau</li>
                <li>Complete levels by clearing all cards from the tableau</li>
                <li>Earn stars based on your performance and remaining cards</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-purple-800">Disney Special Features</h3>
              <ul className="list-disc list-inside space-y-2 text-purple-700">
                <li><strong>Character Powers:</strong> Each Disney character offers unique abilities to help clear difficult levels</li>
                <li><strong>Wild Cards:</strong> Special cards that can match any rank, providing strategic flexibility</li>
                <li><strong>Combo Multipliers:</strong> Chain card clears for bonus points and magical effects</li>
                <li><strong>Themed Obstacles:</strong> Navigate Disney-specific challenges like frozen cards or cursed obstacles</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Success Tips</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Plan your moves carefully - look for long sequences before making your first move</li>
                <li>Save character powers for challenging situations</li>
                <li>Focus on clearing cards that unlock the most options</li>
                <li>Participate in daily challenges for extra rewards</li>
                <li>Collect and upgrade your favorite Disney characters</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-foreground">
            Our Platform’s Mission
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              We are an independent platform dedicated to providing comprehensive information, guides, and resources for Disney Solitaire players. Our mission is to help players maximize their enjoyment and success in this magical card game adventure.
            </p>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-800">What We Provide:</h3>
              <ul className="list-disc list-inside space-y-2 text-green-700">
                <li>Detailed gameplay guides and strategies</li>
                <li>Character profiles and ability explanations</li>
                <li>Level walkthroughs and tips</li>
                <li>Event coverage and seasonal content updates</li>
                <li>Community discussions and player experiences</li>
                <li>Latest news and game updates</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
              <h3 className="text-xl font-semibold mb-3 text-yellow-800">Important Disclaimer</h3>
              <p className="text-yellow-700">
                <strong>This website is not an official Disney website.</strong> We are an independent platform providing information and resources about Disney Solitaire games. All Disney characters, names, and related properties are trademarks of The Walt Disney Company. We are not affiliated with, endorsed by, or connected to Disney or the official Disney Solitaire game developers.
              </p>
            </div>

            <p>
              Our commitment is to provide accurate, helpful, and up-to-date information to enhance your Disney Solitaire gaming experience. We strive to maintain the highest quality content while respecting all intellectual property rights and encouraging players to support the official game.
            </p>
          </div>
        </section>

        <section className="text-center py-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Begin Your Disney Adventure?</h3>
            <p className="text-lg mb-6">
              Explore our comprehensive guides and join the magical world of Disney Solitaire today!
            </p>
            <div className="space-x-4">
              <Link
                href={`/${locale}/posts`}
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Game Guides
              </Link>
              <Link
                href={`/${locale}`}
                className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
