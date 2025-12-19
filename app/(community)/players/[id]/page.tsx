"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Trophy, Target, Package, Clock } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import GlassCard from "@/app/components/GlassCard";

type Player = {
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

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function formatRelativeTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function PlayerProfilePage() {
  const params = useParams();
  const playerId = params?.id as string;
  
  const [mounted, setMounted] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (playerId) {
      fetchPlayer();
    }
  }, [playerId]);

  async function fetchPlayer() {
    setLoading(true);
    try {
      const res = await fetch(`/api/players/${playerId}`);
      if (res.ok) {
        const data = await res.json();
        setPlayer(data);
      }
    } catch (error) {
      console.error("Failed to fetch player:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading player...</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl text-white">Player not found</div>
          <Link
            href="/leaderboards"
            className="text-fuchsia-400 hover:text-fuchsia-300"
          >
            Back to Leaderboards
          </Link>
        </div>
      </div>
    );
  }

  const winRate = player.wins + player.losses > 0
    ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
    : "0.0";

  return (
    <>
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />
      
      <div className="relative mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <Link
          href="/leaderboards"
          className="mb-6 inline-flex items-center gap-2 text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leaderboards
        </Link>

        {/* Player Header */}
        <GlassCard className="mb-8 overflow-hidden p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <img
              src={player.avatarUrl}
              alt={player.displayName}
              className="h-24 w-24 rounded-xl border-2 border-fuchsia-500/50 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/96";
              }}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">
                {player.displayName}
              </h1>
              <p className="mt-1 text-purple-300">{player.handle}</p>
              {player.wallet && (
                <p className="mt-2 font-mono text-xs text-slate-400">
                  {player.wallet.slice(0, 6)}...{player.wallet.slice(-4)}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-300">
                  Level {player.level}
                </span>
                <span className="text-sm text-slate-400">
                  Last seen: {formatRelativeTime(player.lastSeen)}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* KPI Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard className="p-6">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Wins</span>
            </div>
            <div className="text-3xl font-bold text-white">{player.wins}</div>
            <div className="mt-1 text-xs text-slate-400">
              {winRate}% win rate
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Target className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Missions</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {player.missionsCompleted}
            </div>
            <div className="mt-1 text-xs text-slate-400">Completed</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Package className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Lootboxes</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {player.lootboxesOpened}
            </div>
            <div className="mt-1 text-xs text-slate-400">Opened</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Losses</span>
            </div>
            <div className="text-3xl font-bold text-white">{player.losses}</div>
            <div className="mt-1 text-xs text-slate-400">Total defeats</div>
          </GlassCard>
        </div>

        {/* Activity Chart */}
        <GlassCard className="mb-8 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            7-Day Activity
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={player.series7d}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "white"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="wins"
                  stroke="#d946ef"
                  strokeWidth={2}
                  dot={{ fill: "#d946ef" }}
                  name="Wins"
                />
                <Line
                  type="monotone"
                  dataKey="missions"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: "#06b6d4" }}
                  name="Missions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent Matches */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Recent Matches
          </h2>
          <div className="space-y-3">
            {player.recentMatches.map((match, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      match.result === "win"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {match.result === "win" ? "W" : "L"}
                  </span>
                  <div>
                    <div className="font-medium text-white">{match.mission}</div>
                    <div className="text-xs text-slate-400">
                      {match.mode} • {formatTime(match.ts)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500">
                  {formatRelativeTime(match.ts)}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Footer */}
        <footer className="relative mt-8 border-t border-white/10 pt-6">
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
      </div>
    </>
  );
}

