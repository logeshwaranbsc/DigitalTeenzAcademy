import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getProfile, logout as apiLogout } from '../api/auth';
import type { Profile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ user: User; session: Session }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const profileData = await getProfile();
      setProfile(profileData);
    } catch {
      // If profile fetch fails, user may not have a profile yet
      setProfile(null);
    }
  }, []);

  // Initialize: restore session on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (mounted && currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          await fetchProfile();
        }
      } catch {
        // Silent fail
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN' && newSession) {
          await fetchProfile();
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Login failed');
    return { user: data.user, session: data.session };
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const value: AuthContextType = {
    user,
    session,
    profile,
    role: profile?.role ?? null,
    loading,
    isAuthenticated: !!user && !!session,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
