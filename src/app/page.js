"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar/Navbar";
import { BASE_CITY_MARKETS, HERO_SLIDES, getTopRatedSellers, STORAGE_KEY } from "@/data/markets";
import styles from "./page.module.css";

// Dynamic imports for better performance
const SearchBar = dynamic(() => import("@/components/search-bar/SearchBar"), {
  loading: () => <div className={styles.searchLoading}>Loading search...</div>,
});

const BazaarFooter = dynamic(() => import("@/components/bazaar-footer/BazaarFooter"), {
  ssr: false,
  loading: () => <div className={styles.footerLoading}>Loading...</div>,
});

const SERVICE_NOTE = "We only provide an online bazaar. Sellers handle payments & delivery directly.";
const TOP_RATED_SELLERS = getTopRatedSellers(12);
const STAR = "\u2605";

export default function Home() {
  const [hasShop, setHasShop] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "" });

  useEffect(() => {
    // Check if user has a registered shop
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const shops = JSON.parse(stored);
        setHasShop(shops.length > 0);
      }
    }
  }, []);

  return (
    <div className={styles.page} suppressHydrationWarning>
      <Navbar />

      {/* Notification Toast */}
      {notification.show && (
        <div className={styles.notification}>
          <span className={styles.notificationIcon}>✓</span>
          <span className={styles.notificationMessage}>{notification.message}</span>
        </div>
      )}

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy} suppressHydrationWarning>
            <h1>Find Your Marketplace Across Pakistan</h1>
            <p>
              Each city card mirrors the traditional bazaar layout - distinct
              sectors for clothes, perfumes, electronics, and more - so buyers
              can jump straight to the industry they need.
            </p>
          </div>
        </section>

        <SearchBar />

        <section className={styles.cityGrid} aria-label="City marketplaces">
          {BASE_CITY_MARKETS.map((city, index) => {
            const categorySlugs = Object.keys(city.industries || {});
            const primaryCategory =
              (city.defaultCategory && categorySlugs.includes(city.defaultCategory))
                ? city.defaultCategory
                : categorySlugs[0] ?? "clothes";
            return (
              <Link
                key={city.slug}
                href={`/city/${city.slug}/${primaryCategory}`}
                className={styles.cityButton}
                aria-label={`Explore ${city.name} marketplace`}
              >
                <div className={styles.cityButtonImage} suppressHydrationWarning>
                  <Image
                    src={city.image}
                    alt={`${city.name} landmark`}
                    fill
                    className={styles.buttonImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 200px"
                    loading={index < 4 ? "eager" : "lazy"}
                    quality={75}
                  />
                </div>
                <span className={styles.cityButtonName}>{city.name}</span>
              </Link>
            );
          })}
        </section>

                        <section id="top-rated" className={styles.topRatedSection} aria-labelledby="top-rated-title">
          <header className={styles.topRatedHeader}>
            <h2 id="top-rated-title">Top Rated Sellers Across Pakistan</h2>
            <p>
              Discover the stalls buyers trust the most for service, quality, and fast delivery no
              matter where they order from.
            </p>
          </header>
          <div className={styles.topRatedGrid} suppressHydrationWarning>
            {TOP_RATED_SELLERS.map((seller) => (
              <Link
                key={`${seller.citySlug}-${seller.slug || seller.name}`}
                href={seller.path}
                className={styles.topRatedCard}
              >
                <div className={styles.topRatedCardHeader} suppressHydrationWarning>
                  <h3>{seller.name}</h3>
                  {seller.rating ? (
                    <span className={styles.topRatedRating}>
                      {`${seller.rating.toFixed(1)} ${STAR}`}
                    </span>
                  ) : (
                    <span className={styles.topRatedRating}>New</span>
                  )}
                </div>
                <p className={styles.topRatedMeta}>
                  {seller.categoryName} - {seller.cityName}
                </p>
                <p className={styles.topRatedReviews}>
                  {seller.reviews ? `${seller.reviews} reviews` : "Awaiting reviews"}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <BazaarFooter note={SERVICE_NOTE} topRatedSellers={TOP_RATED_SELLERS} />
      </main>
    </div>
  );
}










