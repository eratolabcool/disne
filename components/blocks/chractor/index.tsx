'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

interface Character {
  franchise: string;
  characters: string[];
  scene: string;
  franchiseLink: string;
}

const characterData: Character[] = [
  {
    franchise: "Beauty and the Beast",
    characters: ["Beast", "Belle", "Cogsworth", "Lumiere"],
    scene: "Tale as Old as Time",
    franchiseLink: "https://disney.fandom.com/wiki/Beauty_and_the_Beast_(1991_film)"
  },
  {
    franchise: "The Little Mermaid",
    characters: ["Flounder", "Ariel", "Sebastian", "Sea Creatures"],
    scene: "Under the Sea",
    franchiseLink: "https://disney.fandom.com/wiki/The_Little_Mermaid_(1989_film)"
  },
  {
    franchise: "The Lion King",
    characters: ["Timon", "Pumbaa", "Simba", "Grubs"],
    scene: "Hakuna Matata",
    franchiseLink: "https://disney.fandom.com/wiki/The_Lion_King"
  },
  {
    franchise: "Frozen",
    characters: ["Elsa", "Olaf", "Marshmallow"],
    scene: "Let It Go",
    franchiseLink: "https://disney.fandom.com/wiki/Frozen"
  },
  {
    franchise: "Moana",
    characters: ["Moana", "Heihei", "Maui"],
    scene: "You're Welcome",
    franchiseLink: "https://disney.fandom.com/wiki/Moana"
  },
  {
    franchise: "Snow White and the Seven Dwarfs",
    characters: ["Snow White", "Birds", "Doc", "Happy"],
    scene: "With a Smile and a Song",
    franchiseLink: "https://disney.fandom.com/wiki/Snow_White_and_the_Seven_Dwarfs"
  },
  {
    franchise: "Toy Story",
    characters: ["Woody", "Lenny", "Shark", "Roly Poly Clown", "Robot", "Sarge", "Green Army Men", "Buzz Lightyear"],
    scene: "You've Got a Friend in Me",
    franchiseLink: "https://disney.fandom.com/wiki/Toy_Story"
  },
  {
    franchise: "Aladdin",
    characters: ["Jasmine", "Carpet", "Aladdin"],
    scene: "A Whole New World",
    franchiseLink: "https://disney.fandom.com/wiki/Aladdin"
  },
  {
    franchise: "Cinderella",
    characters: ["Cinderella", "Fairy Godmother"],
    scene: "Bibbidi-Bobbidi-Boo",
    franchiseLink: "https://disney.fandom.com/wiki/Cinderella"
  },
  {
    franchise: "Lilo & Stitch",
    characters: ["Lilo", "Stitch"],
    scene: "Ohana Means Family",
    franchiseLink: "https://disney.fandom.com/wiki/Lilo&Stitch"
  },
  {
    franchise: "Alice in Wonderland",
    characters: ["Mad Hatter", "Alice"],
    scene: "The Mad Tea Party",
    franchiseLink: "https://disney.fandom.com/wiki/Alice in Wonderland"
  },
  {
    franchise: "Ratatouille",
    characters: ["Alfredo Linguini", "Remy"],
    scene: "Anyone Can Cook",
    franchiseLink: "https://disney.fandom.com/wiki/Tangled"
  },
  {
    franchise: "Hercules",
    characters: ["Philoctetes", "Hercules"],
    scene: "One Last Hope",
    franchiseLink: "https://disney.fandom.com/wiki/Snow—_White_and_the_Seven_Dwarfs"
  },
  {
    franchise: "Peter Pan",
    characters: ["Wendy Darling", "Peter Pan", "Tinker Bell"],
    scene: "Oh My! We Can Fly!",
    franchiseLink: "https://disney.fandom.com/wiki/Snow—_White_and_the_Seven_Dwarfs"
  },
  {
    franchise: "Encanto",
    characters: ["Alma Madrigal", "Mirabel Madrigal", "Miracle Butterflies", "Toucans", "Casita"],
    scene: "Casa de Madrigal",
    franchiseLink: "https://disney.fandom.com/wiki/Snow—_White_and_the_Seven_Dwarfs"
  },
  {
    franchise: "The Jungle Book",
    characters: ["Mowgli", "Baloo"],
    scene: "The Bare Necessities",
    franchiseLink: "https://disney.fandom.com/wiki/Snow—_White_and_the_Seven_Dwarfs"
  },
  {
    franchise: "Up",
    characters: ["Ellie", "Carl"],
    scene: "Married Life",
    franchiseLink: "https://disney.fandom.com/wiki/Snow—_White_and_the_Seven_Dwarfs"
  },
  {
    franchise: "Tangled",
    characters: ["Flynn Rider", "Pascal", "Rapunzel"],
    scene: "I See the Light",
    franchiseLink: "https://disney.fandom.com/wiki/Snow—_White_and_the_Seven_Dwarfs"
  },
  {
    franchise: "Mulan",
    characters: ["Fa Zhou", "Mulan"],
    scene: "Reflections",
    franchiseLink: "https://disney.fandom.com/wiki/Mulan"
  },
  {
    franchise: "Coco",
    characters: ["Miguel", "Héctor"],
    scene: "Un Poco Loco",
    franchiseLink: "https://disney.fandom.com/wiki/Coco"
  }
];

export default function CharacterTable() {
  const { theme } = useTheme();
  const t = useTranslations();

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className={`text-3xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        {t('character.title')}
      </h2>
      <div className="overflow-x-auto">
        <table className={`w-full shadow-md rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
          <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-black'
                }`}>
                {t('character.franchise')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-black'
                }`}>
                {t('character.characters')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-black'
                }`}>
                {t('character.scene')}
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
            }`}>
            {characterData.map((item, index) => (
              <tr key={index} className={`hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                  <a href={item.franchiseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}>
                    {item.franchise}
                  </a>
                </td>
                <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-black'
                  }`}>
                  {item.characters.map((character, charIndex) => (
                    <React.Fragment key={charIndex}>
                      <a href={`https://disney.fandom.com/wiki/${character.replace(/\s+/g, '_')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                          }`}>
                        {character}
                      </a>
                      {charIndex < item.characters.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-black'
                  }`}>
                  <a href={`https://disney.fandom.com/wiki/${item.scene.toLowerCase().replace(/[&\s]/g, '_')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}>
                    {item.scene}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}