"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/config";
import { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUpWithPassword: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: AuthError | null; data: { user: User | null; session: Session | null } | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: "google") => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  const { isConfigured } = getSupabaseEnv();

  const fetchProfile = async (userId: string) => {
    try {
      const supabase = createClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    } catch {
      // Ignore profile fetch failure
    }
  };

  useEffect(() => {
    if (!isConfigured) {
      startTransition(() => {
        setIsLoading(false);
      });
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      startTransition(() => {
        setIsLoading(false);
      });
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      startTransition(() => {
        setSession(session);
        setUser(session?.user ?? null);
      });
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      startTransition(() => {
        setIsLoading(false);
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      startTransition(() => {
        setSession(session);
        setUser(session?.user ?? null);
      });
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      startTransition(() => {
        setIsLoading(false);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signInWithPassword = async (email: string, password: string) => {
    const supabase = createClient();
    if (!supabase) {
      return {
        error: new AuthError("Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."),
      };
    }

    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (res.data.user) {
      setUser(res.data.user);
      setSession(res.data.session);
      await fetchProfile(res.data.user.id);
    }

    return { error: res.error };
  };

  const signUpWithPassword = async (
    email: string,
    password: string,
    fullName?: string
  ) => {
    const supabase = createClient();
    if (!supabase) {
      return {
        error: new AuthError("Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."),
        data: null,
      };
    }

    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split("@")[0],
        },
      },
    });

    if (res.data.user) {
      setUser(res.data.user);
      setSession(res.data.session);
      if (res.data.user.id) {
        await fetchProfile(res.data.user.id);
      }
    }

    return { error: res.error, data: res.data };
  };

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    return { error };
  };

  const signInWithOAuth = async (provider: "google") => {
    const supabase = createClient();
    if (!supabase) {
      return {
        error: new AuthError("Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."),
      };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { error };
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isConfigured,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        signInWithOAuth,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
