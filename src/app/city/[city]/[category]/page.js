"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import CategoryPageClient from "./pageClient";
import { useCities, findCityBySlug } from "@/lib/cities";
import styles from "./page.module.css";

const buildCategories = (city) =>
  Object.keys(city.industries || {}).map((slug) => ({
    slug,
    name: city.industries[slug].name,
  }));

export default function CityCategoryPage() {
  const params = useParams();
  const citySlug = (params?.city || "").toLowerCase();
  const categorySlug = (params?.category || "").toLowerCase();
  const cities = useCities();

  const city = useMemo(() => findCityBySlug(cities, citySlug), [cities, citySlug]);

  const categories = useMemo(() => (city ? buildCategories(city) : []), [city]);
  const industry = useMemo(() => city?.industries?.[categorySlug] || null, [city, categorySlug]);

  if (!city) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <h1>City Not Found</h1>
              <p>The marketplace you were looking for is not registered yet.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const targetIndustry =
    industry || {
      name: categorySlug || "",
      slug: categorySlug,
      sellers: [],
    };

  return (
    <CategoryPageClient
      city={{
        name: city.name,
        slug: city.slug,
        image: city.image,
        detailImage: city.detailImage ?? city.image,
      }}
      industry={{
        name: targetIndustry.name,
        slug: categorySlug,
        sellers: targetIndustry.sellers || [],
      }}
      categories={categories}
    />
  );
}
