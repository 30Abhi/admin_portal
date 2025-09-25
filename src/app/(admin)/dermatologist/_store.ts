"use client";

import { create } from "zustand";
import type { Dermatologist } from "@/types";

type UiState = {
  isModalOpen: boolean;
  editingId: string | null;
  search: string;
};

type Actions = {
  openCreate: () => void;
  openEdit: (id: string) => void;
  closeModal: () => void;
  setSearch: (q: string) => void;
  fetchDerms: () => Promise<void>;
  addDerm: (d: Omit<Dermatologist, "id">) => Promise<void>;
  updateDerm: (id: string, d: Omit<Dermatologist, "id">) => Promise<void>;
  deleteDerm: (id: string) => Promise<void>;
};

type Store = { dermatologists: Dermatologist[] } & UiState & Actions;

const seed: Dermatologist[] = [];

export const useDermStore = create<Store>((set) => ({
  dermatologists: seed,
  isModalOpen: false,
  editingId: null,
  search: "",
  openCreate: () => set({ isModalOpen: true, editingId: null }),
  openEdit: (id) => set({ isModalOpen: true, editingId: id }),
  closeModal: () => set({ isModalOpen: false, editingId: null }),
  setSearch: (q) => set({ search: q }),
  fetchDerms: async () => {
    const res = await fetch("/api/dermatologist/get", { method: "GET" });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({} as unknown))) as { error?: string } | undefined;
      throw new Error(err?.error || "Failed to fetch dermatologists");
    }
    const data = await res.json();
    type ApiDermDoc = {
      _id?: { toString?: () => string };
      id?: string;
      name?: string;
      imageUrl?: string;
      clinicName?: string;
      addressCity?: string;
      city?: string;
      addressState?: string;
      state?: string;
      addressCountry?: string;
      country?: string;
      qualifications?: string;
      experienceYears?: number;
      contactNumber?: string;
      couponCode?: string;
    };
    const mapped: Dermatologist[] = (data as ApiDermDoc[]).map((doc) => ({
      id: doc._id?.toString?.() ?? doc.id ?? crypto.randomUUID(),
      name: doc.name ?? "",
      imageUrl: doc.imageUrl ?? "",
      clinicName: doc.clinicName ?? "",
      addressCity: doc.addressCity ?? doc.city ?? "",
      addressState: doc.addressState ?? doc.state ?? "",
      addressCountry: doc.addressCountry ?? doc.country ?? "",
      qualifications: doc.qualifications ?? "",
      experienceYears: Number(doc.experienceYears ?? 0),
      contactNumber: doc.contactNumber ?? "",
      couponCode: doc.couponCode ?? "",
    }));
    set({ dermatologists: mapped });
  },
  addDerm: async (d) => {
    const payload = {
      name: d.name,
      imageUrl: d.imageUrl,
      clinicName: d.clinicName,
      city: d.addressCity,
      state: d.addressState,
      country: d.addressCountry,
      qualifications: d.qualifications,
      experienceYears: d.experienceYears,
      contactNumber: d.contactNumber,
      couponCode: d.couponCode,
    };
    const res = await fetch("/api/dermatologist/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({} as unknown))) as { error?: string } | undefined;
      throw new Error(err?.error || "Failed to create dermatologist");
    }
    const doc = await res.json();
    const mapped: Dermatologist = {
      id: doc._id?.toString?.() ?? doc.id ?? crypto.randomUUID(),
      name: doc.name,
      imageUrl: doc.imageUrl ?? "",
      clinicName: doc.clinicName ?? "",
      addressCity: doc.addressCity ?? doc.city ?? "",
      addressState: doc.addressState ?? doc.state ?? "",
      addressCountry: doc.addressCountry ?? doc.country ?? "",
      qualifications: doc.qualifications ?? "",
      experienceYears: Number(doc.experienceYears ?? 0),
      contactNumber: doc.contactNumber ?? "",
      couponCode: doc.couponCode ?? "",
    };
    set((s) => ({ dermatologists: [mapped, ...s.dermatologists] }));
  },
  updateDerm: async (id, d) => {
    const payload = {
      id,
      name: d.name,
      imageUrl: d.imageUrl,
      clinicName: d.clinicName,
      city: d.addressCity,
      state: d.addressState,
      country: d.addressCountry,
      qualifications: d.qualifications,
      experienceYears: d.experienceYears,
      contactNumber: d.contactNumber,
      couponCode: d.couponCode,
    };
    const res = await fetch("/api/dermatologist/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({} as unknown))) as { error?: string } | undefined;
      throw new Error(err?.error || "Failed to update dermatologist");
    }
    const doc = await res.json();
    const mapped: Dermatologist = {
      id: doc._id?.toString?.() ?? id,
      name: doc.name,
      imageUrl: doc.imageUrl ?? "",
      clinicName: doc.clinicName ?? "",
      addressCity: doc.addressCity ?? doc.city ?? "",
      addressState: doc.addressState ?? doc.state ?? "",
      addressCountry: doc.addressCountry ?? doc.country ?? "",
      qualifications: doc.qualifications ?? "",
      experienceYears: Number(doc.experienceYears ?? 0),
      contactNumber: doc.contactNumber ?? "",
      couponCode: doc.couponCode ?? "",
    };
    set((s) => ({ dermatologists: s.dermatologists.map((x) => (x.id === id ? mapped : x)) }));
  },
  deleteDerm: async (id) => {
    const res = await fetch(`/api/dermatologist/delete?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({} as unknown))) as { error?: string } | undefined;
      throw new Error(err?.error || "Failed to delete dermatologist");
    }
    set((s) => ({ dermatologists: s.dermatologists.filter((x) => x.id !== id) }));
  },
}));


