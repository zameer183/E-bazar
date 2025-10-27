"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/search-bar/SearchBar";
import { BASE_CITY_MARKETS, HERO_SLIDES, getTopRatedSellers } from "@/data/markets";
import BazaarFooter from "@/components/bazaar-footer/BazaarFooter";
import styles from "./page.module.css";

const SERVICE_NOTE = "We only provide an online bazaar. Sellers handle payments & delivery directly.";
const TOP_RATED_SELLERS = getTopRatedSellers(12);
const STAR = "\u2605";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? HERO_SLIDES.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.logo}>E-Bazar</div>
        <div className={styles.tagline}>
          <span className={styles.taglineTitle}>Industry-wise Digital Bazaar</span>
          <p className={styles.taglineCopy}>
            Explore Pakistan&apos;s marketplace culture city by city.
          </p>
        </div>
        <div className={styles.actionGroup}>
          <Link href="/about" className={styles.aboutLink}>
            About Us
          </Link>
          <Link href="/top-rated" className={styles.topRatedButton}>
            Top Rated from all Over Pakistan
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1>Find Your Marketplace Across Pakistan</h1>
            <p>
              Each city card mirrors the traditional bazaar layout - distinct
              sectors for clothes, perfumes, electronics, and more - so buyers
              can jump straight to the industry they need.
            </p>
          </div>
          <div className={styles.heroSlider}>
            <div className={styles.sliderViewport}>
              <div
                className={styles.sliderTrack}
                style={{
                  width: `${HERO_SLIDES.length * 100}%`,
                  transform: `translateX(-${
                    (100 / HERO_SLIDES.length) * currentSlide
                  }%)`,
                }}
              >
                {HERO_SLIDES.map((slide, index) => (
                  <div key={slide.alt} className={styles.slide}>
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      className={styles.slideImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 520px"
                      priority={index === 0}
                    />
                    <div className={styles.slideOverlay}>
                      <h3>{slide.alt}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={`${styles.sliderButton} ${styles.sliderButtonLeft}`}
                onClick={handlePrev}
                aria-label="Show previous landmark"
              >
                {"<"}
              </button>
              <button
                type="button"
                className={`${styles.sliderButton} ${styles.sliderButtonRight}`}
                onClick={handleNext}
                aria-label="Show next landmark"
              >
                {">"}
              </button>
            </div>
            <div className={styles.sliderDots}>
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.alt}
                  type="button"
                  className={
                    index === currentSlide
                      ? styles.sliderDotActive
                      : styles.sliderDot
                  }
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <SearchBar />

        <section className={styles.cityGrid} aria-label="City marketplaces">
          {BASE_CITY_MARKETS.map((city) => {
            const categorySlugs = Object.keys(city.industries || {});
            const primaryCategory =
              (city.defaultCategory && categorySlugs.includes(city.defaultCategory))
                ? city.defaultCategory
                : categorySlugs[0] ?? "clothes";
            return (
              <Link
                key={city.slug}
                href={`/city/${city.slug}/${primaryCategory}`}
                className={styles.cityCardLink}
                aria-label={`Explore ${city.name} marketplace`}
              >
                <article className={styles.cityCard}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={city.image}
                      alt={`${city.name} landmark`}
                      fill
                      className={styles.cityImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 300px"
                      priority={city.slug === "karachi"}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h2>{city.name}</h2>
                    <p className={styles.cardIntro}>
                      Step into the digital lanes of {city.name} inspired by its historic bazaars.
                    </p>
                    <p className={styles.cardStats}>
                      {categorySlugs.length} curated industry lanes ready for buyers.
                    </p>
                  </div>
                </article>
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
          <div className={styles.topRatedGrid}>
            {TOP_RATED_SELLERS.map((seller) => (
              <Link
                key={`${seller.citySlug}-${seller.slug || seller.name}`}
                href={seller.path}
                className={styles.topRatedCard}
              >
                <div className={styles.topRatedCardHeader}>
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










