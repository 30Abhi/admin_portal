import { NextRequest, NextResponse } from "next/server";
import { getAdSlotCollection } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const collection = await getAdSlotCollection();
    const ads = await collection.find({}).sort({ adNumber: 1 }).toArray();
    return NextResponse.json(ads);
  } catch (error) {
    console.error("Failed to fetch ads:", error);
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}
