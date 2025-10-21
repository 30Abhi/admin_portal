"use client";

import { create } from "zustand";
import type { AdSlot } from "@/types";

type UiState = {
  isModalOpen: boolean;
  editingAdNumber: number | null;
  search: string;
};

type Actions = {
  openEdit: (adNumber: number) => void;
  closeModal: () => void;
  setSearch: (q: string) => void;
  fetchAds: () => Promise<void>;
  updateAd: (adNumber: number, imageUrl: string, targetUrl: string) => Promise<void>;
  uploadAdImage: (adNumber: number, file: File) => Promise<string>;
};

type Store = { ads: AdSlot[] } & UiState & Actions;

// Default ad slots configuration
const defaultAdSlots: AdSlot[] = [
  {
    id: "1",
    adNumber: 1,
    section: "questionnaire",
    shape: "square",
    imageUrl: "",
    targetUrl: "",
    order: 1,
  },
  {
    id: "2",
    adNumber: 2,
    section: "questionnaire",
    shape: "square",
    imageUrl: "",
    targetUrl: "",
    order: 2,
  },
  {
    id: "3",
    adNumber: 3,
    section: "questionnaire",
    shape: "square",
    imageUrl: "",
    targetUrl: "",
    order: 3,
  },
  {
    id: "4",
    adNumber: 4,
    section: "loading",
    shape: "poster",
    imageUrl: "",
    targetUrl: "",
    order: 4,
  },
  {
    id: "5",
    adNumber: 5,
    section: "loading",
    shape: "banner-medium",
    imageUrl: "",
    targetUrl: "",
    order: 5,
  },
  {
    id: "6",
    adNumber: 6,
    section: "dashboard",
    shape: "banner-wide",
    imageUrl: "",
    targetUrl: "",
    order: 6,
  },
];

export const useAdsStore = create<Store>((set) => ({
  ads: defaultAdSlots,
  isModalOpen: false,
  editingAdNumber: null,
  search: "",
  
  openEdit: (adNumber) => set({ isModalOpen: true, editingAdNumber: adNumber }),
  closeModal: () => set({ isModalOpen: false, editingAdNumber: null }),
  setSearch: (q) => set({ search: q }),
  
  fetchAds: async () => {
    try {
      const res = await fetch("/api/ads/get", { method: "GET" });
      if (!res.ok) {
        throw new Error("Failed to fetch ads");
      }
      const data = await res.json();
      
      // Map API data to frontend format
      const mappedAds: AdSlot[] = data.map((doc: Record<string, unknown>) => ({
        id: doc._id?.toString?.() ?? doc.id ?? crypto.randomUUID(),
        adNumber: doc.adNumber,
        section: doc.section,
        shape: doc.shape,
        imageUrl: doc.imageUrl || "",
        targetUrl: doc.targetUrl || "",
        order: doc.order,
        countclick: doc.countclick || 0,
        countimpression: doc.countimpression || 0,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }));

      // Merge with default slots to ensure all 6 slots exist
      const mergedAds = defaultAdSlots.map(defaultSlot => {
        const apiSlot = mappedAds.find(ad => ad.adNumber === defaultSlot.adNumber);
        return apiSlot || defaultSlot;
      });

      set({ ads: mergedAds });
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      // Keep default slots on error
    }
  },
  
  updateAd: async (adNumber, imageUrl, targetUrl) => {
    try {
      const res = await fetch("/api/ads/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adNumber, imageUrl, targetUrl }),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to update ad");
      }
      
      const updatedAd = await res.json();
      
      // Update local state
      set((state) => ({
        ads: state.ads.map(ad => 
          ad.adNumber === adNumber 
            ? { ...ad, imageUrl, targetUrl, updatedAt: updatedAd.updatedAt }
            : ad
        )
      }));
    } catch (error) {
      console.error("Failed to update ad:", error);
      throw error;
    }
  },
  
  uploadAdImage: async (adNumber, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("adNumber", adNumber.toString());

      const res = await fetch("/api/ads/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to upload image");
      }
      
      const result = await res.json();
      // Support both dermatologist-style (url) and legacy (imageUrl)
      return result.url || result.imageUrl;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }
  },
}));
