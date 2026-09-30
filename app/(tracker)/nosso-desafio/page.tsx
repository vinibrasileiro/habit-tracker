"use client";

import { ProgressHeader } from "@/components/header/ProgressHeader";
import { HabitStripRow } from "@/components/strip/HabitStripRow";
import { HabitDayMatrix, type HabitMatrixRow } from "@/components/desktop/HabitDayMatrix";
import { combinedHabitGroups } from "@/lib/data/combinedHabitGroups";
import { useSettings } from "@/lib/data/useSettings";
import { challengeDates } from "@/lib/date";

export default function NossoDesafioPage() {
  const { settings } = useSettings();
  const dates = challengeDates(
    settings.challengeStartDate,
    settings.challengeDurationDays
  );
  const groups = combinedHabitGroups();

  const matrixRows: HabitMatrixRow[] = groups.flatMap((group) =>
    group.entries.map((entry) => ({
      personId: entry.personId,
      habitId: entry.habitId,
      rowLabel: `${group.icon} ${entry.personLabel}`,
      failedGlyph: entry.failedGlyph,
    }))
  );

  return (
    <>
      <ProgressHeader personIds={["vinicius", "camila"]} />
      <div className="pb-24 md:hidden">
        <div className="px-3 pt-3">
          {groups.map((group) => (
            <div key={group.label} className="mb-3 border-b border-line pb-2">
              <p className="mb-1 text-sm font-semibold tracking-wide text-ink">
                {group.icon} {group.label.toUpperCase()}
              </p>
              {group.entries.map((entry) => (
                <HabitStripRow
                  key={entry.habitId}
                  personId={entry.personId}
                  habitId={entry.habitId}
                  icon={group.icon}
                  label={entry.personLabel}
                  failedGlyph={entry.failedGlyph}
                  dates={dates}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="hidden pb-10 md:block">
        <HabitDayMatrix rows={matrixRows} dates={dates} />
      </div>
    </>
  );
}
