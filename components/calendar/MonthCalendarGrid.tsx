"use client";

import { useState } from "react";
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

export function MonthCalendarGrid({
  personId,
  onOpenDay,
}: {
  personId: PersonId;
  onOpenDay: (dateISO: string) => void;
}) {
  const today = todayISO();
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));
  const [monthIndex0, setMonthIndex0] = useState(() => Number(today.slice(5, 7)) - 1);

  const dates = monthGridDates(year, monthIndex0);
  const currentMonthPrefix = `${year}-${String(monthIndex0 + 1).padStart(2, "0")}`;

  function goToPreviousMonth() {
    if (monthIndex0 === 0) {
      setYear((y) => y - 1);
      setMonthIndex0(11);
    } else {
      setMonthIndex0((m) => m - 1);
    }
  }

  function goToNextMonth() {
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
          aria-label="Mês anterior"
          className="px-2 py-1 text-ink-muted hover:text-ink"
        >
          ‹
        </button>
        <p className="text-sm font-semibold tracking-wide">
          {MONTH_LABELS_PT[monthIndex0].toUpperCase()} {year}
        </p>
        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Próximo mês"
          className="px-2 py-1 text-ink-muted hover:text-ink"
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
            onOpenDay={onOpenDay}
          />
        ))}
      </div>
    </div>
  );
}
