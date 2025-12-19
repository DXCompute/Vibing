"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type Point = {
  date: string;
  users: number;
  missions: number;
  lootboxes: number;
};

const RANGES = [
  { label: "7d", value: 7 },
  { label: "14d", value: 14 },
  { label: "30d", value: 30 }
];

function formatShortDate(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

function formatNumber(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

export default function TrendsChart({ data }: { data: Point[] }) {
  const [mounted, setMounted] = useState(false);
  const [range, setRange] = useState<number>(7);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    return data.slice(-range);
  }, [data, range]);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Player activity trends
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Loading chart...
            </p>
          </div>
        </div>
        <div className="mt-6 h-72 flex items-center justify-center text-slate-500">
          Loading chart...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            Player activity trends
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Aggregated user growth, mission completions, and lootbox activity
            across the selected time range.
          </p>
        </div>

        {/* Range selector */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`relative rounded-md px-3 py-1 text-sm font-medium transition ${
                range === r.value
                  ? "bg-white/10 text-white shadow ring-1 ring-white/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {r.label}
              <span
                className={`absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full ${
                  range === r.value ? "bg-fuchsia-500" : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatShortDate}
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <YAxis 
              domain={["dataMin - 1500", "dataMax + 1500"]} 
              tickFormatter={formatNumber}
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              formatter={(value: number | undefined) => value ? formatNumber(value) : ''}
              labelFormatter={(label: string) => formatShortDate(label)}
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "white"
              }}
            />
            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="missions" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="lootboxes" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

