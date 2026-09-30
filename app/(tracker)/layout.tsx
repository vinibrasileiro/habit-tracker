"use client";

import { useState } from "react";
import { ProfileProvider } from "@/components/profile/ProfileProvider";
import { CheckinsProvider } from "@/lib/data/useCheckins";
import { TopTabs } from "@/components/layout/TopTabs";
import { QuickCheckinButton } from "@/components/checkin/QuickCheckinButton";
import { QuickCheckinPanel } from "@/components/checkin/QuickCheckinPanel";
import { DayCompletionToast } from "@/components/checkin/DayCompletionToast";
import { useSettings } from "@/lib/data/useSettings";
import { challengeDates } from "@/lib/date";

function TrackerShell({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [quickCheckinOpen, setQuickCheckinOpen] = useState(false);
  const dates = challengeDates(
    settings.challengeStartDate,
    settings.challengeDurationDays
  );

  return (
    <CheckinsProvider dateRange={dates}>
      <DayCompletionToast />
      <TopTabs />
      <div className="flex-1">{children}</div>
      <QuickCheckinButton onClick={() => setQuickCheckinOpen(true)} />
      <QuickCheckinPanel
        open={quickCheckinOpen}
        onClose={() => setQuickCheckinOpen(false)}
      />
    </CheckinsProvider>
  );
}

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <TrackerShell>{children}</TrackerShell>
    </ProfileProvider>
  );
}
