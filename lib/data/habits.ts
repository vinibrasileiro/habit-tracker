import type { HabitRow, PersonId, PersonRow } from "../supabase/types";

/**
 * Fixed reference data, mirrored from supabase/migrations/0002_seed_people_habits.sql.
 * Kept client-side so the tracker can render instantly before the first fetch,
 * without waiting on a network round-trip for data that never changes.
 */

export const PEOPLE: PersonRow[] = [
  { id: "vinicius", display_name: "Vinicius", emoji: "👤", sort_order: 1 },
  { id: "camila", display_name: "Camila", emoji: "👤", sort_order: 2 },
];

export const HABITS: HabitRow[] = [
  {
    id: "sem_doces",
    label: "Sem doces",
    icon: "🍬",
    person_id: "vinicius",
    sort_order: 1,
    failed_glyph: "✕",
  },
  {
    id: "sem_refrigerante_vinicius",
    label: "Sem refrigerante",
    icon: "🥤",
    person_id: "vinicius",
    sort_order: 2,
    failed_glyph: "✕",
  },
  {
    id: "treino_vinicius",
    label: "Treino",
    icon: "🏋️",
    person_id: "vinicius",
    sort_order: 3,
    failed_glyph: "—",
  },
  {
    id: "sem_doces_camila",
    label: "Sem doces",
    icon: "🍬",
    person_id: "camila",
    sort_order: 1,
    failed_glyph: "✕",
  },
  {
    id: "sem_refrigerante_camila",
    label: "Sem refrigerante",
    icon: "🥤",
    person_id: "camila",
    sort_order: 2,
    failed_glyph: "✕",
  },
  {
    id: "treino_camila",
    label: "Treino",
    icon: "🏋️",
    person_id: "camila",
    sort_order: 3,
    failed_glyph: "—",
  },
];

export function habitsForPerson(personId: PersonId): HabitRow[] {
  return HABITS.filter((h) => h.person_id === personId).sort(
    (a, b) => a.sort_order - b.sort_order
  );
}

export function habitById(habitId: string): HabitRow | undefined {
  return HABITS.find((h) => h.id === habitId);
}

export function personById(personId: PersonId): PersonRow | undefined {
  return PEOPLE.find((p) => p.id === personId);
}
