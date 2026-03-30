import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  pin: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function parseJsonSafely(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh the current user's information from the server
  const refreshUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/get-user", {
        method: "GET",
        credentials: "include",
      });

      const data = await parseJsonSafely(response);

      if (response.status === 401) {
        setUser(null);
        return;
      }

      if (!response.ok) {
        setUser(null);
        return;
      }

      setUser(data);
    } catch (error) {
      console.error("Get user failed:", error);
      setUser(null);
    }
  };

  // Function to handle user signup
  const signup = async (name: string, email: string, password: string) => {
    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    // You may want to handle the response here if needed
    const data = await parseJsonSafely(response);

    if (!response.ok) {
      const err: any = new Error(data?.error || "Signup failed");
      err.status = response.status;
      throw err;
    }

    await refreshUser();
  };

  // Function to handle user login
  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJsonSafely(response);

    if (!response.ok) {
      const err: any = new Error(data?.error || "Login failed");
      err.status = response.status;
      throw err;
    }

    await refreshUser();
  };
  // Function to handle user logout
  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      await refreshUser();
      setLoading(false);
    };

    loadUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signup,
      login,
      logout,
      refreshUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
