"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  uploadShopImage,
  deleteShopImage as deleteShopImageFile,
  uploadShopVideo,
  uploadProductImage,
  deleteFile,
} from "@/lib/storage";
import { STORAGE_KEY } from "@/data/markets";
import styles from "./page.module.css";

const PRODUCT_LIMITS = {
  free: 5,
  standard: 25,
  premium: Infinity,
};

const getProductLimit = (plan) => {
  if (!plan) return Infinity;
  const normalized = plan.toLowerCase();
  if (PRODUCT_LIMITS[normalized] !== undefined) {
    return PRODUCT_LIMITS[normalized];
  }
  if (normalized.includes("free")) return PRODUCT_LIMITS.free;
  if (normalized.includes("standard")) return PRODUCT_LIMITS.standard;
  if (normalized.includes("premium")) return PRODUCT_LIMITS.premium;
  return Infinity;
};

export default function SellerDashboard() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "info", layout: "toast" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    description: "",
  });
  const [shopImages, setShopImages] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [shopVideo, setShopVideo] = useState(null);
  const [videoError, setVideoError] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productPrices, setProductPrices] = useState({});
  const [savingProductPrices, setSavingProductPrices] = useState({});
  const [pendingProductName, setPendingProductName] = useState("");
  const [pendingProductPrice, setPendingProductPrice] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [productNameDraft, setProductNameDraft] = useState("");
  const [productPriceDraft, setProductPriceDraft] = useState("");
  const [productModalError, setProductModalError] = useState("");
  const [isDeletingAllProductImages, setIsDeletingAllProductImages] = useState(false);
  const [deletingProductImages, setDeletingProductImages] = useState({});
  const [deletingProducts, setDeletingProducts] = useState({});
  const [productDeleteTarget, setProductDeleteTarget] = useState(null);
  const [productImageDeleteTarget, setProductImageDeleteTarget] = useState(null);
  const [activeProductActions, setActiveProductActions] = useState(null);
  const notificationTimeoutRef = useRef(null);
  const firstProductImageInputRef = useRef(null);
  const syncShopInLocalStorage = useCallback(
    (entry) => {
      if (typeof window === "undefined" || !entry?.id) {
        return;
      }
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        const shops = stored ? JSON.parse(stored) : [];
        const index = shops.findIndex((item) => item.id === entry.id);
        if (index === -1) {
          shops.push(entry);
        } else {
          shops[index] = { ...shops[index], ...entry };
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
      } catch (error) {
        console.warn("Unable to sync shop metadata locally", error);
      }
    },
    []
  );

  const getProductName = (product) => {
    if (typeof product === "string") return product;
    if (product && typeof product === "object") return product.name || "";
    return "";
  };

  const productNamesFromShop = Array.isArray(shop?.products)
    ? shop.products.map(getProductName).filter(Boolean)
    : [];

  const productNamesFromImages = productImages.map((img) => img.productName).filter(Boolean);

  const allProductNames = Array.from(new Set([...productNamesFromShop, ...productNamesFromImages]));

  const productLimit = getProductLimit(shop?.plan || "");
  const productLimitReached = productLimit !== Infinity && allProductNames.length >= productLimit;
  const productLimitDisplay =
    productLimit === Infinity
      ? `${allProductNames.length} products (Unlimited)`
      : `${allProductNames.length}/${productLimit} products`;

  const showNotification = useCallback((message, type = "info", options = {}) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    setNotification({
      show: true,
      message,
      type,
      layout: options.layout === "modal" ? "modal" : "toast",
    });

    notificationTimeoutRef.current = setTimeout(() => {
      setNotification({ show: false, message: "", type: "info", layout: "toast" });
      notificationTimeoutRef.current = null;
    }, 4000);
  }, []);

  const loadShopData = useCallback(async (shopId = null) => {
    try {
      if (typeof window === "undefined") return;

      // Get current user from Firebase
      const { getCurrentUser, onAuthChange } = await import("@/lib/auth");
      let currentUser = getCurrentUser();

      if (!currentUser && typeof onAuthChange === "function") {
        currentUser = await new Promise((resolve) => {
          let resolved = false;
          let unsubscribe = () => {};
          const timeoutId = window.setTimeout(() => {
            if (resolved) return;
            resolved = true;
            unsubscribe();
            resolve(null);
          }, 3000);
          unsubscribe = onAuthChange((user) => {
            if (resolved) return;
            resolved = true;
            window.clearTimeout(timeoutId);
            unsubscribe();
            resolve(user);
          });
        });
      }

      if (!currentUser) {
        setLoading(false);
        router.push("/login");
        return;
      }

      if (currentUser?.uid) {
        window.localStorage.setItem("eBazarLoggedIn", "true");
        window.localStorage.setItem("eBazarCurrentUser", currentUser.uid);
      }

      // Fetch shops from Firestore
      const { getShopsByOwner } = await import("@/lib/firestore");
      const result = await getShopsByOwner(currentUser.uid);

      if (!result.success) {
        console.error("Error loading shops:", result.error);
        showNotification(
          "Unable to load your shops. Check your internet connection and Firebase rules.",
          "error",
          { layout: "modal" }
        );
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
      let productImagesData = [];
      if (productImagesResult.success) {
        productImagesData = productImagesResult.data;
        setProductImages(productImagesData);
      } else {
        setProductImages([]);
      }

      const priceMap = {};
      const shopProducts = Array.isArray(currentShop.products) ? currentShop.products : [];
      shopProducts.forEach((product) => {
        if (!product) return;
        if (typeof product === "string") {
          if (!(product in priceMap)) {
            priceMap[product] = "";
          }
        } else if (typeof product === "object") {
          const productName = product.name || "";
          if (productName) {
            const rawPrice = product.price;
            if (typeof rawPrice === "string") {
              priceMap[productName] = rawPrice.trim();
            } else if (rawPrice !== undefined && rawPrice !== null) {
              priceMap[productName] = String(rawPrice);
            } else {
              priceMap[productName] = "";
            }
          }
        }
      });

      productImagesData.forEach((image) => {
        const imageProductName = image?.productName;
        if (imageProductName && !(imageProductName in priceMap)) {
          priceMap[imageProductName] = "";
        }
      });

      setProductPrices(priceMap);
      setSavingProductPrices({});

      setLoading(false);
    } catch (error) {
      console.error("Error loading shop data:", error);
      showNotification(
        "We couldn't reach Firebase services. Please verify your network connection and that *.googleapis.com is accessible.",
        "error",
        { layout: "modal" }
      );
      setLoading(false);
    }
  }, [router, showNotification]);

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
        showNotification("Failed to update shop details. Please try again.", "error");
        return;
      }

      setShop({ ...shop, ...formData });
      setIsEditing(false);
      showNotification("Shop details updated successfully!", "success");
    } catch (error) {
      console.error("Error saving shop data:", error);
      showNotification("Failed to update shop details. Please try again.", "error");
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
        showNotification("Free package users can only upload 1 shop image. Upgrade to Standard or Premium for unlimited images.", "warning");
        return;
      }

      try {
        // Upload to Firebase Storage
        const { saveShopImage } = await import("@/lib/firestore");

        const result = await uploadShopImage(shop.id, file);

        if (!result.success) {
          showNotification("Failed to upload image. Please try again.", "error");
          return;
        }

        // Save metadata to Firestore
        const imageData = {
          imageUrl: result.url,
          name: file.name,
        };

        const saveResult = await saveShopImage(shop.id, imageData);

        if (!saveResult.success) {
          showNotification("Failed to upload image. Please try again.", "error");
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
        showNotification("Failed to upload image. Please try again.", "error");
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      // Find the image to get its URL
      const image = shopImages.find(img => img.id === imageId);
      if (!image) return;

      // Delete from Firebase Storage
      await deleteShopImageFile(image.imageUrl);

      // Delete metadata from Firestore
      const { deleteShopImage } = await import("@/lib/firestore");
      await deleteShopImage(imageId);

      // Update local state
      const updatedImages = shopImages.filter((img) => img.id !== imageId);
      setShopImages(updatedImages);
    } catch (error) {
      console.error("Error deleting image:", error);
      showNotification("Failed to delete image. Please try again.", "error");
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
          const { saveShopVideo } = await import("@/lib/firestore");

          const result = await uploadShopVideo(shop.id, file);

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
        await deleteFile(shopVideo.videoUrl);
      } else if (shopVideo.data && shopVideo.data.startsWith('http')) {
        // Backward compatibility
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
      showNotification("Failed to delete video. Please try again.", "error");
    }
  };

  const handleProductImageUpload = async (file, productName) => {
    if (!file) return false;

    const trimmedName = (productName || "").trim();
    if (!trimmedName) {
      showNotification("Please provide a product name before uploading an image.", "warning");
      return false;
    }

    // Check if free package and already has 2 images for this product
    const currentProductImages = productImages.filter(img => img.productName === trimmedName);
    if (shop.plan === "free" && currentProductImages.length >= 2) {
      showNotification("Free package users can only upload 2 images per product. Upgrade to Standard or Premium for unlimited images.", "warning");
      return false;
    }

    try {
      // Upload to Firebase Storage
      const { saveProductImage } = await import("@/lib/firestore");

      const result = await uploadProductImage(shop.id, trimmedName, file);

      if (!result.success) {
        showNotification("Failed to upload product image. Please try again.", "error");
        return false;
      }

      // Save metadata to Firestore
      const imageData = {
        imageUrl: result.url,
        name: file.name,
        productName: trimmedName,
      };

      const saveResult = await saveProductImage(shop.id, trimmedName, imageData);

      if (!saveResult.success) {
        showNotification("Failed to upload product image. Please try again.", "error");
        return false;
      }

      // Update local state
      const newImage = {
        id: saveResult.imageId,
        imageUrl: result.url,
        name: file.name,
        productName: trimmedName,
      };
      const updatedImages = [...productImages, newImage];
      setProductImages(updatedImages);
      setProductPrices((prev) =>
        trimmedName in prev ? prev : { ...prev, [trimmedName]: "" }
      );
      return true;
    } catch (error) {
      console.error("Error uploading product image:", error);
      showNotification("Failed to upload product image. Please try again.", "error");
      return false;
    }
  };

  const handleTriggerFirstProductImageUpload = () => {
    if (!shop) {
      showNotification("Select a shop before uploading products.", "warning");
      return;
    }

    if (productLimitReached) {
      showNotification(
        `You've reached the ${productLimit === Infinity ? "unlimited" : productLimit} product limit for your current plan. Upgrade to add more products.`,
        "warning",
        { layout: "modal" }
      );
      return;
    }

    setProductModalError("");
    setProductNameDraft("");
    setProductPriceDraft("");
    setShowProductModal(true);
  };

  const ensureProductEntry = async (productName, priceValue = "") => {
    if (!shop) {
      showNotification("Select a shop before uploading products.", "warning");
      return false;
    }

    const currentProducts = Array.isArray(shop.products) ? [...shop.products] : [];
    const existingIndex = currentProducts.findIndex(
      (product) => getProductName(product).toLowerCase() === productName.toLowerCase()
    );
    const existingCount = currentProducts.reduce((count, product) => {
      const name = getProductName(product);
      if (!name) return count;
      return count + 1;
    }, 0);
    const existingTotal = Math.max(existingCount, allProductNames.length);

    const priceTrimmed = priceValue.trim();
    let updatedProducts = currentProducts;
    let hasChanges = false;

    if (existingIndex === -1) {
      const productLimit = getProductLimit(shop.plan || "");
      if (productLimit !== Infinity && existingTotal >= productLimit) {
        showNotification(
          `You've reached the ${productLimit} product limit for your current plan. Upgrade to add more products.`,
          "warning",
          { layout: "modal" }
        );
        return false;
      }

      const entry = priceTrimmed
        ? { name: productName, price: priceTrimmed }
        : productName;
      updatedProducts = [...currentProducts, entry];
      hasChanges = true;
    } else if (priceTrimmed) {
      const existing = currentProducts[existingIndex];
      const existingPrice =
        typeof existing === "string" ? "" : (existing?.price || "").trim();

      if (existingPrice !== priceTrimmed) {
        updatedProducts = currentProducts.map((product, idx) => {
          if (idx !== existingIndex) return product;
          if (typeof product === "string") {
            return { name: productName, price: priceTrimmed };
          }
          return { ...product, price: priceTrimmed };
        });
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      setProductPrices((prev) => ({
        ...prev,
        [productName]: priceTrimmed || prev[productName] || "",
      }));
      return true;
    }

    try {
      const { updateShop } = await import("@/lib/firestore");
      const result = await updateShop(shop.id, { products: updatedProducts });

      if (!result.success) {
        if (result.code === "permission-denied") {
          setShop((prev) => (prev ? { ...prev, products: updatedProducts } : prev));
          setAllShops((prev) =>
            prev.map((s) => (s.id === shop.id ? { ...s, products: updatedProducts } : s))
          );
          setProductPrices((prev) => ({
            ...prev,
            [productName]: priceTrimmed || prev[productName] || "",
          }));
          syncShopInLocalStorage({ ...shop, products: updatedProducts });
          showNotification(
            "Products were saved locally. Update your Firestore permissions to sync them to the cloud.",
            "warning",
            { layout: "modal" }
          );
          return true;
        }
        showNotification("Failed to update products. Please try again.", "error");
        return false;
      }

      setShop((prev) => (prev ? { ...prev, products: updatedProducts } : prev));
      setAllShops((prev) =>
        prev.map((s) => (s.id === shop.id ? { ...s, products: updatedProducts } : s))
      );
      setProductPrices((prev) => ({
        ...prev,
        [productName]: priceTrimmed || prev[productName] || "",
      }));
      syncShopInLocalStorage({ ...shop, products: updatedProducts });
      return true;
    } catch (error) {
      if (
        error?.code === "permission-denied" ||
        error?.message?.toLowerCase?.().includes("missing or insufficient permissions")
      ) {
        setShop((prev) => (prev ? { ...prev, products: updatedProducts } : prev));
        setAllShops((prev) =>
          prev.map((s) => (s.id === shop.id ? { ...s, products: updatedProducts } : s))
        );
        setProductPrices((prev) => ({
          ...prev,
          [productName]: priceTrimmed || prev[productName] || "",
        }));
        syncShopInLocalStorage({ ...shop, products: updatedProducts });
        showNotification(
          "Products were saved locally. Update your Firestore permissions to sync them to the cloud.",
          "warning",
          { layout: "modal" }
        );
        return true;
      }
      console.error("Error updating products:", error);
      showNotification("Failed to update products. Please try again.", "error");
      return false;
    }
  };

  const handleProductModalCancel = () => {
    setShowProductModal(false);
    setProductNameDraft("");
    setProductPriceDraft("");
    setProductModalError("");
  };

  const handleProductModalConfirm = async () => {
    const trimmedName = productNameDraft.trim();
    const trimmedPrice = productPriceDraft.trim();

    if (!trimmedName) {
      setProductModalError("Please enter a product name before continuing.");
      return;
    }

    const normalizedExisting = allProductNames.some(
      (name) => name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!normalizedExisting && productLimitReached) {
      setProductModalError(
        `You've reached the ${productLimit === Infinity ? "unlimited" : productLimit} product limit for your plan.`
      );
      return;
    }

    if (!normalizedExisting || trimmedPrice) {
      const ensured = await ensureProductEntry(trimmedName, trimmedPrice);
      if (!ensured) {
        setProductModalError("We couldn't save that product yet. Please try again.");
        return;
      }
    }

    setPendingProductName(trimmedName);
    setPendingProductPrice(trimmedPrice);
    setShowProductModal(false);
    setProductModalError("");
    setProductNameDraft("");
    setProductPriceDraft("");
    if (firstProductImageInputRef.current) {
      firstProductImageInputRef.current.click();
    } else {
      showNotification("Product saved. You can add images whenever you're ready.", "success");
    }
  };

  const handleFirstProductImageSelection = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      setPendingProductName("");
      setPendingProductPrice("");
      return;
    }

    const trimmedName = pendingProductName.trim();
    const trimmedPrice = pendingProductPrice.trim();
    setPendingProductName("");
    setPendingProductPrice("");

    if (!trimmedName) {
      showNotification("Product name is required to add an image.", "warning");
      return;
    }

    const normalizedExisting = allProductNames.some(
      (name) => name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!normalizedExisting && productLimitReached) {
      showNotification(
        `You've reached the ${productLimit === Infinity ? "unlimited" : productLimit} product limit for your plan. Upgrade to add more products.`,
        "warning",
        { layout: "modal" }
      );
      return;
    }

    if (!normalizedExisting || trimmedPrice) {
      const ensured = await ensureProductEntry(trimmedName, trimmedPrice);
      if (!ensured) {
        return;
      }
    }

    await handleProductImageUpload(file, trimmedName);
  };

  const handleDeleteAllProductImages = async () => {
    if (!shop) {
      showNotification("No shop selected.", "warning");
      return;
    }

    if (productImages.length === 0) {
      showNotification("There are no product images to delete.", "info");
      return;
    }

    if (typeof window !== "undefined") {
      const confirmDelete = window.confirm(
        "This will remove all product images for your shop. Continue?"
      );
      if (!confirmDelete) {
        return;
      }
    }

    try {
      const existingImages = [...productImages];
      setIsDeletingAllProductImages(true);
      const { deleteProductImage } = await import("@/lib/firestore");

      for (const image of existingImages) {
        const fileUrl = image.imageUrl || image.data;
        if (fileUrl && typeof fileUrl === "string" && fileUrl.startsWith("http")) {
          try {
            await deleteFile(fileUrl);
          } catch (error) {
            console.error("Error deleting product image file:", error);
          }
        }
        await deleteProductImage(image.id);
      }

      setProductImages([]);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `${STORAGE_KEY}_product_images_${shop.id}`,
          JSON.stringify([])
        );
      }
      showNotification("All product images have been deleted.", "success");
    } catch (error) {
      console.error("Error deleting all product images:", error);
      showNotification("Failed to delete product images. Please try again.", "error");
    } finally {
      setIsDeletingAllProductImages(false);
    }
  };

  const handleProductPriceChange = (productName, value) => {
    setProductPrices((prev) => ({
      ...prev,
      [productName]: value,
    }));
  };

  const handleSaveProductPrice = async (productName) => {
    if (!shop) {
      showNotification("No shop selected. Please load a shop first.", "warning");
      return;
    }

    if (!productName) {
      showNotification("Product name is required to update the price.", "warning");
      return;
    }

    const priceValue = (productPrices[productName] ?? "").trim();

    if (savingProductPrices[productName]) {
      return;
    }

    try {
      const currentProducts = Array.isArray(shop.products) ? shop.products : [];
      let existingPrice = null;

      for (const product of currentProducts) {
        if (!product) continue;
        if (typeof product === "string") {
          if (product === productName) {
            existingPrice = "";
            break;
          }
        } else if ((product.name || "") === productName) {
          existingPrice = (product.price || "").trim();
          break;
        }
      }

      if ((existingPrice ?? "") === priceValue) {
        showNotification("Price is already up to date.", "info");
        return;
      }

      setSavingProductPrices((prev) => ({ ...prev, [productName]: true }));

      let priceUpdated = false;

      const updatedProducts = currentProducts.map((product) => {
        if (!product) return product;

        if (typeof product === "string") {
          if (product === productName) {
            priceUpdated = true;
            return {
              name: productName,
              price: priceValue,
            };
          }
          return product;
        }

        const currentName = product.name || "";
        if (currentName === productName) {
          priceUpdated = true;
          return {
            ...product,
            price: priceValue,
          };
        }

        return product;
      });

      if (!priceUpdated) {
        updatedProducts.push({
          name: productName,
          price: priceValue,
        });
      }

      const { updateShop } = await import("@/lib/firestore");
      const result = await updateShop(shop.id, { products: updatedProducts });

      if (!result.success) {
        showNotification("Failed to save product price. Please try again.", "error");
        return;
      }

      setShop((prev) => (prev ? { ...prev, products: updatedProducts } : prev));
      setAllShops((prev) =>
        prev.map((s) => (s.id === shop.id ? { ...s, products: updatedProducts } : s))
      );
      setProductPrices((prev) => ({
        ...prev,
        [productName]: priceValue,
      }));
      showNotification("Product price updated successfully.", "success");
    } catch (error) {
      console.error("Error saving product price:", error);
      showNotification("Failed to save product price. Please try again.", "error");
    } finally {
      setSavingProductPrices((prev) => {
        if (!(productName in prev)) {
          return prev;
        }
        const updated = { ...prev };
        delete updated[productName];
        return updated;
      });
    }
  };

  const handleDeleteProductImagesByName = async (productName, options = {}) => {
    const { silent = false, imageIds = null } = options;
    if (!productName) return true;

    const selection = Array.isArray(imageIds) && imageIds.length > 0
      ? new Set(imageIds)
      : null;

    let imagesForProduct = productImages.filter(
      (img) => img.productName === productName
    );

    if (selection) {
      imagesForProduct = imagesForProduct.filter((img) => selection.has(img.id));
    }

    if (imagesForProduct.length === 0) {
      if (!silent) {
        const message = selection
          ? "Select at least one image to delete."
          : `No images to delete for ${productName}.`;
        showNotification(message, "info");
      }
      return selection ? false : true;
    }

    try {
      setDeletingProductImages((prev) => ({ ...prev, [productName]: true }));
      const { deleteProductImage } = await import("@/lib/firestore");

      for (const image of imagesForProduct) {
        const fileUrl = image.imageUrl || image.data;
        if (fileUrl && typeof fileUrl === "string" && fileUrl.startsWith("http")) {
          await deleteFile(fileUrl);
        }
        await deleteProductImage(image.id);
      }

      const idsToRemove = new Set(imagesForProduct.map((img) => img.id));
      const remainingImages = productImages.filter(
        (img) => !(img.productName === productName && idsToRemove.has(img.id))
      );
      setProductImages(remainingImages);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `${STORAGE_KEY}_product_images_${shop.id}`,
          JSON.stringify(remainingImages)
        );
      }

      if (!silent) {
        showNotification(`Deleted ${imagesForProduct.length} image(s) for ${productName}.`, "success");
      }
      return true;
    } catch (error) {
      console.error("Error deleting product images:", error);
      if (!silent) {
        showNotification("Failed to delete product images. Please try again.", "error");
      }
      return false;
    } finally {
      setDeletingProductImages((prev) => {
        if (!(productName in prev)) {
          return prev;
        }
        const updated = { ...prev };
        delete updated[productName];
        return updated;
      });
    }
  };

  const handleDeleteProduct = async (productName) => {
    const name = (productName || "").trim();
    if (!name || !shop?.id) {
      return;
    }

    setDeletingProducts((prev) => ({ ...prev, [name]: true }));

    try {
      await handleDeleteProductImagesByName(name, { silent: true });

      const currentProducts = Array.isArray(shop.products) ? shop.products : [];
      const updatedProducts = currentProducts.filter((product) => {
        if (!product) {
          return false;
        }
        if (typeof product === "string") {
          return product !== name;
        }
        const currentName = product.name || "";
        return currentName !== name;
      });

      const { updateShop } = await import("@/lib/firestore");
      const result = await updateShop(shop.id, { products: updatedProducts });

      if (!result.success) {
        if (result.code === "permission-denied") {
          setShop((prev) => (prev ? { ...prev, products: updatedProducts } : prev));
          setAllShops((prev) =>
            prev.map((s) => (s.id === shop.id ? { ...s, products: updatedProducts } : s))
          );
          setProductPrices((prev) => {
            const updated = { ...prev };
            delete updated[name];
            return updated;
          });
          syncShopInLocalStorage({ ...shop, products: updatedProducts });
          showNotification(
            "Product deleted locally. Update your Firestore permissions to sync with the cloud.",
            "warning",
            { layout: "modal" }
          );
          return;
        }

        showNotification("Failed to delete product. Please try again.", "error");
        return;
      }

      setShop((prev) => (prev ? { ...prev, products: updatedProducts } : prev));
      setAllShops((prev) =>
        prev.map((s) => (s.id === shop.id ? { ...s, products: updatedProducts } : s))
      );
      setProductPrices((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
      syncShopInLocalStorage({ ...shop, products: updatedProducts });
      showNotification(`Deleted product "${name}" successfully.`, "success");
    } catch (error) {
      if (
        error?.code === "permission-denied" ||
        error?.message?.toLowerCase?.().includes("missing or insufficient permissions")
      ) {
        const currentProducts = Array.isArray(shop.products) ? shop.products : [];
        const updatedProductsLocal = currentProducts.filter((product) => {
          if (!product) {
            return false;
          }
          if (typeof product === "string") {
            return product !== name;
          }
          const currentName = product.name || "";
          return currentName !== name;
        });

        setShop((prev) => (prev ? { ...prev, products: updatedProductsLocal } : prev));
        setAllShops((prev) =>
          prev.map((s) => (s.id === shop.id ? { ...s, products: updatedProductsLocal } : s))
        );
        setProductPrices((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
        syncShopInLocalStorage({ ...shop, products: updatedProductsLocal });
        showNotification(
          "Product deleted locally. Update your Firestore permissions to sync with the cloud.",
          "warning",
          { layout: "modal" }
        );
        return;
      }

      console.error("Error deleting product:", error);
      showNotification("Failed to delete product. Please try again.", "error");
    } finally {
      setDeletingProducts((prev) => {
        if (!(name in prev)) {
          return prev;
        }
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleProductDeleteRequest = (productName) => {
    const name = (productName || "").trim();
    if (!name) {
      return;
    }
    setProductDeleteTarget(name);
  };

  const cancelProductDelete = () => {
    if (productDeleteTarget && deletingProducts[productDeleteTarget]) {
      return;
    }
    setProductDeleteTarget(null);
  };

  const confirmProductDelete = async () => {
    if (!productDeleteTarget) {
      return;
    }
    try {
      await handleDeleteProduct(productDeleteTarget);
    } finally {
      setProductDeleteTarget(null);
    }
  };

  const handleProductImagesDeleteRequest = (productName) => {
    const name = (productName || "").trim();
    if (!name) {
      return;
    }
    const imagesForProduct = productImages.filter((img) => img.productName === name);
    if (imagesForProduct.length === 0) {
      showNotification(`No images to delete for ${name}.`, "info");
      return;
    }
    setProductImageDeleteTarget({
      name,
      count: imagesForProduct.length,
      images: imagesForProduct,
      selectedIds: imagesForProduct.map((img) => img.id),
    });
  };

  const cancelProductImagesDelete = () => {
    if (
      productImageDeleteTarget &&
      deletingProductImages[productImageDeleteTarget.name]
    ) {
      return;
    }
    setProductImageDeleteTarget(null);
  };

  const confirmProductImagesDelete = async () => {
    if (!productImageDeleteTarget) {
      return;
    }
    const { name, selectedIds } = productImageDeleteTarget;
    const success = await handleDeleteProductImagesByName(name, {
      imageIds: Array.isArray(selectedIds) ? selectedIds : [],
    });
    if (success) {
      setProductImageDeleteTarget(null);
    }
  };

  const toggleProductImageForDeletion = (imageId, checked) => {
    setProductImageDeleteTarget((prev) => {
      if (!prev) {
        return prev;
      }
      const currentSelection = Array.isArray(prev.selectedIds) ? prev.selectedIds : [];
      const nextSelection = checked
        ? currentSelection.includes(imageId)
          ? currentSelection
          : [...currentSelection, imageId]
        : currentSelection.filter((id) => id !== imageId);
      return { ...prev, selectedIds: nextSelection };
    });
  };

  const setAllProductImagesForDeletion = (checked) => {
    setProductImageDeleteTarget((prev) => {
      if (!prev) {
        return prev;
      }
      const allIds = Array.isArray(prev.images)
        ? prev.images.map((img) => img.id)
        : [];
      return { ...prev, selectedIds: checked ? allIds : [] };
    });
  };

  const handleDeleteShop = async () => {
    try {
      // Delete from Firestore
      const { deleteShop } = await import("@/lib/firestore");
      const result = await deleteShop(shop.id);

      if (!result.success) {
        showNotification("Failed to delete shop. Please try again.", "error");
        return;
      }

      // Also delete shop images from localStorage (will migrate to Storage later)
      window.localStorage.removeItem(`${STORAGE_KEY}_images_${shop.id}`);
      window.localStorage.removeItem(`${STORAGE_KEY}_video_${shop.id}`);
      window.localStorage.removeItem(`${STORAGE_KEY}_product_images_${shop.id}`);

      router.push("/?deleted=1");
    } catch (error) {
      console.error("Error deleting shop:", error);
      showNotification("Failed to delete shop. Please try again.", "error");
    }
  };

  useEffect(() => {
    loadShopData();
  }, [loadShopData]);

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("eBazarLoggedIn");
      window.localStorage.removeItem("eBazarCurrentUser");
      setShowLogoutModal(false);
      showNotification("You have been logged out successfully!", "success", { layout: "modal" });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  const getVisitorCount = () => {
    if (!shop) return 0;
    const visitorKey = `${STORAGE_KEY}_visitors_${shop.id}`;
    return parseInt(window.localStorage.getItem(visitorKey) || "0");
  };

  const productDeleteInProgress = productDeleteTarget
    ? !!deletingProducts[productDeleteTarget]
    : false;
  const productImagesDeleteInProgress = productImageDeleteTarget
    ? !!deletingProductImages[productImageDeleteTarget.name]
    : false;
  const hasSelectedProductImages = Boolean(
    productImageDeleteTarget?.selectedIds?.length,
  );
  const allImagesSelectedForDeletion = Boolean(
    productImageDeleteTarget?.images?.length &&
      productImageDeleteTarget.selectedIds?.length ===
        productImageDeleteTarget.images.length,
  );
  const selectedProductImagesCount = productImageDeleteTarget?.selectedIds?.length ?? 0;

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
      {/* Notification Toast */}
      {notification.show && (
        <div
          className={`${styles.notification} ${
            notification.type === "success"
              ? styles.notificationSuccess
              : notification.type === "warning"
              ? styles.notificationWarning
              : notification.type === "error"
              ? styles.notificationError
              : styles.notificationInfo
          } ${notification.layout === "modal" ? styles.notificationCenter : ""}`}
        >
          <span className={styles.notificationIcon}>
            {notification.type === "success"
              ? "Success"
              : notification.type === "error"
              ? "Error"
              : notification.type === "warning"
              ? "Warning"
              : "Info"}
          </span>
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
                <div className={styles.shopItemInfo}>
                  <h3>{s.name}</h3>
                  <p>{s.city} - {s.category}</p>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
        {shop?.citySlug && shop?.categorySlug && shop?.slug && (
          <div className={styles.shopActionsBar}>
            <Link
              href={`/city/${shop.citySlug}/${shop.categorySlug}/${shop.slug}`}
              className={styles.viewShopButton}
            >
              View Shop
            </Link>
          </div>
        )}

        {/* Stats Overview */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <h3>Total Visitors</h3>
              <p className={styles.statNumber}>{getVisitorCount()}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <h3>Rating</h3>
              <p className={styles.statNumber}>{shop.rating || "0.0"}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <h3>Reviews</h3>
              <p className={styles.statNumber}>{shop.reviews || 0}</p>
            </div>
          </div>
          <div className={styles.statCard}>
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
                Edit
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
              {isEditing ? (
                <>
                  <label htmlFor="shop-name-input">Shop Name:</label>
                  <input
                    id="shop-name-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </>
              ) : (
                <>
                  <span className={styles.infoLabel}>Shop Name:</span>
                  <span>{shop.name}</span>
                </>
              )}
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>City:</span>
              <span>{shop.city}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Category:</span>
              <span>{shop.category}</span>
            </div>
            <div className={styles.infoRow}>
              {isEditing ? (
                <>
                  <label htmlFor="shop-contact-input">Contact:</label>
                  <input
                    id="shop-contact-input"
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </>
              ) : (
                <>
                  <span className={styles.infoLabel}>Contact:</span>
                  <span>{shop.contact}</span>
                </>
              )}
            </div>
            <div className={styles.infoRow}>
              {isEditing ? (
                <>
                  <label htmlFor="shop-address-input">Address:</label>
                  <textarea
                    id="shop-address-input"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows={3}
                  />
                </>
              ) : (
                <>
                  <span className={styles.infoLabel}>Address:</span>
                  <span>{shop.address}</span>
                </>
              )}
            </div>
            <div className={styles.infoRow}>
              {isEditing ? (
                <>
                  <label htmlFor="shop-description-input">Description:</label>
                  <textarea
                    id="shop-description-input"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows={4}
                  />
                </>
              ) : (
                <>
                  <span className={styles.infoLabel}>Description:</span>
                  <span>{shop.description}</span>
                </>
              )}
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Plan:</span>
              <span className={styles.planBadge}>{shop.planLabel}</span>
            </div>
          </div>
        </div>

        {/* Shop Images */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Shop Images</h2>
            <label className={styles.uploadButton}>
              Upload Image
              <input
                type="file"
                accept="image/*"
                name="shopImage"
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
                  <Image
                    src={image.imageUrl || image.data}
                    alt={image.name || "Shop image"}
                    fill
                    className={styles.imageCardImage}
                    sizes="(max-width: 768px) 50vw, 240px"
                    unoptimized
                  />
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className={styles.imageCardDeleteButton}
                    type="button"
                    aria-label={`Delete ${image.name || "shop image"}`}
                  >
                    <span className={styles.deleteImageLabel}>Delete</span>
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
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  name="shopVideo"
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
                  Delete Video
                </button>
              </div>
            ) : (
              <p className={styles.noVideo}>No video uploaded yet. Add a short video (max 10 seconds) to showcase your shop!</p>
            )}
          </div>
        </div>

        {/* Upload Products */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Upload Products</h2>
            <span className={styles.productLimitNote}>{productLimitDisplay}</span>
          </div>
          <div className={styles.productUploadIntro}>
            <p>
              Add a new product, set its price, and upload up to two showcase images. Your
              plan determines how many unique products you can list.
            </p>
            <button
              type="button"
              className={styles.uploadButtonPrimary}
              onClick={handleTriggerFirstProductImageUpload}
              disabled={productLimitReached}
            >
              Add Product
            </button>
          </div>
          {productLimitReached && (
            <p className={styles.productLimitWarning}>
              You&apos;ve reached the product limit for your {shop.planLabel || shop.plan} plan.
              Upgrade to unlock additional product slots.
            </p>
          )}
        </div>

        {/* Product Images */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Product Images (Max 2 per product)</h2>
          </div>
          <div className={styles.productsList}>
            {allProductNames.length > 0 ? (
              allProductNames.map((productName, index) => {
                const productImgs = productImages.filter(img => img.productName === productName);
                return (
                  <div key={`${productName}-${index}`} className={styles.productItem}>
                    <div className={styles.productHeader}>
                      <h3>{productName}</h3>
                      <div className={styles.productHeaderActions}>
                        <div className={styles.productActionsDropdown}>
                          <button
                            type="button"
                            className={styles.productActionsToggle}
                            onClick={() =>
                              setActiveProductActions((current) =>
                                current === productName ? null : productName
                              )
                            }
                            aria-haspopup="menu"
                            aria-expanded={activeProductActions === productName}
                          >
                            Actions
                            <span className={styles.productActionsCaret} aria-hidden="true" />
                          </button>
                          {activeProductActions === productName && (
                            <div className={styles.productActionsMenu} role="menu">
                              {productImgs.length < 2 && (
                                <label className={styles.productActionsMenuItem} role="menuitem">
                                  Add Image
                                  <input
                                    type="file"
                                    accept="image/*"
                                    name="productImage"
                                    onChange={async (e) => {
                                      const file = e.target.files[0];
                                      if (!file) return;
                                      await handleProductImageUpload(file, productName);
                                      e.target.value = "";
                                      setActiveProductActions(null);
                                    }}
                                    style={{ display: "none" }}
                                  />
                                </label>
                              )}
                              <button
                                type="button"
                                className={`${styles.productActionsMenuItem} ${styles.productActionsDelete}`}
                                onClick={() => {
                                  setActiveProductActions(null);
                                  handleProductDeleteRequest(productName);
                                }}
                                disabled={!!deletingProducts[productName] || !!deletingProductImages[productName]}
                                role="menuitem"
                              >
                                {deletingProducts[productName] ? "Deleting..." : "Delete Product"}
                              </button>
                              {productImgs.length > 0 && (
                                <button
                                  type="button"
                                  className={`${styles.productActionsMenuItem} ${styles.productActionsDelete}`}
                                  onClick={() => {
                                    setActiveProductActions(null);
                                    handleProductImagesDeleteRequest(productName);
                                  }}
                                  disabled={!!deletingProductImages[productName] || !!deletingProducts[productName]}
                                  role="menuitem"
                                >
                                  {deletingProductImages[productName] ? "Deleting..." : "Delete Images"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={styles.productPriceControls}>
                      <label className={styles.productPriceLabel}>
                        <span>Price</span>
                        <input
                          type="text"
                          className={styles.priceInput}
                          value={productPrices[productName] ?? ""}
                          onChange={(e) => handleProductPriceChange(productName, e.target.value)}
                          placeholder="e.g. Rs. 2,500"
                        />
                      </label>
                      <button
                        type="button"
                        className={styles.savePriceButton}
                        onClick={() => handleSaveProductPrice(productName)}
                        disabled={!!savingProductPrices[productName]}
                      >
                        {savingProductPrices[productName] ? "Saving..." : "Save Price"}
                      </button>
                    </div>
                    <div className={styles.productImageGrid}>
                      {productImgs.length === 0 ? (
                        <p className={styles.noProductImages}>No images for this product yet. Add up to 2 images!</p>
                      ) : (
                        productImgs.map((image) => (
                          <div key={image.id} className={styles.productImageCard}>
                            <Image
                              src={image.imageUrl || image.data}
                              alt={image.name || `${productName} preview`}
                              fill
                              className={styles.productImage}
                              sizes="(max-width: 768px) 60vw, 200px"
                              unoptimized
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.noProductsContainer}>
                <p className={styles.noProducts}>No products available for this shop yet.</p>
                <div className={styles.noProductsActions}>
                  <button
                    type="button"
                    className={styles.uploadButtonSmall}
                    onClick={handleTriggerFirstProductImageUpload}
                    disabled={productLimitReached}
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    className={styles.deleteImageButton}
                    onClick={handleDeleteAllProductImages}
                    disabled={isDeletingAllProductImages}
                  >
                    {isDeletingAllProductImages ? "Deleting..." : "Delete Images"}
                  </button>
                </div>
                <input
                  ref={firstProductImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFirstProductImageSelection}
                  style={{ display: "none" }}
                />
              </div>
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
              Delete Shop
            </button>
          </div>
        </div>
      </main>
      </div>

      {productImageDeleteTarget && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Delete Product Images?</h2>
            <p>
              Select the image(s) to remove from &quot;{productImageDeleteTarget.name}&quot;. This action cannot be undone.
            </p>
            {productImageDeleteTarget.images?.length > 1 && (
              <div className={styles.imageSelectionControls}>
                <button
                  type="button"
                  onClick={() =>
                    setAllProductImagesForDeletion(!allImagesSelectedForDeletion)
                  }
                  className={styles.selectionToggleButton}
                  disabled={productImagesDeleteInProgress}
                >
                  {allImagesSelectedForDeletion ? "Clear Selection" : "Select All"}
                </button>
              </div>
            )}
            <div className={styles.imageSelectionList}>
              {productImageDeleteTarget.images?.map((image, index) => {
                const previewSrc = image.imageUrl || image.data;
                const isChecked = productImageDeleteTarget.selectedIds?.includes(image.id);
                return (
                  <label key={image.id} className={styles.imageSelectionItem}>
                    <input
                      type="checkbox"
                      className={styles.imageSelectionCheckbox}
                      checked={Boolean(isChecked)}
                      onChange={(event) =>
                        toggleProductImageForDeletion(image.id, event.target.checked)
                      }
                      disabled={productImagesDeleteInProgress}
                    />
                    <div className={styles.imageSelectionPreview}>
                      {previewSrc ? (
                        <Image
                          src={previewSrc}
                          alt={`${productImageDeleteTarget.name} image ${index + 1}`}
                          width={72}
                          height={72}
                          className={styles.imageSelectionThumbnail}
                          loading="lazy"
                          unoptimized
                          sizes="72px"
                        />
                      ) : (
                        <span className={styles.imageSelectionPlaceholder}>No preview</span>
                      )}
                    </div>
                    <span className={styles.imageSelectionName}>
                      {image.name || `${productImageDeleteTarget.name} image ${index + 1}`}
                    </span>
                  </label>
                );
              })}
            </div>
            {!hasSelectedProductImages && (
              <p className={styles.selectionHint}>Select at least one image to delete.</p>
            )}
            <div className={styles.modalActions}>
              <button
                onClick={cancelProductImagesDelete}
                className={styles.cancelButton}
                disabled={productImagesDeleteInProgress}
              >
                Cancel
              </button>
              <button
                onClick={confirmProductImagesDelete}
                className={styles.confirmDeleteButton}
                disabled={productImagesDeleteInProgress || !hasSelectedProductImages}
              >
                {productImagesDeleteInProgress
                  ? "Deleting..."
                  : selectedProductImagesCount === 1
                  ? "Delete 1 Image"
                  : "Delete Selected Images"}
              </button>
            </div>
          </div>
        </div>
      )}

      {productDeleteTarget && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Delete Product?</h2>
            <p>
              Delete product &quot;{productDeleteTarget}&quot; and all associated images? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={cancelProductDelete}
                className={styles.cancelButton}
                disabled={productDeleteInProgress}
              >
                Cancel
              </button>
              <button
                onClick={confirmProductDelete}
                className={styles.confirmDeleteButton}
                disabled={productDeleteInProgress}
              >
                {productDeleteInProgress ? "Deleting..." : "Yes, Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Upload Modal */}
      {showProductModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add a Product</h2>
            <p>Enter the product details before uploading images.</p>
            {productLimit !== Infinity && (
              <p className={styles.productLimitNote}>
                You can list up to {productLimit} products on your {shop.planLabel || shop.plan} plan.
              </p>
            )}
            <label className={styles.modalField}>
              <span>Product name</span>
              <input
                type="text"
                value={productNameDraft}
                onChange={(event) => setProductNameDraft(event.target.value)}
                placeholder="e.g. Heritage Shawl"
              />
            </label>
            <label className={styles.modalField}>
              <span>Price (optional)</span>
              <input
                type="text"
                value={productPriceDraft}
                onChange={(event) => setProductPriceDraft(event.target.value)}
                placeholder="e.g. Rs. 2,500"
              />
            </label>
            {productModalError && (
              <p className={styles.modalError}>{productModalError}</p>
            )}
            <div className={styles.modalActions}>
              <button onClick={handleProductModalCancel} className={styles.cancelButton}>
                Cancel
              </button>
              <button
                onClick={handleProductModalConfirm}
                className={styles.confirmButton}
                disabled={!productNameDraft.trim()}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Delete Shop?</h2>
            <p>
              Are you sure you want to delete &quot;{shop.name}&quot;? This action cannot be undone.
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
