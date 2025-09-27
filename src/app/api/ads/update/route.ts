import { NextRequest, NextResponse } from "next/server";
import { getAdSlotCollection, AdSlot } from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<AdSlot> & { adNumber: number };
    const { adNumber, imageUrl, targetUrl } = body;

    if (!adNumber || (adNumber < 1 || adNumber > 6)) {
      return NextResponse.json({ error: "Valid adNumber (1-6) is required" }, { status: 400 });
    }

    const collection = await getAdSlotCollection();
    const now = new Date();

    // Check if ad slot exists
    const existingAd = await collection.findOne({ adNumber });
    
    if (existingAd) {
      // Update existing ad
      const updateData: Partial<AdSlot> = {
        updatedAt: now,
      };
      
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (targetUrl !== undefined) updateData.targetUrl = targetUrl;

      const result = await collection.updateOne(
        { adNumber },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Ad slot not found" }, { status: 404 });
      }

      const updatedAd = await collection.findOne({ adNumber });
      return NextResponse.json(updatedAd);
    } else {
      // Create new ad slot if it doesn't exist
      const newAd: AdSlot = {
        adNumber,
        section: getSectionByAdNumber(adNumber),
        shape: getShapeByAdNumber(adNumber),
        order: adNumber,
        imageUrl: imageUrl || "",
        targetUrl: targetUrl || "",
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(newAd);
      const createdAd = await collection.findOne({ _id: result.insertedId });
      return NextResponse.json(createdAd, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to update ad:", error);
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}

// Helper functions to determine section and shape based on adNumber
function getSectionByAdNumber(adNumber: number): "questionnaire" | "loading" | "dashboard" {
  if (adNumber >= 1 && adNumber <= 3) return "questionnaire";
  if (adNumber >= 4 && adNumber <= 5) return "loading";
  if (adNumber === 6) return "dashboard";
  return "questionnaire"; // fallback
}

function getShapeByAdNumber(adNumber: number): "square" | "banner-wide" | "banner-medium" | "poster" {
  switch (adNumber) {
    case 1:
    case 2:
    case 3:
      return "square";
    case 4:
      return "poster";
    case 5:
      return "banner-medium";
    case 6:
      return "banner-wide";
    default:
      return "square";
  }
}
