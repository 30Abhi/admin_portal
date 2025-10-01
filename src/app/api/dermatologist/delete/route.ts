import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDermatologistCollection } from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id query param required" }, { status: 400 });
    const objectId = (() => { try { return new ObjectId(id); } catch { return null; }})();
    if (!objectId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const collection = await getDermatologistCollection();
    const result = await collection.deleteOne({ _id: objectId });
    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete dermatologist" }, { status: 500 });
  }
}


