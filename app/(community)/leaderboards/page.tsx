"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Target } from "lucide-react";
import GlassCard from "@/app/components/GlassCard";

type Player = {
  id: string;
  displayName: string;
  handle: string;
  avatarUrl: string;
  level: number;
  wins: number;
  missionsCompleted: number;
};

export default function LeaderboardsPage() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"wins" | "missions">("wins");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchLeaderboard();
  }, [tab]);

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      const metric = tab === "wins" ? "wins" : "missionsCompleted";
      const res = await fetch(`/api/leaderboard?metric=${metric}&limit=25`);
      const data = await res.json();
      setPlayers(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition">
            <img
              src="/logo.png"
              alt="Ave Forge"
              className="h-10 w-10 rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-semibold">Leaderboards</h1>
              <p className="text-xs text-slate-400">Top players</p>
            </div>
          </Link>
        </div>
        <button className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2 text-sm font-medium shadow-lg transition hover:shadow-fuchsia-500/50">
          Play Now
        </button>
      </div>

      {/* Tabs */}
      <div className="relative flex gap-2">
        <button
          onClick={() => setTab("wins")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "wins"
              ? "bg-white/10 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Trophy className="h-4 w-4" />
          Wins
        </button>
        <button
          onClick={() => setTab("missions")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "missions"
              ? "bg-white/10 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Target className="h-4 w-4" />
          Missions
        </button>
      </div>

      {/* Leaderboard */}
      <GlassCard className="relative overflow-hidden p-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            Loading leaderboard...
          </div>
        ) : (
          <div className="space-y-2">
            {players.map((player, idx) => (
              <Link
                key={player.id}
                href={`/players/${player.id}`}
                className="group flex items-center gap-4 rounded-lg border border-white/5 bg-white/5 p-4 transition hover:bg-white/10"
              >
                {/* Rank */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    idx === 0
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900"
                      : idx === 1
                      ? "bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900"
                      : idx === 2
                      ? "bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100"
                      : "text-slate-400"
                  }`}
                >
                  {idx + 1}
                </div>

                {/* Avatar & Name */}
                <img
                  src={player.avatarUrl}
                  alt={player.displayName}
                  className="h-10 w-10 rounded-lg border border-white/20 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/40";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white transition group-hover:text-fuchsia-400">
                    {player.displayName}
                  </div>
                  <div className="text-xs text-slate-400">{player.handle}</div>
                </div>

                {/* Level */}
                <span className="inline-flex items-center rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300">
                  Lvl {player.level}
                </span>

                {/* Metric Value */}
                <div className="text-right text-lg font-bold text-white w-24">
                  {tab === "wins"
                    ? player.wins.toLocaleString()
                    : player.missionsCompleted.toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Footer */}
      <footer className="relative border-t border-white/10 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Ave Forge. All rights reserved.
          </p>

          {/* Right */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://aveforge.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition"
            >
              Play AveForge
            </a>

            <a
              href="https://x.com/AveForge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition"
            >
              X
            </a>

            <a
              href="https://discord.gg/aveforge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition"
            >
              Discord
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

