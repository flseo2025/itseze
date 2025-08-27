import React, { createContext, useContext, useEffect, useState } from "react";

import type { Session, User } from "@supabase/supabase-js";

import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (password: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Then get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ description: error.message });
      return { error };
    }
    toast({ description: "Logged in successfully." });
    return { error: null };
  };

  const signUp: AuthContextType["signUp"] = async (email, password, metadata = {}) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl, data: metadata }
    });
    if (error) {
      toast({ description: error.message });
      return { error };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({ description: "Signed out." });
  };

  const sendPasswordReset: AuthContextType["sendPasswordReset"] = async (email) => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      toast({ description: error.message });
      return { error };
    }
    toast({ description: "Password reset email sent." });
    return { error: null };
  };

  const updatePassword: AuthContextType["updatePassword"] = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ description: error.message });
      return { error };
    }
    toast({ description: "Password updated. You are now logged in." });
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, sendPasswordReset, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
