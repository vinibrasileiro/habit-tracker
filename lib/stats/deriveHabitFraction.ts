import type { PersonId } from "../supabase/types";
import type { StatusGetter } from "./types";

export interface HabitFraction {
  done: number;
  total: number;
}

/** `elapsedDates` should already be filtered to dates <= today, so the
 * denominator reflects days that have actually happened, not the full
 * 30-day challenge length. */
export function deriveHabitFraction(
  getStatus: StatusGetter,
  personId: PersonId,
  habitId: string,
  elapsedDates: string[]
): HabitFraction {
  const done = elapsedDates.filter(
    (date) => getStatus(personId, habitId, date) === "done"
  ).length;
  return { done, total: elapsedDates.length };
}
