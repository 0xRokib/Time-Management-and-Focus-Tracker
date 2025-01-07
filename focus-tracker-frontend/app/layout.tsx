import { Sidebar } from "@/components/Sidebar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Focus Tracker",
  description:
    "Track and improve your focus with our Pomodoro timer and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1F2937] text-[#FFFFFF]`}
      >
        <div className="flex h-screen">
          <Sidebar />

          <main className="flex-1 p-8 md:ml-64 bg-[#111827] text-[#A1A1AA] overflow-auto">
            {children}
          </main>

          <Toaster />
        </div>
      </body>
    </html>
  );
}
