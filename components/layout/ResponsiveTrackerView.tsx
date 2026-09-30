"use client";

import { useState } from "react";
import { MonthCalendarGrid } from "@/components/calendar/MonthCalendarGrid";
import { DayDetailSheet } from "@/components/calendar/DayDetailSheet";
import { HabitStripRow } from "@/components/strip/HabitStripRow";
import { HabitDayMatrix, type HabitMatrixRow } from "@/components/desktop/HabitDayMatrix";
import { habitsForPerson, personById } from "@/lib/data/habits";
import { useSettings } from "@/lib/data/useSettings";
import { challengeDates } from "@/lib/date";
import type { PersonId } from "@/lib/supabase/types";

export function ResponsiveTrackerView({ personId }: { personId: PersonId }) {
  const { settings } = useSettings();
  const [openDate, setOpenDate] = useState<string | null>(null);

  const habits = habitsForPerson(personId);
  const dates = challengeDates(
    settings.challengeStartDate,
    settings.challengeDurationDays
  );
  const person = personById(personId);

  const matrixRows: HabitMatrixRow[] = habits.map((habit) => ({
    personId,
    habitId: habit.id,
    rowLabel: `${habit.icon} ${habit.label}`,
    failedGlyph: habit.failed_glyph,
  }));

  return (
    <div className="pb-24">
      <div className="md:hidden">
        <MonthCalendarGrid
          personId={personId}
          challengeDates={dates}
          onOpenDay={setOpenDate}
        />
        <div className="mt-4 border-t border-line px-3 pt-3">
          <p className="mb-1 text-sm font-semibold text-ink-muted">30 dias</p>
          {habits.map((habit) => (
            <HabitStripRow
              key={habit.id}
              personId={personId}
              habitId={habit.id}
              icon={habit.icon}
              label={habit.label}
              failedGlyph={habit.failed_glyph}
              dates={dates}
            />
          ))}
        </div>
      </div>
      <div className="hidden md:block">
        <p className="px-4 pt-3 text-sm font-semibold text-ink-muted">
          {person?.emoji} {person?.display_name} — 30 dias
        </p>
        <HabitDayMatrix rows={matrixRows} dates={dates} />
      </div>
      <DayDetailSheet
        personId={personId}
        dateISO={openDate}
        onClose={() => setOpenDate(null)}
      />
    </div>
  );
}
