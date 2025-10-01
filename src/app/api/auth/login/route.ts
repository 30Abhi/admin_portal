import { NextRequest, NextResponse } from "next/server";
import { getAdminCollection } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginBody;
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admins = await getAdminCollection();
    const admin = await admins.findOne({ email, password });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server misconfiguration JWT Secret missing" }, { status: 500 });
    }

    const expiresInSeconds = 2 * 24 * 60 * 60; // 2 days
    // Include email and password in payload per requirement
    const token = jwt.sign({ email, password }, secret, { expiresIn: expiresInSeconds });

    return NextResponse.json({ token, expiresIn: expiresInSeconds });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


