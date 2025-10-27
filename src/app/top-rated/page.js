"use client";

import Link from "next/link";
import { getTopRatedSellers } from "@/data/markets";
import styles from "./page.module.css";

const FEATURED_SELLERS = getTopRatedSellers(36);
const STAR = "\u2605";

export default function TopRatedPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1>Top Rated Sellers Across Pakistan</h1>
        <p>
          These stalls earned the community&apos;s trust through honest dealing, strong product
          quality, and deliveries that arrive when promised. Explore the champions from every city
          and lane.
        </p>
      </header>

      <section className={styles.tips}>
        <h2>How Sellers Earn This Badge</h2>
        <ul>
          <li>Clear communication and respectful dealing with every buyer.</li>
          <li>Consistent product quality that matches the description shared online.</li>
          <li>Fast, reliable delivery even without running a personal website.</li>
        </ul>
        <p>
          Focus on these basics and your stall can climb the rankings too. We surface great service,
          not expensive marketing.
        </p>
      </section>

      <section className={styles.grid} aria-label="Top rated sellers list">
        {FEATURED_SELLERS.length === 0 ? (
          <p className={styles.emptyState}>
            No sellers have been highlighted yet. Once real reviews arrive, verified favourites will appear here automatically.
          </p>
        ) : (
          FEATURED_SELLERS.map((seller) => (
            <Link key={`${seller.citySlug}-${seller.slug}`} href={seller.path} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{seller.name}</h3>
                <span className={styles.rating}>
                  {seller.rating ? `${seller.rating.toFixed(1)} ${STAR}` : "New"}
                </span>
              </div>
              <p className={styles.meta}>
                {seller.categoryName} - {seller.cityName}
              </p>
              <p className={styles.reviews}>
                {seller.reviews ? `${seller.reviews} verified reviews` : "Awaiting first reviews"}
              </p>
              {seller.plan && <span className={styles.plan}>{seller.plan}</span>}
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
