"use client";

import { TrackerCell } from "@/components/cell/TrackerCell";
import { habitsForPerson } from "@/lib/data/habits";
import { useCheckins } from "@/lib/data/useCheckins";
import { todayISO } from "@/lib/date";
import type { PersonId } from "@/lib/supabase/types";

export function DayCellSummary({
  personId,
  dateISO,
  isCurrentMonth,
  isInChallenge,
  onOpenDay,
}: {
  personId: PersonId;
  dateISO: string;
  isCurrentMonth: boolean;
  isInChallenge: boolean;
  onOpenDay: (dateISO: string) => void;
}) {
  const { getStatus, cycle, failedKeys } = useCheckins();
  const habits = habitsForPerson(personId);
  const dayNumber = Number(dateISO.slice(-2));
  const isToday = dateISO === todayISO();

  if (!isCurrentMonth) {
    return <div className="min-h-20" />;
  }

  // In the viewed month but outside the 30-day challenge (e.g. the tail end
  // of a month the challenge doesn't fully cover): show the day number only,
  // not tappable — habit taps here would silently write check-ins that never
  // show up in any stat or strip, which reads as "not saving" to the user.
  if (!isInChallenge) {
    return (
      <div className="flex min-h-20 flex-col items-center gap-1 p-1 opacity-30">
        <span className="font-hand text-lg leading-none text-ink-muted">
          {dayNumber}
        </span>
      </div>
    );
  }

  return (
    <div
      className={[
        "flex min-h-20 flex-col items-center gap-1 rounded-md p-1",
        isToday ? "ring-2 ring-today-ring ring-offset-1 ring-offset-paper" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onOpenDay(dateISO)}
        className="font-hand text-lg leading-none text-ink hover:text-done"
      >
        {dayNumber}
      </button>
      <div className="flex flex-wrap justify-center gap-0.5">
        {habits.map((habit) => (
          <TrackerCell
            key={habit.id}
            size="sm"
            status={getStatus(personId, habit.id, dateISO)}
            failedGlyph={habit.failed_glyph}
            ariaLabel={`${habit.label} — ${dateISO}`}
            hasError={failedKeys.has(`${personId}_${habit.id}_${dateISO}`)}
            onTap={() => cycle(personId, habit.id, dateISO)}
          />
        ))}
      </div>
    </div>
  );
}
