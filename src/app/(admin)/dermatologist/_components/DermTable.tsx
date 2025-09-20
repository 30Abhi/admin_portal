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
    <div className="rounded border border-black/[.08]">
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
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-left font-medium py-3 px-4 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-3 px-4 align-top ${className}`}>{children}</td>;
}


