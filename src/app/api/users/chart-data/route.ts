import { NextResponse } from "next/server";
import { getUsersCollection, IUser } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getUsersCollection();
    const users = await collection.find({}).toArray();

    // Define the chart labels
    const skinConcernLabels = ["Pores", "Redness", "Pigmentation", "Acne", "Wrinkles"];
    const skinTypeLabels = ["Combination", "Oily", "Dry", "Normal", "Sensitive"];

    // Initialize score totals for skin concerns
    const skinConcernTotals = new Array(skinConcernLabels.length).fill(0);
    const skinTypeCounts = new Array(skinTypeLabels.length).fill(0);

    // Process each user
    users.forEach((user: IUser) => {
      // Aggregate skin concern scores
      if (user.skin_concerns && Array.isArray(user.skin_concerns)) {
        user.skin_concerns.forEach((concern: { name: string; score: number }) => {
          const concernIndex = skinConcernLabels.findIndex(
            label => label.toLowerCase() === concern.name.toLowerCase()
          );
          if (concernIndex !== -1) {
            skinConcernTotals[concernIndex] += concern.score;
          }
        });
      }

      // Count skin types
      if (user.skin_type) {
        const skinTypeIndex = skinTypeLabels.findIndex(
          label => label.toLowerCase() === user.skin_type!.toLowerCase()
        );
        if (skinTypeIndex !== -1) {
          skinTypeCounts[skinTypeIndex]++;
        }
      }
    });

    // Calculate percentages for skin concerns
    const totalScore = skinConcernTotals.reduce((sum, score) => sum + score, 0);
    const skinConcernPercentages = skinConcernTotals.map(score => 
      totalScore > 0 ? (score / totalScore) * 100 : 0
    );

    return NextResponse.json({
      skinConcerns: {
        labels: skinConcernLabels,
        data: skinConcernPercentages
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
