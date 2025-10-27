"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import { STORAGE_KEY } from "@/data/markets";
import styles from "./page.module.css";

export default function SellerDashboard() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    description: "",
  });
  const [shopImages, setShopImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [shopVideo, setShopVideo] = useState(null);
  const [videoError, setVideoError] = useState("");
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async (shopId = null) => {
    try {
      if (typeof window === "undefined") return;

      // Get current user from Firebase
      const { getCurrentUser } = await import("@/lib/auth");
      const currentUser = getCurrentUser();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      // Fetch shops from Firestore
      const { getShopsByOwner } = await import("@/lib/firestore");
      const result = await getShopsByOwner(currentUser.uid);

      if (!result.success) {
        console.error("Error loading shops:", result.error);
        setLoading(false);
        return;
      }

      const shops = result.data;

      if (shops.length === 0) {
        router.push("/register");
        return;
      }

      setAllShops(shops);

      // Select shop by ID or default to most recent
      const currentShop = shopId
        ? shops.find(s => s.id === shopId) || shops[0]
        : shops[0];

      setShop(currentShop);
      setSelectedShopId(currentShop.id);
      setFormData({
        name: currentShop.name,
        contact: currentShop.contact,
        address: currentShop.address,
        description: currentShop.description,
      });

      // Load images from Firestore
      const { getShopImages } = await import("@/lib/firestore");
      const imagesResult = await getShopImages(currentShop.id);
      if (imagesResult.success) {
        setShopImages(imagesResult.data);
      } else {
        setShopImages([]);
      }

      // Load video from Firestore
      const { getShopVideo } = await import("@/lib/firestore");
      const videoResult = await getShopVideo(currentShop.id);
      if (videoResult.success) {
        setShopVideo(videoResult.data);
      } else {
        setShopVideo(null);
      }

      // Load product images from Firestore
      const { getProductImages } = await import("@/lib/firestore");
      const productImagesResult = await getProductImages(currentShop.id);
      if (productImagesResult.success) {
        setProductImages(productImagesResult.data);
      } else {
        setProductImages([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading shop data:", error);
      setLoading(false);
    }
  };

  const handleShopSwitch = (shopId) => {
    setIsEditing(false);
    loadShopData(shopId);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: shop.name,
      contact: shop.contact,
      address: shop.address,
      description: shop.description,
    });
  };

  const handleSave = async () => {
    try {
      // Update in Firestore
      const { updateShop } = await import("@/lib/firestore");
      const result = await updateShop(shop.id, formData);

      if (!result.success) {
        alert("Failed to update shop details. Please try again.");
        return;
      }

      setShop({ ...shop, ...formData });
      setIsEditing(false);
      alert("Shop details updated successfully!");
    } catch (error) {
      console.error("Error saving shop data:", error);
      alert("Failed to update shop details. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if free package and already has 1 image
      if (shop.plan === "free" && shopImages.length >= 1) {
        alert("Free package users can only upload 1 shop image. Upgrade to Standard or Premium for unlimited images.");
        return;
      }

      try {
        // Upload to Firebase Storage
        const { uploadShopImage } = await import("@/lib/storage");
        const { saveShopImage } = await import("@/lib/firestore");

        const result = await uploadShopImage(shop.id, file);

        if (!result.success) {
          alert("Failed to upload image. Please try again.");
          return;
        }

        // Save metadata to Firestore
        const imageData = {
          imageUrl: result.url,
          name: file.name,
        };

        const saveResult = await saveShopImage(shop.id, imageData);

        if (!saveResult.success) {
          alert("Failed to save image data. Please try again.");
          return;
        }

        // Update local state
        const newImage = {
          id: saveResult.imageId,
          imageUrl: result.url,
          name: file.name,
        };
        const updatedImages = [...shopImages, newImage];
        setShopImages(updatedImages);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      // Find the image to get its URL
      const image = shopImages.find(img => img.id === imageId);
      if (!image) return;

      // Delete from Firebase Storage
      const { deleteShopImage: deleteStorageImage } = await import("@/lib/storage");
      await deleteStorageImage(image.imageUrl);

      // Delete metadata from Firestore
      const { deleteShopImage } = await import("@/lib/firestore");
      await deleteShopImage(imageId);

      // Update local state
      const updatedImages = shopImages.filter((img) => img.id !== imageId);
      setShopImages(updatedImages);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    setVideoError("");

    if (file) {
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        setVideoError("Please upload a valid video file");
        return;
      }

      // Check video duration
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = async function() {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;

        if (duration > 10) {
          setVideoError("Video must be 10 seconds or less");
          return;
        }

        try {
          // Upload to Firebase Storage
          const { uploadShopVideo } = await import("@/lib/storage");
          const { saveShopVideo } = await import("@/lib/firestore");

          const result = await uploadShopVideo(shop.id, file, (progress) => {
            // Optional: Add progress indicator here
            console.log(`Upload progress: ${progress}%`);
          });

          if (!result.success) {
            setVideoError("Failed to upload video. Please try again.");
            return;
          }

          // Save metadata to Firestore
          const videoData = {
            videoUrl: result.url,
            name: file.name,
            duration: duration,
          };

          const saveResult = await saveShopVideo(shop.id, videoData);

          if (!saveResult.success) {
            setVideoError("Failed to save video data. Please try again.");
            return;
          }

          // Update local state
          const newVideo = {
            id: saveResult.videoId,
            videoUrl: result.url,
            name: file.name,
            duration: duration,
          };
          setShopVideo(newVideo);
        } catch (error) {
          console.error("Error uploading video:", error);
          setVideoError("Failed to upload video. Please try again.");
        }
      };

      video.src = URL.createObjectURL(file);
    }
  };

  const handleDeleteVideo = async () => {
    try {
      if (!shopVideo) return;

      // Delete from Firebase Storage if it's a URL
      if (shopVideo.videoUrl && shopVideo.videoUrl.startsWith('http')) {
        const { deleteFile } = await import("@/lib/storage");
        await deleteFile(shopVideo.videoUrl);
      } else if (shopVideo.data && shopVideo.data.startsWith('http')) {
        // Backward compatibility
        const { deleteFile } = await import("@/lib/storage");
        await deleteFile(shopVideo.data);
      }

      // Delete metadata from Firestore
      const { deleteShopVideo } = await import("@/lib/firestore");
      await deleteShopVideo(shop.id);

      // Clear local state
      setShopVideo(null);

      // Also remove from localStorage for compatibility
      window.localStorage.removeItem(`${STORAGE_KEY}_video_${shop.id}`);
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video. Please try again.");
    }
  };

  const handleProductImageUpload = async (e, productName) => {
    const file = e.target.files[0];
    if (file) {
      // Check if free package and already has 2 images for this product
      const currentProductImages = productImages.filter(img => img.productName === productName);
      if (shop.plan === "free" && currentProductImages.length >= 2) {
        alert("Free package users can only upload 2 images per product. Upgrade to Standard or Premium for unlimited images.");
        return;
      }

      try {
        // Upload to Firebase Storage
        const { uploadProductImage } = await import("@/lib/storage");
        const { saveProductImage } = await import("@/lib/firestore");

        const result = await uploadProductImage(shop.id, productName, file);

        if (!result.success) {
          alert("Failed to upload product image. Please try again.");
          return;
        }

        // Save metadata to Firestore
        const imageData = {
          imageUrl: result.url,
          name: file.name,
          productName: productName,
        };

        const saveResult = await saveProductImage(shop.id, imageData);

        if (!saveResult.success) {
          alert("Failed to save product image data. Please try again.");
          return;
        }

        // Update local state
        const newImage = {
          id: saveResult.imageId,
          imageUrl: result.url,
          name: file.name,
          productName: productName,
        };
        const updatedImages = [...productImages, newImage];
        setProductImages(updatedImages);
      } catch (error) {
        console.error("Error uploading product image:", error);
        alert("Failed to upload product image. Please try again.");
      }
    }
  };

  const handleDeleteProductImage = async (imageId) => {
    try {
      // Find the image to get its URL
      const image = productImages.find(img => img.id === imageId);
      if (!image) return;

      // Delete from Firebase Storage if it's a URL
      if (image.imageUrl && image.imageUrl.startsWith('http')) {
        const { deleteFile } = await import("@/lib/storage");
        await deleteFile(image.imageUrl);
      } else if (image.data && image.data.startsWith('http')) {
        // Backward compatibility
        const { deleteFile } = await import("@/lib/storage");
        await deleteFile(image.data);
      }

      // Delete metadata from Firestore
      const { deleteProductImage } = await import("@/lib/firestore");
      await deleteProductImage(imageId);

      // Update local state
      const updatedImages = productImages.filter((img) => img.id !== imageId);
      setProductImages(updatedImages);

      // Also update localStorage for compatibility
      window.localStorage.setItem(
        `${STORAGE_KEY}_product_images_${shop.id}`,
        JSON.stringify(updatedImages)
      );
    } catch (error) {
      console.error("Error deleting product image:", error);
      alert("Failed to delete product image. Please try again.");
    }
  };

  const handleDeleteShop = async () => {
    try {
      // Delete from Firestore
      const { deleteShop } = await import("@/lib/firestore");
      const result = await deleteShop(shop.id);

      if (!result.success) {
        alert("Failed to delete shop. Please try again.");
        return;
      }

      // Also delete shop images from localStorage (will migrate to Storage later)
      window.localStorage.removeItem(`${STORAGE_KEY}_images_${shop.id}`);
      window.localStorage.removeItem(`${STORAGE_KEY}_video_${shop.id}`);
      window.localStorage.removeItem(`${STORAGE_KEY}_product_images_${shop.id}`);

      router.push("/?deleted=1");
    } catch (error) {
      console.error("Error deleting shop:", error);
      alert("Failed to delete shop. Please try again.");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("eBazarLoggedIn");
      window.localStorage.removeItem("eBazarCurrentUser");
      setShowLogoutModal(false);
      setNotification({ show: true, message: "You have been logged out successfully!" });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  const incrementVisitorCount = () => {
    // This would normally be tracked from the shop page view
    // For demo purposes, we'll store it in localStorage
    const visitorKey = `${STORAGE_KEY}_visitors_${shop.id}`;
    const currentCount = parseInt(window.localStorage.getItem(visitorKey) || "0");
    const newCount = currentCount + 1;
    window.localStorage.setItem(visitorKey, newCount.toString());
    return newCount;
  };

  const getVisitorCount = () => {
    if (!shop) return 0;
    const visitorKey = `${STORAGE_KEY}_visitors_${shop.id}`;
    return parseInt(window.localStorage.getItem(visitorKey) || "0");
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className={styles.error}>
        <h2>No shop found</h2>
        <Link href="/register">Register your shop</Link>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <Navbar />

      {/* Notification Toast */}
      {notification.show && (
        <div className={styles.notification}>
          <span className={styles.notificationIcon}>✓</span>
          <span className={styles.notificationMessage}>{notification.message}</span>
        </div>
      )}

      <div className={styles.dashboardLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>My Shops</h2>
            <Link href="/register" className={styles.addShopButton}>
              + Add Shop
            </Link>
          </div>
          <nav className={styles.shopList}>
            {allShops.map((s) => (
              <button
                key={s.id}
                onClick={() => handleShopSwitch(s.id)}
                className={`${styles.shopItem} ${s.id === selectedShopId ? styles.shopItemActive : ""}`}
              >
                <div className={styles.shopItemIcon}>
                  {s.category === "Clothes" ? "👔" : s.category === "Perfumes" ? "🌸" : "📱"}
                </div>
                <div className={styles.shopItemInfo}>
                  <h3>{s.name}</h3>
                  <p>{s.city} • {s.category}</p>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
        {/* Stats Overview */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👁️</div>
            <div className={styles.statInfo}>
              <h3>Total Visitors</h3>
              <p className={styles.statNumber}>{getVisitorCount()}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statInfo}>
              <h3>Rating</h3>
              <p className={styles.statNumber}>{shop.rating || "0.0"}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💬</div>
            <div className={styles.statInfo}>
              <h3>Reviews</h3>
              <p className={styles.statNumber}>{shop.reviews || 0}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statInfo}>
              <h3>Products</h3>
              <p className={styles.statNumber}>{shop.products?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Shop Information */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Shop Information</h2>
            {!isEditing ? (
              <button onClick={handleEdit} className={styles.editButton}>
                ✏️ Edit
              </button>
            ) : (
              <div className={styles.editActions}>
                <button onClick={handleSave} className={styles.saveButton}>
                  Save
                </button>
                <button onClick={handleCancel} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className={styles.shopInfo}>
            <div className={styles.infoRow}>
              <label>Shop Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <span>{shop.name}</span>
              )}
            </div>
            <div className={styles.infoRow}>
              <label>City:</label>
              <span>{shop.city}</span>
            </div>
            <div className={styles.infoRow}>
              <label>Category:</label>
              <span>{shop.category}</span>
            </div>
            <div className={styles.infoRow}>
              <label>Contact:</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <span>{shop.contact}</span>
              )}
            </div>
            <div className={styles.infoRow}>
              <label>Address:</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={3}
                />
              ) : (
                <span>{shop.address}</span>
              )}
            </div>
            <div className={styles.infoRow}>
              <label>Description:</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={4}
                />
              ) : (
                <span>{shop.description}</span>
              )}
            </div>
            <div className={styles.infoRow}>
              <label>Plan:</label>
              <span className={styles.planBadge}>{shop.planLabel}</span>
            </div>
          </div>
        </div>

        {/* Shop Images */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Shop Images</h2>
            <label className={styles.uploadButton}>
              📷 Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div className={styles.imageGrid}>
            {shopImages.length === 0 ? (
              <p className={styles.noImages}>No images uploaded yet. Add some to showcase your shop!</p>
            ) : (
              shopImages.map((image) => (
                <div key={image.id} className={styles.imageCard}>
                  <img src={image.imageUrl || image.data} alt={image.name} />
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className={styles.deleteImageButton}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shop Video */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Shop Video (Max 10 seconds)</h2>
            {!shopVideo && (
              <label className={styles.uploadButton}>
                🎥 Upload Video
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
          {videoError && (
            <div className={styles.errorMessage} style={{ marginBottom: "16px" }}>
              {videoError}
            </div>
          )}
          <div className={styles.videoContainer}>
            {shopVideo ? (
              <div className={styles.videoCard}>
                <video
                  src={shopVideo.videoUrl || shopVideo.data}
                  controls
                  className={styles.videoPlayer}
                >
                  Your browser does not support the video tag.
                </video>
                <button
                  onClick={handleDeleteVideo}
                  className={styles.deleteVideoButton}
                >
                  🗑️ Delete Video
                </button>
              </div>
            ) : (
              <p className={styles.noVideo}>No video uploaded yet. Add a short video (max 10 seconds) to showcase your shop!</p>
            )}
          </div>
        </div>

        {/* Product Images - Free Package Only */}
        {shop.plan === "free" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Product Images (Max 2 per product)</h2>
            </div>
            <div className={styles.productsList}>
              {shop.products && shop.products.length > 0 ? (
                shop.products.map((product, index) => {
                  // Handle both string products and object products
                  const productName = typeof product === 'string' ? product : product.name;
                  const productImgs = productImages.filter(img => img.productName === productName);
                  return (
                    <div key={`${productName}-${index}`} className={styles.productItem}>
                      <div className={styles.productHeader}>
                        <h3>{productName}</h3>
                        {productImgs.length < 2 && (
                          <label className={styles.uploadButtonSmall}>
                            📷 Add Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleProductImageUpload(e, productName)}
                              style={{ display: "none" }}
                            />
                          </label>
                        )}
                      </div>
                      <div className={styles.productImageGrid}>
                        {productImgs.length === 0 ? (
                          <p className={styles.noProductImages}>No images for this product yet. Add up to 2 images!</p>
                        ) : (
                          productImgs.map((image) => (
                            <div key={image.id} className={styles.productImageCard}>
                              <img src={image.imageUrl || image.data} alt={image.name} />
                              <button
                                onClick={() => handleDeleteProductImage(image.id)}
                                className={styles.deleteImageButton}
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className={styles.noProducts}>No products available for this shop.</p>
              )}
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className={styles.section}>
          <div className={styles.dangerZone}>
            <h2>Danger Zone</h2>
            <p>Once you delete your shop, there is no going back. Please be certain.</p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className={styles.deleteButton}
            >
              🗑️ Delete Shop
            </button>
          </div>
        </div>
      </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Delete Shop?</h2>
            <p>
              Are you sure you want to delete "{shop.name}"? This action cannot be undone.
              All your shop data, images, and statistics will be permanently removed.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleDeleteShop} className={styles.confirmDeleteButton}>
                Yes, Delete Shop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Logout Confirmation</h2>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleLogout} className={styles.confirmButton}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
