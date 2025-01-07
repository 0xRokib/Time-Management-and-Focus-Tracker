"use client";

import { cn } from "@/lib/utils";
import { BarChart2, Clock, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    icon: Clock,
    label: "Focus Timer",
    href: "/",
  },
  {
    icon: BarChart2,
    label: "Analytics",
    href: "/analytics",
  },
  {
    icon: Trophy,
    label: "Achievements",
    href: "/achievements",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bg-[#1F2937] text-[#FFFFFF] shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-[#374151]">
        <h1 className="text-2xl font-bold tracking-tight">Focus Tracker</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-4 px-4 py-3 rounded-lg text-base font-medium transition-all",
              pathname === route.href
                ? "bg-[#16C784] text-white shadow-md"
                : "text-[#A1A1AA] hover:bg-[#2D3748] hover:text-white"
            )}
          >
            <route.icon className="w-5 h-5" />
            {route.label}
          </Link>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-6 border-t border-[#374151] mt-auto">
        <div className="flex items-center gap-x-4">
          <User className="w-8 h-8 text-[#A1A1AA]" />
          <div className="flex-1">
            <p className="text-base font-semibold">John Doe</p>
            <p className="text-sm text-[#A1A1AA]">johndoe@example.com</p>
          </div>
        </div>
        <div className="mt-4">
          <button className="w-full py-2 text-sm font-medium text-center text-white bg-gradient-to-r from-[#16C784] to-[#2ECC71] rounded-lg hover:from-[#2ECC71] hover:to-[#28A745] shadow-md">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
