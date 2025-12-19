import type { ReactNode } from "react";

type Trend = {
  value: number; // percent, e.g. 2.4 means +2.4%
  label?: string; // e.g. "vs last 7d"
};

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  accent?: "slate" | "blue" | "green" | "amber" | "rose";
  trend?: Trend;
};

const ACCENT: Record<NonNullable<Props["accent"]>, string> = {
  slate: "bg-slate-900",
  blue: "bg-blue-600",
  green: "bg-emerald-600",
  amber: "bg-amber-600",
  rose: "bg-rose-600"
};

function TrendPill({ trend }: { trend: Trend }) {
  const up = trend.value >= 0;
  const base =
    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums";
  const cls = up
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-rose-200 bg-rose-100 text-rose-700";

  return (
    <span className={`${base} ${cls}`}>
      <span aria-hidden="true">{up ? "▲" : "▼"}</span>
      {Math.abs(trend.value).toFixed(1)}%{trend.label ? ` ${trend.label}` : ""}
    </span>
  );
}

export default function KpiCard({
  title,
  value,
  subtitle,
  icon,
  accent = "slate",
  trend
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur transition hover:shadow-md hover:ring-1 hover:ring-white/20">
      {/* left accent bar */}
      <div className={`absolute left-0 top-0 h-full w-0.5 ${ACCENT[accent]}`} />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {title}
          </p>
          <p className="mt-3 text-4xl font-semibold tabular-nums text-white">
            {value}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {subtitle ? (
              <p className="text-sm text-slate-400">{subtitle}</p>
            ) : null}
            {trend ? <TrendPill trend={trend} /> : null}
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition group-hover:text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}

