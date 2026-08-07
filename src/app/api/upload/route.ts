import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { canUploadMedia } from "@/lib/rbac";
import { configureCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { Media } from "@/models/Media";
import type { Role } from "@/lib/constants";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !canUploadMedia(session.user.role as Role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Set CLOUDINARY_* env vars." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const alt = String(formData.get("alt") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const cloudinary = configureCloudinary();

  const uploaded = await new Promise<{
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "blog-portal", resource_type: "image" },
        (error, result) => {
          if (error || !result) reject(error || new Error("Upload failed"));
          else resolve(result as typeof result & { public_id: string });
        }
      )
      .end(buffer);
  });

  await connectDB();
  const media = await Media.create({
    cloudinaryPublicId: uploaded.public_id,
    url: uploaded.secure_url,
    width: uploaded.width,
    height: uploaded.height,
    format: uploaded.format,
    alt,
    bytes: uploaded.bytes,
    uploadedBy: session.user.id,
  });

  return NextResponse.json({
    id: media._id.toString(),
    url: media.url,
    publicId: media.cloudinaryPublicId,
    width: media.width,
    height: media.height,
    alt: media.alt,
  });
}
