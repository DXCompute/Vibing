"use client";

import { useEffect, useState } from "react";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function LastUpdated({ timestamp }: { timestamp: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mt-3 text-xs text-slate-500">
        Last updated: <span className="tabular-nums">Loading...</span>
      </div>
    );
  }

  return (
    <div className="mt-3 text-xs text-slate-500">
      Last updated: <span className="tabular-nums">{formatDateTime(timestamp)}</span>
    </div>
  );
}

