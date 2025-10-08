import { NextRequest, NextResponse } from "next/server";
import { getProductCollection } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requiredFields = [
      "productId","name","company","price","rating","link","imageUrl","category","skinTypes","concernsTargeted","regionMarket","keyIngredient"
    ];
    for (const f of requiredFields) {
      if (body[f] === undefined) {
        return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 });
      }
    }

    const collection = await getProductCollection();
    const now = new Date();
    const doc = { ...body, createdAt: now, updatedAt: now };
    const result = await collection.insertOne(doc);
    console.log("Product added:", result.insertedId);
    return NextResponse.json({ _id: result.insertedId, ...doc });
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}


