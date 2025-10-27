"use client";

import { BASE_CITY_MARKETS } from "@/data/markets";
import { db, isFirebaseConfigured } from "./firebase";
import { collection, addDoc, serverTimestamp, writeBatch, doc, getDocs, deleteDoc } from "firebase/firestore";

/**
 * Seed mock shop data to Firebase Firestore
 */
export const seedMockShops = async (onProgress) => {
  if (!isFirebaseConfigured || !db) {
    const message = "Firestore is unavailable. Configure Firebase before seeding data.";
    return { success: false, error: message, message };
  }
  try {
    if (BASE_CITY_MARKETS.length === 0) {
      const message = "No base city data is available to seed.";
      return { success: false, error: message, message };
    }
    const totalShops = BASE_CITY_MARKETS.reduce((acc, city) => {
      return acc + Object.values(city.industries || {}).reduce((sum, industry) => {
        return sum + (industry.sellers?.length || 0);
      }, 0);
    }, 0);

    let processedShops = 0;
    if (onProgress) {
      onProgress({ status: "Starting seed process...", progress: 0 });
    }

    // Create a fake admin user ID for mock data
    const MOCK_ADMIN_ID = "mock-admin-user";

    for (const city of BASE_CITY_MARKETS) {
      for (const [categorySlug, industry] of Object.entries(city.industries || {})) {
        const sellers = industry.sellers || [];

        for (const seller of sellers) {
          // Create shop document
          const shopData = {
            ownerId: MOCK_ADMIN_ID, // Mock admin owns all seed data
            name: seller.name,
            city: city.name,
            citySlug: city.slug,
            category: industry.name,
            categorySlug: categorySlug,
            contact: seller.contact,
            address: seller.address,
            plan: seller.plan === "Featured Store" ? "premium" :
                  seller.plan === "Premium Partner" ? "premium" :
                  seller.plan === "Standard Partner" ? "standard" : "free",
            planLabel: seller.plan,
            slug: seller.slug,
            description: seller.description,
            products: seller.products || [],
            rating: seller.rating || 0,
            reviews: seller.reviews || 0,
            visitors: Math.floor(Math.random() * 1000),
            subcategoryFocus: seller.subcategoryFocus,
            shopImage: seller.shopImage,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };

          await addDoc(collection(db, "shops"), shopData);

          processedShops++;
          const progress = Math.round((processedShops / totalShops) * 100);
          if (onProgress) {
            onProgress({
              status: `Added ${seller.name} in ${city.name}`,
              progress,
              current: processedShops,
              total: totalShops,
            });
          }
        }
      }
    }

    return {
      success: true,
      message: `Successfully seeded ${processedShops} shops!`,
      count: processedShops
    };
  } catch (error) {
    console.error("Error seeding mock shops:", error);
    return {
      success: false,
      error: error.message,
      message: `Failed to seed data: ${error.message}`
    };
  }
};

/**
 * Clear all mock shop data from Firestore
 */
export const clearMockShops = async (onProgress) => {
  if (!isFirebaseConfigured || !db) {
    const message = "Firestore is unavailable. Configure Firebase before clearing data.";
    return { success: false, error: message, message };
  }
  try {
    if (onProgress) {
      onProgress({ status: "Fetching all shops...", progress: 0 });
    }

    // Get all shops
    const shopsSnapshot = await getDocs(collection(db, "shops"));
    const total = shopsSnapshot.size;

    if (total === 0) {
      return {
        success: true,
        message: "No shops to delete",
        count: 0
      };
    }

    let deleted = 0;

    // Delete in batches
    let batch = writeBatch(db);
    let batchCount = 0;

    for (const shopDoc of shopsSnapshot.docs) {
      batch.delete(doc(db, "shops", shopDoc.id));
      batchCount += 1;
      deleted += 1;

      // Firestore batch limit is 500 operations
      if (batchCount === 500) {
        await batch.commit();
        batch = writeBatch(db);
        batchCount = 0;
      }

      const progress = Math.round((deleted / total) * 100);
      if (onProgress) {
        onProgress({
          status: `Deleting shop ${deleted}/${total}...`,
          progress,
          current: deleted,
          total,
        });
      }
    }

    // Commit remaining operations
    if (batchCount > 0) {
      await batch.commit();
    }

    // Also clear shop images
    if (onProgress) {
      onProgress({ status: "Clearing shop images...", progress: 95 });
    }
    const imagesSnapshot = await getDocs(collection(db, "shopImages"));
    for (const imageDoc of imagesSnapshot.docs) {
      await deleteDoc(doc(db, "shopImages", imageDoc.id));
    }

    // Clear videos
    const videosSnapshot = await getDocs(collection(db, "shopVideos"));
    for (const videoDoc of videosSnapshot.docs) {
      await deleteDoc(doc(db, "shopVideos", videoDoc.id));
    }

    // Clear product images
    const productImagesSnapshot = await getDocs(collection(db, "productImages"));
    for (const productImageDoc of productImagesSnapshot.docs) {
      await deleteDoc(doc(db, "productImages", productImageDoc.id));
    }

    return {
      success: true,
      message: `Successfully deleted ${deleted} shops and related data!`,
      count: deleted
    };
  } catch (error) {
    console.error("Error clearing mock shops:", error);
    return {
      success: false,
      error: error.message,
      message: `Failed to clear data: ${error.message}`
    };
  }
};

/**
 * Get statistics about current data
 */
export const getDataStats = async () => {
  if (!isFirebaseConfigured || !db) {
    return {
      success: false,
      error: "Firestore is unavailable. Configure Firebase before fetching stats.",
    };
  }
  try {
    const shopsSnapshot = await getDocs(collection(db, "shops"));
    const imagesSnapshot = await getDocs(collection(db, "shopImages"));
    const videosSnapshot = await getDocs(collection(db, "shopVideos"));
    const productImagesSnapshot = await getDocs(collection(db, "productImages"));

    return {
      success: true,
      stats: {
        shops: shopsSnapshot.size,
        shopImages: imagesSnapshot.size,
        shopVideos: videosSnapshot.size,
        productImages: productImagesSnapshot.size,
      }
    };
  } catch (error) {
    console.error("Error getting data stats:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
