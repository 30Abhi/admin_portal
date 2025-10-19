import { NextRequest, NextResponse } from "next/server";
import { getAdminCollection } from "@/lib/mongodb";

type CreateAdminBody = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateAdminBody;
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const collection = await getAdminCollection();
    
    // Check if email already exists
    const existingAdmin = await collection.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const newAdmin = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
    };

    const result = await collection.insertOne(newAdmin);
    const createdAdmin = await collection.findOne({ _id: result.insertedId });
    
    return NextResponse.json(createdAdmin);
  } catch {
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
