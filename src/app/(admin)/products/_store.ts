"use client";

import { create } from "zustand";
import type { Product } from "@/types";

type UiState = {
  isModalOpen: boolean;
  editingProductId: string | null;
  search: string;
};

type Actions = {
  openCreate: () => void;
  openEdit: (id: string) => void;
  closeModal: () => void;
  setSearch: (q: string) => void;
  fetchProducts: () => Promise<void>;
  addProduct: (p: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, p: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

type Store = {
  products: Product[];
} & UiState & Actions;

const seed: Product[] = [];

export const useProductsStore = create<Store>((set) => ({
  products: seed,
  isModalOpen: false,
  editingProductId: null,
  search: "",
  openCreate: () => set({ isModalOpen: true, editingProductId: null }),
  openEdit: (id) => set({ isModalOpen: true, editingProductId: id }),
  closeModal: () => set({ isModalOpen: false, editingProductId: null }),
  setSearch: (q) => set({ search: q }),
  fetchProducts: async () => {
    const res = await fetch("/api/product/get", { method: "GET" });
    if (!res.ok) return;
    const data = await res.json();
    const mapped: Product[] = (data || []).map((doc: any) => ({
      id: doc._id?.toString?.() ?? doc.id,
      productId: doc.productId,
      name: doc.name,
      company: doc.company,
      price: doc.price,
      rating: doc.rating,
      link: doc.link,
      imageUrl: doc.imageUrl,
      category: doc.category,
      skinTypes: doc.skinTypes || [],
      concernsTargeted: doc.concernsTargeted || [],
      regionMarket: doc.regionMarket,
      keyIngredient: doc.keyIngredient,
    }));
    set({ products: mapped });
  },
  addProduct: async (p) => {
    const res = await fetch("/api/product/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (!res.ok) throw new Error("Failed to add product");
    const doc = await res.json();
    set((s) => ({ products: [{ id: doc._id?.toString?.() ?? doc.id, ...p }, ...s.products] }));
  },
  updateProduct: async (id, p) => {
    const res = await fetch("/api/product/edit", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...p }),
    });
    if (!res.ok) throw new Error("Failed to update product");
    const updated = await res.json();
    set((s) => ({ products: s.products.map((x) => (x.id === id ? { id, ...p } : x)) }));
  },
  deleteProduct: async (id) => {
    const res = await fetch(`/api/product/delete?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
    set((s) => ({ products: s.products.filter((x) => x.id !== id) }));
  },
}));


