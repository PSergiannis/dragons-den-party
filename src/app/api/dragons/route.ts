import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const dragons = await prisma.dragon.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(dragons);
  } catch (error) {
    console.error("Error fetching dragons:", error);
    return NextResponse.json(
      { error: "Failed to fetch dragons" },
      { status: 500 }
    );
  }
}
