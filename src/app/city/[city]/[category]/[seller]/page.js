"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import SellerPageClient from "./pageClient";
import { findCityBySlug, useCities } from "@/lib/cities";
import styles from "./page.module.css";

const findIndustry = (city, categorySlug) => city?.industries?.[categorySlug] || null;

const findBaseSeller = (industry, sellerSlug) => {
  if (!industry || !Array.isArray(industry.sellers)) return null;
  return (
    industry.sellers.find((seller) => {
      const normalized = seller.slug || "";
      return normalized.toLowerCase() === sellerSlug;
    }) || null
  );
};

export default function SellerPage() {
  const params = useParams();
  const citySlug = (params?.city || "").toLowerCase();
  const categorySlug = (params?.category || "").toLowerCase();
  const sellerSlug = (params?.seller || "").toLowerCase();
  const cities = useCities();

  const city = useMemo(() => findCityBySlug(cities, citySlug), [cities, citySlug]);
  const industry = useMemo(() => findIndustry(city, categorySlug), [city, categorySlug]);
  const baseSeller = useMemo(() => findBaseSeller(industry, sellerSlug), [industry, sellerSlug]);

  if (!city || !industry) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <h1>Seller Not Found</h1>
              <p>The seller you looked for does not exist in this marketplace yet.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <SellerPageClient
      city={{
        name: city.name,
        slug: city.slug,
        image: city.image,
        detailImage: city.detailImage ?? city.image,
      }}
      industry={{
        name: industry.name,
        slug: categorySlug,
      }}
      baseSeller={baseSeller}
      slugs={{ city: citySlug, category: categorySlug, seller: sellerSlug }}
    />
  );
}
