import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const adNumber = formData.get("adNumber") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!adNumber || isNaN(Number(adNumber)) || Number(adNumber) < 1 || Number(adNumber) > 6) {
      return NextResponse.json({ error: "Valid adNumber (1-6) is required" }, { status: 400 });
    }

    if (!file.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const timestamp = Date.now();
    const fileName = file.name || "upload";
    const fileExtension = fileName.split(".").pop() || "jpg";
    const contentType = file.type || "image/jpeg";

    const filename = `ad-${adNumber}-${timestamp}.${fileExtension}`;
    const key = `ads/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(putCommand);

    // Create a pre-signed GET URL (same behavior as dermatologist)
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

    // Return both for compatibility
    return NextResponse.json({ success: true, url, imageUrl: url, key, filename });
  } catch (error) {
    console.error("Failed to upload file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
