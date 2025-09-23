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
  addDerm: (d: Omit<Dermatologist, "id">) => void;
  updateDerm: (id: string, d: Omit<Dermatologist, "id">) => void;
  deleteDerm: (id: string) => void;
};

type Store = { dermatologists: Dermatologist[] } & UiState & Actions;

const seed: Dermatologist[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    qualifications: "MBBS, MD, Dermatology",
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    clinicName: "Skin & Hair Solutions",
    addressCity: "Bangalore",
    addressState: "Karnataka",
    addressCountry: "India",
    experienceYears: 12,
    contactNumber: "+91 98765 43211",
    couponCode: "GLAMGUIDER25",
  },
  {
    id: "2",
    name: "Dr. Amit Singh",
    qualifications: "MBBS, MD, Dermatology",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    clinicName: "Skin Care Specialists",
    addressCity: "Bangalore",
    addressState: "Karnataka",
    addressCountry: "India",
    experienceYears: 10,
    contactNumber: "+91 98765 43213",
    couponCode: "GLAMGUIDER22",
  },
  {
    id: "3",
    name: "Dr. Meera Reddy",
    qualifications: "MBBS, MD, Dermatology",
    imageUrl:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    clinicName: "DermaCare Clinic",
    addressCity: "Bangalore",
    addressState: "Karnataka",
    addressCountry: "India",
    experienceYears: 18,
    contactNumber: "+91 98765 43214",
    couponCode: "GLAMGUIDER35",
  },
];

export const useDermStore = create<Store>((set) => ({
  dermatologists: seed,
  isModalOpen: false,
  editingId: null,
  search: "",
  openCreate: () => set({ isModalOpen: true, editingId: null }),
  openEdit: (id) => set({ isModalOpen: true, editingId: id }),
  closeModal: () => set({ isModalOpen: false, editingId: null }),
  setSearch: (q) => set({ search: q }),
  addDerm: (d) => set((s) => ({ dermatologists: [{ id: crypto.randomUUID(), ...d }, ...s.dermatologists] })),
  updateDerm: (id, d) => set((s) => ({ dermatologists: s.dermatologists.map((x) => (x.id === id ? { id, ...d } : x)) })),
  deleteDerm: (id) => set((s) => ({ dermatologists: s.dermatologists.filter((x) => x.id !== id) })),
}));


