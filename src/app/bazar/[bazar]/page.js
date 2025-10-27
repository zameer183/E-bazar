"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getBazaarDefinition } from "@/data/markets";
import SearchBar from "@/components/search-bar/SearchBar";
import BazaarFooter from "@/components/bazaar-footer/BazaarFooter";
import { useCities } from "@/lib/cities";
import styles from "./page.module.css";

const SERVICE_NOTE = "We only provide an online bazaar. Sellers handle payments & delivery directly.";

export default function BazaarPage({ params }) {
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get("city");
  const bazaarSlug = params?.bazar;
  const cities = useCities();
  const bazaarDef = getBazaarDefinition(bazaarSlug);

  if (!bazaarDef) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <h1>Bazaar Not Found</h1>
          <p>The bazaar you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className={styles.homeLink}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const filteredCities = selectedCity
    ? cities.filter((city) => city.slug === selectedCity)
    : cities;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/bazar/${bazaarSlug}`}>{bazaarDef.title}</Link>
          {selectedCity && (
            <>
              <span>/</span>
              <span>{filteredCities[0]?.name || selectedCity}</span>
            </>
          )}
        </nav>
      </header>

      <main className={styles.main}>
        <SearchBar enableCityFilter bazaarSlug={bazaarSlug} />

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>{bazaarDef.title}</h1>
            <p>{bazaarDef.description}</p>
            {selectedCity && filteredCities.length > 0 && (
              <p className={styles.cityNote}>
                Showing {bazaarDef.title} in {filteredCities[0].name}
              </p>
            )}
          </div>
        </section>

        {bazaarDef.subcategories && bazaarDef.subcategories.length > 0 && (
          <section className={styles.subcategoriesSection}>
            <h2>Browse by Subcategory</h2>
            <p className={styles.subcategoryHint}>
              Choose your subcategory to explore sellers.{" "}
              {!selectedCity &&
                "Karachi will be shown by default - use the search bar to select a different city."}
            </p>
            <div className={styles.subcategoryGrid}>
              {bazaarDef.subcategories.map((sub) => {
                const categorySlug = sub.categorySlug || "clothes";
                const targetCity = selectedCity || "karachi";
                return (
                  <Link
                    key={sub.focus}
                    href={`/city/${targetCity}/${categorySlug}?focus=${sub.focus}`}
                    className={styles.subcategoryCard}
                  >
                    <h3>{sub.label}</h3>
                    <p>Explore specialized sellers in this lane</p>
                    <span className={styles.subcategoryArrow}>Browse {"->"}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <BazaarFooter note={SERVICE_NOTE} />
      </main>
    </div>
  );
}
