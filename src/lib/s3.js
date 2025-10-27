import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

let s3ClientInstance = null;

const requiredEnvVars = ["AWS_REGION", "AWS_S3_BUCKET"];
const optionalCredentialVars = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"];

const getMissingVars = (vars) =>
  vars.filter((name) => !process.env[name] || process.env[name].trim().length === 0);

const validateAwsConfig = () => {
  const missingRequired = getMissingVars(requiredEnvVars);
  if (missingRequired.length > 0) {
    throw new Error(
      `Missing AWS configuration. Set the following environment variable(s): ${missingRequired.join(
        ", "
      )}`
    );
  }

  const hasPartialCredentials = optionalCredentialVars.some(
    (name) => process.env[name] && process.env[name].trim().length > 0
  );

  if (hasPartialCredentials) {
    const missingCreds = getMissingVars(optionalCredentialVars);
    if (missingCreds.length > 0) {
      throw new Error(
        `Incomplete AWS credentials. Provide both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. Missing: ${missingCreds.join(
          ", "
        )}`
      );
    }
  }
};

export const getS3Client = () => {
  if (s3ClientInstance) {
    return s3ClientInstance;
  }

  validateAwsConfig();

  const region = process.env.AWS_REGION;
  const hasStaticCredentials =
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

  s3ClientInstance = new S3Client({
    region,
    credentials: hasStaticCredentials
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
  });

  return s3ClientInstance;
};

export const getBucketName = () => process.env.AWS_S3_BUCKET;

const getPublicBaseUrl = () => {
  const customDomain = process.env.AWS_S3_PUBLIC_URL;
  if (customDomain) {
    return customDomain.replace(/\/+$/, "");
  }

  const bucket = getBucketName();
  const region = process.env.AWS_REGION;
  const isUsEast1 = region === "us-east-1";
  const host = isUsEast1
    ? `https://${bucket}.s3.amazonaws.com`
    : `https://${bucket}.s3.${region}.amazonaws.com`;
  return host;
};

export const buildPublicUrl = (key) => {
  if (!key) {
    throw new Error("Missing S3 object key");
  }
  const base = getPublicBaseUrl();
  return `${base}/${encodeURI(key)}`;
};

export const getKeyFromUrl = (url) => {
  if (!url) {
    throw new Error("File URL is required to derive the S3 key");
  }

  const normalizedUrl = url.replace(/\?.*$/, ""); // strip query string
  const baseCandidates = [
    getPublicBaseUrl(),
    `https://${getBucketName()}.s3.amazonaws.com`,
    `https://${getBucketName()}.s3.${process.env.AWS_REGION}.amazonaws.com`,
  ].map((candidate) => candidate.replace(/\/+$/, ""));

  for (const base of baseCandidates) {
    if (normalizedUrl.startsWith(`${base}/`)) {
      const key = normalizedUrl.substring(base.length + 1);
      return decodeURIComponent(key);
    }
  }

  throw new Error("Unable to derive S3 key from the provided URL");
};

export const deleteObjectByKey = async (key) => {
  if (!key) {
    throw new Error("S3 object key is required for deletion");
  }

  const client = getS3Client();
  const bucket = getBucketName();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
};

