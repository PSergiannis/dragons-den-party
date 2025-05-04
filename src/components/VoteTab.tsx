"use client";

import { useState } from "react";
import { FaCocktail, FaDragon } from "react-icons/fa";

interface Option {
  id: number;
  name: string;
}

interface Vote {
  type: "cocktail" | "dragon";
  optionId: number;
  priority: number;
  points: number;
}

const dummyCocktails: Option[] = [
  { id: 1, name: "Dragon's Breath" },
  { id: 2, name: "Fireball Fizz" },
  { id: 3, name: "Scorched Martini" },
  { id: 4, name: "Flame Whisper" },
  { id: 5, name: "Inferno Punch" },
];

const dummyDragons: Option[] = [
  { id: 1, name: "Blaze" },
  { id: 2, name: "Ember" },
  { id: 3, name: "Inferno" },
  { id: 4, name: "Pyro" },
  { id: 5, name: "Scorch" },
];

export default function VoteTab() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [cocktailVotes, setCocktailVotes] = useState<Vote[]>([]);
  const [dragonVotes, setDragonVotes] = useState<Vote[]>([]);
  const [error, setError] = useState("");

  const handleVote = (
    type: "cocktail" | "dragon",
    optionId: number,
    priority: number
  ) => {
    const votes = type === "cocktail" ? cocktailVotes : dragonVotes;
    const setVotes = type === "cocktail" ? setCocktailVotes : setDragonVotes;

    // Remove any existing vote for this priority
    const filteredVotes = votes.filter((v) => v.priority !== priority);

    // Add new vote with points
    setVotes([
      ...filteredVotes,
      {
        type,
        optionId,
        priority,
        points: getPoints(priority),
      },
    ]);
  };

  const getPoints = (priority: number) => {
    switch (priority) {
      case 1:
        return 5;
      case 2:
        return 3;
      case 3:
        return 1;
      default:
        return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !surname) return;

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          surname,
          votes: [...cocktailVotes, ...dragonVotes],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit votes");
      }

      setHasVoted(true);
    } catch (err) {
      setError("Failed to submit votes. Please try again.");
      console.error("Error submitting votes:", err);
    }
  };

  if (hasVoted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you for voting!</h2>
        <p>Your votes have been recorded.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Enter Your Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="text"
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaCocktail /> Cocktail Votes
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((priority) => (
              <div key={priority} className="flex items-center gap-4">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500">
                  {priority}
                </span>
                <select
                  onChange={(e) =>
                    handleVote("cocktail", Number(e.target.value), priority)
                  }
                  className="flex-1 px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select a cocktail</option>
                  {dummyCocktails.map((cocktail) => (
                    <option key={cocktail.id} value={cocktail.id}>
                      {cocktail.name}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-white/70">
                  {getPoints(priority)} points
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaDragon /> Dragon Votes
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((priority) => (
              <div key={priority} className="flex items-center gap-4">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500">
                  {priority}
                </span>
                <select
                  onChange={(e) =>
                    handleVote("dragon", Number(e.target.value), priority)
                  }
                  className="flex-1 px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select a dragon</option>
                  {dummyDragons.map((dragon) => (
                    <option key={dragon.id} value={dragon.id}>
                      {dragon.name}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-white/70">
                  {getPoints(priority)} points
                </span>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <button
          type="submit"
          className="w-full py-3 px-6 bg-pink-500 hover:bg-pink-600 rounded-md font-semibold transition-colors"
        >
          Submit Votes
        </button>
      </form>
    </div>
  );
}
