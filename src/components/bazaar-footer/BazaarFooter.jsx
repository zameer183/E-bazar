"use client";

import Link from "next/link";
import styles from "./BazaarFooter.module.css";

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
  const filteredSections = BAZAAR_SECTIONS;

  return (
    <footer className={styles.footer}>
      <div className={styles.headerRow} suppressHydrationWarning>
        <div className={styles.titleBlock} suppressHydrationWarning>
          <h2>Marketplace Directory</h2>
          <p>
            Explore Pakistan&apos;s bazaar taxonomy to find the category you need.
          </p>
        </div>
      </div>

      {filteredSections.length === 0 ? (
        <p className={styles.emptyState}>
          No bazaar categories match that search. Try another keyword.
        </p>
      ) : (
        <div className={styles.grid} suppressHydrationWarning>
          {filteredSections.map((section) => {
            // Map section titles to bazaar slugs
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
              <div key={section.title} className={styles.column} suppressHydrationWarning>
                <Link href={`/bazar/${bazaarSlug}`} className={styles.sectionTitle}>
                  <h3>{section.title}</h3>
                </Link>
                <ul>
                  {section.items.map((item) => (
                    <li key={`${section.title}-${item}`}>
                      <Link href={`/bazar/${bazaarSlug}`} className={styles.itemLink}>
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

      {note && <p className={styles.note}>{note}</p>}
    </footer>
  );
}
