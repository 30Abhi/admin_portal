"use client";

import toast from "react-hot-toast";
import { useEffect, useMemo } from "react";
import { useAdminStore } from "../_store";
import { useAuth } from "@/hooks/useAuth";

export default function AdminTable() {
  const { admins, deleteAdmin, openEdit, search, fetchAdmins } = useAdminStore();
  const { currentUserEmail } = useAuth();

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const rows = useMemo(() => {
    const q = search.toLowerCase();
    return admins.filter((admin) =>
      !q ||
      admin.name.toLowerCase().includes(q) ||
      admin.email.toLowerCase().includes(q)
    );
  }, [admins, search]);

  return (
    <div className="rounded border border-black/[.08] overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <table className="w-full text-base">
          <thead className="text-base lg:text-lg text-black/80">
            <tr className="border-b border-black/[.06]">
              <Th>Name</Th>
              <Th>Email</Th>
              <Th className="text-right pr-4">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((admin) => {
              const isCurrentUser = admin.email === currentUserEmail;
              return (
                <tr key={admin.id} className="border-b border-black/[.06] hover:bg-black/[.02] h-16">
                  <Td>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#6c47ff] flex items-center justify-center text-white font-semibold text-sm">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{admin.name}</span>
                        {isCurrentUser && (
                          <span className="text-xs text-gray-500">(You)</span>
                        )}
                      </div>
                    </div>
                  </Td>
                  <Td>{admin.email}</Td>
                  <Td className="text-right pr-4">
                    <button className="mr-3" title="Edit" onClick={() => openEdit(admin.id)}>✎</button>
                    <button 
                      title={isCurrentUser ? "Cannot delete yourself" : "Delete"} 
                      onClick={async () => {
                        if (isCurrentUser) {
                          toast.error("You cannot delete yourself");
                          return;
                        }
                        try {
                          await deleteAdmin(admin.id);
                          toast.success("Admin deleted");
                        } catch {
                          toast.error("Server error. Try again.");
                        }
                      }}
                      disabled={isCurrentUser}
                      className={isCurrentUser ? "opacity-50 cursor-not-allowed" : ""}
                    >🗑️</button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {rows.map((admin) => {
          const isCurrentUser = admin.email === currentUserEmail;
          return (
            <div key={admin.id} className="border-b border-black/[.06] p-5 hover:bg-black/[.02] min-h-20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#6c47ff] flex items-center justify-center text-white font-semibold">
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{admin.name}</span>
                    <span className="text-sm text-gray-500">{admin.email}</span>
                    {isCurrentUser && (
                      <span className="text-xs text-gray-500">(You)</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded" title="Edit" onClick={() => openEdit(admin.id)}>✎</button>
                  <button 
                    className={`p-2 hover:bg-gray-100 rounded ${isCurrentUser ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={isCurrentUser ? "Cannot delete yourself" : "Delete"} 
                    onClick={async () => {
                      if (isCurrentUser) {
                        toast.error("You cannot delete yourself");
                        return;
                      }
                      try {
                        await deleteAdmin(admin.id);
                        toast.success("Admin deleted");
                      } catch {
                        toast.error("Server error. Try again.");
                      }
                    }}
                    disabled={isCurrentUser}
                  >🗑️</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-left font-semibold py-4 px-5 ${className}`}>{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-3 px-4 align-top ${className}`}>{children}</td>;
}
