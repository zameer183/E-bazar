"use client";

import styles from "./page.module.css";

const WHY_POINTS = [
  "List your shop in the lanes Pakistanis already trust - no complicated onboarding.",
  "Reach city-wide buyers searching by industry, subcategory, and bazaar culture.",
  "Keep full control of pricing and payments while we surface your story to new customers.",
];

const FUTURE_POINTS = [
  "More verified seller badges powered by buyer feedback from every province.",
  "City-specific discovery feeds highlighting seasonal trends and festival collections.",
  "Logistics partners so you can promise fast delivery without building your own network.",
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1>About E-Bazar</h1>
        <p>
          E-Bazar celebrates Pakistan&apos;s marketplace heritage - from Karachi&apos;s buzzing
          streets to the artisans of Bahawalpur. We organize that energy into a digital bazaar so
          buyers can explore confident, city-first shopping without losing the culture that makes
          every stall special.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Why Choose Us</h2>
        <p>
          We are bazaar people through and through. E-Bazar is built with the rhythm of Pakistani
          city markets in mind, giving shoppers the comfort of familiar lanes and giving sellers an
          instant digital showcase.
        </p>
        <ul className={styles.list}>
          {WHY_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Grow Without Extra Overheads</h2>
        <p>
          Buyers don&apos;t demand a personal website or fancy marketing campaign here. Just bring
          your best dealing, honest prices, quality products, and timely delivery. Earn trust,
          respond quickly, and your lane stays busy.
        </p>
      </section>

      <section className={styles.section}>
        <h2>The Road Ahead</h2>
        <p>We&apos;re continuously widening the bazaar so sellers can sell smarter today and tomorrow.</p>
        <ul className={styles.list}>
          {FUTURE_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
