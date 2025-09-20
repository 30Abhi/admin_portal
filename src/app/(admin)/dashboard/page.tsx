"use client";

import { TopSkinConcernsChart, SkinTypeDistributionChart } from "./_components/Charts";

const adRows = [
  { placement: "Homepage banner", clicks: 1290 },
  { placement: "Dashboard banner", clicks: 1500 },
  { placement: "Analytics loading banner", clicks: 800 },
  { placement: "Quiz 01", clicks: 720 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-[1fr_240px] gap-8 items-start">
        <section className="rounded border border-black/[.08] p-4">
          <h2 className="text-sm font-semibold px-2 pb-2">Advertisement Performance</h2>
          <table className="w-full text-sm">
            <thead className="text-xs text-black/60">
              <tr className="border-y border-black/[.06]">
                <th className="text-left py-2 px-2">Ad Placement</th>
                <th className="text-right py-2 px-2">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {adRows.map((r) => (
                <tr key={r.placement} className="border-b border-black/[.06]">
                  <td className="py-3 px-2">{r.placement}</td>
                  <td className="py-3 px-2 text-right">{r.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="rounded border border-black/[.08] p-4 flex flex-col items-start">
          <span className="text-sm opacity-70">Total users</span>
          <span className="text-3xl font-semibold">4,862</span>
        </aside>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <section className="rounded border border-black/[.08] p-4">
          <h3 className="text-sm font-semibold mb-4">Top skin concerns</h3>
          <TopSkinConcernsChart />
        </section>
        <section className="rounded border border-black/[.08] p-4">
          <h3 className="text-sm font-semibold mb-4">Skin type distribution</h3>
          <SkinTypeDistributionChart />
        </section>
      </div>
    </div>
  );
}


