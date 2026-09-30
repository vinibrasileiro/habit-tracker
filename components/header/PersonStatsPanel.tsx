"use client";

import { habitsForPerson, personById } from "@/lib/data/habits";
import { useCheckins } from "@/lib/data/useCheckins";
import type { PersonId } from "@/lib/supabase/types";
import { deriveHabitFraction } from "@/lib/stats/deriveHabitFraction";
import { deriveStreak } from "@/lib/stats/deriveStreak";
import { deriveWeeklyGoal } from "@/lib/stats/deriveWeeklyGoal";
import { HabitFractionStat } from "./HabitFractionStat";
import { StreakBadge } from "./StreakBadge";
import { WeeklyGoalBadge } from "./WeeklyGoalBadge";

export function PersonStatsPanel({
  personId,
  elapsedDates,
  currentWeekElapsedDates,
}: {
  personId: PersonId;
  elapsedDates: string[];
  currentWeekElapsedDates: string[];
}) {
  const { getStatus } = useCheckins();
  const person = personById(personId);
  const habits = habitsForPerson(personId);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-ink-muted">
        {person?.emoji} {person?.display_name}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {habits.map((habit) => {
          const fraction = deriveHabitFraction(
            getStatus,
            personId,
            habit.id,
            elapsedDates
          );
          return (
            <HabitFractionStat
              key={habit.id}
              icon={habit.icon}
              label={habit.label}
              done={fraction.done}
              total={fraction.total}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {habits.map((habit) => {
          const streak = deriveStreak(getStatus, personId, habit.id, elapsedDates);
          return <StreakBadge key={habit.id} label={habit.label} days={streak} />;
        })}
        {habits
          .filter((habit) => habit.id.startsWith("treino"))
          .map((habit) => {
            const goal = deriveWeeklyGoal(
              getStatus,
              personId,
              habit.id,
              currentWeekElapsedDates
            );
            return <WeeklyGoalBadge key={habit.id} goal={goal} />;
          })}
      </div>
    </div>
  );
}
