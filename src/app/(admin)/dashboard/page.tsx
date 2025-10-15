"use client";

import { useEffect, useState } from "react";
import { TopSkinConcernsChart, SkinTypeDistributionChart } from "./_components/Charts";
import type { AdSlot } from "@/types";

const adPlacementNames: Record<number, string> = {
  1: "Questionnaire A",
  2: "Questionnaire B", 
  3: "Questionnaire C",
  4: "Loading Screen Top",
  5: "Loading Screen Bottom",
  6: "Analytics Page",
};

export default function DashboardPage() {
  const [ads, setAds] = useState<AdSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch("/api/ads/get");
        if (!response.ok) {
          throw new Error("Failed to fetch ads");
        }
        const adsData = await response.json();
        setAds(adsData);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Create adRows from fetched ads data
  const adRows = ads.map(ad => ({
    placement: adPlacementNames[ad.adNumber] || `Ad ${ad.adNumber}`,
    clicks: ad.countclick || 0,
  }));

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <h1 className="text-xl lg:text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6 lg:gap-8 items-start">
        <section className="rounded border border-black/[.08] p-4">
          <h2 className="text-sm font-semibold px-2 pb-2">Advertisement Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[300px]">
              <thead className="text-xs text-black/60">
                <tr className="border-y border-black/[.06]">
                  <th className="text-left py-2 px-2">Ad Placement</th>
                  <th className="text-right py-2 px-2">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={2} className="py-3 px-2 text-center text-gray-500">
                      Loading ad data...
                    </td>
                  </tr>
                ) : (
                  adRows.map((r) => (
                    <tr key={r.placement} className="border-b border-black/[.06]">
                      <td className="py-3 px-2">{r.placement}</td>
                      <td className="py-3 px-2 text-right">{r.clicks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded border border-black/[.08] p-4 flex flex-col items-start">
          <span className="text-sm opacity-70">Total users</span>
          <span className="text-2xl lg:text-3xl font-semibold">4,862</span>
        </aside>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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


