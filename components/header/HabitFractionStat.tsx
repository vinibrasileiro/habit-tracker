export function HabitFractionStat({
  icon,
  label,
  done,
  total,
}: {
  icon: string;
  label: string;
  done: number;
  total: number;
}) {
  return (
    <span className="text-sm text-ink">
      {icon} {label}: <span className="font-semibold">{done}/{total}</span>
    </span>
  );
}
