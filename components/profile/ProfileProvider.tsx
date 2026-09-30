"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ProfileContext,
  readStoredProfile,
  writeStoredProfile,
} from "@/lib/profile/useProfile";
import type { PersonId } from "@/lib/supabase/types";

/** Gates its children behind a locally-stored profile choice, redirecting to
 * /onboarding if none is set yet on this device. */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // undefined = not checked yet (server render / first client paint, kept
  // identical to avoid a hydration mismatch), null = checked, nothing stored.
  const [personId, setPersonIdState] = useState<PersonId | null | undefined>(
    undefined
  );

  useEffect(() => {
    const stored = readStoredProfile();
    if (!stored) {
      router.replace("/onboarding");
    }
    // Reading localStorage is only possible client-side, after mount — this
    // is the one place that value can first become known, so it can only be
    // set from an effect, not derived during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPersonIdState(stored);
  }, [router]);

  function setPersonId(next: PersonId) {
    writeStoredProfile(next);
    setPersonIdState(next);
  }

  if (!personId) return null;

  return (
    <ProfileContext.Provider value={{ personId, setPersonId }}>
      {children}
    </ProfileContext.Provider>
  );
}
