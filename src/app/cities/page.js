"use client";

import Link from "next/link";
import landingStyles from "../page.module.css";
import styles from "./page.module.css";
import { useCities } from "@/lib/cities";
import Image from "next/image";
import { buildImageProps } from "@/lib/images";

export default function CitiesDirectory() {
  const cities = useCities();
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>All City Marketplaces</h1>
        <p>
          Browse every E-Bazar city hub. Each marketplace mirrors the local bazaar layout so you can
          jump straight into the industries you care about.
        </p>
      </header>

      <section className={`${landingStyles.cityGrid} ${styles.cityGrid}`} aria-label="All city marketplaces">
        {cities.map((city, index) => {
          const industries = Object.keys(city.industries || {});
          const defaultCategory =
            (city.defaultCategory && industries.includes(city.defaultCategory))
              ? city.defaultCategory
              : industries[0] ?? "clothes";

          return (
            <Link
              key={city.slug}
              href={`/city/${city.slug}/${defaultCategory}`}
              className={landingStyles.cityButton}
              aria-label={`Explore ${city.name} marketplace`}
            >
              <div className={landingStyles.cityButtonImage}>
                <Image
                  {...buildImageProps(city.image)}
                  alt={`${city.name} landmark`}
                  fill
                  className={landingStyles.buttonImage}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 220px"
                  loading={index < 6 ? "eager" : "lazy"}
                  quality={75}
                />
              </div>
              <span className={landingStyles.cityButtonName}>{city.name}</span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
