"use client";

import { useState, useEffect } from "react";
import { FaCocktail, FaDragon } from "react-icons/fa";
import CustomDropdown from "./CustomDropdown";

interface Option {
  id: number;
  name: string;
}

interface CocktailOption extends Option {
  dragon_name: string;
  ingredients: string;
  imagePath?: string;
}

interface DragonOption extends Option {
  imagePath?: string;
}

interface Vote {
  type: "cocktail" | "dragon";
  optionId: number;
  priority: number;
  points: number;
}

// Helper function to convert dragon name to image filename
const getDragonImageFilename = (dragonName: string): string => {
  const nameToFile: Record<string, string> = {
    "Γιάννης Τσιώρης": "tsioris.png",
    "Λέων Γιοχάη": "giohi.png",
    "Τάσος Οικονόμου": "oikonomou.png",
    "Νίκη Γουλιμή": "goulimi.png",
    "Χάρης Βαφειάς": "vafeias.png",
    "Μαρία Χατζηστεφανή": "hatzistefani.png",
    "Λιλή Περγαντά": "perganta.png",
  };

  return nameToFile[dragonName] || "";
};

export default function VoteTab() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [cocktailVotes, setCocktailVotes] = useState<Vote[]>([]);
  const [dragonVotes, setDragonVotes] = useState<Vote[]>([]);
  const [cocktails, setCocktails] = useState<CocktailOption[]>([]);
  const [dragons, setDragons] = useState<DragonOption[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch cocktails
        const cocktailsResponse = await fetch("/api/cocktails");
        if (!cocktailsResponse.ok) {
          throw new Error("Failed to fetch cocktails");
        }
        const cocktailsData = await cocktailsResponse.json();

        // Add image paths to cocktails based on their dragon_name
        const cocktailsWithImages = cocktailsData.map(
          (cocktail: CocktailOption) => ({
            ...cocktail,
            imagePath: getDragonImageFilename(cocktail.dragon_name),
          })
        );

        setCocktails(cocktailsWithImages);

        // Fetch dragons
        const dragonsResponse = await fetch("/api/dragons");
        if (!dragonsResponse.ok) {
          throw new Error("Failed to fetch dragons");
        }
        const dragonsData = await dragonsResponse.json();

        // Add image paths to dragons - match by name
        const dragonsWithImages = dragonsData.map((dragon: Option) => {
          // Find matching filename for the dragon
          let imagePath = "";

          // Check against our dragon name mapping
          if (
            dragon.name === "Γιάννης Τσιώρης" ||
            dragon.name.includes("Τσιώρης")
          ) {
            imagePath = "tsioris.png";
          } else if (
            dragon.name === "Λέων Γιοχάη" ||
            dragon.name.includes("Γιοχάη")
          ) {
            imagePath = "giohi.png";
          } else if (
            dragon.name === "Τάσος Οικονόμου" ||
            dragon.name.includes("Οικονόμου")
          ) {
            imagePath = "oikonomou.png";
          } else if (
            dragon.name === "Νίκη Γουλιμή" ||
            dragon.name.includes("Γουλιμή")
          ) {
            imagePath = "goulimi.png";
          } else if (
            dragon.name === "Χάρης Βαφειάς" ||
            dragon.name.includes("Βαφειάς")
          ) {
            imagePath = "vafeias.png";
          } else if (
            dragon.name === "Μαρία Χατζηστεφανή" ||
            dragon.name.includes("Χατζηστεφανή")
          ) {
            imagePath = "hatzistefani.png";
          } else if (
            dragon.name === "Λιλή Περγαντά" ||
            dragon.name.includes("Περγαντά")
          ) {
            imagePath = "perganta.png";
          }

          return {
            ...dragon,
            imagePath,
          };
        });

        setDragons(dragonsWithImages);

        setLoading(false);
      } catch (err) {
        setError("Failed to load voting options. Please refresh the page.");
        console.error("Error loading options:", err);
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

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

    // Validate that name and surname are provided
    if (!name || !surname) {
      setError("Please enter your name and surname.");
      return;
    }

    // Validate that all three cocktail votes are selected
    if (cocktailVotes.length < 3) {
      setError("Please select all three of your favorite cocktails.");
      return;
    }

    // Validate that all three dragon votes are selected
    if (dragonVotes.length < 3) {
      setError("Please select all three of your favorite dragons.");
      return;
    }

    try {
      // First check if user has already voted
      const checkResponse = await fetch(
        `/api/user-exists?name=${encodeURIComponent(
          name
        )}&surname=${encodeURIComponent(surname)}`
      );

      if (checkResponse.ok) {
        const { exists } = await checkResponse.json();

        if (exists) {
          setError("You have already voted. Each user can only vote once.");
          return;
        }
      }

      // If user hasn't voted before, proceed with submitting votes
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

  // Filter out already selected options
  const getFilteredCocktails = (currentPriority: number) => {
    // Get IDs of cocktails already selected in other priority slots
    const selectedCocktailIds = cocktailVotes
      .filter((vote) => vote.priority !== currentPriority)
      .map((vote) => vote.optionId);

    // Return only cocktails that haven't been selected yet
    return cocktails.filter(
      (cocktail) => !selectedCocktailIds.includes(cocktail.id)
    );
  };

  const getFilteredDragons = (currentPriority: number) => {
    // Get IDs of dragons already selected in other priority slots
    const selectedDragonIds = dragonVotes
      .filter((vote) => vote.priority !== currentPriority)
      .map((vote) => vote.optionId);

    // Return only dragons that haven't been selected yet
    return dragons.filter((dragon) => !selectedDragonIds.includes(dragon.id));
  };

  if (hasVoted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you for voting!</h2>
        <p>Your votes have been recorded.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center">
        <p>Loading voting options...</p>
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
            <FaCocktail /> Favourite Cocktail
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((priority) => (
              <div key={priority} className="flex items-center gap-4">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500">
                  {priority}
                </span>
                <CustomDropdown
                  options={getFilteredCocktails(priority)}
                  placeholder="Select a cocktail"
                  onChange={(id) => handleVote("cocktail", id, priority)}
                  className="flex-1"
                />
                <span className="text-sm text-white/70">
                  {getPoints(priority)} points
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaDragon /> Dragon Voting
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((priority) => (
              <div key={priority} className="flex items-center gap-4">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500">
                  {priority}
                </span>
                <CustomDropdown
                  options={getFilteredDragons(priority)}
                  placeholder="Select a dragon"
                  onChange={(id) => handleVote("dragon", id, priority)}
                  className="flex-1"
                />
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
