"use client";

import { useSettings } from "@/lib/data/useSettings";
import {
  addDays,
  challengeDates,
  challengeDayNumber,
  startOfWeekISO,
  todayISO,
} from "@/lib/date";
import type { PersonId } from "@/lib/supabase/types";
import { PersonStatsPanel } from "./PersonStatsPanel";

export function ProgressHeader({ personIds }: { personIds: PersonId[] }) {
  const { settings } = useSettings();
  const today = todayISO();
  const rawDayNumber = challengeDayNumber(
    today,
    settings.challengeStartDate,
    settings.challengeDurationDays
  );
  // Outside the challenge range: clamp to day 1 (not started yet) or the
  // final day (challenge over), rather than showing a misleading number.
  const dayNumber =
    rawDayNumber ??
    (today < settings.challengeStartDate ? 1 : settings.challengeDurationDays);

  const allDates = challengeDates(
    settings.challengeStartDate,
    settings.challengeDurationDays
  );
  const elapsedDates = allDates.filter((d) => d <= today);

  const weekStart = startOfWeekISO(today);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const currentWeekElapsedDates = weekDates.filter(
    (d) => d <= today && allDates.includes(d)
  );

  const percent = Math.round((dayNumber / settings.challengeDurationDays) * 100);

  return (
    <div className="flex flex-col gap-4 border-b border-line px-4 py-4">
      <div>
        <p className="font-hand text-2xl text-ink-muted">Desafio 30 Dias</p>
        <p className="text-sm text-ink-muted">
          Dia {dayNumber} de {settings.challengeDurationDays}
        </p>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full bg-done transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        {personIds.map((personId) => (
          <PersonStatsPanel
            key={personId}
            personId={personId}
            elapsedDates={elapsedDates}
            currentWeekElapsedDates={currentWeekElapsedDates}
          />
        ))}
      </div>
    </div>
  );
}
