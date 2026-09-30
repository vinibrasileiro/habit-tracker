"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { DayHabitEditor } from "@/components/checkin/DayHabitEditor";
import type { PersonId } from "@/lib/supabase/types";

export function DayDetailSheet({
  personId,
  dateISO,
  onClose,
}: {
  personId: PersonId;
  dateISO: string | null;
  onClose: () => void;
}) {
  return (
    <BottomSheet open={dateISO !== null} onClose={onClose}>
      {dateISO && (
        <>
          <DayHabitEditor dateISO={dateISO} personIds={[personId]} title="DIA" />
          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-md border border-line py-2.5 text-sm font-semibold text-ink"
          >
            FECHAR
          </button>
        </>
      )}
    </BottomSheet>
  );
}
