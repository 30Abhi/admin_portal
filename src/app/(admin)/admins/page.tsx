"use client";

import AdminModal from "./_components/AdminModal";
import AdminTable from "./_components/AdminTable";
import { useAdminStore } from "./_store";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function AdminsPage() {
  const { openCreate, search, setSearch, setCurrentUserEmail } = useAdminStore();
  const { currentUserEmail } = useAuth();

  // Sync current user email with admin store
  useEffect(() => {
    setCurrentUserEmail(currentUserEmail);
  }, [currentUserEmail, setCurrentUserEmail]);
  
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl lg:text-2xl font-semibold">Admin Management</h1>
        <button onClick={openCreate} className="h-9 rounded px-3 bg-[#6c47ff] text-white text-sm whitespace-nowrap">+ Add new admin</button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admins..."
            className="h-9 w-full rounded border border-black/[.08] pl-9 pr-3 outline-none focus:ring-2 focus:ring-[#6c47ff]/30 text-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">🔍</span>
        </div>
      </div>

      <AdminTable />
      <AdminModal />
    </div>
  );
}
