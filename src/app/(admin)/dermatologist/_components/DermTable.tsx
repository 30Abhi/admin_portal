"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useEffect, useMemo } from "react";
import { useDermStore } from "../_store";

export default function DermTable() {
  const { dermatologists, deleteDerm, openEdit, search, fetchDerms } = useDermStore();

  useEffect(() => {
    fetchDerms();
  }, [fetchDerms]);

  const rows = useMemo(() => {
    const q = search.toLowerCase();
    return dermatologists.filter((d) =>
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.clinicName.toLowerCase().includes(q) ||
      d.addressCity.toLowerCase().includes(q) ||
      d.addressState.toLowerCase().includes(q) ||
      d.addressCountry.toLowerCase().includes(q) ||
      d.couponCode.toLowerCase().includes(q)
    );
  }, [dermatologists, search]);

  return (
    <div className="rounded border border-black/[.08] overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <table className="w-full text-base">
          <thead className="text-base lg:text-lg text-black/80">
            <tr className="border-b border-black/[.06]">
              <Th>Dermatologist</Th>
              <Th>Clinic</Th>
              <Th>Address</Th>
              <Th>Qualifications</Th>
              <Th>Experience</Th>
              <Th>Contact</Th>
              <Th>Coupon</Th>
              <Th className="text-right pr-4">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-b border-black/[.06] hover:bg-black/[.02] h-24">
                <Td>
                  <div className="flex items-center gap-4">
                    <Image src={d.imageUrl || "/next.svg"} alt="" width={64} height={64} className="rounded-full object-cover" />
                    <div className="flex flex-col">
                      <span>{d.name}</span>
                    </div>
                  </div>
                </Td>
                <Td>{d.clinicName}</Td>
                <Td>{`${d.addressCity}, ${d.addressState}, ${d.addressCountry}`}</Td>
                <Td>{d.qualifications}</Td>
                <Td>{d.experienceYears} yrs</Td>
                <Td>{d.contactNumber}</Td>
                <Td>{d.couponCode}</Td>
                <Td className="text-right pr-4">
                  <button className="mr-3" title="Edit" onClick={() => openEdit(d.id)}>✎</button>
                  <button title="Delete" onClick={async () => {
                    try {
                      await deleteDerm(d.id);
                      toast.success("Dermatologist deleted");
                    } catch {
                      toast.error("Server error. Try again.");
                    }
                  }}>🗑️</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {rows.map((d) => (
          <div key={d.id} className="border-b border-black/[.06] p-5 hover:bg-black/[.02] min-h-28">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-4">
                <Image src={d.imageUrl || "/next.svg"} alt="" width={72} height={72} className="rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-sm text-gray-500">{d.clinicName}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded" title="Edit" onClick={() => openEdit(d.id)}>✎</button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Delete" onClick={async () => {
                  try {
                    await deleteDerm(d.id);
                    toast.success("Dermatologist deleted");
                  } catch {
                    toast.error("Server error. Try again.");
                  }
                }}>🗑️</button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Address:</span>
                <span className="ml-1">{`${d.addressCity}, ${d.addressState}, ${d.addressCountry}`}</span>
              </div>
              <div>
                <span className="text-gray-500">Qualifications:</span>
                <span className="ml-1">{d.qualifications}</span>
              </div>
              <div>
                <span className="text-gray-500">Experience:</span>
                <span className="ml-1">{d.experienceYears} years</span>
              </div>
              <div>
                <span className="text-gray-500">Contact:</span>
                <span className="ml-1">{d.contactNumber}</span>
              </div>
              <div>
                <span className="text-gray-500">Coupon:</span>
                <span className="ml-1 font-mono bg-gray-100 px-2 py-1 rounded">{d.couponCode}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-left font-semibold py-4 px-5 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-3 px-4 align-top ${className}`}>{children}</td>;
}


