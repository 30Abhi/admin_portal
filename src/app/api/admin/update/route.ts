import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdminCollection } from "@/lib/mongodb";

type UpdateAdminBody = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  changePassword?: boolean;
};

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as UpdateAdminBody;
    const { id, name, email, password, changePassword } = body || {};

    if (!id) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    if (changePassword && !password) {
      return NextResponse.json({ error: "Password is required when changing password" }, { status: 400 });
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

    // Check if email already exists for another admin
    const emailConflict = await collection.findOne({ 
      email: email.trim().toLowerCase(), 
      _id: { $ne: objectId } 
    });
    if (emailConflict) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const updateData: {
      name: string;
      email: string;
      password?: string;
    } = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    // Only update password if changePassword is true
    if (changePassword && password) {
      updateData.password = password.trim();
    }

    await collection.updateOne({ _id: objectId }, { $set: updateData });
    const updatedAdmin = await collection.findOne({ _id: objectId });
    
    return NextResponse.json(updatedAdmin);
  } catch {
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
  }
}
