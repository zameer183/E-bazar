import { NextResponse } from "next/server";

import { deleteObjectByKey, getKeyFromUrl } from "@/lib/s3";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body || (typeof body !== "object")) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { key: rawKey, url } = body;

    let objectKey = typeof rawKey === "string" ? rawKey.trim() : "";

    if (!objectKey) {
      if (typeof url === "string" && url.trim().length > 0) {
        objectKey = getKeyFromUrl(url.trim());
      } else {
        return NextResponse.json(
          { success: false, error: "Provide either the S3 object key or the file URL." },
          { status: 400 }
        );
      }
    }

    await deleteObjectByKey(objectKey);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("S3 delete error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete file from S3." },
      { status: 500 }
    );
  }
}

