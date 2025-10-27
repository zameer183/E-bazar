"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, onAuthChange } from "@/lib/auth";
import styles from "./page.module.css";

const PACKAGES = [
  {
    id: "free",
    label: "Free Package",
    tagline: "For new sellers testing the waters",
    price: "Limited listings",
    description:
      "Get started with a basic presence in E-Bazar and list a limited number of products.",
    features: ["Up to 5 active listings", "Community reviews", "City visibility"],
  },
  {
    id: "standard",
    label: "Standard Package",
    tagline: "For shops ready to grow",
    price: "Monthly fee",
    description:
      "Scale your reach with 25 listings and better placement inside city markets.",
    features: [
      "Up to 25 active listings",
      "Priority placement in category results",
      "Access to promotional campaigns",
    ],
  },
  {
    id: "premium",
    label: "Premium Package",
    tagline: "For brands that want the spotlight",
    price: "Featured store",
    description:
      "Own the spotlight with 100 listings, premium placement, and featured branding across E-Bazar.",
    features: [
      "Up to 100 active listings",
      "Featured city placement",
      "Dedicated storefront banner",
      "Priority support & insights",
    ],
  },
];

export default function RegisterPackages() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let redirected = false;

    const unsubscribe = onAuthChange((user) => {
      if (!isMounted) return;
      if (user) {
        setAuthReady(true);
      } else {
        setAuthReady(false);
        if (!redirected) {
          redirected = true;
          router.replace(`/login?redirect=${encodeURIComponent("/register")}`);
        }
      }
    });

    const currentUser = getCurrentUser?.();
    if (currentUser && isMounted) {
      setAuthReady(true);
    }

    return () => {
      isMounted = false;
      redirected = true;
      unsubscribe?.();
    };
  }, [router]);

  const handleSelect = (planId) => {
    router.push(`/register/details?plan=${planId}`);
  };

  if (!authReady) {
    return null;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.pricingSection}>
          <div className={styles.container}>
            <header className={styles.intro}>
              <h1>Ecommerce made easy for every stage of your business</h1>
              <p>
                Choose the perfect plan to support your business from its first steps
                to the big leagues. List your shop and appear inside city industry
                sections with trusted ratings and reviews.
              </p>
            </header>

            <div className={styles.cardGrid}>
              {PACKAGES.map((pkg) => (
                <article key={pkg.id} className={styles.card}>
                  <div className={styles.cardDetails}>
                    <h2>{pkg.label}</h2>
                    <p className={styles.cardTagline}>{pkg.tagline}</p>
                    <div className={styles.priceBadge}>
                      <span>{pkg.price}</span>
                    </div>
                    <p className={styles.cardDescription}>{pkg.description}</p>
                    <button
                      type="button"
                      className={styles.cardCta}
                      onClick={() => handleSelect(pkg.id)}
                    >
                      Select {pkg.label}
                    </button>
                  </div>
                  <div className={styles.cardFeatures}>
                    <p className={styles.cardFeaturesHeading}>
                      <strong>Includes:</strong>
                    </p>
                    <ul>
                      {pkg.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <p className={styles.disclaimer}>
              All packages are billed securely through E-Bazar. Taxes are calculated at
              checkout where applicable.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
