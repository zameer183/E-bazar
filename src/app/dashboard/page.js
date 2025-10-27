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

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = (shopId = null) => {
    try {
      if (typeof window === "undefined") return;
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        router.push("/register");
        return;
      }
      const shops = JSON.parse(stored);
      if (shops.length === 0) {
        router.push("/register");
        return;
      }

      setAllShops(shops);

      // Select shop by ID or default to most recent
      const currentShop = shopId
        ? shops.find(s => s.id === shopId) || shops[shops.length - 1]
        : shops[shops.length - 1];

      setShop(currentShop);
      setSelectedShopId(currentShop.id);
      setFormData({
        name: currentShop.name,
        contact: currentShop.contact,
        address: currentShop.address,
        description: currentShop.description,
      });
      // Load images from localStorage
      const storedImages = window.localStorage.getItem(`${STORAGE_KEY}_images_${currentShop.id}`);
      if (storedImages) {
        setShopImages(JSON.parse(storedImages));
      } else {
        setShopImages([]);
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

  const handleSave = () => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const shops = JSON.parse(stored);
      const updatedShops = shops.map((s) =>
        s.id === shop.id
          ? { ...s, ...formData }
          : s
      );
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShops));
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          id: Date.now(),
          data: reader.result,
          name: file.name,
        };
        const updatedImages = [...shopImages, newImage];
        setShopImages(updatedImages);
        window.localStorage.setItem(
          `${STORAGE_KEY}_images_${shop.id}`,
          JSON.stringify(updatedImages)
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (imageId) => {
    const updatedImages = shopImages.filter((img) => img.id !== imageId);
    setShopImages(updatedImages);
    window.localStorage.setItem(
      `${STORAGE_KEY}_images_${shop.id}`,
      JSON.stringify(updatedImages)
    );
  };

  const handleDeleteShop = () => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const shops = JSON.parse(stored);
      const updatedShops = shops.filter((s) => s.id !== shop.id);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShops));
      // Also delete shop images
      window.localStorage.removeItem(`${STORAGE_KEY}_images_${shop.id}`);
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
                  <img src={image.data} alt={image.name} />
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
