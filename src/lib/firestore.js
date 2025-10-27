import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ==================== USER OPERATIONS ====================

/**
 * Create a new user document
 */
export const createUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user by ID
 */
export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    }
    return { success: false, error: "User not found" };
  } catch (error) {
    console.error("Error getting user:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user data
 */
export const updateUser = async (userId, userData) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message };
  }
};

// ==================== USER PROFILE OPERATIONS ====================

/**
 * Create or update user profile
 */
export const setUserProfile = async (userId, profileData) => {
  try {
    await setDoc(
      doc(db, "userProfiles", userId),
      {
        ...profileData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.error("Error setting user profile:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
  try {
    const profileDoc = await getDoc(doc(db, "userProfiles", userId));
    if (profileDoc.exists()) {
      return { success: true, data: { id: profileDoc.id, ...profileDoc.data() } };
    }
    return { success: false, error: "Profile not found" };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { success: false, error: error.message };
  }
};

// ==================== USER SETTINGS OPERATIONS ====================

/**
 * Save user settings
 */
export const saveUserSettings = async (userId, settings) => {
  try {
    await setDoc(doc(db, "userSettings", userId), settings, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error saving user settings:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user settings
 */
export const getUserSettings = async (userId) => {
  try {
    const settingsDoc = await getDoc(doc(db, "userSettings", userId));
    if (settingsDoc.exists()) {
      return { success: true, data: settingsDoc.data() };
    }
    return { success: false, error: "Settings not found" };
  } catch (error) {
    console.error("Error getting user settings:", error);
    return { success: false, error: error.message };
  }
};

// ==================== SHOP OPERATIONS ====================

/**
 * Create a new shop
 */
export const createShop = async (shopData) => {
  try {
    const shopRef = await addDoc(collection(db, "shops"), {
      ...shopData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, shopId: shopRef.id };
  } catch (error) {
    console.error("Error creating shop:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get shop by ID
 */
export const getShop = async (shopId) => {
  try {
    const shopDoc = await getDoc(doc(db, "shops", shopId));
    if (shopDoc.exists()) {
      return { success: true, data: { id: shopDoc.id, ...shopDoc.data() } };
    }
    return { success: false, error: "Shop not found" };
  } catch (error) {
    console.error("Error getting shop:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all shops for a specific owner
 */
export const getShopsByOwner = async (ownerId) => {
  try {
    const q = query(
      collection(db, "shops"),
      where("ownerId", "==", ownerId)
      // Note: orderBy removed temporarily - add index in Firebase Console to enable sorting
      // orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const shops = [];
    querySnapshot.forEach((doc) => {
      shops.push({ id: doc.id, ...doc.data() });
    });

    // Sort in memory as a temporary solution
    shops.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime; // desc order
    });

    return { success: true, data: shops };
  } catch (error) {
    console.error("Error getting shops by owner:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all shops (for marketplace)
 */
export const getAllShops = async () => {
  try {
    const q = query(collection(db, "shops"));
    const querySnapshot = await getDocs(q);
    const shops = [];
    querySnapshot.forEach((doc) => {
      shops.push({ id: doc.id, ...doc.data() });
    });

    // Sort in memory by createdAt
    shops.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime; // desc order
    });

    return { success: true, data: shops };
  } catch (error) {
    console.error("Error getting all shops:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update shop data
 */
export const updateShop = async (shopId, shopData) => {
  try {
    await updateDoc(doc(db, "shops", shopId), {
      ...shopData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating shop:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete shop
 */
export const deleteShop = async (shopId) => {
  try {
    await deleteDoc(doc(db, "shops", shopId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting shop:", error);
    return { success: false, error: error.message };
  }
};

// ==================== SHOP IMAGE OPERATIONS ====================

/**
 * Save shop image metadata (URL from Firebase Storage)
 */
export const saveShopImage = async (shopId, imageData) => {
  try {
    const imageRef = await addDoc(collection(db, "shopImages"), {
      shopId,
      ...imageData,
      uploadedAt: serverTimestamp(),
    });
    return { success: true, imageId: imageRef.id };
  } catch (error) {
    console.error("Error saving shop image:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all images for a shop
 */
export const getShopImages = async (shopId) => {
  try {
    const q = query(
      collection(db, "shopImages"),
      where("shopId", "==", shopId)
      // orderBy("uploadedAt", "desc") - requires index, sorting in memory instead
    );
    const querySnapshot = await getDocs(q);
    const images = [];
    querySnapshot.forEach((doc) => {
      images.push({ id: doc.id, ...doc.data() });
    });

    // Sort in memory
    images.sort((a, b) => {
      const aTime = a.uploadedAt?.toMillis?.() || 0;
      const bTime = b.uploadedAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return { success: true, data: images };
  } catch (error) {
    console.error("Error getting shop images:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete shop image metadata
 */
export const deleteShopImage = async (imageId) => {
  try {
    await deleteDoc(doc(db, "shopImages", imageId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting shop image:", error);
    return { success: false, error: error.message };
  }
};

// ==================== SHOP VIDEO OPERATIONS ====================

/**
 * Save shop video metadata
 */
export const saveShopVideo = async (shopId, videoData) => {
  try {
    const videoRef = await addDoc(collection(db, "shopVideos"), {
      shopId,
      ...videoData,
      uploadedAt: serverTimestamp(),
    });
    return { success: true, videoId: videoRef.id };
  } catch (error) {
    console.error("Error saving shop video:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get shop video
 */
export const getShopVideo = async (shopId) => {
  try {
    const q = query(
      collection(db, "shopVideos"),
      where("shopId", "==", shopId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { success: true, data: { id: doc.id, ...doc.data() } };
    }
    return { success: false, error: "Video not found" };
  } catch (error) {
    console.error("Error getting shop video:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete shop video metadata
 */
export const deleteShopVideo = async (videoId) => {
  try {
    await deleteDoc(doc(db, "shopVideos", videoId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting shop video:", error);
    return { success: false, error: error.message };
  }
};

// ==================== PRODUCT IMAGE OPERATIONS ====================

/**
 * Save product image metadata
 */
export const saveProductImage = async (shopId, productName, imageData) => {
  try {
    const imageRef = await addDoc(collection(db, "productImages"), {
      shopId,
      productName,
      ...imageData,
      uploadedAt: serverTimestamp(),
    });
    return { success: true, imageId: imageRef.id };
  } catch (error) {
    console.error("Error saving product image:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get product images for a shop
 */
export const getProductImages = async (shopId) => {
  try {
    const q = query(
      collection(db, "productImages"),
      where("shopId", "==", shopId)
      // orderBy("uploadedAt", "desc") - requires index, sorting in memory instead
    );
    const querySnapshot = await getDocs(q);
    const images = [];
    querySnapshot.forEach((doc) => {
      images.push({ id: doc.id, ...doc.data() });
    });

    // Sort in memory
    images.sort((a, b) => {
      const aTime = a.uploadedAt?.toMillis?.() || 0;
      const bTime = b.uploadedAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return { success: true, data: images };
  } catch (error) {
    console.error("Error getting product images:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete product image metadata
 */
export const deleteProductImage = async (imageId) => {
  try {
    await deleteDoc(doc(db, "productImages", imageId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting product image:", error);
    return { success: false, error: error.message };
  }
};

// ==================== VISITOR COUNT OPERATIONS ====================

/**
 * Increment visitor count for a shop
 */
export const incrementVisitorCount = async (shopId) => {
  try {
    const shopRef = doc(db, "shops", shopId);
    const shopDoc = await getDoc(shopRef);

    if (shopDoc.exists()) {
      const currentVisitors = shopDoc.data().visitors || 0;
      await updateDoc(shopRef, {
        visitors: currentVisitors + 1,
      });
      return { success: true, count: currentVisitors + 1 };
    }
    return { success: false, error: "Shop not found" };
  } catch (error) {
    console.error("Error incrementing visitor count:", error);
    return { success: false, error: error.message };
  }
};
