"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import { getTopRatedSellers } from "@/data/markets";
import { useCities } from "@/lib/cities";
import { useI18n } from "@/lib/i18n";
import { buildImageProps } from "@/lib/images";

const SearchBar = dynamic(() => import("@/components/search-bar/SearchBar"), {
  loading: () => (
    <div className="flex h-24 items-center justify-center rounded-3xl border border-white/20 bg-white/60 shadow-sm dark:bg-bazar-darkCard/70">
      <span className="text-sm font-semibold text-bazar-text/70 dark:text-bazar-darkText/70">
        Loading search…
      </span>
    </div>
  ),
});

const BazaarFooter = dynamic(() => import("@/components/bazaar-footer/BazaarFooter"), {
  ssr: false,
  loading: () => (
    <div className="mt-16 rounded-3xl border border-white/40 bg-white/60 p-10 text-center shadow-sm dark:bg-bazar-darkCard/70">
      <span className="text-sm font-semibold text-bazar-text/60 dark:text-bazar-darkText/70">
        Loading footer…
      </span>
    </div>
  ),
});

const TOP_RATED_SELLERS = getTopRatedSellers(6);

export default function Home() {
  const cities = useCities();
  const { t, language } = useI18n();
  const serviceNote = t("service.note");
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-bazar-background to-white dark:from-bazar-darkBg dark:via-bazar-darkCard dark:to-bazar-darkBg">
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-10 md:px-6 lg:px-8" suppressHydrationWarning>
        <HeroSection cities={cities} />
        <SearchSection />
        <CitySection cities={cities} language={language} t={t} />
        <TopRatedSection t={t} />
        <BazaarFooter note={serviceNote} />
      </main>
    </div>
  );
}

function HeroSection({ cities }) {
  const { t, language } = useI18n();
  const cityMedia = useMemo(() => {
    if (!Array.isArray(cities)) {
      return [];
    }
    return cities
      .filter((city) => city?.name)
      .map((city) => ({
        name: city.name,
        image: city.detailImage ?? city.image ?? "/images/hero-background.jpg",
      }));
  }, [cities]);
  const cityNames = useMemo(() => cityMedia.map((entry) => entry.name), [cityMedia]);

  const fallbackLabel = language === "ur" ? "پاکستان" : "Pakistan";
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const activeCity = cityNames.length > 0 ? cityNames[activeCityIndex] : fallbackLabel;
  const activeCityImage =
    cityMedia.length > 0
      ? cityMedia[activeCityIndex]?.image ?? "/images/hero-background.jpg"
      : "/images/hero-background.jpg";

  useEffect(() => {
    setActiveCityIndex(0);
  }, [cityNames.length]);

  useEffect(() => {
    if (cityNames.length <= 1) {
      setActiveCityIndex(0);
      return undefined;
    }
    const interval = window.setInterval(() => {
      setActiveCityIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex >= cityNames.length ? 0 : nextIndex;
      });
    }, 3500);
    return () => window.clearInterval(interval);
  }, [cityNames]);

  const heroHeadline = useMemo(() => {
    if (language === "ur") {
      return `${activeCity} کے ہول سیل بازار اب آن لائن`;
    }
    return `Shop ${activeCity} Wholesale Bazaar Online`;
  }, [activeCity, language]);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-bazar-primary text-white shadow-bazar-card">
      <div className="absolute inset-0">
        <Image
          key={activeCityImage}
          src={activeCityImage}
          alt={`${activeCity} wholesale bazaar`}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-bazar-primary/80" />
      </div>
      <div className="relative flex flex-col gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
        <div className="max-w-xl space-y-5 animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em]">
            {language === "ur" ? "پورے پاکستان کے شہروں کے بازار" : "All Pakistan City Bazaars"}
          </p>
          <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm sm:text-4xl lg:text-5xl" key={activeCity}>
            {heroHeadline}
          </h1>
          <p className="text-base text-white/85 lg:text-lg">{t("home.hero.subtitle")}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/city/islamabad/clothes"
              className="rounded-full bg-bazar-gradient px-6 py-3 text-sm font-semibold text-white shadow-bazar-card transition duration-200 hover:shadow-bazar-hover"
            >
              Explore Aabpara
            </Link>
            <Link
              href="/cities"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/90 transition duration-200 hover:bg-white/10 hover:text-white"
            >
              View All Cities
            </Link>
          </div>
        </div>
        <div className="mt-10 flex w-full max-w-md flex-col gap-4 rounded-3xl border border-white/15 bg-black/20 p-6 backdrop-blur lg:mt-0">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">Marketplace Snapshot</h2>
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            {[
              { label: "Wholesale Vendors", value: "320+" },
              { label: "Cities Covered", value: "12" },
              { label: "Verified Orders", value: "18K" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/10 px-3 py-4 shadow-inner shadow-black/20">
                <p className="text-xl font-bold">{item.value}</p>
                <p className="text-xs text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchSection() {
  return (
    <section className="-mt-12 rounded-3xl border border-bazar-primary/10 bg-white/80 p-6 shadow-bazar-card backdrop-blur-lg dark:border-white/10 dark:bg-bazar-darkCard/90">
      <SearchBar />
    </section>
  );
}

function CitySection({ cities, language, t }) {
  return (
    <section className="space-y-6" aria-label="City marketplaces">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-bazar-text dark:text-white">
          {language === "ur" ? "پاکستان کے مشہور بازار" : "Featured Wholesale Markets"}
        </h2>
        <p className="text-sm text-bazar-text/60 dark:text-bazar-darkText/70">{t("home.city.viewAllHint")}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cities.slice(0, 4).map((city, index) => {
          const categorySlugs = Object.keys(city.industries || {});
          const primaryCategory =
            (city.defaultCategory && categorySlugs.includes(city.defaultCategory))
              ? city.defaultCategory
              : categorySlugs[0] ?? "clothes";
          return (
            <Link
              key={city.slug}
              href={`/city/${city.slug}/${primaryCategory}`}
              className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-bazar-card transition duration-200 hover:-translate-y-1 hover:shadow-bazar-hover dark:border-white/10 dark:bg-bazar-darkCard"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  {...buildImageProps(city.image)}
                  alt={`${city.name} landmark`}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  loading={index < 2 ? "eager" : "lazy"}
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-bazar-text shadow-sm">
                  {city.name}
                </span>
              </div>
              <div className="space-y-2 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-bazar-primary">
                  Bazaar Highlights
                </p>
                <p className="text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
                  Discover {city.name}&rsquo;s wholesale lanes curated for nationwide buyers.
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function TopRatedSection({ t }) {
  if (TOP_RATED_SELLERS.length === 0) {
    return null;
  }

  return (
    <section id="top-rated" className="space-y-8 rounded-3xl border border-bazar-primary/10 bg-white/80 p-10 shadow-bazar-card backdrop-blur-md dark:border-white/10 dark:bg-bazar-darkCard/90">
      <header className="space-y-3">
        <h2 className="text-2xl font-bold text-bazar-text dark:text-white">{t("home.topRated.title")}</h2>
        <p className="max-w-2xl text-sm text-bazar-text/70 dark:text-bazar-darkText/70">{t("home.topRated.subtitle")}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {TOP_RATED_SELLERS.map((seller) => (
          <Link
            key={`${seller.citySlug}-${seller.slug || seller.name}`}
            href={seller.path}
            className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white px-6 py-5 shadow-bazar-card transition duration-200 hover:-translate-y-1 hover:shadow-bazar-hover dark:border-white/10 dark:bg-bazar-darkCard"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-bazar-text dark:text-white">{seller.name}</h3>
                <p className="mt-1 text-sm text-bazar-text/60 dark:text-bazar-darkText/70">
                  {seller.categoryName} • {seller.cityName}
                </p>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="text-lg font-semibold text-bazar-primary">{seller.rating?.toFixed(1) ?? "0.0"}</span>
                <span className="text-xs text-bazar-text/60 dark:text-bazar-darkText/60">{seller.reviews} reviews</span>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-bazar-primary/5 p-4 text-sm text-bazar-text/70 shadow-inner dark:bg-white/5 dark:text-bazar-darkText/70">
              <ReviewSummary
                rating={seller.rating ?? 0}
                count={seller.reviews ?? 0}
                readHref={`${seller.path}#reviews`}
                readLabel="Read reviews"
                writeHref={`/reviews?seller=${encodeURIComponent(seller.slug || seller.name)}`}
                writeLabel="Write a review"
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-end">
        <Link
          href="/top-rated"
          className="inline-flex items-center gap-3 rounded-full border border-bazar-primary/30 px-6 py-3 text-sm font-semibold text-bazar-primary transition duration-200 hover:bg-bazar-primary hover:text-white dark:border-white/30 dark:text-bazar-darkText dark:hover:bg-white/10 dark:hover:text-white"
        >
          {t("home.topRated.cta")}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m-6.75-6.75L19.5 12l-6.75 6.75" />
          </svg>
        </Link>
      </div>
    </section>
  );
}










