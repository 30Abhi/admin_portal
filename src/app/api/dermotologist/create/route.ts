import { NextRequest, NextResponse } from "next/server";
import { getDermotologistCollection, Dermotologist } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Dermotologist>;
    const { name } = body;
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const now = new Date();
    const doc: Dermotologist = {
      name,
      imageUrl: body.imageUrl,
      clinicName: body.clinicName,
      city: body.city,
      state: body.state,
      country: body.country,
      qualifications: body.qualifications,
      experienceYears: typeof body.experienceYears === "number" ? body.experienceYears : undefined,
      contactNumber: body.contactNumber,
      couponCode: body.couponCode,
      // legacy optional fields for compatibility
      email: body.email,
      phone: body.phone,
      specialization: body.specialization,
      photoUrl: body.photoUrl,
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getDermotologistCollection();
    const result = await collection.insertOne(doc);
    return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to create dermatologist" }, { status: 500 });
  }
}


