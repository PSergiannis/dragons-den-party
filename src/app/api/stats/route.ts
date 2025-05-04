import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CocktailStats {
  id: number;
  name: string;
  dragon_name: string;
  ingredients: string;
  points: number | bigint;
}

interface DragonStats {
  id: number;
  name: string;
  points: number | bigint;
}

export async function GET() {
  try {
    // Get cocktail rankings with dragon_name and ingredients
    const cocktailRankings = await prisma.$queryRaw<CocktailStats[]>`
      SELECT c.id, c.name, c.dragon_name, c.ingredients, COALESCE(SUM(v.points), 0) as points
      FROM cocktails c
      LEFT JOIN votes v ON c.id = v.option_id AND v.vote_type = 'cocktail'
      GROUP BY c.id, c.name, c.dragon_name, c.ingredients
      ORDER BY points DESC
    `;

    // Get dragon rankings
    const dragonRankings = await prisma.$queryRaw<DragonStats[]>`
      SELECT d.id, d.name, COALESCE(SUM(v.points), 0) as points
      FROM dragons d
      LEFT JOIN votes v ON d.id = v.option_id AND v.vote_type = 'dragon'
      GROUP BY d.id, d.name
      ORDER BY points DESC
    `;

    // Convert BigInt points to Number for serialization
    const cocktails = cocktailRankings.map((c: CocktailStats) => ({
      ...c,
      points: typeof c.points === "bigint" ? Number(c.points) : c.points,
    }));

    const dragons = dragonRankings.map((d: DragonStats) => ({
      ...d,
      points: typeof d.points === "bigint" ? Number(d.points) : d.points,
    }));

    return NextResponse.json({
      cocktails,
      dragons,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
