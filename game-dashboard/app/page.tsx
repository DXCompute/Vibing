import fs from "node:fs/promises";
import path from "node:path";

import { Users, Clock, Star, Package } from "lucide-react";
import KpiCard from "./components/KpiCard";
import TrendsChart from "./components/TrendsChart";
import LastUpdated from "./components/LastUpdated";

type Metrics = {
  gameDate: string;
  missionsCompleted: number;
  usersTotal: number;
  avgLevel: number;
  lootboxesOpened: number;
  updatedAt: string;
  deltas?: {
    usersTotalPct?: number;
    missionsCompletedPct?: number;
    avgLevelPct?: number;
    lootboxesOpenedPct?: number;
  };
  series?: Array<{ date: string; users: number; missions: number; lootboxes: number }>;
};

function formatInt(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function formatOneDecimal(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(n);
}

async function readMetrics(): Promise<Metrics> {
  const filePath = path.join(process.cwd(), "app", "data", "metrics.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Metrics;
}

export default async function Page() {
  const m = await readMetrics();

  const avgHoursPerPlayer =
    m.usersTotal > 0 ? m.missionsCompleted / m.usersTotal : 0; // placeholder example
  // If you have total hours in your JSON, swap this to real calc.

  return (
    <main className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />
      
      <div className="relative mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="Ave Forge Logo" 
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Ave Forge
            </h1>
            <p className="mt-1 text-slate-400">
              Live Game Metrics
            </p>
              <LastUpdated timestamp={m.updatedAt} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/leaderboards"
              className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-fuchsia-500/50"
            >
              Leaderboards
            </a>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Status: Live
            </span>
          </div>
        </div>

        {/* KPI grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Players"
            value={formatInt(m.usersTotal)}
            subtitle="Active accounts"
            accent="slate"
            trend={
              typeof m.deltas?.usersTotalPct === "number"
                ? { value: m.deltas.usersTotalPct, label: "vs 7d" }
                : undefined
            }
            icon={<Users className="h-5 w-5" />}
          />

          <KpiCard
            title="Missions Completed"
            value={formatInt(m.missionsCompleted)}
            subtitle="Cumulative completions"
            accent="blue"
            trend={
              typeof m.deltas?.missionsCompletedPct === "number"
                ? { value: m.deltas.missionsCompletedPct, label: "vs 7d" }
                : undefined
            }
            icon={<Package className="h-5 w-5" />}
          />

          <KpiCard
            title="Average Level"
            value={formatOneDecimal(m.avgLevel)}
            subtitle="Player progression"
            accent="amber"
            trend={
              typeof m.deltas?.avgLevelPct === "number"
                ? { value: m.deltas.avgLevelPct, label: "vs 7d" }
                : undefined
            }
            icon={<Star className="h-5 w-5" />}
          />

          <KpiCard
            title="Lootboxes Opened"
            value={formatInt(m.lootboxesOpened)}
            subtitle="Total opens"
            accent="rose"
            trend={
              typeof m.deltas?.lootboxesOpenedPct === "number"
                ? { value: m.deltas.lootboxesOpenedPct, label: "vs 7d" }
                : undefined
            }
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10" />

        {/* Chart */}
        {m.series?.length ? <TrendsChart data={m.series} /> : null}

        {/* Highlights */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <h3 className="text-base font-semibold text-white">
            Highlights (current period)
          </h3>

          <ul className="mt-3 space-y-2.5">
            <li className="flex items-center gap-2 text-sm text-slate-300">
              <img 
                src="/nova-container-icon.png" 
                alt="Nova Container" 
                className="h-8 w-8 rounded border border-white/20 object-cover"
              />
              <span>
                <span className="font-medium text-white">Nova Container</span> is
                currently the most opened lootbox
              </span>
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-300">
              <img 
                src="/razor-core-icon.png" 
                alt="Razor Core" 
                className="h-8 w-8 rounded border border-white/20 object-cover"
              />
              <span>
                <span className="font-medium text-white">Razor Core</span> is the most
                completed mission this period
              </span>
            </li>
          </ul>
        </div>

        {/* About */}
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <h2 className="text-base font-semibold text-white">
            About this dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            This public dashboard displays aggregated game statistics for Ave Forge.
            Metrics are updated periodically and do not include any personal or
            player-identifiable data.
          </p>
        </div>
      </div>

      <footer className="relative mt-12 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

