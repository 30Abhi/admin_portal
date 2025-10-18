import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getUsersCollection();
    const users = await collection.find({}).toArray();

    // Define the chart labels
    const skinConcernLabels = ["Pigmentation", "Acne", "Wrinkles", "Dryness", "Sensitivity"];
    const skinTypeLabels = ["Combination", "Oily", "Dry", "Normal", "Sensitive"];

    // Initialize counters
    const skinConcernCounts = new Array(skinConcernLabels.length).fill(0);
    const skinTypeCounts = new Array(skinTypeLabels.length).fill(0);

    // Process each user
    users.forEach((user: any) => {
      // Count skin concerns
      if (user.skin_concerns && Array.isArray(user.skin_concerns)) {
        user.skin_concerns.forEach((concern: any) => {
          const concernIndex = skinConcernLabels.findIndex(
            label => label.toLowerCase() === concern.name.toLowerCase()
          );
          if (concernIndex !== -1) {
            skinConcernCounts[concernIndex]++;
          }
        });
      }

      // Count skin types
      if (user.skin_type) {
        const skinTypeIndex = skinTypeLabels.findIndex(
          label => label.toLowerCase() === user.skin_type.toLowerCase()
        );
        if (skinTypeIndex !== -1) {
          skinTypeCounts[skinTypeIndex]++;
        }
      }
    });

    return NextResponse.json({
      skinConcerns: {
        labels: skinConcernLabels,
        data: skinConcernCounts
      },
      skinTypes: {
        labels: skinTypeLabels,
        data: skinTypeCounts
      }
    });
  } catch (error) {
    console.error("Failed to fetch chart data:", error);
    return NextResponse.json({ error: "Failed to fetch chart data" }, { status: 500 });
  }
}
