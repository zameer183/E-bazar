import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

import {
  buildPublicUrl,
  getBucketName,
  getS3Client,
  getObjectAcl,
} from "@/lib/s3";

export const runtime = "nodejs";

const sanitizeSegment = (segment) => segment.replace(/[^a-zA-Z0-9._-]/g, "_");

const ensurePathIsSafe = (rawPath) => {
  if (!rawPath) {
    throw new Error("Upload path is required.");
  }

  const normalized = rawPath.trim().replace(/^\/+/, "").replace(/\/\/+/g, "/");

  if (normalized.length === 0) {
    throw new Error("Upload path cannot be empty.");
  }

  if (normalized.includes("..")) {
    throw new Error("Upload path cannot contain traversal segments.");
  }

  return normalized;
};

const generateObjectKey = (folderPath, originalName) => {
  const timestamp = Date.now();
  const uniqueSuffix = randomUUID();

  if (!originalName || originalName === "blob") {
    return `${folderPath}/${timestamp}-${uniqueSuffix}`;
  }

  const trimmedName = originalName.trim();
  const hasExtension = trimmedName.includes(".");
  const baseName = hasExtension ? trimmedName.substring(0, trimmedName.lastIndexOf(".")) : trimmedName;
  const extension = hasExtension ? trimmedName.substring(trimmedName.lastIndexOf(".") + 1) : "";

  const safeBase = sanitizeSegment(baseName) || "upload";
  const safeExt = sanitizeSegment(extension);

  const suffix = `${timestamp}-${uniqueSuffix}`;
  return safeExt ? `${folderPath}/${safeBase}-${suffix}.${safeExt}` : `${folderPath}/${safeBase}-${suffix}`;
};

const isAclUnsupportedError = (error) => {
  const code = error?.Code || error?.code || error?.name;
  if (code === "AccessControlListNotSupported") {
    return true;
  }

  const message = error?.message || "";
  return message.includes("bucket does not allow ACLs") || message.includes("Access Control List is not supported");
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "A file must be provided for upload." },
        { status: 400 }
      );
    }

    const rawPath = formData.get("path");
    const safePath = ensurePathIsSafe(typeof rawPath === "string" ? rawPath : rawPath?.toString());

    const explicitFileNameRaw = formData.get("fileName");
    const explicitFileName =
      typeof explicitFileNameRaw === "string" ? explicitFileNameRaw : explicitFileNameRaw?.toString();

    const objectKey = generateObjectKey(
      safePath,
      explicitFileName || (file.name && file.name !== "blob" ? file.name : undefined)
    );

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const contentTypeCandidate = formData.get("contentType");
    const contentType =
      (typeof contentTypeCandidate === "string" && contentTypeCandidate) || file.type || "application/octet-stream";

    const client = getS3Client();
    const bucket = getBucketName();
    const aclConfig = getObjectAcl();

    const baseParams = {
      Bucket: bucket,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: contentType,
      CacheControl: process.env.AWS_S3_CACHE_CONTROL || undefined,
    };

    try {
      await client.send(new PutObjectCommand({ ...baseParams, ...aclConfig }));
    } catch (uploadError) {
      if (aclConfig.ACL && isAclUnsupportedError(uploadError)) {
        console.warn("S3 bucket does not accept ACLs; retrying upload without ACL.");
        await client.send(new PutObjectCommand(baseParams));
      } else {
        throw uploadError;
      }
    }

    const publicUrl = buildPublicUrl(objectKey);

    return NextResponse.json(
      {
        success: true,
        key: objectKey,
        url: publicUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("S3 upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file to S3." },
      { status: 500 }
    );
  }
}
