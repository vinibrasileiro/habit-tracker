import type { PersonId } from "../supabase/types";
import type { StatusGetter } from "./types";

export type WeeklyGoalStatus = "met" | "short" | "exceeded";

export interface WeeklyGoal {
  done: number;
  goal: number;
  status: WeeklyGoalStatus;
}

const WORKOUT_GOAL = 3;

/** `weekDates` should be the Monday-Sunday dates for one calendar week,
 * already intersected with elapsed (<= today) dates by the caller. Weeks
 * are fixed Monday-Sunday regardless of the challenge start date (confirmed
 * product decision), not anchored to when the challenge began. */
export function deriveWeeklyGoal(
  getStatus: StatusGetter,
  personId: PersonId,
  habitId: string,
  weekDates: string[]
): WeeklyGoal {
  const done = weekDates.filter(
    (date) => getStatus(personId, habitId, date) === "done"
  ).length;

  const status: WeeklyGoalStatus =
    done > WORKOUT_GOAL ? "exceeded" : done === WORKOUT_GOAL ? "met" : "short";

  return { done, goal: WORKOUT_GOAL, status };
}
