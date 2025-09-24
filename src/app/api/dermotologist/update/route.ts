import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDermotologistCollection, Dermotologist } from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Dermotologist> & { id?: string };
    const id = body.id;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const objectId = (() => { try { return new ObjectId(id); } catch { return null; }})();
    if (!objectId) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { id: _omit, _id: _omit2, ...rest } = body as any;
    const update: Partial<Dermotologist> = { ...rest, updatedAt: new Date() };

    const collection = await getDermotologistCollection();
    await collection.updateOne({ _id: objectId }, { $set: update });
    const updated = await collection.findOne({ _id: objectId });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to update dermatologist" }, { status: 500 });
  }
}


