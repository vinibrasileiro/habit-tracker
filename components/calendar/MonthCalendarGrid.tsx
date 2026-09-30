"use client";

import { useMemo, useState } from "react";
import { DayCellSummary } from "./DayCellSummary";
import { monthGridDates, todayISO, WEEKDAY_LABELS_PT } from "@/lib/date";
import type { PersonId } from "@/lib/supabase/types";

const MONTH_LABELS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function yearOf(dateISO: string) {
  return Number(dateISO.slice(0, 4));
}
function monthIndex0Of(dateISO: string) {
  return Number(dateISO.slice(5, 7)) - 1;
}

export function MonthCalendarGrid({
  personId,
  challengeDates,
  onOpenDay,
}: {
  personId: PersonId;
  challengeDates: string[];
  onOpenDay: (dateISO: string) => void;
}) {
  const today = todayISO();
  const firstChallengeDate = challengeDates[0];
  const lastChallengeDate = challengeDates[challengeDates.length - 1];
  const challengeDateSet = useMemo(() => new Set(challengeDates), [challengeDates]);

  // Default to today's month if today falls inside the challenge; otherwise
  // anchor on the challenge's own start month (challenge hasn't started yet
  // or has already ended — showing some unrelated "today" month would just
  // land on an all-disabled grid).
  const defaultAnchor =
    today >= firstChallengeDate && today <= lastChallengeDate
      ? today
      : firstChallengeDate;

  const [year, setYear] = useState(() => yearOf(defaultAnchor));
  const [monthIndex0, setMonthIndex0] = useState(() => monthIndex0Of(defaultAnchor));

  const minYear = yearOf(firstChallengeDate);
  const minMonth0 = monthIndex0Of(firstChallengeDate);
  const maxYear = yearOf(lastChallengeDate);
  const maxMonth0 = monthIndex0Of(lastChallengeDate);

  const atMinMonth = year === minYear && monthIndex0 === minMonth0;
  const atMaxMonth = year === maxYear && monthIndex0 === maxMonth0;

  const dates = monthGridDates(year, monthIndex0);
  const currentMonthPrefix = `${year}-${String(monthIndex0 + 1).padStart(2, "0")}`;

  function goToPreviousMonth() {
    if (atMinMonth) return;
    if (monthIndex0 === 0) {
      setYear((y) => y - 1);
      setMonthIndex0(11);
    } else {
      setMonthIndex0((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (atMaxMonth) return;
    if (monthIndex0 === 11) {
      setYear((y) => y + 1);
      setMonthIndex0(0);
    } else {
      setMonthIndex0((m) => m + 1);
    }
  }

  return (
    <div className="px-3 py-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousMonth}
          disabled={atMinMonth}
          aria-label="Mês anterior"
          className="px-2 py-1 text-ink-muted hover:text-ink disabled:opacity-20 disabled:hover:text-ink-muted"
        >
          ‹
        </button>
        <p className="text-sm font-semibold tracking-wide">
          {MONTH_LABELS_PT[monthIndex0].toUpperCase()} {year}
        </p>
        <button
          type="button"
          onClick={goToNextMonth}
          disabled={atMaxMonth}
          aria-label="Próximo mês"
          className="px-2 py-1 text-ink-muted hover:text-ink disabled:opacity-20 disabled:hover:text-ink-muted"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px text-center text-xs text-ink-muted">
        {WEEKDAY_LABELS_PT.map((label) => (
          <div key={label} className="pb-1">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px divide-line">
        {dates.map((dateISO) => (
          <DayCellSummary
            key={dateISO}
            personId={personId}
            dateISO={dateISO}
            isCurrentMonth={dateISO.startsWith(currentMonthPrefix)}
            isInChallenge={challengeDateSet.has(dateISO)}
            onOpenDay={onOpenDay}
          />
        ))}
      </div>
    </div>
  );
}
