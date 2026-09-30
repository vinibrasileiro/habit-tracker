"use client";

import { PEOPLE } from "@/lib/data/habits";
import type { PersonId } from "@/lib/supabase/types";

export function ProfilePicker({
  onPick,
}: {
  onPick: (personId: PersonId) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div>
        <p className="font-hand text-3xl text-ink-muted">Desafio 30 Dias</p>
        <h1 className="mt-1 text-xl font-semibold">Quem é você?</h1>
      </div>
      <div className="flex gap-4">
        {PEOPLE.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => onPick(person.id)}
            className="flex w-32 flex-col items-center gap-2 rounded-xl border border-line px-4 py-6 transition-colors hover:border-ink-muted active:scale-95"
          >
            <span className="text-3xl">{person.emoji}</span>
            <span className="font-medium">{person.display_name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
