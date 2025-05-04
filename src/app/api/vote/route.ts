import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { emitStatsUpdate } from "@/lib/socket";
import { Server } from "socket.io";

const prisma = new PrismaClient();

interface VoteData {
  type: "cocktail" | "dragon";
  optionId: number;
  priority: number;
  points: number;
}

export async function POST(request: Request) {
  try {
    const { name, surname, votes } = await request.json();

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        surname,
      },
    });

    // Create votes
    const votePromises = votes.map((vote: VoteData) =>
      prisma.vote.create({
        data: {
          userId: user.id,
          voteType: vote.type,
          optionId: vote.optionId,
          priority: vote.priority,
          points: vote.points,
        },
      })
    );

    await Promise.all(votePromises);

    // Emit WebSocket update
    const io = new Server();
    await emitStatsUpdate(io);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
