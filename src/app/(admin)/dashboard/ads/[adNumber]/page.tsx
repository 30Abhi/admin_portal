"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { AdUserAnalytics } from "@/types";

const adPlacementNames: Record<number, string> = {
  1: "Questionnaire A",
  2: "Questionnaire B",
  3: "Questionnaire C",
  4: "Loading Screen Top",
  5: "Loading Screen Bottom",
  6: "Analytics Page",
};

export default function AdDetailPage() {
  const router = useRouter();
  const params = useParams();
  const adNumber = parseInt(params.adNumber as string, 10);

  const [data, setData] = useState<AdUserAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (searchValue?: string) => {
    if (isNaN(adNumber) || adNumber < 1 || adNumber > 6) {
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        adNumber: adNumber.toString(),
      });

      if (fromDate) {
        params.append("fromDate", fromDate);
      }
      if (toDate) {
        params.append("toDate", toDate);
      }
      const searchTerm = searchValue !== undefined ? searchValue : search;
      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      const response = await fetch(`/api/ads/events?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ad events");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching ad events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [adNumber, fromDate, toDate, search]);

  useEffect(() => {
    if (isNaN(adNumber) || adNumber < 1 || adNumber > 6) {
      router.push("/dashboard");
      return;
    }

    fetchData();
  }, [adNumber, fromDate, toDate, fetchData, router]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchData(search);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, fetchData]);

  const handleExportCSV = () => {
    const headers = ["User Email", "User Name", "Clicks", "Impressions"];
    const rows = data.map((item) => [
      item.userEmail,
      item.userName,
      item.clicks.toString(),
      item.impressions.toString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `ad-${adNumber}-${adPlacementNames[adNumber] || `ad-${adNumber}`}-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const adPlacementName = adPlacementNames[adNumber] || `Ad ${adNumber}`;

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-9 h-9 rounded border border-black/[.08] hover:bg-black/[.02] transition-colors"
          title="Back to Dashboard"
        >
          ←
        </Link>
        <h1 className="text-xl lg:text-2xl font-semibold">
          {adPlacementName} - User Analytics
        </h1>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Search Field */}
        <div className="relative flex-1 max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="h-9 w-full rounded border border-black/[.08] pl-9 pr-3 outline-none focus:ring-2 focus:ring-[#6c47ff]/30 text-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">🔍</span>
        </div>

        {/* Date Range Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="fromDate" className="text-sm text-black/60 whitespace-nowrap">
              From:
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 rounded border border-black/[.08] px-3 outline-none focus:ring-2 focus:ring-[#6c47ff]/30 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="toDate" className="text-sm text-black/60 whitespace-nowrap">
              To:
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 rounded border border-black/[.08] px-3 outline-none focus:ring-2 focus:ring-[#6c47ff]/30 text-sm"
            />
          </div>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          disabled={isLoading || data.length === 0}
          className="h-9 rounded px-3 bg-[#6c47ff] text-white text-sm whitespace-nowrap hover:bg-[#5a3ee6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="rounded border border-black/[.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="text-xs text-black/60 bg-black/[.02]">
              <tr className="border-b border-black/[.06]">
                <th className="text-left py-3 px-4 font-semibold">User Email</th>
                <th className="text-left py-3 px-4 font-semibold">User Name</th>
                <th className="text-right py-3 px-4 font-semibold">Clicks</th>
                <th className="text-right py-3 px-4 font-semibold">Impressions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                    Loading user analytics...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                    No user data found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={`${item.userEmail}-${index}`}
                    className="border-b border-black/[.06] hover:bg-black/[.02] transition-colors"
                  >
                    <td className="py-3 px-4">{item.userEmail}</td>
                    <td className="py-3 px-4">{item.userName}</td>
                    <td className="py-3 px-4 text-right">{item.clicks.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{item.impressions.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      {!isLoading && data.length > 0 && (
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="px-4 py-2 rounded bg-black/[.02]">
            <span className="text-black/60">Total Users: </span>
            <span className="font-semibold">{data.length}</span>
          </div>
          <div className="px-4 py-2 rounded bg-black/[.02]">
            <span className="text-black/60">Total Clicks: </span>
            <span className="font-semibold">
              {data.reduce((sum, item) => sum + item.clicks, 0).toLocaleString()}
            </span>
          </div>
          <div className="px-4 py-2 rounded bg-black/[.02]">
            <span className="text-black/60">Total Impressions: </span>
            <span className="font-semibold">
              {data.reduce((sum, item) => sum + item.impressions, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

