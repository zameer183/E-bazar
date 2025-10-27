"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search-bar/SearchBar";
import BazaarFooter from "@/components/bazaar-footer/BazaarFooter";
import { getBazaarDefinition, getTopRatedSellers } from "@/data/markets";
import styles from "./page.module.css";

const SERVICE_NOTE = "We only provide an online bazaar. Sellers handle payments & delivery directly.";
const GLOBAL_TOP_RATED = getTopRatedSellers(8);

export default function BazaarPageClient({ city, bazaar, fragranceSellers, heroImage }) {
  const definition = getBazaarDefinition(bazaar.slug);
  const heroVisual = heroImage || city.detailImage || city.image;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/city/${city.slug}/bazar/${bazaar.slug}`}>{city.name}</Link>
          <span>/</span>
          <span>{definition?.title ?? bazaar.title}</span>
        </nav>
      </header>

      <main className={styles.main}>
        <SearchBar citySlug={city.slug} lockCity />

        <section className={styles.hero}>
          <div className={styles.heroImage}>
            <Image
              src={heroVisual}
              alt={`${city.name} bazaar visuals`}
              fill
              className={styles.heroAsset}
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </div>
          <div className={styles.heroCopy}>
            <h1>{definition?.title ?? bazaar.title}</h1>
            <p>{definition?.description}</p>
            <Suspense fallback={null}>
              <FocusNote />
            </Suspense>
          </div>

        </section>

        {bazaar.slug === "fragrance" ? (
          <>
            <section className={styles.highlights}>
              <header className={styles.sectionHeader}>
                <h2>Signature Fragrance Highlights</h2>
                <p>
                  Discover iconic scent profiles adored by shoppers across {city.name}.
                </p>
              </header>
              <div className={styles.highlightGrid}>
                {(definition?.highlights || []).map((item) => (
                  <article key={item.name} className={styles.highlightCard}>
                    <h3>{item.name}</h3>
                    <span>{item.origin}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.sellerSection}>
              <header className={styles.sectionHeader}>
                <h2>Featured Fragrance Houses</h2>
                <p>
                  Explore reputed perfume houses within {city.name} offering attars,
                  sprays, and bespoke scent services.
                </p>
              </header>
              <div className={styles.sellerGrid}>
                {fragranceSellers.map((seller) => {
                  const ratingLabel = seller.rating
                    ? `${seller.rating.toFixed(1)} \u2605`
                    : "New Store";
                  const reviewsLabel = seller.reviews
                    ? `${seller.reviews} reviews`
                    : "Awaiting reviews";

                  return (
                    <Link
                      key={seller.slug}
                      href={`/city/${city.slug}/perfumes/${seller.slug}`}
                      className={styles.sellerLink}
                    >
                      <article className={styles.sellerCard}>
                        <div className={styles.sellerHeader}>
                          <h3>{seller.name}</h3>
                          <span className={styles.planTag}>{seller.plan}</span>
                        </div>
                        <div className={styles.sellerMeta}>
                          <span>{seller.address}</span>
                          <span>{seller.contact}</span>
                        </div>
                        <div className={styles.sellerRatings}>
                          <span>{ratingLabel}</span>
                          <span>{reviewsLabel}</span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <section className={styles.subcategorySection}>
            <header className={styles.sectionHeader}>
              <h2>Choose Your Lane</h2>
              <p>
                Select the subcategory that fits your need and dive straight into the
                {` ${definition?.title?.toLowerCase() ?? bazaar.slug}`} listings for{" "}
                {city.name}.
              </p>
            </header>
            <div className={styles.subcategoryGrid}>
              {(definition?.subcategories || []).map((sub) => (
                <Link
                  key={sub.label}
                  href={`/city/${city.slug}/${sub.categorySlug}?focus=${sub.focus}`}
                  className={styles.subcategoryCard}
                >
                  <span>{sub.label}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <BazaarFooter note={SERVICE_NOTE} topRatedSellers={GLOBAL_TOP_RATED} />
      </main>
    </div>
  );
}

function FocusNote() {
  const searchParams = useSearchParams();
  const focus = searchParams.get("focus");
  if (!focus) return null;
  return (
    <p className={styles.focusNote}>
      {`Showing options related to "${focus.replaceAll("-", " ")}".`}
    </p>
  );
}






