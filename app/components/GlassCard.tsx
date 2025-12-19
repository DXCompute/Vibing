export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-white/5 backdrop-blur border border-white/10 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

