import type { PersonId } from "../supabase/types";
import type { StatusGetter } from "./types";

/** Consecutive 'done' days for one habit, walking backwards from the most
 * recent elapsed date. Any 'unset' or 'failed' day breaks the streak
 * (per-habit, per confirmed product decision — not combined across habits). */
export function deriveStreak(
  getStatus: StatusGetter,
  personId: PersonId,
  habitId: string,
  elapsedDatesAscending: string[]
): number {
  let streak = 0;
  for (let i = elapsedDatesAscending.length - 1; i >= 0; i--) {
    if (getStatus(personId, habitId, elapsedDatesAscending[i]) !== "done") break;
    streak++;
  }
  return streak;
}
