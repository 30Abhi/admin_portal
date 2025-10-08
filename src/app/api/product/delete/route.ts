import { NextRequest, NextResponse } from "next/server";
import { getProductCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing query param: id" }, { status: 400 });
    }

    const collection = await getProductCollection();
    const _id = new ObjectId(id);
    const { deletedCount } = await collection.deleteOne({ _id });
    if (deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    console.log("Product deleted:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}


