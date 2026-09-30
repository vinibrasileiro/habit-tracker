import type { PersonId } from "../supabase/types";
import type { StatusGetter } from "./types";

/** True once every habit assigned to `personId` is marked 'done' for `dateISO'.
 * Drives the "DIA CONCLUIDO!" celebration — independent of the (per-habit)
 * streak definition. */
export function deriveDayCompletion(
  getStatus: StatusGetter,
  personId: PersonId,
  habitIds: string[],
  dateISO: string
): boolean {
  if (habitIds.length === 0) return false;
  return habitIds.every((habitId) => getStatus(personId, habitId, dateISO) === "done");
}
