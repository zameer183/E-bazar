"use client";

import Link from "next/link";
import Image from "next/image";
import { useCities } from "@/lib/cities";
import { buildImageProps } from "@/lib/images";
import { useI18n } from "@/lib/i18n";

export default function CitiesDirectory() {
  const cities = useCities();
  const { t, language } = useI18n();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-bazar-background to-white py-16 dark:from-bazar-darkBg dark:via-bazar-darkCard dark:to-bazar-darkBg">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-3xl border border-bazar-primary/15 bg-white/80 px-8 py-12 shadow-bazar-card backdrop-blur dark:border-white/10 dark:bg-bazar-darkCard/90 sm:px-12">
          <div className="absolute inset-0 bg-gradient-to-tr from-bazar-primary/10 via-bazar-gold/10 to-transparent dark:from-white/10" />
          <div className="relative flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-bazar-primary/20 bg-bazar-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-bazar-primary dark:border-white/10 dark:bg-white/10 dark:text-white">
              {language === "ur" ? "شہر وار بازار" : "City Networks"}
            </span>
            <h1 className="text-3xl font-bold text-bazar-text dark:text-white sm:text-4xl">
              {t("cities.title")}
            </h1>
            <p className="max-w-3xl text-sm text-bazar-text/70 dark:text-bazar-darkText/70 sm:text-base">
              {t("cities.subtitle")}
            </p>
          </div>
        </header>

        <section
          className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="All city marketplaces"
        >
          {cities.map((city, index) => {
            const industries = Object.keys(city.industries || {});
            const defaultCategory =
              city.defaultCategory && industries.includes(city.defaultCategory)
                ? city.defaultCategory
                : industries[0] ?? "clothes";

            return (
              <Link
                key={city.slug}
                href={`/city/${city.slug}/${defaultCategory}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-bazar-primary/10 bg-white shadow-bazar-card transition duration-200 hover:-translate-y-1 hover:shadow-bazar-hover dark:border-white/10 dark:bg-bazar-darkCard"
                aria-label={`Explore ${city.name} marketplace`}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    {...buildImageProps(city.image)}
                    alt={`${city.name} landmark`}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    loading={index < 6 ? "eager" : "lazy"}
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-bazar-text shadow-sm">
                    {city.name}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-bazar-primary">
                    {language === "ur" ? "مشہور بازار" : "Featured Bazaars"}
                  </p>
                  <p className="text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
                    {language === "ur"
                      ? `${city.name} کے بازاروں میں ${industries.length} سے زائد کیٹیگریز دستیاب ہیں۔`
                      : `Discover ${industries.length}+ bazaar categories in ${city.name}.`}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-bazar-primary transition duration-200 group-hover:text-bazar-gold dark:text-bazar-darkText dark:group-hover:text-white">
                    {t("cities.card.cta")}
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
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
