import { NextRequest, NextResponse } from "next/server";
import { getAdClickEventCollection, getAdImpressionEventCollection } from "@/lib/mongodb";
import type { AdUserAnalytics } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adNumberParam = searchParams.get("adNumber");
    const fromDateParam = searchParams.get("fromDate");
    const toDateParam = searchParams.get("toDate");
    const searchParam = searchParams.get("search") || "";

    if (!adNumberParam) {
      return NextResponse.json({ error: "adNumber is required" }, { status: 400 });
    }

    const adNumber = parseInt(adNumberParam, 10);
    if (isNaN(adNumber) || adNumber < 1 || adNumber > 6) {
      return NextResponse.json({ error: "Valid adNumber (1-6) is required" }, { status: 400 });
    }

    const clickCollection = await getAdClickEventCollection();
    const impressionCollection = await getAdImpressionEventCollection();

    // Build filter query
    const filter: {
      adNumber: number;
      timestamp?: {
        $gte?: Date;
        $lte?: Date;
      };
      $or?: Array<{
        userEmail?: { $regex: string; $options: string };
        userName?: { $regex: string; $options: string };
      }>;
    } = {
      adNumber: adNumber,
    };

    // Add date range filter
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

    // Add search filter (case-insensitive search on email or name)
    if (searchParam.trim()) {
      const searchRegex = { $regex: searchParam.trim(), $options: "i" };
      filter.$or = [
        { userEmail: searchRegex },
        { userName: searchRegex },
      ];
    }

    // Fetch all matching events from both collections in parallel
    const [clickEvents, impressionEvents] = await Promise.all([
      clickCollection.find(filter).toArray(),
      impressionCollection.find(filter).toArray(),
    ]);

    // Aggregate by userEmail/userName
    const userMap = new Map<string, AdUserAnalytics>();

    // Process click events
    for (const event of clickEvents) {
      const key = `${event.userEmail}|${event.userName}`;
      
      if (!userMap.has(key)) {
        userMap.set(key, {
          userEmail: event.userEmail,
          userName: event.userName,
          clicks: 0,
          impressions: 0,
        });
      }

      const userData = userMap.get(key)!;
      userData.clicks++;
    }

    // Process impression events
    for (const event of impressionEvents) {
      const key = `${event.userEmail}|${event.userName}`;
      
      if (!userMap.has(key)) {
        userMap.set(key, {
          userEmail: event.userEmail,
          userName: event.userName,
          clicks: 0,
          impressions: 0,
        });
      }

      const userData = userMap.get(key)!;
      userData.impressions++;
    }

    // Convert map to array and sort by total interactions (clicks + impressions) descending
    const result = Array.from(userMap.values()).sort((a, b) => {
      const totalA = a.clicks + a.impressions;
      const totalB = b.clicks + b.impressions;
      return totalB - totalA;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch ad events:", error);
    return NextResponse.json({ error: "Failed to fetch ad events" }, { status: 500 });
  }
}

