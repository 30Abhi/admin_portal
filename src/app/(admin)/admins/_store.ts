"use client";

import { create } from "zustand";
import type { Admin } from "@/types";

type UiState = {
  isModalOpen: boolean;
  editingId: string | null;
  search: string;
  currentUserEmail: string | null;
};

type Actions = {
  openCreate: () => void;
  openEdit: (id: string) => void;
  closeModal: () => void;
  setSearch: (q: string) => void;
  setCurrentUserEmail: (email: string | null) => void;
  fetchAdmins: () => Promise<void>;
  addAdmin: (admin: Omit<Admin, "id">) => Promise<void>;
  updateAdmin: (id: string, admin: Omit<Admin, "id"> & { changePassword: boolean }) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
};

type Store = { admins: Admin[] } & UiState & Actions;

const seed: Admin[] = [];

export const useAdminStore = create<Store>((set) => ({
  admins: seed,
  isModalOpen: false,
  editingId: null,
  search: "",
  currentUserEmail: null,
  openCreate: () => set({ isModalOpen: true, editingId: null }),
  openEdit: (id) => set({ isModalOpen: true, editingId: id }),
  closeModal: () => set({ isModalOpen: false, editingId: null }),
  setSearch: (q) => set({ search: q }),
  setCurrentUserEmail: (email) => set({ currentUserEmail: email }),
  fetchAdmins: async () => {
    const res = await fetch("/api/admin/get", { method: "GET" });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({} as unknown))) as { error?: string } | undefined;
      throw new Error(err?.error || "Failed to fetch admins");
    }
    const data = await res.json();
    type ApiAdminDoc = {
      _id?: { toString?: () => string };
      id?: string;
      name?: string;
      email?: string;
      password?: string;
    };
    const mapped: Admin[] = (data as ApiAdminDoc[]).map((doc) => ({
      id: doc._id?.toString?.() ?? doc.id ?? crypto.randomUUID(),
      name: doc.name ?? "",
      email: doc.email ?? "",
      password: doc.password ?? "",
    }));
    set({ admins: mapped });
  },
  addAdmin: async (admin) => {
    const payload = {
      name: admin.name,
      email: admin.email,
      password: admin.password,
    };
    const res = await fetch("/api/admin/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({} as unknown))) as { error?: string } | undefined;
      throw new Error(err?.error || "Failed to create admin");
    }
    const doc = await res.json();
    const mapped: Admin = {
      id: doc._id?.toString?.() ?? doc.id ?? crypto.randomUUID(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
    };
    set((s) => ({ admins: [mapped, ...s.admins] }));
  },
  updateAdmin: async (id, admin) => {
    const payload = {
      id,
      name: admin.name,
      email: admin.email,
      password: admin.password,
      changePassword: admin.changePassword,
    };
    const res = await fetch("/api/admin/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({} as unknown))) as { error?: string } | undefined;
      throw new Error(err?.error || "Failed to update admin");
    }
    const doc = await res.json();
    const mapped: Admin = {
      id: doc._id?.toString?.() ?? id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
    };
    set((s) => ({ admins: s.admins.map((x) => (x.id === id ? mapped : x)) }));
  },
  deleteAdmin: async (id) => {
    const res = await fetch(`/api/admin/delete?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({} as unknown))) as { error?: string } | undefined;
      throw new Error(err?.error || "Failed to delete admin");
    }
    set((s) => ({ admins: s.admins.filter((x) => x.id !== id) }));
  },
}));
