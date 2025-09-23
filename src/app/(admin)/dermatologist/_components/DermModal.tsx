"use client";

import { useEffect, useMemo, useState } from "react";
import { useDermStore } from "../_store";
import type { Dermatologist } from "@/types";

type FormState = {
  name: string;
  imageUrl: string;
  clinicName: string;
  addressCity: string;
  addressState: string;
  addressCountry: string;
  qualifications: string;
  experienceYears: string;
  contactNumber: string;
  couponCode: string;
};

export default function DermModal() {
  const { isModalOpen, editingId, closeModal, addDerm, updateDerm, dermatologists } = useDermStore();

  const editing = useMemo<Dermatologist | undefined>(
    () => dermatologists.find((d) => d.id === editingId),
    [dermatologists, editingId]
  );

  const [form, setForm] = useState<FormState>({
    name: "",
    imageUrl: "",
    clinicName: "",
    addressCity: "",
    addressState: "",
    addressCountry: "",
    qualifications: "",
    experienceYears: "",
    contactNumber: "",
    couponCode: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        imageUrl: editing.imageUrl,
        clinicName: editing.clinicName,
        addressCity: editing.addressCity,
        addressState: editing.addressState,
        addressCountry: editing.addressCountry,
        qualifications: editing.qualifications,
        experienceYears: String(editing.experienceYears),
        contactNumber: editing.contactNumber,
        couponCode: editing.couponCode,
      });
    } else {
      setForm({
        name: "",
        imageUrl: "",
        clinicName: "",
        addressCity: "",
        addressState: "",
        addressCountry: "",
        qualifications: "",
        experienceYears: "",
        contactNumber: "",
        couponCode: "",
      });
    }
  }, [editing]);

  if (!isModalOpen) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      imageUrl: form.imageUrl.trim() || "/next.svg",
      clinicName: form.clinicName.trim(),
      addressCity: form.addressCity.trim(),
      addressState: form.addressState.trim(),
      addressCountry: form.addressCountry.trim(),
      qualifications: form.qualifications.trim(),
      experienceYears: Number(form.experienceYears) || 0,
      contactNumber: form.contactNumber.trim(),
      couponCode: form.couponCode.trim(),
    };
    if (editing) updateDerm(editing.id, payload);
    else addDerm(payload);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
      <form onSubmit={onSubmit} className="relative z-10 w-full max-w-2xl bg-white rounded-lg border border-black/[.08] p-4 sm:p-6 shadow-sm flex flex-col gap-4 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{editing ? "Edit dermatologist" : "Add new dermatologist"}</h2>
          <button type="button" onClick={closeModal} className="text-sm opacity-70 hover:opacity-100">✕</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Image URL" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
          <Input label="Clinic name" value={form.clinicName} onChange={(v) => setForm({ ...form, clinicName: v })} />
          <Input label="City" value={form.addressCity} onChange={(v) => setForm({ ...form, addressCity: v })} />
          <Input label="State" value={form.addressState} onChange={(v) => setForm({ ...form, addressState: v })} />
          <Input label="Country" value={form.addressCountry} onChange={(v) => setForm({ ...form, addressCountry: v })} />
          <Input label="Qualifications" value={form.qualifications} onChange={(v) => setForm({ ...form, qualifications: v })} />
          <Input label="Experience (years)" type="number" step="1" value={form.experienceYears} onChange={(v) => setForm({ ...form, experienceYears: v })} />
          <Input label="Contact number" value={form.contactNumber} onChange={(v) => setForm({ ...form, contactNumber: v })} />
          <Input label="Coupon code" value={form.couponCode} onChange={(v) => setForm({ ...form, couponCode: v })} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={closeModal} className="h-9 rounded px-3 border border-black/[.08] bg-[#f2f2f2]">Cancel</button>
          <button type="submit" className="h-9 rounded px-3 bg-[#6c47ff] text-white">{editing ? "Save changes" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", step }: { label: string; value: string; onChange: (v: string) => void; type?: string; step?: string; }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="opacity-70">{label}</span>
      <input type={type} step={step} value={value} onChange={(e) => onChange(e.target.value)} className="h-9 rounded border border-black/[.08] px-3 outline-none focus:ring-2 focus:ring-[#6c47ff]/30" required />
    </label>
  );
}


