"use client";

import { motion } from "framer-motion";
import type { CheckinStatus } from "@/lib/supabase/types";

const GLYPH: Record<CheckinStatus, string> = {
  unset: "○",
  done: "✓",
  failed: "✕",
};

// min-h/min-w scale with size instead of a single shared floor: a blanket
// 44px minimum would win over every smaller explicit height (min-height
// always overrides a smaller height), silently forcing every "sm" cell in
// the dense calendar/strip/desktop-matrix views up to 44px and blowing out
// those layouts. "lg" still hits the full 44px HIG target where it's the
// sole/primary control (quick check-in, day detail); "sm"/"md" trade a
// slightly smaller target for the density those grids need.
const SIZE_CLASSES = {
  sm: "h-7 w-7 min-h-7 min-w-7 text-xs",
  md: "h-9 w-9 min-h-9 min-w-9 text-sm",
  lg: "h-11 w-11 min-h-11 min-w-11 text-base",
} as const;

export type TrackerCellSize = keyof typeof SIZE_CLASSES;

export interface TrackerCellProps {
  status: CheckinStatus;
  failedGlyph?: string;
  size?: TrackerCellSize;
  isToday?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  ariaLabel: string;
  onTap: () => void;
}

export function TrackerCell({
  status,
  failedGlyph = GLYPH.failed,
  size = "md",
  isToday = false,
  disabled = false,
  hasError = false,
  ariaLabel,
  onTap,
}: TrackerCellProps) {
  const glyph = status === "failed" ? failedGlyph : GLYPH[status];

  const stateClasses =
    status === "done"
      ? "bg-done-soft text-done border-done/40"
      : status === "failed"
        ? "bg-failed-soft text-failed border-failed/40"
        : "bg-transparent text-ink-muted border-line";

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={status === "done"}
      disabled={disabled}
      onClick={onTap}
      className={[
        "relative flex items-center justify-center rounded-md border font-medium select-none",
        "touch-manipulation",
        SIZE_CLASSES[size],
        stateClasses,
        isToday ? "ring-2 ring-today-ring ring-offset-1 ring-offset-paper" : "",
        hasError ? "outline outline-2 outline-failed" : "",
        disabled ? "opacity-50" : "active:scale-95",
      ].join(" ")}
    >
      <motion.span
        key={status}
        initial={{ scale: 0.5, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          status === "done"
            ? { type: "spring", stiffness: 500, damping: 15 }
            : { type: "spring", stiffness: 400, damping: 25 }
        }
      >
        {glyph}
      </motion.span>
    </button>
  );
}
