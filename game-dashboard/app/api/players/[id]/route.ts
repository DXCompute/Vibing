import { NextRequest, NextResponse } from "next/server";
import { getPlayerById } from "@/app/lib/players";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = await getPlayerById(params.id);
    
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    
    return NextResponse.json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 });
  }
}

