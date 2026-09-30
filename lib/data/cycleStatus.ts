import type { CheckinStatus } from "../supabase/types";

/** The single tap-to-cycle rule used everywhere a cell is tapped directly:
 * unset -> done -> failed -> unset. The quick check-in panel bypasses this
 * and sets status explicitly instead, but both paths write through the same
 * upsert function so they can never diverge. */
export function cycleStatus(current: CheckinStatus): CheckinStatus {
  switch (current) {
    case "unset":
      return "done";
    case "done":
      return "failed";
    case "failed":
      return "unset";
  }
}
