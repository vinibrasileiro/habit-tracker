export function StreakBadge({ label, days }: { label: string; days: number }) {
  if (days === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-done-soft px-2 py-0.5 text-xs font-medium text-done">
      🔥 {label}: {days} {days === 1 ? "dia" : "dias"}
    </span>
  );
}
