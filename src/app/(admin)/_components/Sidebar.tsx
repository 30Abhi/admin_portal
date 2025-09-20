"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dermatologist", label: "Dermatologist" },
  { href: "/products", label: "Products" },
  { href: "/ads", label: "Ads" },
];

interface SidebarProps {
  onItemClick?: () => void;
}

export default function Sidebar({onItemClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
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
    </nav>
  );
}


