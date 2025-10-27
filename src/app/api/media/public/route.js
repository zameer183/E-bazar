import { NextResponse } from "next/server";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

import { getBucketName, getKeyFromUrl, getS3Client } from "@/lib/s3";

export const runtime = "nodejs";

const buildHeaders = (metadata = {}) => {
  const headers = new Headers();
  if (metadata.ContentType) {
    headers.set("Content-Type", metadata.ContentType);
  }
  if (metadata.ContentLength !== undefined && metadata.ContentLength !== null) {
    headers.set("Content-Length", String(metadata.ContentLength));
  }
  if (metadata.ETag) {
    headers.set("ETag", metadata.ETag);
  }
  if (metadata.LastModified) {
    const lastModified =
      metadata.LastModified instanceof Date
        ? metadata.LastModified.toUTCString()
        : new Date(metadata.LastModified).toUTCString();
    headers.set("Last-Modified", lastModified);
  }

  const cacheControl =
    metadata.CacheControl ||
    process.env.AWS_S3_CACHE_CONTROL ||
    "public, max-age=86400, immutable";
  headers.set("Cache-Control", cacheControl);

  return headers;
};

const resolveKey = (request) => {
  const { searchParams } = new URL(request.url);
  const keyParam = searchParams.get("key");
  if (keyParam && keyParam.trim().length > 0) {
    return keyParam.trim();
  }

  const urlParam = searchParams.get("url");
  if (urlParam && urlParam.trim().length > 0) {
    return getKeyFromUrl(urlParam.trim());
  }

  throw new Error("Provide either an S3 object key or URL.");
};

const sendError = (status, message) =>
  NextResponse.json({ success: false, error: message }, { status });

const streamBodyToWeb = (body) => {
  if (!body) {
    return null;
  }
  if (typeof body.transformToWebStream === "function") {
    return body.transformToWebStream();
  }
  return Readable.toWeb(body);
};

const handleS3Error = (error) => {
  const status =
    error?.$metadata?.httpStatusCode ||
    (error?.name === "NotFound" || error?.Code === "NoSuchKey" ? 404 : 500);
  const message =
    status === 404
      ? "File not found."
      : error?.message || "Unable to retrieve media from S3.";
  console.error("S3 proxy error:", error);
  return sendError(status, message);
};

export async function HEAD(request) {
  let key;
  try {
    key = resolveKey(request);
  } catch (error) {
    return sendError(400, error.message);
  }

  try {
    const client = getS3Client();
    const bucket = getBucketName();
    const metadata = await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    return new Response(null, {
      status: 200,
      headers: buildHeaders(metadata),
    });
  } catch (error) {
    return handleS3Error(error);
  }
}

export async function GET(request) {
  let key;
  try {
    key = resolveKey(request);
  } catch (error) {
    return sendError(400, error.message);
  }

  try {
    const client = getS3Client();
    const bucket = getBucketName();
    const result = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    const stream = streamBodyToWeb(result.Body);
    if (!stream) {
      return sendError(500, "Failed to load media stream.");
    }

    return new Response(stream, {
      status: 200,
      headers: buildHeaders(result),
    });
  } catch (error) {
    return handleS3Error(error);
  }
}
