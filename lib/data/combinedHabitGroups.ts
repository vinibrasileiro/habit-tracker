import { HABITS, PEOPLE } from "./habits";
import type { PersonId } from "../supabase/types";

export interface CombinedHabitGroup {
  label: string;
  icon: string;
  entries: {
    personId: PersonId;
    habitId: string;
    failedGlyph: string;
    personLabel: string;
  }[];
}

const personOrder = new Map(PEOPLE.map((p) => [p.id, p.sort_order]));

/** Groups the fixed habit list by habit type (Sem doces / Sem refrigerante /
 * Treino) so the "Nosso Desafio" view can show Vinicius and Camila's rows for
 * the same habit next to each other, matching the product spec's layout. */
export function combinedHabitGroups(): CombinedHabitGroup[] {
  const groups = new Map<string, CombinedHabitGroup>();

  for (const habit of HABITS) {
    const existing = groups.get(habit.label);
    const entry = {
      personId: habit.person_id,
      habitId: habit.id,
      failedGlyph: habit.failed_glyph,
      personLabel:
        PEOPLE.find((p) => p.id === habit.person_id)?.display_name ?? habit.person_id,
    };
    if (existing) {
      existing.entries.push(entry);
    } else {
      groups.set(habit.label, { label: habit.label, icon: habit.icon, entries: [entry] });
    }
  }

  for (const group of groups.values()) {
    group.entries.sort(
      (a, b) => (personOrder.get(a.personId) ?? 0) - (personOrder.get(b.personId) ?? 0)
    );
  }

  return Array.from(groups.values());
}
