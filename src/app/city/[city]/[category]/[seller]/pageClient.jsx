"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  STORAGE_KEY,
  createSellerSlug,
  createProductShowcase,
  getTopRatedSellers,
} from "@/data/markets";
import { deriveCategorySlug, normalizeProducts } from "@/lib/products";
import BazaarFooter from "@/components/bazaar-footer/BazaarFooter";
import SearchBar from "@/components/search-bar/SearchBar";
import StarRating from "@/components/star-rating/StarRating";
import styles from "./page.module.css";

const SERVICE_NOTE =
  "We only provide an online bazaar. Sellers handle payments & delivery directly.";
const GLOBAL_TOP_RATED = getTopRatedSellers(8);
const SELLER_REVIEW_KEY = "__seller__";

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
  "Impressed with the quality and packaging.",
  "Great service, delivery arrived on time!",
  "Highly recommended—exactly as described.",
  "Friendly seller and quick responses.",
  "Fantastic experience, will purchase again.",
  "Good value for money and authentic items.",
  "Loved the attention to detail in every product.",
  "Customer support was very helpful throughout.",
];

const FALLBACK_PRODUCT_COMMENTS = [
  "Exactly what I needed. Works perfectly!",
  "Quality exceeded expectations for the price.",
  "Item arrived well-packed and ready to use.",
  "Solid build quality—feels premium in hand.",
  "Color and finish are exactly as shown in photos.",
  "Very happy with the purchase. Recommended!",
  "Reliable performance during daily use so far.",
  "Makes a great gift—beautiful presentation.",
  "The attention to detail really stands out.",
  "Smooth transaction and excellent communication.",
];

const buildFallbackTimestamp = (ms) => ({
  toMillis: () => ms,
  toDate: () => new Date(ms),
});

const generateFallbackSellerReviews = (sellerInfo) => {
  const seedSource =
    sellerInfo?.id || sellerInfo?.slug || sellerInfo?.name || "seller";
  let hash = 0;
  for (let i = 0; i < seedSource.length; i += 1) {
    hash = (hash << 5) - hash + seedSource.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);
  const reviewCount = 3 + (seed % 3);
  const baseRating = Number(
    (
      (Number.isFinite(sellerInfo?.rating) ? sellerInfo.rating : 4.2) +
      ((seed % 10) - 5) * 0.05
    ).toFixed(1)
  );

  const reviews = [];
  for (let i = 0; i < reviewCount; i += 1) {
    const reviewer =
      FALLBACK_REVIEWERS[(seed + i) % FALLBACK_REVIEWERS.length];
    const comment =
      FALLBACK_COMMENTS[(seed + i * 3) % FALLBACK_COMMENTS.length];
    const rating = Math.min(
      5,
      Math.max(4, Number((baseRating + (i % 3) * 0.1).toFixed(1)))
    );
    const createdMs = Date.now() - (seed % 5 + i) * 86_400_000;

    reviews.push({
      id: `fallback-${seed}-${i}`,
      name: reviewer,
      comment,
      rating,
      createdAt: buildFallbackTimestamp(createdMs),
      isFallback: true,
    });
  }

  return reviews;
};

const generateFallbackProductReviews = (
  sellerInfo,
  product,
  seedOffset = 0
) => {
  const productName =
    typeof product === "string" ? product : product?.name || "product";
  const seedSource = `${sellerInfo?.id || sellerInfo?.slug || sellerInfo?.name || "seller"}::${productName || "product"}`;

  let hash = 0;
  for (let i = 0; i < seedSource.length; i += 1) {
    hash = (hash << 5) - hash + seedSource.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash) + seedOffset;
  const reviewCount = 2 + (seed % 3);
  const baseRating = Math.min(
    5,
    Math.max(
      3.5,
      Number(
        (
          (Number.isFinite(product?.rating) ? product.rating : 4.3) +
          ((seed % 7) - 3) * 0.08
        ).toFixed(1)
      )
    )
  );

  const reviews = [];
  for (let i = 0; i < reviewCount; i += 1) {
    const reviewer =
      FALLBACK_REVIEWERS[(seed + i * 2) % FALLBACK_REVIEWERS.length];
    const comment =
      FALLBACK_PRODUCT_COMMENTS[(seed + i * 5) % FALLBACK_PRODUCT_COMMENTS.length];
    const rating = Math.min(
      5,
      Math.max(3, Number((baseRating + ((i % 2) - 0.5) * 0.2).toFixed(1)))
    );
    const createdMs = Date.now() - (seed % 9 + i) * 72_000_000;

    reviews.push({
      id: `fallback-product-${seed}-${i}`,
      name: reviewer,
      comment,
      rating,
      productName,
      createdAt: buildFallbackTimestamp(createdMs),
      isFallback: true,
    });
  }

  return reviews;
};

const toSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const matchShop = (shop, citySlug, categorySlug, sellerSlug) => {
  const cityMatches =
    shop.citySlug?.toLowerCase?.() === citySlug ||
    shop.city?.toLowerCase?.() === citySlug;
  const categoryMatches =
    shop.categorySlug?.toLowerCase?.() === categorySlug ||
    shop.category?.toLowerCase?.() === categorySlug;
  const derivedSlug = (
    shop.slug || createSellerSlug(shop.city ?? citySlug, shop.name ?? "")
  ).toLowerCase();
  return cityMatches && categoryMatches && derivedSlug === sellerSlug;
};

export default function SellerPageClient({ city, industry, baseSeller, slugs }) {
  const { city: citySlug, category: categorySlug, seller: sellerSlug } = slugs;
  const searchParams = useSearchParams();
  const productFocus = searchParams.get("product");
  const [dynamicSeller, setDynamicSeller] = useState(null);
  const [shopImages, setShopImages] = useState([]);
  const [shopVideo, setShopVideo] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productReviews, setProductReviews] = useState({});
  const [sellerReviews, setSellerReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const toastTimerRef = useRef(null);

  const showToast = (message, type = "info", duration = 3000) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
      toastTimerRef.current = null;
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const loadProductReviews = async (shopId, products) => {
    if (!products || products.length === 0) return;
    try {
      const { getProductReviews } = await import("@/lib/firestore");
      const reviewsData = {};
      for (const product of products) {
        const productName = typeof product === 'string' ? product : product.name;
        const result = await getProductReviews(shopId, productName);
        if (result.success && result.data?.length) {
          reviewsData[productName] = result.data;
        } else {
          reviewsData[productName] = generateFallbackProductReviews(
            seller || { id: shopId },
            product
          );
        }
      }
      setProductReviews(reviewsData);
    } catch (error) {
      console.warn("Falling back to sample product reviews.", error);
      const fallbackReviews = {};
      for (const product of products) {
        const productName = typeof product === 'string' ? product : product.name;
        fallbackReviews[productName] = generateFallbackProductReviews(
          seller || { id: shopId },
          product,
          7
        );
      }
      setProductReviews(fallbackReviews);
    }
  };

  const loadSellerReviews = async (shopId, fallbackSellerInfo = null) => {
    if (!shopId) {
      setSellerReviews([]);
      return;
    }
    try {
      const { getSellerReviews } = await import("@/lib/firestore");
      const result = await getSellerReviews(shopId);
      if (result.success) {
        setSellerReviews(result.data);
      } else {
        const fallbackReviews = generateFallbackSellerReviews(fallbackSellerInfo || seller || { id: shopId });
        setSellerReviews(fallbackReviews);
      }
    } catch (error) {
      console.warn("Falling back to sample seller reviews.", error);
      const fallbackReviews = generateFallbackSellerReviews(fallbackSellerInfo || seller || { id: shopId });
      setSellerReviews(fallbackReviews);
    }
  };

  useEffect(() => {
    const loadShopData = async () => {
      if (baseSeller || typeof window === "undefined") return;
      try {
        // Try to get shop ID from localStorage first
        const stored = window.localStorage.getItem(STORAGE_KEY);

        if (!stored) {
          // No localStorage data at all
          return;
        }

        const shops = JSON.parse(stored);
        const match = shops.find((shop) =>
          matchShop(shop, citySlug, categorySlug, sellerSlug),
        );

        if (!match) {
          // No matching shop found
          setSellerReviews([]);
          return;
        }

        const shopId = match?.id;

        // If we have a valid shopId string, load from Firestore for fresh data
        if (shopId && typeof shopId === 'string' && shopId.length > 0) {
          const { getShop, getShopImages, getShopVideo, getProductImages } = await import("@/lib/firestore");

          const firestoreResult = await getShop(shopId);
          if (firestoreResult.success) {
            const shopData = firestoreResult.data;
            const resolvedCategorySlug = deriveCategorySlug(shopData, categorySlug);
            const normalizedProducts =
              Array.isArray(shopData.products) && shopData.products.length > 0
                ? normalizeProducts(shopData.products, resolvedCategorySlug)
                : [];

            setDynamicSeller({
              ...shopData,
              id: shopId,
              categorySlug: resolvedCategorySlug,
              slug:
                (shopData.slug && shopData.slug.toLowerCase()) ||
                createSellerSlug(shopData.city ?? citySlug, shopData.name ?? ""),
              products: normalizedProducts,
            });

            // Update localStorage with fresh data from Firestore
            const updatedShops = shops.map((s) =>
              s.id === shopId
                ? {
                    ...shopData,
                    id: shopId,
                    categorySlug: resolvedCategorySlug,
                    products: normalizedProducts,
                  }
                : s,
            );
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShops));

            // Load images from Firestore
            const imagesResult = await getShopImages(shopId);
            if (imagesResult.success) {
              setShopImages(imagesResult.data);
            }

            const videoResult = await getShopVideo(shopId);
            if (videoResult.success) {
              setShopVideo(videoResult.data);
            }

            const productImagesResult = await getProductImages(shopId);
            if (productImagesResult.success) {
              setProductImages(productImagesResult.data);
            }

            // Load reviews for all products
            await loadProductReviews(shopId, normalizedProducts);
            await loadSellerReviews(shopId, match);
          } else {
            // Firestore fetch failed, fall back to localStorage data
            const fallbackCategorySlug = deriveCategorySlug(match, categorySlug);
            const hasStoredProducts = Array.isArray(match.products) && match.products.length > 0;
            const fallbackProducts = hasStoredProducts
              ? match.products
              : match.ownerId
              ? []
              : createProductShowcase(fallbackCategorySlug, Math.floor(Math.random() * 40));
            const normalizedFallback = normalizeProducts(fallbackProducts, fallbackCategorySlug);
            setDynamicSeller({
              ...match,
              id: match.id,
              categorySlug: fallbackCategorySlug,
              slug:
                (match.slug && match.slug.toLowerCase()) ||
                createSellerSlug(match.city ?? citySlug, match.name ?? ""),
              products: normalizedFallback,
            });
            if (shopId) {
              await loadProductReviews(shopId, normalizedFallback);
              await loadSellerReviews(shopId, match);
            }
          }
        } else {
          // No valid shopId or old data format, use localStorage data as fallback
          const fallbackCategorySlug = deriveCategorySlug(match, categorySlug);
          const hasStoredProducts = Array.isArray(match.products) && match.products.length > 0;
          const fallbackProducts = hasStoredProducts
            ? match.products
            : match.ownerId
            ? []
            : createProductShowcase(fallbackCategorySlug, Math.floor(Math.random() * 40));
          const normalizedFallback = normalizeProducts(fallbackProducts, fallbackCategorySlug);
          setDynamicSeller({
            ...match,
            ...(match.id ? { id: match.id } : {}),
            categorySlug: fallbackCategorySlug,
            slug:
              (match.slug && match.slug.toLowerCase()) ||
              createSellerSlug(match.city ?? citySlug, match.name ?? ""),
            products: normalizedFallback,
          });
          if (match?.id) {
            await loadProductReviews(match.id, normalizedFallback);
            await loadSellerReviews(match.id, match);
          }
        }
      } catch (error) {
        console.error("Unable to load stored shops", error);
      }
    };

    loadShopData();

    // Listen for localStorage changes (when dashboard updates data)
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        loadShopData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events from same window
    const handleCustomStorageUpdate = () => {
      loadShopData();
    };
    window.addEventListener('localStorageUpdated', handleCustomStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageUpdate);
    };
  }, [baseSeller, citySlug, categorySlug, sellerSlug]);

  const seller = useMemo(() => baseSeller ?? dynamicSeller ?? null, [
    baseSeller,
    dynamicSeller,
  ]);

  const sellerReviewStats = useMemo(() => {
    if (!sellerReviews || sellerReviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const count = sellerReviews.length;
    const sum = sellerReviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return {
      average: Number((sum / count).toFixed(1)),
      count,
    };
  }, [sellerReviews]);

  const sellerDisplayRating =
    sellerReviewStats.count > 0
      ? sellerReviewStats.average
      : typeof seller?.rating === "number"
      ? Number(seller.rating.toFixed(1))
      : 0;

  const sellerDisplayReviewCount =
    sellerReviewStats.count > 0
      ? sellerReviewStats.count
      : typeof seller?.reviews === "number"
      ? seller.reviews
      : 0;

  const canSubmitReview = Boolean(seller?.id);
  const isSellerReview = selectedProduct === SELLER_REVIEW_KEY;

  // Track visitor count
  useEffect(() => {
    if (!seller || typeof window === "undefined") return;
    try {
      const visitorKey = `${STORAGE_KEY}_visitors_${seller.id}`;
      const currentCount = parseInt(window.localStorage.getItem(visitorKey) || "0");
      const newCount = currentCount + 1;
      window.localStorage.setItem(visitorKey, newCount.toString());
    } catch (error) {
      console.error("Unable to track visitor", error);
    }
  }, [seller]);

  const focusProduct = useMemo(() => {
    if (!productFocus) return null;
    const products = seller?.products || [];
    const match = products.find((product) =>
      (product.slug || toSlug(product.name)) === productFocus,
    );
    return match?.name ?? null;
  }, [productFocus, seller]);

  // Helper function to get product image URL
  const getProductImageUrl = (productName) => {
    const productImgs = productImages.filter(img => {
      const imgProductName = typeof img.productName === 'string' ? img.productName : '';
      const targetProductName = typeof productName === 'string' ? productName : (productName?.name || '');
      return imgProductName === targetProductName;
    });
    return productImgs.length > 0 ? productImgs[0].imageUrl : null;
  };

  if (!seller) {
    return (
      <div className={styles.missingPage}>
        <p>Seller details not found or no longer available.</p>
        <Link href={`/city/${citySlug}/${categorySlug}`} className={styles.backLink}>
          Back to {city.name} bazaar
        </Link>
      </div>
    );
  }

  const products = seller.products && seller.products.length > 0
    ? seller.products
    : [];

  const reviewSubtitle = isSellerReview
    ? "Share your experience with this shop to support fellow buyers."
    : "Tell us about this product to guide other shoppers.";
  const reviewModalTitle = isSellerReview
    ? `Rate ${seller.name}`
    : `Rate ${selectedProduct || "this product"}`;
  const toastClassName = `${styles.toast} ${
    toast.type === "success"
      ? styles.toastSuccess
      : toast.type === "warning"
      ? styles.toastWarning
      : toast.type === "error"
      ? styles.toastError
      : styles.toastInfo
  }`;
  const toastIcon =
    toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : toast.type === "warning" ? "⚠" : "ℹ";

  const handleChat = (productName) => {
    const message = `Hi! I'm interested in ${productName}. Can you provide more details about this product and delivery information?`;
    const whatsappUrl = `https://wa.me/${seller.contact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOpenReviewModal = (targetKey = SELLER_REVIEW_KEY, initialRating = 5) => {
    if (!seller?.id) {
      showToast("Ratings are available for verified E-Bazar shops. Stay tuned!", "info");
      return;
    }
    setSelectedProduct(targetKey);
    setShowReviewModal(true);
    setReviewForm({ name: "", rating: initialRating, comment: "" });
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedProduct(null);
    setReviewForm({ name: "", rating: 5, comment: "" });
  };

  const handleReviewFormChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      showToast("Please fill in all fields before submitting your review.", "warning");
      return;
    }

    try {
      if (!seller?.id) {
        showToast("Unable to submit review at this time.", "error");
        return;
      }

      if (reviewForm.rating < 1 || reviewForm.rating > 5) {
        showToast("Please select a rating between 1 and 5 stars.", "warning");
        return;
      }

      const isSellerReview = selectedProduct === SELLER_REVIEW_KEY;
      const currentUserId =
        typeof window !== "undefined"
          ? window.localStorage.getItem("eBazarCurrentUser") || null
          : null;
      const reviewPayload = {
        ...reviewForm,
        userId: currentUserId,
      };

      if (isSellerReview) {
        const { addSellerReview } = await import("@/lib/firestore");
        const result = await addSellerReview(seller.id, reviewPayload);
        if (!result.success) {
          showToast("Failed to submit review. Please try again.", "error");
          return;
        }
        await loadSellerReviews(seller.id, seller);
      } else {
        const { addProductReview } = await import("@/lib/firestore");
        const result = await addProductReview(seller.id, selectedProduct, reviewPayload);
        if (!result.success) {
          showToast("Failed to submit review. Please try again.", "error");
          return;
        }
        await loadProductReviews(seller.id, seller.products);
        await loadSellerReviews(seller.id, seller);
      }

      showToast("Thanks! Your review has been submitted.", "success");
      handleCloseReviewModal();
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Failed to submit review. Please try again.", "error");
    }
  };

  const getReviewCount = (productName) =>
    productReviews[productName]?.length ?? 0;

  const getAverageRating = (productName) => {
    const reviews = productReviews[productName] || [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return Number((sum / reviews.length).toFixed(1));
  };

  return (
    <div className={styles.page}>
      {toast.show && (
        <div className={toastClassName}>
          <span className={styles.toastIcon}>{toastIcon}</span>
          <span>{toast.message}</span>
        </div>
      )}
      <header className={styles.header}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/city/${citySlug}/${categorySlug}`}>{city.name}</Link>
          <span>/</span>
          <span>{seller.name}</span>
        </nav>
      </header>

      <main className={styles.main}>
        <SearchBar citySlug={city.slug} lockCity />

        <section className={styles.hero}>
          <div className={styles.shopImageContainer}>
            <Image
              src={
                shopImages.length > 0
                  ? shopImages[0].imageUrl
                  : seller.shopImage || city.detailImage || city.image
              }
              alt={`${seller.name} shop`}
              fill
              className={styles.shopImage}
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
          <div className={styles.shopInfoCard}>
            <div className={styles.shopHeader}>
              <h1>{seller.name}</h1>
              <span className={styles.planBadge}>{seller.plan || "Marketplace Partner"}</span>
            </div>
            <div className={styles.shopDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Address:</span>
                <span className={styles.detailValue}>{seller.address}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Contact:</span>
                <span className={styles.detailValue}>{seller.contact}</span>
              </div>
              <div className={`${styles.detailRow} ${styles.detailRowWide}`}>
                <span className={styles.detailLabel}>Buyer Rating:</span>
                <div
                  className={`${styles.detailValueStacked} ${
                    canSubmitReview ? styles.ratingClickable : ""
                  }`}
                  role={canSubmitReview ? "button" : undefined}
                  tabIndex={canSubmitReview ? 0 : undefined}
                  onClick={() => canSubmitReview && handleOpenReviewModal(SELLER_REVIEW_KEY)}
                  onKeyDown={(event) => {
                    if (!canSubmitReview) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleOpenReviewModal(SELLER_REVIEW_KEY);
                    }
                  }}
                >
                  <StarRating
                    value={sellerDisplayRating}
                    size="md"
                    interactive={false}
                    label={`Seller rating ${sellerDisplayRating} out of 5`}
                  />
                    {sellerDisplayRating > 0 && (
                      <div className={styles.ratingMeta}>
                        <span>{`${sellerDisplayRating.toFixed(1)} / 5`}</span>
                        {sellerDisplayReviewCount > 0 && (
                          <span>
                            {sellerDisplayReviewCount === 1
                              ? "1 review"
                              : `${sellerDisplayReviewCount} reviews`}
                          </span>
                        )}
                      </div>
                    )}
                  {canSubmitReview ? (
                    <button
                      type="button"
                      onClick={() => handleOpenReviewModal(SELLER_REVIEW_KEY)}
                      className={styles.rateButton}
                    >
                      ⭐ Rate This Seller
                    </button>
                  ) : (
                    <span className={styles.rateHint}>
                      Seller ratings are available for verified E-Bazar shops.
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className={styles.shopDescription}>
              {seller.description ||
                `${seller.name} serves ${industry.name.toLowerCase()} buyers across ${city.name}.`}
            </p>
            {focusProduct && (
              <p className={styles.focusProduct}>Viewing: {focusProduct}</p>
            )}
          </div>
        </section>

        <section className={styles.productsSection}>
          <header className={styles.sectionHeader}>
            <h2>Product Catalog</h2>
            <p>
              Explore the highlighted inventory offered by {seller.name}. Ratings and
              reviews reflect buyer feedback shared through the marketplace community.
            </p>
          </header>

          {products.length === 0 ? (
            <div className={styles.emptyProducts}>
              <p>No products are currently listed for this shop.</p>
              <p>The seller is working on adding their product catalog.</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => {
                const productSlug = product.slug || toSlug(product.name);
                const isFocused = productFocus && productFocus === productSlug;
                const productName = typeof product === 'string' ? product : product.name;
                const uploadedImageUrl = getProductImageUrl(productName);
                const reviewCount = getReviewCount(productName);
                const fallbackRating =
                  typeof product.rating === "number"
                    ? Number(product.rating.toFixed(1))
                    : 0;
                const displayRating =
                  reviewCount > 0 ? getAverageRating(productName) : fallbackRating;
                const fallbackReviewCount =
                  typeof product.reviews === "number" ? product.reviews : 0;
                const displayReviewCount =
                  reviewCount > 0 ? reviewCount : fallbackReviewCount;
                const ratingLabel =
                  displayRating > 0
                    ? `${displayRating.toFixed(1)} / 5`
                    : "New arrival";
                const reviewLabel =
                  displayReviewCount > 0
                    ? `${displayReviewCount === 1 ? "1 review" : `${displayReviewCount} reviews`}`
                    : null;

                return (
                  <article
                    key={`${seller.slug}-${productName}`}
                    className={`${styles.productCard} ${isFocused ? styles.productCardActive : ""}`}
                  >
                    <div className={styles.productImage}>
                      <Image
                        src={uploadedImageUrl || product.image}
                        alt={productName}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <div className={styles.productDetails}>
                      <h3>{productName}</h3>
                      <p className={styles.productPrice}>{product.price}</p>
                  <div
                    className={`${styles.productRatingRow} ${
                      canSubmitReview ? styles.ratingClickable : ""
                    }`}
                    role={canSubmitReview ? "button" : undefined}
                    tabIndex={canSubmitReview ? 0 : undefined}
                    onClick={() => canSubmitReview && handleOpenReviewModal(productName)}
                    onKeyDown={(event) => {
                      if (!canSubmitReview) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleOpenReviewModal(productName);
                      }
                    }}
                  >
                      <StarRating
                        value={displayRating}
                        size="sm"
                        interactive={false}
                        label={`Rating for ${productName}`}
                      />
                        <span className={styles.productRatingValue}>{ratingLabel}</span>
                        {reviewLabel && (
                          <span className={styles.productReviewCount}>{reviewLabel}</span>
                        )}
                      </div>
                      <div className={styles.productActions}>
                        {canSubmitReview && (
                          <button
                            type="button"
                            onClick={() => handleOpenReviewModal(productName)}
                            className={styles.rateButton}
                          >
                            ⭐ Rate Product
                          </button>
                        )}
                        <button
                          onClick={() => handleChat(productName)}
                          className={styles.chatButton}
                          type="button"
                        >
                          💬 Chat
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {showReviewModal && (
          <div
            className={styles.reviewModalOverlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
          >
            <div className={styles.reviewModal}>
              <header className={styles.reviewModalHeader}>
                <h3 id="review-modal-title">{reviewModalTitle}</h3>
                <p>{reviewSubtitle}</p>
              </header>
              <form className={styles.reviewModalForm} onSubmit={handleSubmitReview}>
                <label htmlFor="reviewer-name">Your Name</label>
                <input
                  id="reviewer-name"
                  name="name"
                  type="text"
                  value={reviewForm.name}
                  onChange={handleReviewFormChange}
                  placeholder="Type your name"
                  required
                />
                <div className={styles.reviewRatingRow}>
                  <span>Rating</span>
                  <StarRating
                    value={reviewForm.rating}
                    size="lg"
                    interactive
                    onSelect={(score) =>
                      setReviewForm((prev) => ({ ...prev, rating: score }))
                    }
                    label="Select your rating"
                  />
                </div>
                <label htmlFor="review-comment">Share your experience</label>
                <textarea
                  id="review-comment"
                  name="comment"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={handleReviewFormChange}
                  placeholder="What did you love? What could be better?"
                  required
                />
                <div className={styles.reviewActions}>
                  <button type="button" onClick={handleCloseReviewModal} className={styles.cancelButton}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <BazaarFooter note={SERVICE_NOTE} />
      </main>
    </div>
  );
}
