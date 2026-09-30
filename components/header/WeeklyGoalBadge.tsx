import type { WeeklyGoal } from "@/lib/stats/deriveWeeklyGoal";

const LABEL: Record<WeeklyGoal["status"], string> = {
  met: "META ATINGIDA",
  exceeded: "META SUPERADA",
  short: "",
};

export function WeeklyGoalBadge({ goal }: { goal: WeeklyGoal }) {
  const suffix =
    goal.status === "short"
      ? `FALTA ${goal.goal - goal.done}`
      : LABEL[goal.status];

  const toneClasses =
    goal.status === "short"
      ? "bg-transparent text-ink-muted border-line"
      : "bg-done-soft text-done border-done/40";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${toneClasses}`}
    >
      🏋️ {goal.done}/{goal.goal} — {suffix}
    </span>
  );
}
