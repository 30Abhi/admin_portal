"use client";

import DermModal from "./_components/DermModal";
import DermTable from "./_components/DermTable";
import { useDermStore } from "./_store";

export default function DermatologistPage() {
  const { openCreate, search, setSearch } = useDermStore();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dermatologist Management</h1>
        <button onClick={openCreate} className="h-9 rounded px-3 bg-[#6c47ff] text-white">+ Add new dermatologist</button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-80">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="h-9 w-full rounded border border-black/[.08] pl-9 pr-3 outline-none focus:ring-2 focus:ring-[#6c47ff]/30"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">🔍</span>
        </div>
      </div>

      <DermTable />
      <DermModal />
    </div>
  );
}


