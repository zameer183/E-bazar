"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { STORAGE_KEY } from "@/data/markets";
import styles from "./page.module.css";

const matchCity = (shop, slug, name) => {
  const shopCitySlug = shop.citySlug?.toLowerCase?.();
  const shopCityName = shop.city?.toLowerCase?.();
  return shopCitySlug === slug || shopCityName === name.toLowerCase();
};

const matchCategory = (shop, slug, name) => {
  const shopCategorySlug = shop.categorySlug?.toLowerCase?.();
  const shopCategoryName = shop.category?.toLowerCase?.();
  return shopCategorySlug === slug || shopCategoryName === name.toLowerCase();
};

export default function CategoryPageClient({ city, industry, categories }) {
  const [dynamicShops, setDynamicShops] = useState([]);

  const loadShops = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setDynamicShops([]);
        return;
      }
      const parsed = JSON.parse(stored);
      const filtered = parsed.filter(
        (shop) =>
          matchCity(shop, city.slug, city.name) &&
          matchCategory(shop, industry.slug, industry.name),
      );
      setDynamicShops(filtered);
    } catch (error) {
      console.error("Unable to read stored shops", error);
      setDynamicShops([]);
    }
  };

  useEffect(() => {
    loadShops();
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        loadShops();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city.slug, industry.slug]);

  const sellers = useMemo(() => {
    const base = industry.sellers || [];
    const dynamic = dynamicShops.map((shop) => ({
      name: shop.name,
      address: shop.address,
      contact: shop.contact,
      rating: shop.rating ?? 0,
      reviews: shop.reviews ?? 0,
      plan: shop.planLabel || shop.plan || "Marketplace Partner",
    }));
    return [...base, ...dynamic];
  }, [industry.sellers, dynamicShops]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/city/${city.slug}/${industry.slug}`}>{city.name}</Link>
          <span>/</span>
          <span>{industry.name}</span>
        </nav>
        <Link href="/register" className={styles.registerButton}>
          Register Apni Dukan
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroImage}>
            <Image
              src={city.detailImage ?? city.image}
              alt={`${city.name} landmark view`}
              fill
              className={styles.heroAsset}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className={styles.heroCopy}>
            <h1>
              {city.name} {industry.name} Market
            </h1>
            <p>
              Discover curated {industry.name.toLowerCase()} sellers from{" "}
              {city.name}&apos;s bazaar culture. Each stall keeps the spirit of
              Pakistan&apos;s marketplace alive—organized so shoppers reach the
              right lane instantly.
            </p>
            <p className={styles.sellerCount}>
              {sellers.length}+ specialist stores listed • Updated in real time
              with new registrations and reviews.
            </p>
            <div className={styles.categoryLinks}>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/city/${city.slug}/${category.slug}`}
                  className={
                    category.slug === industry.slug
                      ? styles.categoryLinkActive
                      : styles.categoryLink
                  }
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sellerSection}>
          <header className={styles.sectionHeader}>
            <h2>{industry.name} Sellers in {city.name}</h2>
            <p>
              Browse featured shops alongside newly registered sellers. Ratings
              and reviews update as the community shares feedback.
            </p>
          </header>
          <div className={styles.sellerGrid}>
            {sellers.map((seller) => (
              <article key={`${seller.name}-${seller.address}`} className={styles.sellerCard}>
                <div className={styles.sellerHeader}>
                  <h3>{seller.name}</h3>
                  <span className={styles.planTag}>{seller.plan}</span>
                </div>
                <div className={styles.sellerMeta}>
                  <span>{seller.address}</span>
                  <span>{seller.contact}</span>
                </div>
                <div className={styles.sellerRatings}>
                  <span>
                    {seller.rating ? `${seller.rating.toFixed(1)} ★` : "New Store"}
                  </span>
                  <span>
                    {seller.reviews ? `${seller.reviews} reviews` : "Awaiting reviews"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.ctaBanner}>
          <div>
            <h3>List your store with E-Bazar</h3>
            <p>
              Select a subscription package, register your bazaar stall, and
              appear instantly in the right city lane.
            </p>
          </div>
          <Link href="/register" className={styles.ctaButton}>
            Register Apni Dukan
          </Link>
        </section>
      </main>
    </div>
  );
}
