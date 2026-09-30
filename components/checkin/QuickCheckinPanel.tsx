"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { DayHabitEditor } from "./DayHabitEditor";
import { todayISO } from "@/lib/date";

export function QuickCheckinPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <DayHabitEditor dateISO={todayISO()} personIds={["vinicius", "camila"]} />
      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full rounded-md bg-ink py-2.5 text-sm font-semibold text-paper"
      >
        SALVAR
      </button>
    </BottomSheet>
  );
}
