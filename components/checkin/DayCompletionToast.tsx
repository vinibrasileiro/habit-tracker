"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCheckins } from "@/lib/data/useCheckins";
import { habitsForPerson } from "@/lib/data/habits";
import { deriveDayCompletion } from "@/lib/stats/deriveDayCompletion";
import { todayISO } from "@/lib/date";
import { useProfile } from "@/lib/profile/useProfile";

/** Watches this device's own profile for today's completion. Mounts fresh
 * (via `key={today}`) each time completion flips false -> true, so the fade
 * in/hold/fade out keyframes replay every time rather than needing a
 * separate "just completed" state + timer to manage. */
export function DayCompletionToast() {
  const { personId } = useProfile();
  const { getStatus } = useCheckins();
  const today = todayISO();
  const habitIds = habitsForPerson(personId).map((h) => h.id);
  const isComplete = deriveDayCompletion(getStatus, personId, habitIds, today);

  return (
    <AnimatePresence>
      {isComplete && (
        <motion.div
          key={today}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: [0, 1, 1, 0], y: [-12, 0, 0, -12] }}
          transition={{ duration: 2.2, times: [0, 0.15, 0.8, 1] }}
          className="pointer-events-none fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper shadow-lg"
        >
          🔥 DIA CONCLUÍDO!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
