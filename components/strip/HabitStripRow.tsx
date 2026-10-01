"use client";

import { TrackerCell } from "@/components/cell/TrackerCell";
import { useCheckins } from "@/lib/data/useCheckins";
import { todayISO } from "@/lib/date";
import type { PersonId } from "@/lib/supabase/types";

export function HabitStripRow({
  personId,
  habitId,
  icon,
  label,
  failedGlyph,
  dates,
  personLabel,
}: {
  personId: PersonId;
  habitId: string;
  icon: string;
  label: string;
  failedGlyph: string;
  dates: string[];
  personLabel?: string;
}) {
  const { getStatus, cycle, failedKeys } = useCheckins();
  const today = todayISO();

  return (
    <div className="flex flex-col gap-1 py-1.5">
      <p className="text-sm font-medium text-ink-muted">
        {icon} {label}
        {personLabel ? ` — ${personLabel}` : ""}
      </p>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {dates.map((dateISO) => (
          <TrackerCell
            key={dateISO}
            size="sm"
            status={getStatus(personId, habitId, dateISO)}
            failedGlyph={failedGlyph}
            isToday={dateISO === today}
            ariaLabel={`${label} — ${dateISO}`}
            hasError={failedKeys.has(`${personId}_${habitId}_${dateISO}`)}
            disabled={dateISO !== today}
            onTap={() => cycle(personId, habitId, dateISO)}
          />
        ))}
      </div>
    </div>
  );
}
