"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useTripStore } from "@/lib/store/trip-store";

/**
 * AuthStateListener - Manages Zustand trip store based on auth changes
 * 
 * Behavior:
 * - Login from guest (null → user): KEEP store (preserve trip data created as guest)
 * - Switch accounts (userA → userB): CLEAR store (prevent data leakage)
 * - Logout: CLEAR store (also handled in UserDropdown for immediate feedback)
 */
export function AuthStateListener() {
  const clearTrip = useTripStore((state) => state.clearTrip);
  const previousUserIdRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    const initializeAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      previousUserIdRef.current = user?.id ?? null;
      isInitializedRef.current = true;
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Skip if not initialized yet (to avoid clearing on initial load)
      if (!isInitializedRef.current) return;

      const currentUserId = session?.user?.id ?? null;
      const previousUserId = previousUserIdRef.current;

      // Clear store when:
      // 1. User switches accounts (userA → userB) - CLEAR
      // 2. User signs out - CLEAR
      // 3. User logs in from guest (null → user) - KEEP (preserve trip data)
      if (event === "SIGNED_IN") {
        // Only clear if switching between authenticated users (userA → userB)
        // Keep store when logging in from guest state (null → user)
        if (previousUserId !== null && previousUserId !== currentUserId) {
          console.log(
            "[AuthStateListener] User switched accounts, clearing trip store",
          );
          clearTrip();
        } else if (previousUserId === null) {
          console.log(
            "[AuthStateListener] User logged in from guest, keeping trip store",
          );
        }
      } else if (event === "SIGNED_OUT") {
        // User logged out - clear store
        console.log("[AuthStateListener] User signed out, clearing trip store");
        clearTrip();
      }

      // Update tracked user
      previousUserIdRef.current = currentUserId;
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clearTrip]);

  // This component doesn't render anything
  return null;
}
