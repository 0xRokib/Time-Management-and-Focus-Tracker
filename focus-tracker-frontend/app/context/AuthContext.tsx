"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type UserType = {
  name: string;
  email: string;
  token: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  login: (userData: UserType) => void;
  logout: () => void;
  loading: boolean; // Add loading state to context
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // const token = localStorage.getItem("token");
    const token = "";
    if (
      !token &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/registration")
    ) {
      router.push("/login");
    } else if (token) {
      setIsAuthenticated(true);
      setUser({
        name: "Stored Name",
        email: "stored@example.com",
        token,
      });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false); // Set loading to false once the authentication check is complete
  }, [pathname, router]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const login = (userData: UserType) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
