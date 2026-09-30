"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { todayISO } from "../date";
import type { SettingsRow } from "../supabase/types";

export interface ChallengeSettings {
  challengeStartDate: string;
  challengeDurationDays: number;
}

const FALLBACK: ChallengeSettings = {
  challengeStartDate: todayISO(),
  challengeDurationDays: 30,
};

/** Fetches the singleton settings row. Falls back to "starts today, 30 days"
 * while loading or if the row hasn't been seeded yet, so the UI never blocks
 * on this — it just briefly shows day 1 until the real value arrives. */
export function useSettings(): { settings: ChallengeSettings; loading: boolean } {
  const [settings, setSettings] = useState<ChallengeSettings>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data } = (await supabase
          .from("settings")
          .select("challenge_start_date, challenge_duration_days")
          .eq("id", 1)
          .maybeSingle()) as {
          data: Pick<
            SettingsRow,
            "challenge_start_date" | "challenge_duration_days"
          > | null;
        };
        if (cancelled || !data) return;
        setSettings({
          challengeStartDate: data.challenge_start_date,
          challengeDurationDays: data.challenge_duration_days,
        });
      } catch (err) {
        console.error("Failed to load challenge settings, using fallback.", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading };
}
