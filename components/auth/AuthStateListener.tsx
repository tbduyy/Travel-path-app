"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useTripStore } from "@/lib/store/trip-store";

/**
 * AuthStateListener - Clears Zustand trip store when user changes
 * This handles both login and logout scenarios:
 * - When user logs out: store is cleared (also handled in UserDropdown)
 * - When user logs in: store is cleared to prevent seeing previous user's data
 * - When user switches accounts: store is cleared
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
      // 1. User signs in (and it's a different user or no previous user was tracked)
      // 2. User signs out
      // 3. User switches accounts
      if (event === "SIGNED_IN") {
        // User just logged in
        if (previousUserId !== currentUserId) {
          console.log("[AuthStateListener] User changed on login, clearing trip store");
          clearTrip();
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
