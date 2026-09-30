"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { readStoredProfile } from "@/lib/profile/useProfile";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const stored = readStoredProfile();
    router.replace(stored ? `/${stored}` : "/onboarding");
  }, [router]);

  return null;
}
