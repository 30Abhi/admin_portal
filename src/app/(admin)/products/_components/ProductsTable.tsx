"use client";

import { useMemo } from "react";
import { useProductsStore } from "../_store";

export default function ProductsTable() {
  const { products, deleteProduct, openEdit, search } = useProductsStore();

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const q = search.toLowerCase();
        if (!q) return true;
        return (
          p.productId.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.company.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.keyIngredient.toLowerCase().includes(q) ||
          p.regionMarket.toLowerCase().includes(q) ||
          p.concernsTargeted.some(concern => concern.toLowerCase().includes(q)) ||
          p.skinTypes.some(skinType => skinType.toLowerCase().includes(q))
        );
      }),
    [products, search]
  );

  return (
    <div className="rounded border border-black/[.08] overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <table className="w-full text-sm">
          <thead className="text-xs text-black/60">
            <tr className="border-b border-black/[.06]">
              <Th>Product ID</Th>
              <Th>Product Name</Th>
              <Th>Brand</Th>
              <Th>Price (INR)</Th>
              <Th>Category</Th>
              <Th>Concerns Targeted</Th>
              <Th>Skin Type Suitability</Th>
              <Th>Region Market</Th>
              <Th>Key ingredient</Th>
              <Th className="text-right pr-4">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-black/[.06] hover:bg-black/[.02]">
                <Td>{p.productId}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl || "/next.svg"} alt="" width={28} height={28} className="rounded" />
                    <div className="flex flex-col">
                      <span>{p.name}</span>
                      <a href={p.link} target="_blank" className="text-xs text-[#6c47ff] underline opacity-80">View</a>
                    </div>
                  </div>
                </Td>
                <Td>{p.company}</Td>
                <Td>{p.price.toFixed(2)}</Td>
                <Td>{p.category}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {p.concernsTargeted.map((concern, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {concern}
                      </span>
                    ))}
                  </div>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {p.skinTypes.map((skinType, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skinType}
                      </span>
                    ))}
                  </div>
                </Td>
                <Td>{p.regionMarket}</Td>
                <Td>{p.keyIngredient}</Td>
                <Td className="text-right pr-4">
                  <button className="mr-3" title="Edit" onClick={() => openEdit(p.id)}>✎</button>
                  <button title="Delete" onClick={() => deleteProduct(p.id)}>🗑️</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {filtered.map((p) => (
          <div key={p.id} className="border-b border-black/[.06] p-4 hover:bg-black/[.02]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
              <img src={p.imageUrl || "/next.svg"} alt="" width={40} height={40} className="rounded" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{p.name}</span>
                  <span className="text-xs text-gray-500">ID: {p.productId}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded" title="Edit" onClick={() => openEdit(p.id)}>✎</button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Delete" onClick={() => deleteProduct(p.id)}>🗑️</button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="text-gray-500">Brand:</span>
                <span className="ml-1">{p.company}</span>
              </div>
              <div>
                <span className="text-gray-500">Price:</span>
                <span className="ml-1">₹{p.price.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-1">{p.category}</span>
              </div>
              <div>
                <span className="text-gray-500">Region:</span>
                <span className="ml-1">{p.regionMarket}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500">Concerns:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.concernsTargeted.map((concern, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Skin Types:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.skinTypes.map((skinType, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skinType}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Key Ingredient:</span>
                <span className="ml-1 text-xs">{p.keyIngredient}</span>
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


