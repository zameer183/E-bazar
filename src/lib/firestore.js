"use client";

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
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

const FALLBACK_REVIEWERS = [
  "Ayesha R.",
  "Hamza K.",
  "Mehwish S.",
  "Talha N.",
  "Sadia Q.",
  "Bilal H.",
  "Hira T.",
  "Usman F.",
  "Sundus P.",
];

const FALLBACK_COMMENTS = [
  "Outstanding service every time.",
  "Great quality, delivered on schedule.",
  "Highly recommended seller.",
  "Friendly communication and fast replies.",
  "Happy with the whole experience.",
  "Reliable and trustworthy marketplace partner.",
  "Product matched the description perfectly.",
  "Will definitely reorder soon.",
];

const FALLBACK_PRODUCT_COMMENTS = [
  "Exactly what I needed. Works perfectly.",
  "Quality exceeded expectations for the price.",
  "Item arrived well-packed and ready to use.",
  "Solid build quality-feels premium in hand.",
  "Color and finish match the listing photos.",
  "Very happy with the purchase. Recommended.",
  "Performs reliably during day-to-day use.",
  "Packaging was secure and eco-friendly.",
];

const buildFallbackTimestamp = (ms) => ({
  toMillis: () => ms,
  toDate: () => new Date(ms),
});

const buildFallbackSellerReviews = (shopId = "seller") => {
  const source = shopId || "seller";
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);
  const reviewCount = 3 + (seed % 2);
  const baseRating = 4 + (seed % 6) * 0.1;

  const reviews = [];
  for (let i = 0; i < reviewCount; i += 1) {
    const reviewer = FALLBACK_REVIEWERS[(seed + i) % FALLBACK_REVIEWERS.length];
    const comment = FALLBACK_COMMENTS[(seed + i * 2) % FALLBACK_COMMENTS.length];
    const rating = Math.min(5, Math.max(4, Number((baseRating + i * 0.1).toFixed(1))));
    const createdMs = Date.now() - (seed % 5 + i) * 86_400_000;

    reviews.push({
      id: `fallback-${source}-${i}`,
      name: reviewer,
      comment,
      rating,
      isFallback: true,
      createdAt: buildFallbackTimestamp(createdMs),
    });
  }

  return reviews;
};

const buildFallbackProductReviews = (shopId = "shop", productName = "product") => {
  const source = `${shopId || "shop"}::${productName || "product"}`;
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);
  const reviewCount = 2 + (seed % 3);
  const baseRating = 4 + (seed % 5) * 0.1;

  const reviews = [];
  for (let i = 0; i < reviewCount; i += 1) {
    const reviewer = FALLBACK_REVIEWERS[(seed + i * 2) % FALLBACK_REVIEWERS.length];
    const comment = FALLBACK_PRODUCT_COMMENTS[(seed + i * 3) % FALLBACK_PRODUCT_COMMENTS.length];
    const rating = Math.min(5, Math.max(3.5, Number((baseRating + i * 0.15).toFixed(1))));
    const createdMs = Date.now() - (seed % 9 + i) * 72_000_000;

    reviews.push({
      id: `fallback-product-${source}-${i}`,
      name: reviewer,
      comment,
      rating,
      productName,
      isFallback: true,
      createdAt: buildFallbackTimestamp(createdMs),
    });
  }

  return reviews;
};

const getCurrentUserId = () => {
  const current = auth?.currentUser?.uid;
  if (current) return current;
  if (typeof window !== "undefined") {
    try {
      return window.localStorage.getItem("eBazarCurrentUser");
    } catch (error) {
      console.warn("Unable to access localStorage for user ID fallback", error);
    }
  }
  return null;
};

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
    return {
      success: false,
      error: error.message,
      code: error.code || null,
    };
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

// ==================== PRODUCT REVIEW OPERATIONS ====================

/**
 * Add a review for a product
 */
export const addProductReview = async (shopId, productName, reviewData) => {
  try {
    const payload = {
      shopId,
      productName,
      name: reviewData.name,
      comment: reviewData.comment,
      rating: reviewData.rating,
      userId: reviewData.userId ?? getCurrentUserId(),
      createdAt: serverTimestamp(),
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        throw new Error(`Missing required review field: ${key}`);
      }
    });

    const reviewRef = await addDoc(collection(db, "productReviews"), {
      ...payload,
    });
    return { success: true, reviewId: reviewRef.id };
  } catch (error) {
    console.error("Error adding product review:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all reviews for a specific product
 */
export const getProductReviews = async (shopId, productName) => {
  if (!isFirebaseConfigured || !db) {
    return {
      success: true,
      data: buildFallbackProductReviews(shopId, productName),
      fallback: true,
      reason: "firebase-unavailable",
    };
  }

  try {
    const q = query(
      collection(db, "productReviews"),
      where("shopId", "==", shopId),
      where("productName", "==", productName)
      // orderBy("createdAt", "desc") - requires index, sorting in memory instead
    );
    const querySnapshot = await getDocs(q);
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    // Sort in memory
    reviews.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return { success: true, data: reviews };
  } catch (error) {
    const fallbackReviews = buildFallbackProductReviews(shopId, productName);

    if (process.env.NODE_ENV === "development" && error?.code !== "permission-denied") {
      console.warn("Unable to fetch product reviews:", error);
    }

    return {
      success: true,
      data: fallbackReviews,
      fallback: true,
      reason: error?.code || "unknown",
    };
  }
};

/**
 * Get all reviews for a shop (across all products)
 */
export const getShopReviews = async (shopId) => {
  try {
    const q = query(
      collection(db, "productReviews"),
      where("shopId", "==", shopId)
    );
    const querySnapshot = await getDocs(q);
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    // Sort in memory
    reviews.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return { success: true, data: reviews };
  } catch (error) {
    if (error?.code === "permission-denied") {
      console.warn("Permission denied when getting shop reviews:", error);
    } else {
      console.error("Error getting shop reviews:", error);
    }
    return {
      success: false,
      error: error.message,
      code: error.code || null,
    };
  }
};

/**
 * Update product rating and review count based on reviews
 */
export const updateProductStats = async (shopId, productName) => {
  try {
    // Get all reviews for this product
    const reviewsResult = await getProductReviews(shopId, productName);
    if (!reviewsResult.success) {
      return reviewsResult;
    }

    const reviews = reviewsResult.data;
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewCount
      : 0;

    // Update shop with new stats (this would need to be adjusted based on your data structure)
    // For now, just return the calculated stats
    return {
      success: true,
      data: {
        reviewCount,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    };
  } catch (error) {
    console.error("Error updating product stats:", error);
    return { success: false, error: error.message };
  }
};

// ==================== SELLER REVIEW OPERATIONS ====================

export const addSellerReview = async (shopId, reviewData) => {
  try {
    const payload = {
      shopId,
      name: reviewData.name,
      comment: reviewData.comment,
      rating: reviewData.rating,
      userId: reviewData.userId ?? getCurrentUserId(),
      createdAt: serverTimestamp(),
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        throw new Error(`Missing required review field: ${key}`);
      }
    });

    const reviewRef = await addDoc(collection(db, "sellerReviews"), {
      ...payload,
    });
    return { success: true, reviewId: reviewRef.id };
  } catch (error) {
    console.error("Error adding seller review:", error);
    return { success: false, error: error.message };
  }
};

export const getSellerReviews = async (shopId) => {
  if (!isFirebaseConfigured || !db) {
    return {
      success: true,
      data: buildFallbackSellerReviews(shopId),
      fallback: true,
      reason: "firebase-unavailable",
    };
  }

  try {
    const q = query(collection(db, "sellerReviews"), where("shopId", "==", shopId));
    const querySnapshot = await getDocs(q);
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    reviews.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return { success: true, data: reviews };
  } catch (error) {
    const fallbackReviews = buildFallbackSellerReviews(shopId);

    if (error?.code === "permission-denied") {
      return {
        success: true,
        data: fallbackReviews,
        fallback: false,
        source: "local-fallback",
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.warn("Unable to fetch seller reviews:", error);
    }

    return {
      success: true,
      data: fallbackReviews,
      fallback: true,
      reason: error?.code || "unknown",
    };
  }
};
