"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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

type AdStats = {
  adNumber: number;
  clicks: number;
  impressions: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [ads, setAds] = useState<AdSlot[]>([]);
  const [adStats, setAdStats] = useState<AdStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [userCount, setUserCount] = useState<number>(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [skinConcernsData, setSkinConcernsData] = useState<number[]>([]);
  const [skinConcernsLabels, setSkinConcernsLabels] = useState<string[]>([]);
  const [skinTypeData, setSkinTypeData] = useState<number[]>([]);
  const [isLoadingCharts, setIsLoadingCharts] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchAdStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) {
        params.append("fromDate", fromDate);
      }
      if (toDate) {
        params.append("toDate", toDate);
      }

      const response = await fetch(`/api/ads/stats?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ad stats");
      }
      const statsData = await response.json();
      setAdStats(statsData);
    } catch (error) {
      console.error("Error fetching ad stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, [fromDate, toDate]);

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

    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/users/count");
        if (!response.ok) {
          throw new Error("Failed to fetch user count");
        }
        const data = await response.json();
        setUserCount(data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await fetch("/api/users/chart-data");
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const chartData = await response.json();
        setSkinConcernsData(chartData.skinConcerns.data);
        setSkinConcernsLabels(chartData.skinConcerns.labels);
        setSkinTypeData(chartData.skinTypes.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoadingCharts(false);
      }
    };

    fetchAds();
    fetchUserCount();
    fetchChartData();
  }, []);

  useEffect(() => {
    // Always fetch stats from event collections (new implementation)
    fetchAdStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  // Create adRows using aggregated stats from event collections (always use new implementation)
  const adRows = ads.map(ad => {
    const stats = adStats.find(s => s.adNumber === ad.adNumber);
    // Always use aggregated stats from event collections
    const clicks = stats?.clicks || 0;
    const impressions = stats?.impressions || 0;
    
    return {
      adNumber: ad.adNumber,
      placement: adPlacementNames[ad.adNumber] || `Ad ${ad.adNumber}`,
      clicks,
      impressions,
      ctr: impressions && impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00",
    };
  });

  const handleRowClick = (adNumber: number) => {
    router.push(`/dashboard/ads/${adNumber}`);
  };

  const handleExportCSV = () => {
    const headers = ["Ad Placement", "Impressions", "Clicks", "CTR (%)"];
    const rows = adRows.map((row) => [
      row.placement,
      row.impressions.toString(),
      row.clicks.toString(),
      row.ctr,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // Create filename with date range if filters are applied
    let filename = "ad-performance";
    if (fromDate || toDate) {
      const dateRange = `${fromDate || "start"}_to_${toDate || "end"}`;
      filename += `-${dateRange}`;
    }
    filename += `-${new Date().toISOString().split("T")[0]}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <h1 className="text-xl lg:text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6 lg:gap-8 items-start">
        <section className="rounded border border-black/[.08] p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-semibold px-2">Advertisement Performance</h2>
            {/* Date Range Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <label htmlFor="dashboard-fromDate" className="text-xs text-black/60 whitespace-nowrap">
                  From:
                </label>
                <input
                  id="dashboard-fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-8 rounded border border-black/[.08] px-2 outline-none focus:ring-2 focus:ring-[#6c47ff]/30 text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="dashboard-toDate" className="text-xs text-black/60 whitespace-nowrap">
                  To:
                </label>
                <input
                  id="dashboard-toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-8 rounded border border-black/[.08] px-2 outline-none focus:ring-2 focus:ring-[#6c47ff]/30 text-xs"
                />
              </div>
              {(fromDate || toDate) && (
                <button
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                  }}
                  className="h-8 px-2 rounded border border-black/[.08] hover:bg-black/[.02] text-xs transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={handleExportCSV}
                disabled={isLoading || isLoadingStats || adRows.length === 0}
                className="h-8 px-3 rounded bg-[#6c47ff] text-white text-xs whitespace-nowrap hover:bg-[#5a3ee6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead className="text-xs text-black/60">
                <tr className="border-y border-black/[.06]">
                  <th className="text-left py-2 px-2">Ad Placement</th>
                  <th className="text-right py-2 px-2">Impressions</th>
                  <th className="text-right py-2 px-2">Clicks</th>
                  <th className="text-right py-2 px-2">CTR (%)</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isLoadingStats ? (
                  <tr>
                    <td colSpan={4} className="py-3 px-2 text-center text-gray-500">
                      Loading ad data...
                    </td>
                  </tr>
                ) : (
                  adRows.map((r) => (
                    <tr 
                      key={r.placement} 
                      className="border-b border-black/[.06] cursor-pointer hover:bg-black/[.02] transition-colors"
                      onClick={() => handleRowClick(r.adNumber)}
                    >
                      <td className="py-3 px-2">{r.placement}</td>
                      <td className="py-3 px-2 text-right">{r.impressions.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right">{r.clicks.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right">{r.ctr}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded border border-black/[.08] p-4 flex flex-col items-start">
          <span className="text-sm opacity-70">Total users</span>
          <span className="text-2xl lg:text-3xl font-semibold">
            {isLoadingUsers ? "Loading..." : userCount.toLocaleString()}
          </span>
        </aside>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded border border-black/[.08] p-4">
          <h3 className="text-sm font-semibold mb-4">Top skin concerns</h3>
          {isLoadingCharts ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Loading chart data...
            </div>
          ) : (
            <TopSkinConcernsChart labels={skinConcernsLabels} data={skinConcernsData} />
          )}
        </section>
        <section className="rounded border border-black/[.08] p-4">
          <h3 className="text-sm font-semibold mb-4">Skin type distribution</h3>
          {isLoadingCharts ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Loading chart data...
            </div>
          ) : (
            <SkinTypeDistributionChart data={skinTypeData} />
          )}
        </section>
      </div>
    </div>
  );
}


