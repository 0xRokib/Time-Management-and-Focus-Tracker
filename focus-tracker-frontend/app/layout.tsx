"use client";
import { Sidebar } from "@/components/Sidebar";
import { useMetadata } from "@/hooks/useMetadata";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import React Query

import { AuthProvider, useAuth } from "./context/AuthContext";
import "./globals.css";

// Create the QueryClient instance
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const metadata = useMetadata();

  return (
    <html lang="en">
      <head>
        {metadata && (
          <>
            <title>{metadata.title}</title>
            <meta name="description" content={metadata.description} />
          </>
        )}
      </head>
      <body className="antialiased bg-[#1F2937] text-[#FFFFFF]">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Content>{children}</Content>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth(); // Access loading state from AuthContext
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname, router);

  useEffect(() => {
    if (
      !isAuthenticated &&
      pathname !== "/login" &&
      pathname !== "/registration"
    ) {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  // If loading, show loading screen
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // If not authenticated and not on login/registration pages, prevent rendering of the sidebar or main content
  if (
    !isAuthenticated &&
    pathname !== "/login" &&
    pathname !== "/registration"
  ) {
    return null; // Prevent rendering of any content, including Sidebar and main content
  }

  return (
    <div
      className={`flex h-screen ${!isAuthenticated ? "justify-center" : ""}`}
    >
      {/* Render Sidebar only if authenticated */}
      {isAuthenticated && <Sidebar />}
      <main
        className={`flex-1 p-8 md:ml-64 bg-[#111827] text-[#A1A1AA] overflow-auto ${
          !isAuthenticated ? "w-full" : ""
        }`}
      >
        {children}
      </main>
      <Toaster />
    </div>
  );
}
