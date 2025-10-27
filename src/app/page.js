"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import { BASE_CITY_MARKETS, getTopRatedSellers } from "@/data/markets";
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

export default function Home() {
  return (
    <div className={styles.page} suppressHydrationWarning>
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
          <Link
            href="/cities"
            className={styles.cityButtonCta}
            aria-label="View all city marketplaces"
          >
            <span className={styles.cityButtonCtaLabel}>
              View All Cities
              <span aria-hidden="true" className={styles.cityButtonCtaHint}>
                See every marketplace across Pakistan
              </span>
            </span>
          </Link>
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
                </div>
                <p className={styles.topRatedMeta}>
                  {seller.categoryName} - {seller.cityName}
                </p>
                <ReviewSummary
                  rating={seller.rating ?? 0}
                  count={seller.reviews ?? 0}
                  readHref={`${seller.path}#reviews`}
                  readLabel="Read reviews"
                  writeHref={`/reviews?seller=${encodeURIComponent(seller.slug || seller.name)}`}
                  writeLabel="Write a review"
                />
              </Link>
            ))}
          </div>
          <Link href="/top-rated" className={styles.topRatedCta}>
            <span className={styles.topRatedCtaCircle} aria-hidden="true">
              <span className={`${styles.topRatedCtaIcon} ${styles.topRatedCtaArrow}`} />
            </span>
            <span className={styles.topRatedCtaLabel}>Browse Pakistan-wide champions</span>
          </Link>
        </section>

        <BazaarFooter note={SERVICE_NOTE} />
      </main>
    </div>
  );
}










