import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getUsersCollection();
    const count = await collection.countDocuments();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to count users:", error);
    return NextResponse.json({ error: "Failed to count users" }, { status: 500 });
  }
}
