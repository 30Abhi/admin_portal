import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function getS3Client() {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("AWS S3 environment variables are not set");
  }
  return new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
}

export async function POST(req: NextRequest) {
  try {
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    if (!bucket) {
      return NextResponse.json({ error: "AWS_S3_BUCKET_NAME not set" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = (file as File).type || "application/octet-stream";
    const originalName = (file as File).name || "upload.bin";

    const timestamp = Date.now();
    const key = `dermotologists/${timestamp}-${originalName}`;

    const s3 = getS3Client();
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: "public-read",
      })
    );

    const publicUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return NextResponse.json({ url: publicUrl, key });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}


