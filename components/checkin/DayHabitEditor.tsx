"use client";

import { habitsForPerson, personById } from "@/lib/data/habits";
import { useCheckins } from "@/lib/data/useCheckins";
import { fromISODate } from "@/lib/date";
import type { PersonId } from "@/lib/supabase/types";

function formatDayMonth(dateISO: string): string {
  const d = fromISODate(dateISO);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function DayHabitEditor({
  dateISO,
  personIds,
  title = "HOJE",
}: {
  dateISO: string;
  personIds: PersonId[];
  title?: string;
}) {
  const { getStatus, getRow, setStatus, failedKeys } = useCheckins();

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold">
        {title} — {formatDayMonth(dateISO)}
      </h2>
      {personIds.map((personId) => {
        const person = personById(personId);
        const habits = habitsForPerson(personId);
        return (
          <div key={personId} className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-ink-muted">
              {person?.emoji} {person?.display_name}
            </p>
            {habits.map((habit) => {
              const isTraining = habit.id.startsWith("treino");
              const status = getStatus(personId, habit.id, dateISO);
              const row = getRow(personId, habit.id, dateISO);
              const key = `${personId}_${habit.id}_${dateISO}`;
              const doneLabel = isTraining ? "SIM" : "CUMPRI";
              const failedLabel = isTraining ? "NÃO" : "NÃO CUMPRI";

              return (
                <div key={habit.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm">
                      {habit.icon} {habit.label}
                    </span>
                    <div className="flex gap-2">
                      <EditButton
                        active={status === "done"}
                        label={`✓ ${doneLabel}`}
                        tone="done"
                        onClick={() =>
                          setStatus(
                            personId,
                            habit.id,
                            dateISO,
                            status === "done" ? "unset" : "done"
                          )
                        }
                      />
                      <EditButton
                        active={status === "failed"}
                        label={`✕ ${failedLabel}`}
                        tone="failed"
                        onClick={() =>
                          setStatus(
                            personId,
                            habit.id,
                            dateISO,
                            status === "failed" ? "unset" : "failed"
                          )
                        }
                      />
                    </div>
                  </div>
                  {failedKeys.has(key) && (
                    <p className="text-xs text-failed">
                      Não foi possível salvar. Toque novamente.
                    </p>
                  )}
                  {row && status !== "unset" && (
                    <p className="text-xs text-ink-muted">
                      Atualizado em{" "}
                      {new Date(row.updated_at).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function EditButton({
  active,
  label,
  tone,
  onClick,
}: {
  active: boolean;
  label: string;
  tone: "done" | "failed";
  onClick: () => void;
}) {
  const toneClasses =
    tone === "done"
      ? active
        ? "bg-done text-paper border-done"
        : "border-line text-ink-muted hover:border-done hover:text-done"
      : active
        ? "bg-failed text-paper border-failed"
        : "border-line text-ink-muted hover:border-failed hover:text-failed";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${toneClasses}`}
    >
      {label}
    </button>
  );
}
