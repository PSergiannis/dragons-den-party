"use client";

import { useState, useEffect } from "react";
import { FaCocktail, FaDragon, FaTrophy } from "react-icons/fa";
import type { IconType } from "react-icons";
import { io } from "socket.io-client";
import Image from "next/image";

// Helper function to get image filename based on dragon name
const getDragonImageFilename = (dragonName: string | undefined): string => {
  if (!dragonName) return "";

  const nameToFile: Record<string, string> = {
    "Γιάννης Τσιώρης": "tsioris.png",
    "Λέων Γιοχάη": "giohi.png",
    "Τάσος Οικονόμου": "oikonomou.png",
    "Νίκη Γουλιμή": "goulimi.png",
    "Χάρης Βαφειάς": "vafeias.png",
    "Μαρία Χατζηστεφανή": "hatzistefani.png",
    "Λιλή Περγαντά": "perganta.png",
  };

  // Check for partial matches too
  for (const [name, file] of Object.entries(nameToFile)) {
    if (dragonName.includes(name) || name.includes(dragonName)) {
      return file;
    }
  }

  return "";
};

interface Ranking {
  id: number;
  name: string;
  points: number;
  dragon_name?: string;
  ingredients?: string;
}

interface CocktailRanking extends Ranking {
  dragon_name: string;
  ingredients: string;
}

interface RankingListProps {
  rankings: Ranking[];
  title: string;
  icon: IconType;
  isCocktails?: boolean;
}

export default function StatsTab() {
  const [cocktailRankings, setCocktailRankings] = useState<CocktailRanking[]>(
    []
  );
  const [dragonRankings, setDragonRankings] = useState<Ranking[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Initial fetch
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setCocktailRankings(data.cocktails);
        setDragonRankings(data.dragons);
      } catch (err) {
        setError("Failed to load statistics");
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();

    // Set up WebSocket connection
    const socket = io({
      path: "/api/socket",
      addTrailingSlash: false,
    });

    socket.on(
      "statsUpdate",
      (data: { cocktails: CocktailRanking[]; dragons: Ranking[] }) => {
        setCocktailRankings(data.cocktails);
        setDragonRankings(data.dragons);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const RankingList = ({
    rankings,
    title,
    icon: Icon,
    isCocktails = false,
  }: RankingListProps) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Icon /> {title}
      </h2>
      <div className="space-y-2">
        {rankings.map((item, index) => {
          // Determine image path based on whether it's a cocktail or dragon
          let imagePath = "";
          if (isCocktails && "dragon_name" in item) {
            // For cocktails, use the dragon_name to get the image
            imagePath = getDragonImageFilename(item.dragon_name);
          } else {
            // For dragons, use the dragon name directly
            imagePath = getDragonImageFilename(item.name);
          }

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white/10 rounded-lg"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500">
                {index + 1}
              </div>
              {imagePath && (
                <div className="flex-shrink-0">
                  <Image
                    src={`/images/${imagePath}`}
                    alt={
                      (isCocktails && "dragon_name" in item
                        ? item.dragon_name
                        : item.name) || "Dragon image"
                    }
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-pink-500"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                {isCocktails && "ingredients" in item && (
                  <div className="text-xs text-gray-300">
                    {item.ingredients}
                  </div>
                )}
                <div className="text-sm text-white/70">
                  {item.points} points
                </div>
              </div>
              {index === 0 && <FaTrophy className="text-yellow-400 text-2xl" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <RankingList
        rankings={cocktailRankings}
        title="Cocktail Rankings"
        icon={FaCocktail}
        isCocktails={true}
      />
      <RankingList
        rankings={dragonRankings}
        title="Dragon Rankings"
        icon={FaDragon}
      />
    </div>
  );
}
