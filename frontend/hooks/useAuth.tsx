import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { apiFetch } from "../lib/api";

const STORAGE_KEY = "cq_access_token";

type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "user" | "admin";
  reputation: number;
  badges: Array<{ code: string; name: string; description: string; awardedAt: string }>;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (input: { usernameOrEmail: string; password: string }) => Promise<void>;
  register: (input: { name: string; username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persistToken = useCallback((token: string | null) => {
    if (typeof window === "undefined") return;
    if (token) {
      window.localStorage.setItem(STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const fetchProfile = useCallback(
    async (token: string) => {
      const { user: me } = await apiFetch<{ user: AuthUser }>("/auth/me", {
        token
      });
      setUser(me);
      setAccessToken(token);
      persistToken(token);
    },
    [persistToken]
  );

  const refreshSession = useCallback(async () => {
    const { user: me, accessToken: token } = await apiFetch<{ user: AuthUser; accessToken: string }>("/auth/refresh", {
      method: "POST"
    });
    setUser(me);
    setAccessToken(token);
    persistToken(token);
  }, [persistToken]);

  useEffect(() => {
    const bootstrap = async () => {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        try {
          await fetchProfile(stored);
        } catch {
          // Token expired or invalid, try refresh
          try {
            await refreshSession();
          } catch {
            // Refresh also failed, clear state
            persistToken(null);
            setUser(null);
            setAccessToken(null);
          }
        }
      }
      // If no stored token, silently finish loading without trying refresh
      // User will need to login manually
      setLoading(false);
    };

    void bootstrap();
  }, [fetchProfile, persistToken, refreshSession]);

  const login = useCallback(
    async (input: { usernameOrEmail: string; password: string }) => {
      const { user: loggedInUser, accessToken: token } = await apiFetch<{ user: AuthUser; accessToken: string }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(input)
        }
      );
      setUser(loggedInUser);
      setAccessToken(token);
      persistToken(token);
    },
    [persistToken]
  );

  const register = useCallback(
    async (input: { name: string; username: string; email: string; password: string }) => {
      const { user: createdUser, accessToken: token } = await apiFetch<{ user: AuthUser; accessToken: string }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(input)
        }
      );
      setUser(createdUser);
      setAccessToken(token);
      persistToken(token);
    },
    [persistToken]
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        token: accessToken ?? undefined
      });
    } catch (error) {
      // swallow errors
    } finally {
      setUser(null);
      setAccessToken(null);
      persistToken(null);
    }
  }, [accessToken, persistToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      loading,
      login,
      register,
      logout,
      refreshSession
    }),
    [user, accessToken, loading, login, register, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

