"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDermStore } from "../_store";
import type { Dermatologist, DermFormState } from "@/types";

export default function DermModal() {
  const { isModalOpen, editingId, closeModal, addDerm, updateDerm, dermatologists } = useDermStore();

  const editing = useMemo<Dermatologist | undefined>(
    () => dermatologists.find((d) => d.id === editingId),
    [dermatologists, editingId]
  );

  const [form, setForm] = useState<DermFormState>({
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
      setSelectedFile(null); // Reset file selection when editing
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
      setSelectedFile(null);
    }
  }, [editing]);

  if (!isModalOpen) return null;

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch("/api/dermatologist/upload", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
    
    const data = await response.json();
    return data.url;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = form.imageUrl.trim() || "/next.svg";
      
      // If a new file is selected, upload it
      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }
      
      const payload = {
        name: form.name.trim(),
        imageUrl,
        clinicName: form.clinicName.trim(),
        addressCity: form.addressCity.trim(),
        addressState: form.addressState.trim(),
        addressCountry: form.addressCountry.trim(),
        qualifications: form.qualifications.trim(),
        experienceYears: Number(form.experienceYears) || 0,
        contactNumber: form.contactNumber.trim(),
        couponCode: form.couponCode.trim(),
      };
      
      if (editing) {
        await updateDerm(editing.id, payload);
        toast.success("Dermatologist updated");
      } else {
        await addDerm(payload);
        toast.success("Dermatologist created");
      }
      closeModal();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Server error. Try again.");
    } finally {
      setUploading(false);
    }
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
          <FileInput 
            label="Profile Image" 
            file={selectedFile} 
            onChange={setSelectedFile}
            currentImageUrl={editing?.imageUrl}
          />
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
          <button type="button" onClick={closeModal} className="h-9 rounded px-3 border border-black/[.08] bg-[#f2f2f2]" disabled={uploading}>Cancel</button>
          <button type="submit" className="h-9 rounded px-3 bg-[#6c47ff] text-white disabled:opacity-50" disabled={uploading}>
            {uploading ? "Uploading..." : (editing ? "Save changes" : "Create")}
          </button>
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

function FileInput({ 
  label, 
  file, 
  onChange, 
  currentImageUrl 
}: { 
  label: string; 
  file: File | null; 
  onChange: (file: File | null) => void; 
  currentImageUrl?: string; 
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onChange(selectedFile);
  };

  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="opacity-70">{label}</span>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="h-9 rounded border border-black/[.08] px-3 outline-none focus:ring-2 focus:ring-[#6c47ff]/30 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-[#6c47ff] file:text-white hover:file:bg-[#5a3ce8]"
        />
        {file && (
          <div className="text-xs text-green-600">
            Selected: {file.name}
          </div>
        )}
        {currentImageUrl && !file && (
          <div className="text-xs text-gray-500">
            Current image will be kept
          </div>
        )}
      </div>
    </div>
  );
}


