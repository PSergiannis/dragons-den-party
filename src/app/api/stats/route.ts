import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface VoteStats {
  id: number;
  name: string;
  points: number;
}

export async function GET() {
  try {
    // Get cocktail rankings
    const cocktailRankings = await prisma.$queryRaw<VoteStats[]>`
      SELECT c.id, c.name, COALESCE(SUM(v.points), 0) as points
      FROM cocktails c
      LEFT JOIN votes v ON c.id = v.option_id AND v.vote_type = 'cocktail'
      GROUP BY c.id, c.name
      ORDER BY points DESC
    `;

    // Get dragon rankings
    const dragonRankings = await prisma.$queryRaw<VoteStats[]>`
      SELECT d.id, d.name, COALESCE(SUM(v.points), 0) as points
      FROM dragons d
      LEFT JOIN votes v ON d.id = v.option_id AND v.vote_type = 'dragon'
      GROUP BY d.id, d.name
      ORDER BY points DESC
    `;

    return NextResponse.json({
      cocktails: cocktailRankings,
      dragons: dragonRankings,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
