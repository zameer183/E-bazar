import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

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

/**
 * Upload profile picture
 * @param {string} userId - User ID
 * @param {File|string} file - File object or base64 string
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadProfilePicture = async (userId, file) => {
  try {
    const storageRef = ref(storage, `profile-pictures/${userId}/${Date.now()}`);

    let uploadData;
    if (typeof file === "string" && file.startsWith("data:")) {
      // Handle base64 string
      uploadData = base64ToBlob(file);
    } else {
      // Handle File object
      uploadData = file;
    }

    const snapshot = await uploadBytes(storageRef, uploadData);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, url: downloadURL };
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
    const storageRef = ref(storage, `shops/${shopId}/images/${Date.now()}`);

    let uploadData;
    if (typeof file === "string" && file.startsWith("data:")) {
      uploadData = base64ToBlob(file);
    } else {
      uploadData = file;
    }

    const snapshot = await uploadBytes(storageRef, uploadData);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, url: downloadURL };
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
    const storageRef = ref(storage, `shops/${shopId}/video/${Date.now()}`);

    let uploadData;
    if (typeof file === "string" && file.startsWith("data:")) {
      uploadData = base64ToBlob(file);
    } else {
      uploadData = file;
    }

    const uploadTask = uploadBytesResumable(storageRef, uploadData);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (onProgress) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          }
        },
        (error) => {
          console.error("Error uploading shop video:", error);
          reject({ success: false, error: error.message });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ success: true, url: downloadURL });
        }
      );
    });
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
    const sanitizedProductName = productName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const storageRef = ref(
      storage,
      `shops/${shopId}/products/${sanitizedProductName}/${Date.now()}`
    );

    let uploadData;
    if (typeof file === "string" && file.startsWith("data:")) {
      uploadData = base64ToBlob(file);
    } else {
      uploadData = file;
    }

    const snapshot = await uploadBytes(storageRef, uploadData);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, url: downloadURL };
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
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
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
