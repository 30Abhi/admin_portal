import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDermatologistCollection, Dermatologist } from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Dermatologist> & { id?: string };
    const id = body.id;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const objectId = (() => { try { return new ObjectId(id); } catch { return null; }})();
    if (!objectId) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { _id, ...rest } = body as Record<string, unknown>;
    const update: Partial<Dermatologist> = { ...(rest as Partial<Dermatologist>), updatedAt: new Date() };

    const collection = await getDermatologistCollection();
    await collection.updateOne({ _id: objectId }, { $set: update });
    const updated = await collection.findOne({ _id: objectId });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update dermatologist" }, { status: 500 });
  }
}


