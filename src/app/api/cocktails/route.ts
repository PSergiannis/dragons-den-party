import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cocktails = await prisma.cocktail.findMany({
      select: {
        id: true,
        name: true,
        dragon_name: true,
        ingredients: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(cocktails);
  } catch (error) {
    console.error("Error fetching cocktails:", error);
    return NextResponse.json(
      { error: "Failed to fetch cocktails" },
      { status: 500 }
    );
  }
}
