/** Date helpers. All "ISO date" strings here are plain YYYY-MM-DD (no time/zone),
 * matching Postgres `date` columns, and are always manipulated in local time to
 * avoid UTC-boundary off-by-one bugs on day math. */

export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, days: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Returns the `count` challenge dates starting at `startDate`, inclusive. */
export function challengeDates(startDate: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addDays(startDate, i));
}

/** 1 = day 1 of the challenge. Returns null if `dateISO` is outside the range. */
export function challengeDayNumber(
  dateISO: string,
  startDate: string,
  durationDays: number
): number | null {
  const diff = Math.round(
    (fromISODate(dateISO).getTime() - fromISODate(startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const dayNumber = diff + 1;
  return dayNumber >= 1 && dayNumber <= durationDays ? dayNumber : null;
}

/** Monday = 0 ... Sunday = 6, matching the Seg-Dom calendar layout. */
export function mondayIndex(dateISO: string): number {
  const jsDay = fromISODate(dateISO).getDay(); // Sunday = 0 ... Saturday = 6
  return (jsDay + 6) % 7;
}

export function startOfWeekISO(dateISO: string): string {
  return addDays(dateISO, -mondayIndex(dateISO));
}

/** Days in the given month's calendar grid, including leading/trailing days
 * from adjacent months so every week row has 7 days (Seg-Dom). */
export function monthGridDates(year: number, monthIndex0: number): string[] {
  const firstOfMonth = toISODate(new Date(year, monthIndex0, 1));
  const lastOfMonth = toISODate(new Date(year, monthIndex0 + 1, 0));
  const gridStart = startOfWeekISO(firstOfMonth);
  const lastWeekday = mondayIndex(lastOfMonth);
  const gridEnd = addDays(lastOfMonth, 6 - lastWeekday);

  const dates: string[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
}

export const WEEKDAY_LABELS_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
