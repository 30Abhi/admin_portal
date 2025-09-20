"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useDermStore } from "../_store";

export default function DermTable() {
  const { dermatologists, deleteDerm, openEdit, search } = useDermStore();

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
        <table className="w-full text-sm">
          <thead className="text-xs text-black/60">
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
              <tr key={d.id} className="border-b border-black/[.06] hover:bg-black/[.02]">
                <Td>
                  <div className="flex items-center gap-3">
                    <Image src={d.imageUrl || "/next.svg"} alt="" width={28} height={28} className="rounded-full" />
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
                  <button title="Delete" onClick={() => deleteDerm(d.id)}>🗑️</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {rows.map((d) => (
          <div key={d.id} className="border-b border-black/[.06] p-4 hover:bg-black/[.02]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Image src={d.imageUrl || "/next.svg"} alt="" width={40} height={40} className="rounded-full" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{d.name}</span>
                  <span className="text-xs text-gray-500">{d.clinicName}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded" title="Edit" onClick={() => openEdit(d.id)}>✎</button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Delete" onClick={() => deleteDerm(d.id)}>🗑️</button>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
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
  return <th className={`text-left font-medium py-3 px-4 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-3 px-4 align-top ${className}`}>{children}</td>;
}


