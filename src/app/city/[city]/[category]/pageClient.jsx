"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  STORAGE_KEY,
  CATEGORY_TO_BAZAAR,
  createSellerSlug,
  createProductShowcase,
  getBazaarSubcategories,
  getTopRatedSellers,
} from "@/data/markets";
import BazaarFooter from "@/components/bazaar-footer/BazaarFooter";
import SearchBar from "@/components/search-bar/SearchBar";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

const SERVICE_NOTE =
  "We only provide an online bazaar. Sellers handle payments & delivery directly.";
const GLOBAL_TOP_RATED = getTopRatedSellers(8);

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

export default function CategoryPageClient(props) {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading bazaar lanes...</div>}>
      <CategoryPageContent {...props} />
    </Suspense>
  );
}

function CategoryPageContent({ city, industry, categories }) {
  const [dynamicShops, setDynamicShops] = useState([]);
  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus");
  const bazaarSlug = CATEGORY_TO_BAZAAR[industry.slug];
  const subcategories = useMemo(
    () => getBazaarSubcategories(bazaarSlug),
    [bazaarSlug],
  );
  const subcategoryFocuses = useMemo(
    () => subcategories.map((sub) => sub.focus),
    [subcategories],
  );
  const totalCategories = categories?.length ?? 0;

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
    const dynamic = dynamicShops.map((shop, index) => {
      const slug = shop.slug || createSellerSlug(city.name, shop.name);
      const fallbackFocus =
        subcategoryFocuses.length > 0
          ? subcategoryFocuses[index % subcategoryFocuses.length]
          : null;
      return {
        name: shop.name,
        slug,
        address: shop.address,
        contact: shop.contact,
        rating: shop.rating ?? 0,
        reviews: shop.reviews ?? 0,
        plan: shop.planLabel || shop.plan || "Marketplace Partner",
        description:
          shop.description ||
          `${shop.name} serves ${industry.name.toLowerCase()} buyers across ${city.name}.`,
        products:
          shop.products && shop.products.length > 0
            ? shop.products
            : createProductShowcase(industry.slug, index),
        subcategoryFocus: shop.subcategoryFocus || shop.focus || fallbackFocus,
      };
    });
    return [...base, ...dynamic].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [
    industry.sellers,
    dynamicShops,
    city.name,
    industry.name,
    industry.slug,
    subcategoryFocuses,
  ]);

  const filteredSellers = useMemo(() => {
    if (!focusParam) return sellers;
    return sellers.filter((seller) => seller.subcategoryFocus === focusParam);
  }, [focusParam, sellers]);

  const activeSubcategory = useMemo(
    () => subcategories.find((sub) => sub.focus === focusParam) || null,
    [focusParam, subcategories],
  );

  const hasFocus = Boolean(focusParam && activeSubcategory);
  const basePath = `/city/${city.slug}/${industry.slug}`;
  const subcategoryLabelMap = useMemo(() => {
    const map = {};
    subcategories.forEach((subcategory) => {
      map[subcategory.focus] = subcategory.label;
    });
    return map;
  }, [subcategories]);

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
      </header>

      <main className={styles.main}>
        <SearchBar citySlug={city.slug} lockCity />
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
              Pakistan&apos;s marketplace alive - organized so shoppers reach the
              right lane instantly.
            </p>
            {subcategories.length > 0 && (
              <div
                className={styles.subcategoryBar}
                role="tablist"
                aria-label={`${industry.name} subcategories`}
              >
                <Link
                  href={basePath}
                  className={
                    hasFocus ? styles.subcategoryLink : styles.subcategoryLinkActive
                  }
                >
                  All lanes
                </Link>
                {subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.focus}
                    href={`${basePath}?focus=${subcategory.focus}`}
                    className={
                      focusParam === subcategory.focus
                        ? styles.subcategoryLinkActive
                        : styles.subcategoryLink
                    }
                  >
                    {subcategory.label}
                  </Link>
                ))}
              </div>
            )}
            <p className={styles.sellerCount}>
              {hasFocus && activeSubcategory
                ? `Showing ${filteredSellers.length} sellers from the ${activeSubcategory.label} lane.`
                : `Showing ${filteredSellers.length} sellers across ${Math.max(
                    subcategories.length,
                    1,
                  )} bazaar lanes.`}
            </p>
            <p className={styles.marketMeta}>
              Connected to {totalCategories} major categories in {city.name}.
            </p>
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
          {filteredSellers.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No sellers are listed for this lane yet. Check back soon.</p>
              <Link href={basePath} className={styles.resetFilter}>
                View all sellers
              </Link>
            </div>
          ) : (
            <div className={styles.sellerGrid}>
              {filteredSellers.map((seller, idx) => (
                <Link
                  key={seller.slug ?? `${seller.name}-${idx}`}
                  href={`/city/${city.slug}/${industry.slug}/${seller.slug ?? createSellerSlug(city.name, seller.name)}`}
                  className={styles.sellerLink}
                >
                  <article className={styles.sellerCard}>
                    <div className={styles.sellerHeader}>
                      <h3>{seller.name}</h3>
                      <div className={styles.sellerTags}>
                        {seller.subcategoryFocus && (
                          <span className={styles.subcategoryTag}>
                            {subcategoryLabelMap[seller.subcategoryFocus] ||
                              seller.subcategoryFocus.replaceAll("-", " ")}
                          </span>
                        )}
                        <span className={styles.planTag}>{seller.plan}</span>
                      </div>
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
                        {seller.reviews
                          ? `${seller.reviews} reviews`
                          : "Awaiting reviews"}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className={styles.ctaBanner}>
          <div>
            <h3>List your store with E-Bazar</h3>
            <p>
              Select a subscription package, register your bazaar stall, and
              appear instantly in the right city lane.
            </p>
          </div>
          <p className={styles.ctaHint}>
            Tap the bottom-right button to start your registration.
          </p>
        </section>

        <BazaarFooter note={SERVICE_NOTE} topRatedSellers={GLOBAL_TOP_RATED} />
      </main>
    </div>
  );
}








