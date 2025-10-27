"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import BazaarPageClient from "./pageClient";
import { findCityBySlug, useCities } from "@/lib/cities";
import { getBazaarDefinition, getBazaarHeroImage } from "@/data/markets";
import styles from "./page.module.css";

const deriveFragranceSellers = (city) => city?.industries?.perfumes?.sellers || [];

export default function CityBazaarPage() {
  const params = useParams();
  const citySlug = (params?.city || "").toLowerCase();
  const bazaarSlug = (params?.bazar || "").toLowerCase();
  const cities = useCities();

  const city = useMemo(() => findCityBySlug(cities, citySlug), [cities, citySlug]);
  const bazaar = useMemo(() => getBazaarDefinition(bazaarSlug), [bazaarSlug]);

  if (!city || !bazaar) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <h1>Marketplace Not Available</h1>
              <p>This bazaar is not available for the selected city.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const heroImage = getBazaarHeroImage(city.slug, bazaar.slug) || city.detailImage || city.image;
  const fragranceSellers = bazaar.slug === "fragrance" ? deriveFragranceSellers(city) : [];

  return (
    <BazaarPageClient
      city={{
        name: city.name,
        slug: city.slug,
        image: city.image,
        detailImage: city.detailImage ?? city.image,
      }}
      bazaar={bazaar}
      fragranceSellers={fragranceSellers}
      heroImage={heroImage}
    />
  );
}
