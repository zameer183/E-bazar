"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/search-bar/SearchBar";
import {
  BASE_CITY_MARKETS,
  HERO_SLIDES,
  BAZAAR_ORDER,
  getBazaarDefinition,
} from "@/data/markets";
import BazaarFooter from "@/components/bazaar-footer/BazaarFooter";
import styles from "./page.module.css";

const SERVICE_NOTE =
  "We only provide an online bazaar – sellers handle payments & delivery directly.";

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
        <Link href="/register" className={styles.registerButton}>
          Register Apni Dukan
        </Link>
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
                      sizes="(max-width: 768px) 100vw, 45vw"
                      priority={index < 2}
                      quality={90}
                    />
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

        <div className={styles.serviceStrip} role="note">
          {SERVICE_NOTE}
        </div>

        <SearchBar />

        <section className={styles.cityGrid} aria-label="City marketplaces">
          {BASE_CITY_MARKETS.map((city) => (
            <article key={city.slug} className={styles.cityCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={city.image}
                  alt={`${city.name} landmark`}
                  fill
                  className={styles.cityImage}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
                  priority={city.slug === "karachi"}
                />
              </div>
              <div className={styles.cardContent}>
                <h2>{city.name}</h2>
                <p className={styles.cardIntro}>
                  Navigate the city&apos;s iconic markets and explore dedicated
                  sectors inspired by Pakistan&apos;s traditional bazaars.
                </p>
                <div className={styles.industrySlider} role="list">
                  {BAZAAR_ORDER.map((bazaarSlug) => {
                    const bazaar = getBazaarDefinition(bazaarSlug);
                    return (
                      <Link
                        key={`${city.slug}-${bazaarSlug}`}
                        href={`/city/${city.slug}/bazar/${bazaarSlug}`}
                        className={styles.industryPill}
                        role="listitem"
                      >
                        {bazaar?.title ?? bazaarSlug}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </section>

        <BazaarFooter note={SERVICE_NOTE} />
      </main>
    </div>
  );
}
