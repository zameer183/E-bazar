"use client";

import { storage as firebaseStorage } from "@/lib/firebase";
import {
  ref as firebaseRef,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const STORAGE_DRIVER = (() => {
  const explicit = process.env.NEXT_PUBLIC_STORAGE_DRIVER;
  if (explicit && explicit.trim().length > 0) {
    return explicit.trim().toLowerCase();
  }

  const hasAwsEnv =
    process.env.NEXT_PUBLIC_AWS_S3_BUCKET &&
    process.env.NEXT_PUBLIC_AWS_REGION;

  return hasAwsEnv ? "aws" : "firebase";
})();

/**
 * Convert base64 to Blob
 */
const base64ToBlob = (base64String) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

const ensureFileLike = (file, fallbackName = "upload") => {
  if (typeof file === "string" && file.startsWith("data:")) {
    const blob = base64ToBlob(file);
    return new File([blob], `${fallbackName}.${blob.type.split("/")[1] || "bin"}`, {
      type: blob.type || "application/octet-stream",
    });
  }

  if (file instanceof File) {
    return file;
  }

  if (file instanceof Blob) {
    return new File([file], fallbackName, { type: file.type || "application/octet-stream" });
  }

  throw new Error("Unsupported file format. Provide a base64 string or File/Blob object.");
};

const sanitizePathSegment = (value) => value.replace(/[^a-zA-Z0-9/_-]/g, "_");

const shouldUseFirebaseUploads = () => STORAGE_DRIVER === "firebase";

const generateFirebaseObjectPath = (path, fileName = "upload") => {
  const normalizedPath = path
    .split("/")
    .filter(Boolean)
    .map((segment) => sanitizePathSegment(segment))
    .join("/");

  const baseName = sanitizePathSegment(fileName) || "upload";
  const globalCrypto =
    typeof globalThis !== "undefined" && globalThis.crypto
      ? globalThis.crypto
      : undefined;
  const randomId =
    (globalCrypto && typeof globalCrypto.randomUUID === "function"
      ? globalCrypto.randomUUID()
      : Math.random().toString(36).slice(2));
  return `${normalizedPath}/${Date.now()}-${randomId}-${baseName}`;
};

const uploadViaApi = async ({ path, file, fileName, onProgress }) => {
  const safePath = sanitizePathSegment(path);
  const uploadFile = ensureFileLike(file, fileName || "upload");
  const effectiveName = fileName || uploadFile.name || "upload";

  const formData = new FormData();
  formData.append("path", safePath);
  formData.append("file", uploadFile, effectiveName);
  formData.append("fileName", effectiveName);
  formData.append("contentType", uploadFile.type || "application/octet-stream");

  if (onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/media/upload");

      if (typeof onProgress === "function") {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress((event.loaded / event.total) * 100);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (_error) {
            reject({ success: false, error: "Unable to parse upload response." });
          }
        } else {
          reject({ success: false, error: `Upload failed with status ${xhr.status}.` });
        }
      };

      xhr.onerror = () => reject({ success: false, error: "Network error during upload." });
      xhr.send(formData);
    });
  }

  const endpoint = "/api/media/upload";
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  } catch (networkError) {
    if (typeof window !== "undefined") {
      const absoluteUrl = new URL(endpoint, window.location.origin).toString();
      response = await fetch(absoluteUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
    } else {
      throw networkError;
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to upload file.");
  }

  return response.json();
};

const uploadViaFirebaseStorage = async ({ path, file, fileName, onProgress }) => {
  const uploadFile = ensureFileLike(file, fileName || "upload");
  const sanitizedName =
    sanitizePathSegment(fileName || uploadFile.name || "upload") || "upload";
  const objectPath = generateFirebaseObjectPath(path, sanitizedName);
  const objectRef = firebaseRef(firebaseStorage, objectPath);
  const metadata = {
    contentType: uploadFile.type || "application/octet-stream",
  };

  if (typeof onProgress === "function") {
    const task = uploadBytesResumable(objectRef, uploadFile, metadata);
    return new Promise((resolve, reject) => {
      task.on(
        "state_changed",
        (snapshot) => {
          if (snapshot.total) {
            onProgress((snapshot.bytesTransferred / snapshot.total) * 100);
          }
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve({ success: true, url, key: objectPath });
        }
      );
    });
  }

  const snapshot = await uploadBytes(objectRef, uploadFile, metadata);
  const url = await getDownloadURL(snapshot.ref);
  return { success: true, url, key: objectPath };
};

const deleteViaApi = async ({ key, url }) => {
  const endpoint = "/api/media/delete";
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, url }),
      credentials: "include",
    });
  } catch (networkError) {
    if (typeof window !== "undefined") {
      const absoluteUrl = new URL(endpoint, window.location.origin).toString();
      response = await fetch(absoluteUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, url }),
        credentials: "include",
      });
    } else {
      throw networkError;
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to delete file.");
  }

  return response.json();
};

const extractFirebaseObjectPath = (urlOrKey) => {
  if (!urlOrKey) return null;
  if (!urlOrKey.includes("http")) {
    return urlOrKey.replace(/^\/+/, "");
  }

  const match = urlOrKey.match(/\/o\/([^?]+)/);
  if (!match || !match[1]) return null;
  return decodeURIComponent(match[1]);
};

const deleteViaFirebaseStorage = async ({ key, url }) => {
  const objectPath = extractFirebaseObjectPath(key || url);
  if (!objectPath) {
    throw new Error("Unable to determine Firebase Storage object path.");
  }
  const objectRef = firebaseRef(firebaseStorage, objectPath);
  await deleteObject(objectRef);
  return { success: true };
};

const uploadWithPreferredDriver = async (options) => {
  if (shouldUseFirebaseUploads()) {
    return uploadViaFirebaseStorage(options);
  }

  try {
    return await uploadViaApi(options);
  } catch (error) {
    console.error("S3 upload failed:", error);
    if (error && typeof error === "object" && error.message) {
      error.message = `S3 upload failed: ${error.message}`;
    }
    throw error;
  }
};

const deleteWithPreferredDriver = async ({ key, url }) => {
  if (shouldUseFirebaseUploads()) {
    return deleteViaFirebaseStorage({ key, url });
  }

  if (url && url.includes("firebasestorage.googleapis.com")) {
    throw new Error(
      "Attempted to delete a Firebase Storage asset while AWS media storage is active. " +
        "Update the media reference to point at S3 or explicitly enable Firebase storage."
    );
  }

  try {
    return await deleteViaApi({ key, url });
  } catch (error) {
    console.error("S3 delete failed:", error);
    if (error && typeof error === "object" && error.message) {
      error.message = `S3 delete failed: ${error.message}`;
    }
    throw error;
  }
};

/**
 * Upload profile picture
 * @param {string} userId - User ID
 * @param {File|string} file - File object or base64 string
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadProfilePicture = async (userId, file) => {
  try {
    const response = await uploadWithPreferredDriver({
      path: `profile-pictures/${sanitizePathSegment(userId)}`,
      file,
      fileName: "profile-picture",
    });

    return { success: true, url: response.url, key: response.key };
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload shop image
 * @param {string} shopId - Shop ID
 * @param {File|string} file - File object or base64 string
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadShopImage = async (shopId, file) => {
  try {
    const response = await uploadWithPreferredDriver({
      path: `shops/${sanitizePathSegment(shopId)}/images`,
      file,
      fileName: "shop-image",
    });

    return { success: true, url: response.url, key: response.key };
  } catch (error) {
    console.error("Error uploading shop image:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload shop video
 * @param {string} shopId - Shop ID
 * @param {File|string} file - File object or base64 string
 * @param {Function} onProgress - Progress callback (percent)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadShopVideo = async (shopId, file, onProgress = null) => {
  try {
    const response = await uploadWithPreferredDriver({
      path: `shops/${sanitizePathSegment(shopId)}/video`,
      file,
      fileName: "shop-video",
      onProgress,
    });

    return { success: true, url: response.url, key: response.key };
  } catch (error) {
    console.error("Error uploading shop video:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload product image
 * @param {string} shopId - Shop ID
 * @param {string} productName - Product name
 * @param {File|string} file - File object or base64 string
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadProductImage = async (shopId, productName, file) => {
  try {
    const sanitizedProductName = sanitizePathSegment(
      productName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
    );

    const response = await uploadWithPreferredDriver({
      path: `shops/${sanitizePathSegment(shopId)}/products/${sanitizedProductName}`,
      file,
      fileName: "product-image",
    });

    return { success: true, url: response.url, key: response.key };
  } catch (error) {
    console.error("Error uploading product image:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete file from storage
 * @param {string} fileUrl - Full URL of the file to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteFile = async (fileUrl) => {
  try {
    await deleteWithPreferredDriver({ url: fileUrl });
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete profile picture
 * @param {string} fileUrl - Full URL of the profile picture
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteProfilePicture = async (fileUrl) => {
  return deleteFile(fileUrl);
};

/**
 * Delete shop image
 * @param {string} fileUrl - Full URL of the shop image
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteShopImage = async (fileUrl) => {
  return deleteFile(fileUrl);
};

/**
 * Delete shop video
 * @param {string} fileUrl - Full URL of the shop video
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteShopVideo = async (fileUrl) => {
  return deleteFile(fileUrl);
};

/**
 * Delete product image
 * @param {string} fileUrl - Full URL of the product image
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteProductImage = async (fileUrl) => {
  return deleteFile(fileUrl);
};
