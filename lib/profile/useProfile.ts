"use client";

import { createContext, useContext } from "react";
import type { PersonId } from "../supabase/types";

const STORAGE_KEY = "habit-tracker:profile";

export function readStoredProfile(): PersonId | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "vinicius" || value === "camila" ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredProfile(personId: PersonId): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, personId);
  } catch {
    // Storage unavailable (private browsing, etc). The picker will just
    // reappear next visit, which is an acceptable degradation.
  }
}

export interface ProfileContextValue {
  personId: PersonId;
  setPersonId: (personId: PersonId) => void;
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}
