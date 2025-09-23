"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "./_components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-[240px_1fr]">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-black/[.08]">
        <Image src="/glamguider.png" alt="GlamGuider" width={120} height={28} />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex border-r border-black/[.08] dark:border-white/[.145] p-4 flex-col gap-6">
        <div className="flex items-center gap-2 px-2">
          <Image src="/glamguider.png" alt="GlamGuider" width={140} height={32} />
        </div>
        <Sidebar />
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-black/[.08] p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Image src="/glamguider.png" alt="GlamGuider" width={120} height={28} />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Sidebar onItemClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        {children}
      </main>
    </div>
    </ProtectedRoute>
  );
}


