"use client";

import { useState, useEffect } from "react";
import { FaCocktail, FaDragon, FaTrophy } from "react-icons/fa";
import type { IconType } from "react-icons";
import { io } from "socket.io-client";

interface Ranking {
  id: number;
  name: string;
  points: number;
}

interface RankingListProps {
  rankings: Ranking[];
  title: string;
  icon: IconType;
}

export default function StatsTab() {
  const [cocktailRankings, setCocktailRankings] = useState<Ranking[]>([]);
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
      (data: { cocktails: Ranking[]; dragons: Ranking[] }) => {
        setCocktailRankings(data.cocktails);
        setDragonRankings(data.dragons);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const RankingList = ({ rankings, title, icon: Icon }: RankingListProps) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Icon /> {title}
      </h2>
      <div className="space-y-2">
        {rankings.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-white/10 rounded-lg"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-white/70">{item.points} points</div>
            </div>
            {index === 0 && <FaTrophy className="text-yellow-400 text-2xl" />}
          </div>
        ))}
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
      />
      <RankingList
        rankings={dragonRankings}
        title="Dragon Rankings"
        icon={FaDragon}
      />
    </div>
  );
}
