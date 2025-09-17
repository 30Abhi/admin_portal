import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Sidebar from "./_components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r border-black/[.08] dark:border-white/[.145] p-4 flex flex-col gap-6">
        <div className="flex items-center gap-2 px-2">
          <Image src="/glamguider.png" alt="GlamGuider" width={140} height={32} />
        </div>
        <Sidebar />
      </aside>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}


