import { NextRequest, NextResponse } from "next/server";
import { getAdClickEventCollection, getAdImpressionEventCollection } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fromDateParam = searchParams.get("fromDate");
    const toDateParam = searchParams.get("toDate");

    const clickCollection = await getAdClickEventCollection();
    const impressionCollection = await getAdImpressionEventCollection();

    // Build filter query for date range
    const filter: any = {};

    if (fromDateParam || toDateParam) {
      filter.timestamp = {};
      if (fromDateParam) {
        const fromDate = new Date(fromDateParam);
        fromDate.setHours(0, 0, 0, 0);
        filter.timestamp.$gte = fromDate;
      }
      if (toDateParam) {
        const toDate = new Date(toDateParam);
        toDate.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = toDate;
      }
    }

    // Fetch all matching events from both collections in parallel
    const [clickEvents, impressionEvents] = await Promise.all([
      clickCollection.find(filter).toArray(),
      impressionCollection.find(filter).toArray(),
    ]);

    // Aggregate by adNumber
    const adStatsMap = new Map<number, { clicks: number; impressions: number }>();

    // Initialize all 6 ads with 0 counts
    for (let i = 1; i <= 6; i++) {
      adStatsMap.set(i, { clicks: 0, impressions: 0 });
    }

    // Count clicks by adNumber
    for (const event of clickEvents) {
      const adNumber = event.adNumber;
      if (adNumber >= 1 && adNumber <= 6) {
        const stats = adStatsMap.get(adNumber)!;
        stats.clicks++;
      }
    }

    // Count impressions by adNumber
    for (const event of impressionEvents) {
      const adNumber = event.adNumber;
      if (adNumber >= 1 && adNumber <= 6) {
        const stats = adStatsMap.get(adNumber)!;
        stats.impressions++;
      }
    }

    // Convert map to array format: [{ adNumber: 1, clicks: X, impressions: Y }, ...]
    const result = Array.from(adStatsMap.entries())
      .map(([adNumber, stats]) => ({
        adNumber,
        clicks: stats.clicks,
        impressions: stats.impressions,
      }))
      .sort((a, b) => a.adNumber - b.adNumber);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch ad stats:", error);
    return NextResponse.json({ error: "Failed to fetch ad stats" }, { status: 500 });
  }
}

