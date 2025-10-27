"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

const matchesQuery = (section, query) => {
  const normalized = query.toLowerCase();
  if (section.title.toLowerCase().includes(normalized)) return true;
  return section.items.some((item) => item.toLowerCase().includes(normalized));
};

const filterSections = (sections, query) => {
  if (!query) return sections;
  return sections
    .map((section) => {
      if (!matchesQuery(section, query)) return null;
      if (section.title.toLowerCase().includes(query.toLowerCase())) {
        return section;
      }
      const filteredItems = section.items.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase()),
      );
      return { ...section, items: filteredItems };
    })
    .filter(Boolean);
};

export default function BazaarFooter({ note, topRatedSellers = [] }) {
  const [query, setQuery] = useState("");
  const filteredSections = useMemo(
    () => filterSections(BAZAAR_SECTIONS, query.trim()),
    [query],
  );
  const hasTopRated = useMemo(
    () => (topRatedSellers?.length ?? 0) > 0,
    [topRatedSellers],
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h2>Marketplace Directory</h2>
          <p>
            Explore Pakistan&apos;s bazaar taxonomy or search for the category you need.
          </p>
        </div>
        <label className={styles.searchField}>
          <span>Search categories</span>
          <input
            type="search"
            placeholder="Type to filter e.g. electronics, tailoring, travel..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      {hasTopRated && (
        <div className={styles.topRatedBlock}>
          <span className={styles.topRatedLabel}>Top Rated Sellers</span>
          <Link href="/top-rated" className={styles.topRatedLink}>
            Browse Pakistan-wide champions {"->"}
          </Link>
        </div>
      )}

      {filteredSections.length === 0 ? (
        <p className={styles.emptyState}>
          No bazaar categories match that search. Try another keyword.
        </p>
      ) : (
        <div className={styles.grid}>
          {filteredSections.map((section) => (
            <div key={section.title} className={styles.column}>
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={`${section.title}-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {note && <p className={styles.note}>{note}</p>}
    </footer>
  );
}
