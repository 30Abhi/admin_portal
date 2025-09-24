import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDermotologistCollection } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const collection = await getDermotologistCollection();
    if (id) {
      const objectId = (() => { try { return new ObjectId(id); } catch { return null; }})();
      if (!objectId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
      const one = await collection.findOne({ _id: objectId });
      if (!one) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(one);
    }
    const all = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(all);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch dermatologists" }, { status: 500 });
  }
}


