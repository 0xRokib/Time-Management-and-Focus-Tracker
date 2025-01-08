"use client";
import { Sidebar } from "@/components/Sidebar";
import { SkeletonLoading } from "@/components/SkeletonLoading";
import { useMetadata } from "@/hooks/useMetadata";
import { Poppins } from "@next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./globals.css";
const queryClient = new QueryClient();

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

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
      <body className={poppins.className}>
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
  const { isAuthenticated, loading } = useAuth();
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

  if (loading) {
    return <SkeletonLoading />;
  }
  if (!isAuthenticated) {
    if (pathname === "/login" || pathname === "/registration") {
      return <main className="">{children}</main>;
    }
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 md:ml-64 bg-[#101317] text-[#A1A1AA] overflow-auto ">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
