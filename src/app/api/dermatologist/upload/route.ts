import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = file.name || 'upload';
    const fileExtension = fileName.split('.').pop() || 'jpg';
    const fileType = file.type || 'image/jpeg';

    // Create unique filename and S3 key for dermatologist images
    const uniqueFileName = `derm_${timestamp}.${fileExtension}`;
    const key = `dermatologists/${uniqueFileName}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload the object (kept private; bucket policy/ownership enforces privacy)
    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: fileType,
    });

    await s3Client.send(putCommand);

    // Create a pre-signed GET URL valid for 1 hour
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    });
    
    const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 604800 });
    return NextResponse.json({ url: signedUrl, key });
    
  } catch (error) {
    console.error('S3 upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}


