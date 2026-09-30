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
  onOpenDay,
}: {
  personId: PersonId;
  dateISO: string;
  isCurrentMonth: boolean;
  onOpenDay: (dateISO: string) => void;
}) {
  const { getStatus, cycle, failedKeys } = useCheckins();
  const habits = habitsForPerson(personId);
  const dayNumber = Number(dateISO.slice(-2));
  const isToday = dateISO === todayISO();

  if (!isCurrentMonth) {
    return <div className="min-h-20" />;
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
