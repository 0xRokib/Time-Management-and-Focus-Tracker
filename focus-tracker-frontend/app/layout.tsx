"use client";

import { Sidebar } from "@/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#1F2937] text-[#FFFFFF]">
        <AuthProvider>
          <Content>{children}</Content>
        </AuthProvider>
      </body>
    </html>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      !isAuthenticated &&
      pathname !== "/login" &&
      pathname !== "/registration"
    ) {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  if (
    !isAuthenticated &&
    (pathname === "/login" || pathname === "/registration")
  ) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 md:ml-64 bg-[#111827] text-[#A1A1AA] overflow-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
