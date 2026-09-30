export type PersonId = "vinicius" | "camila";

export type CheckinStatus = "unset" | "done" | "failed";

export interface PersonRow {
  id: PersonId;
  display_name: string;
  emoji: string;
  sort_order: number;
}

export interface HabitRow {
  id: string;
  label: string;
  icon: string;
  person_id: PersonId;
  sort_order: number;
  failed_glyph: string;
}

export interface CheckinRow {
  id: string;
  person_id: PersonId;
  habit_id: string;
  checkin_date: string; // ISO date (YYYY-MM-DD)
  status: CheckinStatus;
  created_at: string;
  updated_at: string;
}

export interface SettingsRow {
  id: 1;
  challenge_start_date: string; // ISO date (YYYY-MM-DD)
  challenge_duration_days: number;
}
