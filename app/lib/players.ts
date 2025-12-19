import fs from "node:fs/promises";
import path from "node:path";

export type Player = {
  id: string;
  displayName: string;
  handle: string;
  avatarUrl: string;
  wallet?: string;
  level: number;
  wins: number;
  losses: number;
  missionsCompleted: number;
  lootboxesOpened: number;
  lastSeen: string;
  recentMatches: Array<{
    ts: string;
    mode: string;
    result: string;
    mission: string;
  }>;
  series7d: Array<{
    date: string;
    wins: number;
    missions: number;
    lootboxes: number;
  }>;
};

export async function getPlayers(): Promise<Player[]> {
  const filePath = path.join(process.cwd(), "app", "data", "players.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Player[];
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  const players = await getPlayers();
  return players.find((p) => p.id === id);
}

export async function searchPlayers(query: string): Promise<Player[]> {
  const players = await getPlayers();
  const q = query.toLowerCase().trim();
  
  if (!q) return players;
  
  return players.filter((p) => {
    return (
      p.displayName.toLowerCase().includes(q) ||
      p.handle.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.wallet?.toLowerCase().includes(q)
    );
  });
}

export async function getLeaderboard(
  metric: "wins" | "missionsCompleted",
  limit: number = 25
): Promise<Player[]> {
  const players = await getPlayers();
  
  const sorted = [...players].sort((a, b) => {
    return b[metric] - a[metric];
  });
  
  return sorted.slice(0, limit);
}

