import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getAdminCollection } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ authenticated: false, error: "Missing token" }, { status: 401 });
    }

    const token = authHeader.substring("Bearer ".length);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ authenticated: false, error: "Server misconfiguration" }, { status: 500 });
    }

    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ authenticated: false, error: "Invalid token" }, { status: 401 });
    }

    const { email, password } =
      typeof decoded === "object" && decoded
        ? (decoded as JwtPayload)
        : ({} as JwtPayload);
    if (!email || !password) {
      return NextResponse.json({ authenticated: false, error: "Invalid payload" }, { status: 401 });
    }

    const admins = await getAdminCollection();
    const admin = await admins.findOne({ email, password });
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false, error: "Unexpected error" }, { status: 500 });
  }
}


