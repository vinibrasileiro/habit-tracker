import type { CheckinStatus, PersonId } from "../supabase/types";

/** All stats functions take a plain accessor instead of the raw checkins map,
 * so they stay pure/testable and work directly against useCheckins().getStatus. */
export type StatusGetter = (
  personId: PersonId,
  habitId: string,
  dateISO: string
) => CheckinStatus;
