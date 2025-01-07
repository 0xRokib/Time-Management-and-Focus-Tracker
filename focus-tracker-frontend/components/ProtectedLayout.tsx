// components/ProtectedLayout.tsx

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

export const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Show loading while redirecting
  }

  return <>{children}</>;
};
