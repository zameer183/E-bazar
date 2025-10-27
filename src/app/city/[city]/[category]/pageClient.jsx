"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  STORAGE_KEY,
  CATEGORY_TO_BAZAAR,
  createSellerSlug,
  createProductShowcase,
  getBazaarDefinition,
  getBazaarSubcategories,
} from "@/data/markets";
import SearchBar from "@/components/search-bar/SearchBar";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

// Dynamic import for footer
const BazaarFooter = dynamic(() => import("@/components/bazaar-footer/BazaarFooter"), {
  ssr: false,
});

const SERVICE_NOTE =
  "We only provide an online bazaar. Sellers handle payments & delivery directly.";

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
  const orderedCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    const prioritySlug = "art-craft";
    return [...categories].sort((a, b) => {
      if (a.slug === prioritySlug) return -1;
      if (b.slug === prioritySlug) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [categories]);

  const formatCategoryLabel = (category) => {
    if (!category) return "";
    const bazaarSlugForCategory = CATEGORY_TO_BAZAAR[category.slug];
    if (bazaarSlugForCategory) {
      const definition = getBazaarDefinition(bazaarSlugForCategory);
      if (definition?.title) return definition.title;
    }
    const trimmed = category.name?.trim?.() ?? "";
    return trimmed.toLowerCase().includes("bazaar") ? trimmed : `${trimmed} Bazaar`;
  };

  useEffect(() => {
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

    loadShops();
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        loadShops();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [city.slug, city.name, industry.slug, industry.name]);

  const sellers = useMemo(() => {
    const base = industry.sellers || [];
    const dynamic = dynamicShops.map((shop, index) => {
      const slug = shop.slug || createSellerSlug(city.name, shop.name);
      const fallbackFocus =
        subcategoryFocuses.length > 0
          ? subcategoryFocuses[index % subcategoryFocuses.length]
          : null;
      return {
        id: shop.id, // Add unique ID
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
    return [...base, ...dynamic].sort((a, b) => a.name.localeCompare(b.name));
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
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1>
              {city.name} {industry.name} Market
            </h1>
          </div>
        </section>

        <SearchBar citySlug={city.slug} lockCity />

        {/* Category Navigation - Show all main categories for this city */}
        {totalCategories > 0 && (
          <div
            className={styles.subcategoryBar}
            role="tablist"
            aria-label={`${city.name} categories`}
          >
            {orderedCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/city/${city.slug}/${category.slug}`}
                className={
                  category.slug === industry.slug
                    ? styles.subcategoryLinkActive
                    : styles.subcategoryLink
                }
              >
                {formatCategoryLabel(category)}
              </Link>
            ))}
          </div>
        )}

        {subcategories.length > 0 && (
          <div className={styles.subcategoryFocusWrapper}>
            <div className={styles.subcategoryFocusBar} role="tablist" aria-label={`${industry.name} subcategories`}>
              <Link
                href={basePath}
                className={!hasFocus ? styles.focusLinkActive : styles.focusLink}
              >
                All {industry.name}
              </Link>
              {subcategories.map((subcategory) => (
                <Link
                  key={subcategory.focus}
                  href={`${basePath}?focus=${subcategory.focus}`}
                  className={
                    focusParam === subcategory.focus
                      ? styles.focusLinkActive
                      : styles.focusLink
                  }
                >
                  {subcategory.label}
                </Link>
              ))}
            </div>
          </div>
        )}

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
                  key={seller.id || `${seller.slug}-${idx}`}
                  href={`/city/${city.slug}/${industry.slug}/${seller.slug ?? createSellerSlug(city.name, seller.name)}`}
                  className={styles.sellerLink}
                >
                  <article className={styles.sellerCard}>
                    <div className={styles.sellerHeader}>
                      <h3>{seller.name}</h3>
                      <div className={styles.sellerTags}>
                        <span className={styles.planTag}>{seller.plan}</span>
                      </div>
                    </div>
                    <div className={styles.sellerMeta}>
                      <span>{seller.address}</span>
                      <span>{seller.contact}</span>
                      {seller.subcategoryFocus && (
                        <span className={styles.subcategoryInfo}>
                          {subcategoryLabelMap[seller.subcategoryFocus] ||
                            seller.subcategoryFocus.replaceAll("-", " ")}
                        </span>
                      )}
                    </div>
                    <div className={styles.sellerRatings}>
                      <span>
                        {seller.rating ? `${seller.rating.toFixed(1)} / 5` : "New Store"}
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

        <BazaarFooter note={SERVICE_NOTE} />
      </main>
    </div>
  );
}








