import { NextRequest, NextResponse } from "next/server";
import { getProductCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body || {};
    if (!id) {
      return NextResponse.json({ error: "Missing field: id" }, { status: 400 });
    }

    const collection = await getProductCollection();
    const _id = new ObjectId(id);
    const now = new Date();

    const { matchedCount } = await collection.updateOne(
      { _id },
      { $set: { ...updates, updatedAt: now } }
    );

    if (matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updated = await collection.findOne({ _id });
    console.log("Product updated:", id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to edit product:", error);
    return NextResponse.json({ error: "Failed to edit product" }, { status: 500 });
  }
}


