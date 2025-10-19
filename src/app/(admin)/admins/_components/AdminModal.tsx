"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAdminStore } from "../_store";
import type { Admin, AdminFormState } from "@/types";

export default function AdminModal() {
  const { isModalOpen, editingId, closeModal, addAdmin, updateAdmin, admins } = useAdminStore();

  const editing = useMemo<Admin | undefined>(
    () => admins.find((admin) => admin.id === editingId),
    [admins, editingId]
  );

  const [form, setForm] = useState<AdminFormState>({
    name: "",
    email: "",
    password: "",
    changePassword: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        email: editing.email,
        password: "",
        changePassword: false,
      });
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        changePassword: false,
      });
    }
  }, [editing]);

  if (!isModalOpen) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        changePassword: form.changePassword,
      };
      
      if (editing) {
        await updateAdmin(editing.id, payload);
        toast.success("Admin updated");
      } else {
        await addAdmin(payload);
        toast.success("Admin created");
      }
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
      <form onSubmit={onSubmit} className="relative z-10 w-full max-w-md bg-white rounded-lg border border-black/[.08] p-4 sm:p-6 shadow-sm flex flex-col gap-4 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{editing ? "Edit admin" : "Add new admin"}</h2>
          <button type="button" onClick={closeModal} className="text-sm opacity-70 hover:opacity-100">✕</button>
        </div>

        <div className="flex flex-col gap-4">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          
          {editing && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="changePassword"
                checked={form.changePassword}
                onChange={(e) => setForm({ ...form, changePassword: e.target.checked })}
                className="rounded border border-black/[.08]"
              />
              <label htmlFor="changePassword" className="text-sm opacity-70">
                Change password
              </label>
            </div>
          )}
          
          {(editing ? form.changePassword : true) && (
            <Input 
              label="Password" 
              type="password" 
              value={form.password} 
              onChange={(v) => setForm({ ...form, password: v })} 
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={closeModal} className="h-9 rounded px-3 border border-black/[.08] bg-[#f2f2f2]" disabled={loading}>Cancel</button>
          <button type="submit" className="h-9 rounded px-3 bg-[#6c47ff] text-white disabled:opacity-50" disabled={loading}>
            {loading ? "Saving..." : (editing ? "Save changes" : "Create")}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string; }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="opacity-70">{label}</span>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="h-9 rounded border border-black/[.08] px-3 outline-none focus:ring-2 focus:ring-[#6c47ff]/30" 
        required 
      />
    </label>
  );
}
