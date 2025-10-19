import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdminCollection } from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    const objectId = (() => { 
      try { 
        return new ObjectId(id); 
      } catch { 
        return null; 
      }
    })();
    
    if (!objectId) {
      return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
    }

    const collection = await getAdminCollection();
    
    // Check if admin exists
    const existingAdmin = await collection.findOne({ _id: objectId });
    if (!existingAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Check if this is the last admin
    const adminCount = await collection.countDocuments();
    if (adminCount <= 1) {
      return NextResponse.json({ error: "Cannot delete the last admin" }, { status: 400 });
    }

    await collection.deleteOne({ _id: objectId });
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}
