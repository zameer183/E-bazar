"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";

const PACKAGES = [
  {
    id: "free",
    label: "Free Package",
    price: "Limited listings",
    description:
      "Get started with a basic presence in E-Bazar and list a limited number of products.",
    features: ["Up to 5 active listings", "Community reviews", "City visibility"],
  },
  {
    id: "standard",
    label: "Standard Package",
    price: "Monthly fee",
    description:
      "Scale your reach with flexible listings and better placement inside city markets.",
    features: [
      "Unlimited listings",
      "Priority placement in category results",
      "Access to promotional campaigns",
    ],
  },
  {
    id: "premium",
    label: "Premium Package",
    price: "Featured store",
    description:
      "Own the spotlight with premium placement and featured branding across E-Bazar.",
    features: [
      "Featured city placement",
      "Dedicated storefront banner",
      "Priority support & insights",
    ],
  },
];

export default function RegisterPackages() {
  const router = useRouter();

  const handleSelect = (planId) => {
    router.push(`/register/details?plan=${planId}`);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Register Apni Dukan</h1>
          <p>
            Choose a subscription that fits your goals, then list your shop to appear
            inside your city's industry sections with ratings and reviews.
          </p>
        </section>

        <section className={styles.packageGrid}>
          {PACKAGES.map((pkg) => (
            <article key={pkg.id} className={styles.packageCard}>
              <h2>{pkg.label}</h2>
              <p className={styles.packagePrice}>{pkg.price}</p>
              <p className={styles.packageDescription}>{pkg.description}</p>
              <ul className={styles.packageFeatures}>
                {pkg.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                className={styles.selectButton}
                onClick={() => handleSelect(pkg.id)}
              >
                Select {pkg.label}
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
