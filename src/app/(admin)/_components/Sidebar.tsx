"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { SidebarProps } from "@/types";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dermatologist", label: "Dermatologist" },
  { href: "/products", label: "Products" },
  { href: "/ads", label: "Ads" },
  { href: "/admins", label: "Admins" },
];

export default function Sidebar({onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    if (onItemClick) onItemClick();
    router.replace("/signin");
  }

  return (
    <nav className="flex flex-col gap-1 h-full">
      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`rounded px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[#f2f2f2] text-black"
                  : "hover:bg-black/[.05]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      
      <div className="flex-1" />
      
      <div className="flex flex-col gap-1">
        <div className="h-px bg-black/[.08]" />
        <button
          onClick={handleLogout}
          className="rounded px-3 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}


