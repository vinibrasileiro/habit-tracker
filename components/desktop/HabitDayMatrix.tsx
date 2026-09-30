"use client";

import { TrackerCell } from "@/components/cell/TrackerCell";
import { useCheckins } from "@/lib/data/useCheckins";
import { todayISO } from "@/lib/date";
import type { PersonId } from "@/lib/supabase/types";

export interface HabitMatrixRow {
  personId: PersonId;
  habitId: string;
  rowLabel: string;
  failedGlyph: string;
}

export function HabitDayMatrix({
  rows,
  dates,
}: {
  rows: HabitMatrixRow[];
  dates: string[];
}) {
  const { getStatus, cycle, failedKeys } = useCheckins();
  const today = todayISO();

  return (
    <div className="overflow-x-auto px-4 py-3">
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-paper px-2 py-1 text-left font-medium text-ink-muted">
              Hábito
            </th>
            {dates.map((dateISO) => (
              <th
                key={dateISO}
                className="px-0.5 py-1 text-center font-normal text-ink-muted"
              >
                {dateISO.slice(-2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.personId}_${row.habitId}`}>
              <td className="sticky left-0 z-10 whitespace-nowrap bg-paper px-2 py-1 font-medium">
                {row.rowLabel}
              </td>
              {dates.map((dateISO) => (
                <td key={dateISO} className="px-0.5 py-1">
                  <TrackerCell
                    size="sm"
                    status={getStatus(row.personId, row.habitId, dateISO)}
                    failedGlyph={row.failedGlyph}
                    isToday={dateISO === today}
                    ariaLabel={`${row.rowLabel} — ${dateISO}`}
                    hasError={failedKeys.has(
                      `${row.personId}_${row.habitId}_${dateISO}`
                    )}
                    onTap={() => cycle(row.personId, row.habitId, dateISO)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
