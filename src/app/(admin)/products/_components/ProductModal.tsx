"use client";

import { useEffect, useMemo, useState } from "react";
import { useProductsStore } from "../_store";
import type { Product } from "@/types";

import PillSelect from "./PillSelect";
import type { ProductFormState } from "@/types";

export default function ProductModal() {
  const {
    isModalOpen,
    editingProductId,
    closeModal,
    addProduct,
    updateProduct,
    products,
  } = useProductsStore();

  const editingProduct = useMemo<Product | undefined>(
    () => products.find((p) => p.id === editingProductId),
    [products, editingProductId]
  );

  const [form, setForm] = useState<ProductFormState>({
    productId: "",
    name: "",
    company: "",
    price: "",
    rating: "",
    link: "",
    imageUrl: "",
    category: "",
    skinTypes: [],
    concernsTargeted: [],
    regionMarket: "",
    keyIngredient: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setForm({
        productId: editingProduct.productId,
        name: editingProduct.name,
        company: editingProduct.company,
        price: String(editingProduct.price),
        rating: String(editingProduct.rating),
        link: editingProduct.link,
        imageUrl: editingProduct.imageUrl,
        category: editingProduct.category,
        skinTypes: editingProduct.skinTypes,
        concernsTargeted: editingProduct.concernsTargeted,
        regionMarket: editingProduct.regionMarket,
        keyIngredient: editingProduct.keyIngredient,
      });
    } else if (isModalOpen) {
      // Reset to empty when opening in create mode
      setForm({
        productId: "",
        name: "",
        company: "",
        price: "",
        rating: "",
        link: "",
        imageUrl: "",
        category: "",
        skinTypes: [],
        concernsTargeted: [],
        regionMarket: "",
        keyIngredient: "",
      });
    }
  }, [editingProduct, isModalOpen]);

  if (!isModalOpen) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.productId.trim() || !form.name.trim() || form.concernsTargeted.length === 0 || form.skinTypes.length === 0) {
      return;
    }
    
    const payload = {
      productId: form.productId.trim(),
      name: form.name.trim(),
      company: form.company.trim(),
      price: Number(form.price) || 0,
      rating: Number(form.rating) || 0,
      link: form.link.trim(),
      imageUrl: form.imageUrl.trim() || "/next.svg",
      category: form.category.trim(),
      skinTypes: form.skinTypes,
      concernsTargeted: form.concernsTargeted,
      regionMarket: form.regionMarket.trim(),
      keyIngredient: form.keyIngredient.trim(),
    };
    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-2xl bg-white rounded-lg border border-black/[.08] p-4 sm:p-6 shadow-sm flex flex-col gap-4 max-h-[95vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editingProduct ? "Edit Product Form" : "Add Product Form"}
          </h2>
          <button type="button" onClick={closeModal} className="text-sm opacity-70 hover:opacity-100">✕</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Product ID *" value={form.productId} onChange={(v) => setForm({ ...form, productId: v })} />
          <Input label="Product Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Brand" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
          <Input label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" step="0.01" required={false} />
          <Input label="Key ingredients" value={form.keyIngredient} onChange={(v) => setForm({ ...form, keyIngredient: v })} />
          <Input label="Region market" value={form.regionMarket} onChange={(v) => setForm({ ...form, regionMarket: v })} />
          <Input label="Rating" value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} type="number" step="0.1" />
          <Input label="Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
          <Input label="Product image URL" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} required={false} />

          {/* Category quick-select chips (single-select) */}
          <div className="flex flex-col gap-2">
            <span className="text-sm opacity-70">Category</span>
            <div className="flex flex-wrap gap-1">
              {[
                "Cleanser",
                "Moisturizer",
                "Serum",
                "Sunscreen",
                "Toner",
              ].map((option) => {
                const selected = form.category === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setForm({ ...form, category: option })}
                    className={`px-2 py-1 text-xs rounded-full border ${
                      selected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <PillSelect
            label="Concerns Targeted *"
            value={form.concernsTargeted}
            onChange={(v) => {
              const next = v.slice(0, 4);
              setForm({ ...form, concernsTargeted: next });
            }}
            options={[
              "Wrinkles",
              "Fine Lines",
              "Acne",
              "Hyperpigmentation (Dark Spots)",
              "Oily Skin",
              "Dryness",
              "Dehydration",
              "Redness",
              "Sensitivity",
              "Uneven Texture",
            ]}
            placeholder="Type and press Enter to add"
            required
            error={
              form.concernsTargeted.length === 0
                ? "Please select at least one concern (max 4)"
                : ""
            }
          />
          
          <PillSelect
            label="Skin Type Suitability *"
            value={form.skinTypes}
            onChange={(v) => setForm({ ...form, skinTypes: v })}
            options={["oily", "combination", "dry", "normal"]}
            placeholder="Type and press Enter to add"
            required
          />

        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={closeModal} className="h-9 rounded px-3 border border-black/[.08] bg-[#f2f2f2]">Cancel</button>
          <button type="submit" className="h-9 rounded px-3 bg-[#6c47ff] text-white">{editingProduct ? "Save changes" : "Create product"}</button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", step, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; step?: string; required?: boolean; }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="opacity-70">{label}</span>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded border border-black/[.08] px-3 outline-none focus:ring-2 focus:ring-[#6c47ff]/30"
        required={required ?? (label !== "Product image URL")}
      />
    </label>
  );
}


