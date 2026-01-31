"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: { role: string } | null;
  userEmail: string | null;
  userName: string | null;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider - Centralized auth state management
 * 
 * Benefits:
 * - Single Supabase auth check instead of multiple duplicate calls
 * - All components share the same auth state
 * - No more waterfall auth requests
 * - Reduces network calls from ~3 to 1 on protected pages
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use ref to track if already initialized to prevent double init in StrictMode
  const isInitialized = useRef(false);

  // Create supabase client once
  const supabase = useMemo(() => createClient(), []);

  // Inline profile fetch to avoid dependency issues
  const doFetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("Profile")
        .select("role")
        .eq("id", userId)
        .single();
      setProfile(data);
    } catch (error) {
      console.error("[AuthProvider] Error fetching profile:", error);
      setProfile(null);
    }
  };

  const refreshAuth = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await doFetchProfile(user.id);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("[AuthProvider] Error refreshing auth:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    // Initial auth check
    const initAuth = async () => {
      try {
        console.log("[AuthProvider] Initializing...");
        const { data: { user } } = await supabase.auth.getUser();
        console.log("[AuthProvider] User:", user?.email ?? "null");
        setUser(user);
        if (user) {
          await doFetchProfile(user.id);
        }
      } catch (error) {
        console.error("[AuthProvider] Init error:", error);
      } finally {
        console.log("[AuthProvider] Setting isLoading to false");
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[AuthProvider] Auth state changed:", _event);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        doFetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  // Only run once on mount - supabase is stable via useMemo
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    profile,
    userEmail: user?.email ?? null,
    userName: user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? null,
    signOut,
    refreshAuth,
  }), [user, isLoading, profile, signOut, refreshAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth - Hook to access shared auth state
 * 
 * Usage:
 * const { user, isAuthenticated, isLoading } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * useRequireAuthFromContext - Protected route hook using shared context
 * Eliminates duplicate auth calls by reusing AuthProvider state
 */
export function useRequireAuthFromContext(options: { redirectTo?: string; returnTo?: string } = {}) {
  const { redirectTo = "/login" } = options;
  const { isLoading, isAuthenticated, user } = useAuth();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Only redirect once when we have finished loading and user is not authenticated
    if (!isLoading && !isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      setShowAuthPopup(true);
      
      // Build redirect URL with returnTo param so login knows where to redirect back
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      const returnTo = options.returnTo || currentPath;
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(returnTo)}`;
      
      console.log("[useRequireAuthFromContext] Not authenticated, redirecting in 1.5s to:", loginUrl);
      
      // Delay redirect to show popup
      const timer = setTimeout(() => {
        window.location.href = loginUrl;
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, redirectTo, options.returnTo]);

  return { 
    isLoading, 
    isAuthenticated, 
    showAuthPopup,
    user,
  };
}
