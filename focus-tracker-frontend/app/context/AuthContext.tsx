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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // const token = localStorage.getItem("token");
    const token = "asdasdasd";

    // Only redirect if the user is trying to access a protected page
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
  }, [pathname, router]);

  useEffect(() => {
    if (isAuthenticated) {
      // If the user is authenticated, redirect to home
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
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
