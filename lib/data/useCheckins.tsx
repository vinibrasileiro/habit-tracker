"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "../supabase/client";
import type { CheckinRow, CheckinStatus, PersonId } from "../supabase/types";
import { cycleStatus } from "./cycleStatus";

function checkinKey(personId: PersonId, habitId: string, dateISO: string) {
  return `${personId}_${habitId}_${dateISO}`;
}

interface CheckinsContextValue {
  loading: boolean;
  getRow: (
    personId: PersonId,
    habitId: string,
    dateISO: string
  ) => CheckinRow | undefined;
  getStatus: (
    personId: PersonId,
    habitId: string,
    dateISO: string
  ) => CheckinStatus;
  setStatus: (
    personId: PersonId,
    habitId: string,
    dateISO: string,
    status: CheckinStatus
  ) => Promise<void>;
  cycle: (personId: PersonId, habitId: string, dateISO: string) => Promise<void>;
  failedKeys: Set<string>;
}

const CheckinsContext = createContext<CheckinsContextValue | null>(null);

export function CheckinsProvider({
  dateRange,
  children,
}: {
  dateRange: string[];
  children: React.ReactNode;
}) {
  const [rows, setRows] = useState<Map<string, CheckinRow>>(new Map());
  const [loading, setLoading] = useState(true);
  const [failedKeys, setFailedKeys] = useState<Set<string>>(new Set());
  // Guards against a slower "unset -> done" upsert response landing after a
  // newer "done -> failed" one for the same cell (fast double-taps).
  const writeSeq = useRef<Map<string, number>>(new Map());

  const startDate = dateRange[0];
  const endDate = dateRange[dateRange.length - 1];

  useEffect(() => {
    if (!startDate || !endDate) return;
    let cancelled = false;

    async function load() {
      try {
        const { data } = (await supabase
          .from("checkins")
          .select("*")
          .gte("checkin_date", startDate)
          .lte("checkin_date", endDate)) as { data: CheckinRow[] | null };
        if (cancelled || !data) return;
        const next = new Map<string, CheckinRow>();
        for (const row of data) {
          next.set(checkinKey(row.person_id, row.habit_id, row.checkin_date), row);
        }
        setRows(next);
      } catch (err) {
        console.error("Failed to load check-ins.", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel("checkins-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "checkins" },
        (payload) => {
          const row = payload.new as CheckinRow | undefined;
          if (!row || row.checkin_date < startDate || row.checkin_date > endDate) {
            return;
          }
          setRows((prev) => {
            const next = new Map(prev);
            next.set(checkinKey(row.person_id, row.habit_id, row.checkin_date), row);
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [startDate, endDate]);

  const getRow = useCallback(
    (personId: PersonId, habitId: string, dateISO: string) =>
      rows.get(checkinKey(personId, habitId, dateISO)),
    [rows]
  );

  const getStatus = useCallback(
    (personId: PersonId, habitId: string, dateISO: string): CheckinStatus =>
      getRow(personId, habitId, dateISO)?.status ?? "unset",
    [getRow]
  );

  const setStatus = useCallback(
    async (
      personId: PersonId,
      habitId: string,
      dateISO: string,
      status: CheckinStatus
    ) => {
      const key = checkinKey(personId, habitId, dateISO);
      const previousRow = rows.get(key);
      const seq = (writeSeq.current.get(key) ?? 0) + 1;
      writeSeq.current.set(key, seq);

      const now = new Date().toISOString();
      const optimisticRow: CheckinRow = {
        id: previousRow?.id ?? key,
        person_id: personId,
        habit_id: habitId,
        checkin_date: dateISO,
        status,
        created_at: previousRow?.created_at ?? now,
        updated_at: now,
      };

      setRows((prev) => {
        const next = new Map(prev);
        next.set(key, optimisticRow);
        return next;
      });
      setFailedKeys((prev) => {
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });

      let data: CheckinRow | null = null;
      let error: unknown = null;
      try {
        ({ data, error } = (await supabase
          .from("checkins")
          .upsert(
            {
              person_id: personId,
              habit_id: habitId,
              checkin_date: dateISO,
              status,
            },
            { onConflict: "person_id,habit_id,checkin_date" }
          )
          .select()
          .single()) as { data: CheckinRow | null; error: unknown });
      } catch (err) {
        error = err;
      }

      // A newer write for this key has already started; let it own the outcome.
      if (writeSeq.current.get(key) !== seq) return;

      if (error || !data) {
        console.error("Failed to save check-in.", error);
        setRows((prev) => {
          const next = new Map(prev);
          if (previousRow) {
            next.set(key, previousRow);
          } else {
            next.delete(key);
          }
          return next;
        });
        setFailedKeys((prev) => new Set(prev).add(key));
        return;
      }

      setRows((prev) => {
        const next = new Map(prev);
        next.set(key, data);
        return next;
      });
    },
    [rows]
  );

  const cycle = useCallback(
    (personId: PersonId, habitId: string, dateISO: string) =>
      setStatus(personId, habitId, dateISO, cycleStatus(getStatus(personId, habitId, dateISO))),
    [getStatus, setStatus]
  );

  return (
    <CheckinsContext.Provider
      value={{ loading, getRow, getStatus, setStatus, cycle, failedKeys }}
    >
      {children}
    </CheckinsContext.Provider>
  );
}

export function useCheckins(): CheckinsContextValue {
  const ctx = useContext(CheckinsContext);
  if (!ctx) {
    throw new Error("useCheckins must be used within a CheckinsProvider");
  }
  return ctx;
}
