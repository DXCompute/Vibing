import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/app/lib/players";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const metric = searchParams.get("metric") as "wins" | "missionsCompleted" || "wins";
  const limit = parseInt(searchParams.get("limit") || "25", 10);

  try {
    const leaderboard = await getLeaderboard(metric, limit);
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}

