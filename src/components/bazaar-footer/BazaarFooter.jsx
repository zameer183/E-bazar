"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const BAZAAR_SECTIONS = [
  {
    title: "Fashion Bazaar",
    items: [
      "Fashion & Clothing",
      "Footwear",
      "Jewelry & Accessories",
      "Beauty & Cosmetics",
      "Fashion Designers & Boutiques",
      "Textile & Fabric",
      "Tailoring & Stitching",
    ],
  },
  {
    title: "Fragrance Bazaar",
    items: [
      "Attars & Oils",
      "Signature Sprays",
      "Arabian Blends",
      "Gift Sets",
      "Artisan Collections",
    ],
  },
  {
    title: "Tech Bazaar",
    items: [
      "Electronics & Gadgets",
      "Mobile Phones & Accessories",
      "Computers & Laptops",
      "Home Appliances",
      "Electronic Repair & Maintenance",
    ],
  },
  {
    title: "Home Bazaar",
    items: [
      "Furniture & Home Decor",
      "Kitchenware & Utensils",
      "Cleaning & Sanitation",
      "Interior Design & Carpentry",
      "Packaging & Supplies",
    ],
  },
  {
    title: "Grocery Bazaar",
    items: [
      "Grocery & Supermarket",
      "Food & Beverages",
      "Bakery & Sweets",
      "Restaurant & Catering",
    ],
  },
  {
    title: "Auto Bazaar",
    items: [
      "Automobiles & Motorbikes",
      "Auto Parts & Accessories",
      "Car Care & Maintenance",
    ],
  },
  {
    title: "Construction Bazaar",
    items: [
      "Construction & Building Material",
      "Tools & Hardware",
      "Solar & Energy Solutions",
      "Security & Safety Equipment",
    ],
  },
  {
    title: "Agro Bazaar",
    items: [
      "Agriculture & Farming",
      "Livestock & Poultry",
      "Industrial Equipment & Machinery",
    ],
  },
  {
    title: "Education Bazaar",
    items: [
      "Books & Education",
      "Stationery & Office Supplies",
      "Education & Training Institutes",
    ],
  },
  {
    title: "Family Bazaar",
    items: [
      "Toys & Baby Products",
      "Pets & Pet Supplies",
      "Gifts & Flowers",
      "Art & Handicrafts",
    ],
  },
  {
    title: "Health Bazaar",
    items: ["Health & Fitness", "Medical & Pharmaceuticals"],
  },
  {
    title: "Event Bazaar",
    items: [
      "Event & Wedding Services",
      "Photography & Videography",
      "Printing & Advertising",
    ],
  },
  {
    title: "Travel Bazaar",
    items: [
      "Travel & Tourism",
      "Hotels & Hospitality",
      "Real Estate & Property",
    ],
  },
  {
    title: "Business Bazaar",
    items: [
      "IT & Software Services",
      "Freelancing & Digital Services",
      "Shipping & Logistics",
    ],
  },
  {
    title: "Islamic Bazaar",
    items: ["Religious Items & Books"],
  },
];

export default function BazaarFooter({ note }) {
  const { t } = useI18n();
  const sections = BAZAAR_SECTIONS;

  return (
    <footer className="overflow-hidden rounded-3xl border border-bazar-primary/20 bg-white/90 shadow-bazar-card backdrop-blur-lg dark:border-white/10 dark:bg-bazar-darkCard/90">
      <div className="border-b border-bazar-primary/20 bg-bazar-primary/5 px-6 py-8 dark:border-white/10 dark:bg-white/5 sm:px-10">
        <h2 className="text-2xl font-bold text-bazar-text dark:text-white">{t("footer.marketplaceDirectory")}</h2>
        <p className="mt-2 max-w-3xl text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
          {t("footer.marketplaceDirectory.subtitle")}
        </p>
      </div>

      {sections.length === 0 ? (
        <p className="px-6 py-10 text-sm font-semibold text-bazar-text/60 dark:text-bazar-darkText/70">
          {t("footer.empty")}
        </p>
      ) : (
        <div className="grid gap-8 px-6 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:px-10">
          {sections.map((section) => {
            const bazaarSlugMap = {
              "Fashion Bazaar": "fashion",
              "Fragrance Bazaar": "fragrance",
              "Tech Bazaar": "tech",
              "Home Bazaar": "home",
              "Grocery Bazaar": "grocery",
              "Auto Bazaar": "auto",
              "Construction Bazaar": "construction",
              "Agro Bazaar": "agro",
              "Education Bazaar": "education",
              "Family Bazaar": "family",
              "Health Bazaar": "health",
              "Event Bazaar": "event",
              "Travel Bazaar": "travel",
              "Business Bazaar": "business",
              "Islamic Bazaar": "islamic",
            };
            const bazaarSlug = bazaarSlugMap[section.title] || "fashion";

            return (
              <div key={section.title} className="space-y-4">
                <Link
                  href={`/bazar/${bazaarSlug}`}
                  className="flex items-center gap-2 text-sm font-semibold text-bazar-text transition duration-200 hover:text-bazar-primary dark:text-bazar-darkText dark:hover:text-white"
                >
                  <span className="h-1 w-8 rounded-full bg-bazar-primary" aria-hidden />
                  <span>{section.title}</span>
                </Link>
                <ul className="space-y-2 text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
                  {section.items.map((item) => (
                    <li key={`${section.title}-${item}`}>
                      <Link
                        href={`/bazar/${bazaarSlug}`}
                        className="transition duration-200 hover:text-bazar-primary dark:hover:text-white"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {note && (
        <div className="border-t border-bazar-primary/10 bg-bazar-primary/5 px-6 py-6 text-sm text-bazar-text/70 dark:border-white/10 dark:bg-white/5 dark:text-bazar-darkText/70 sm:px-10">
          {note}
        </div>
      )}

      <div className="border-t border-bazar-primary/10 bg-white/80 px-6 py-4 text-xs text-bazar-text/60 dark:border-white/5 dark:bg-bazar-darkCard dark:text-bazar-darkText/60 sm:px-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} E-Bazar Pakistan. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <Link href="/about" className="hover:text-bazar-primary dark:hover:text-white transition duration-200">
            About
          </Link>
          <Link href="/contact" className="hover:text-bazar-primary dark:hover:text-white transition duration-200">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-bazar-primary dark:hover:text-white transition duration-200">
            Privacy Policy
          </Link>
          <div className="flex items-center gap-3">
            {["facebook", "instagram", "linkedin"].map((social) => (
              <Link
                key={social}
                href={`https://example.com/${social}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-bazar-primary/20 text-bazar-text/70 transition duration-200 hover:bg-bazar-primary hover:text-white dark:border-white/10 dark:text-bazar-darkText/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <span className="sr-only">{social}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M12 2.04c-5.52 0-9.96 4.44-9.96 9.96 0 4.98 3.65 9.11 8.43 9.88v-6.99H8.07v-2.89h2.4V9.41c0-2.37 1.39-3.69 3.52-3.69.71 0 1.68.12 1.68.12v2.32h-.95c-.94 0-1.23.58-1.23 1.17v1.41h2.61l-.42 2.89h-2.19v7c4.78-.77 8.43-4.9 8.43-9.88 0-5.52-4.44-9.96-9.96-9.96Z" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
