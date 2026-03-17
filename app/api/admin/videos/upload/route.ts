import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload video to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "planetkids/videos",
            resource_type: "video",
            eager: [{ format: "jpg", transformation: [{ start_offset: "1" }] }],
            eager_async: false,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    // Auto-generate thumbnail from video using Cloudinary
    const thumbnailUrl = uploadResult.secure_url
      .replace("/upload/", "/upload/so_1/")
      .replace(/\.[^/.]+$/, ".jpg");

    return NextResponse.json({
      videoUrl: uploadResult.secure_url,
      thumbnail: thumbnailUrl,
      duration: uploadResult.duration
        ? formatDuration(uploadResult.duration)
        : null,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
