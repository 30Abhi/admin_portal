import { NextResponse } from "next/server";
import { getProductCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getProductCollection();
    const products = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}


