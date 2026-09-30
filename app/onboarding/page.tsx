"use client";

import { useRouter } from "next/navigation";
import { ProfilePicker } from "@/components/profile/ProfilePicker";
import { writeStoredProfile } from "@/lib/profile/useProfile";
import type { PersonId } from "@/lib/supabase/types";

export default function OnboardingPage() {
  const router = useRouter();

  function handlePick(personId: PersonId) {
    writeStoredProfile(personId);
    router.replace(`/${personId}`);
  }

  return <ProfilePicker onPick={handlePick} />;
}
