"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  STORAGE_KEY,
  createSellerSlug,
  createProductShowcase,
  getTopRatedSellers,
} from "@/data/markets";
import BazaarFooter from "@/components/bazaar-footer/BazaarFooter";
import SearchBar from "@/components/search-bar/SearchBar";
import styles from "./page.module.css";

const SERVICE_NOTE =
  "We only provide an online bazaar. Sellers handle payments & delivery directly.";
const GLOBAL_TOP_RATED = getTopRatedSellers(8);

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
  const [productFocus, setProductFocus] = useState(null);
  const [dynamicSeller, setDynamicSeller] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setProductFocus(params.get("product"));
  }, [citySlug, categorySlug, sellerSlug]);


  useEffect(() => {
    if (baseSeller || typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const shops = JSON.parse(stored);
      const match = shops.find((shop) =>
        matchShop(shop, citySlug, categorySlug, sellerSlug),
      );
      if (!match) return;
      setDynamicSeller({
        ...match,
        slug:
          (match.slug && match.slug.toLowerCase()) ||
          createSellerSlug(match.city ?? citySlug, match.name ?? ""),
        products:
          match.products && match.products.length > 0
            ? match.products
            : createProductShowcase(categorySlug, Math.floor(Math.random() * 40)),
      });
    } catch (error) {
      console.error("Unable to load stored shops", error);
    }
  }, [baseSeller, citySlug, categorySlug, sellerSlug]);

  const seller = useMemo(() => baseSeller ?? dynamicSeller ?? null, [
    baseSeller,
    dynamicSeller,
  ]);

  const focusProduct = useMemo(() => {
    if (!productFocus) return null;
    const products = seller?.products || [];
    const match = products.find((product) =>
      (product.slug || toSlug(product.name)) === productFocus,
    );
    return match?.name ?? null;
  }, [productFocus, seller]);

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

  const products = seller.products || createProductShowcase(categorySlug, 0);

  return (
    <div className={styles.page}>
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
              src={seller.shopImage || city.detailImage || city.image}
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
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Rating:</span>
                <span className={styles.detailValue}>
                  {seller.rating ? `${seller.rating.toFixed(1)} ★` : "New Store"}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Reviews:</span>
                <span className={styles.detailValue}>
                  {seller.reviews ? `${seller.reviews} reviews` : "Awaiting reviews"}
                </span>
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

          <div className={styles.productsGrid}>
            {products.map((product) => {
              const productSlug = product.slug || toSlug(product.name);
              const isFocused = productFocus && productFocus === productSlug;

              return (
                <article
                  key={`${seller.slug}-${product.name}`}
                  className={`${styles.productCard} ${isFocused ? styles.productCardActive : ""}`}
                >
                  <div className={styles.productImage}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className={styles.productDetails}>
                    <h3>{product.name}</h3>
                    <p className={styles.productPrice}>{product.price}</p>
                    <div className={styles.productRatings}>
                      <span>
                        {product.rating ? `${product.rating.toFixed(1)} \u2605` : "New arrival"}
                      </span>
                      <span>
                        {product.reviews
                          ? `${product.reviews} reviews`
                          : "First review pending"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <BazaarFooter note={SERVICE_NOTE} topRatedSellers={GLOBAL_TOP_RATED} />
      </main>
    </div>
  );
}




