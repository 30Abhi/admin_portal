"use client";

import { create } from "zustand";

export type Product = {
  id: string;
  productId: string;
  name: string;
  company: string;
  price: number;
  rating: number;
  link: string;
  imageUrl: string;
  category: string;
  skinTypes: string[];
  concernsTargeted: string[];
  regionMarket: string;
  keyIngredient: string;
};

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
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, p: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
};

type Store = {
  products: Product[];
} & UiState & Actions;

const seed: Product[] = [
  {
    id: "1",
    productId: "101",
    name: "Cerave Acne foaming fash wash",
    company: "Cereve",
    price: 500,
    rating: 4.6,
    link: "https://example.com",
    imageUrl: "/next.svg",
    category: "cleanser",
    skinTypes: ["oily", "combination"],
    concernsTargeted: ["acne", "oily skin"],
    regionMarket: "India",
    keyIngredient: "Salicylic Acid 2%",
  },
  {
    id: "2",
    productId: "102",
    name: "Cerave Hydrating Cleanser",
    company: "Cereve",
    price: 300,
    rating: 4.8,
    link: "https://example.com",
    imageUrl: "/next.svg",
    category: "cleanser",
    skinTypes: ["dry", "normal"],
    concernsTargeted: ["dryness", "dehydration"],
    regionMarket: "India",
    keyIngredient: "Hyaluronic Acid",
  },
];

export const useProductsStore = create<Store>((set, get) => ({
  products: seed,
  isModalOpen: false,
  editingProductId: null,
  search: "",
  openCreate: () => set({ isModalOpen: true, editingProductId: null }),
  openEdit: (id) => set({ isModalOpen: true, editingProductId: id }),
  closeModal: () => set({ isModalOpen: false, editingProductId: null }),
  setSearch: (q) => set({ search: q }),
  addProduct: (p) =>
    set((s) => ({ products: [{ id: crypto.randomUUID(), ...p }, ...s.products] })),
  updateProduct: (id, p) =>
    set((s) => ({ products: s.products.map((x) => (x.id === id ? { id, ...p } : x)) })),
  deleteProduct: (id) => set((s) => ({ products: s.products.filter((x) => x.id !== id) })),
}));


