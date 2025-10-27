"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import {
  CATEGORY_OPTIONS,
  CITY_OPTIONS,
  STORAGE_KEY,
  createSellerSlug,
  createProductShowcase,
} from "@/data/markets";
import styles from "./page.module.css";

const PACKAGES = [
  {
    id: "free",
    label: "Free Package",
    tagline: "Limited listings",
  },
  {
    id: "standard",
    label: "Standard Package",
    tagline: "Monthly fee",
  },
  {
    id: "premium",
    label: "Premium Package",
    tagline: "Featured store",
  },
];

function RegisterDetailsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "free";

  const selectedPackage = useMemo(
    () => PACKAGES.find((pkg) => pkg.id === planId) || PACKAGES[0],
    [planId]
  );

  const [formState, setFormState] = useState({
    name: "",
    citySlug: CITY_OPTIONS[0]?.slug || "",
    categorySlug: CATEGORY_OPTIONS[0]?.slug || "",
    contact: "",
    address: "",
    webLink: "",
  });

  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!formState.name || !formState.contact || !formState.address) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields to continue.",
      });
      return;
    }

    const cityOption =
      CITY_OPTIONS.find((city) => city.slug === formState.citySlug) || null;
    const categoryOption =
      CATEGORY_OPTIONS.find(
        (category) => category.slug === formState.categorySlug
      ) || null;

    try {
      // Get current user from Firebase Auth
      const { getCurrentUser } = await import("@/lib/auth");
      const currentUser = getCurrentUser();

      if (!currentUser) {
        setStatus({
          type: "error",
          message: "Please log in to register a shop",
        });
        router.push("/login");
        return;
      }

      const newShop = {
        ownerId: currentUser.uid,
        name: formState.name,
        city: cityOption?.name ?? formState.citySlug,
        citySlug: cityOption?.slug ?? formState.citySlug,
        category: categoryOption?.name ?? formState.categorySlug,
        categorySlug: categoryOption?.slug ?? formState.categorySlug,
        contact: formState.contact,
        address: formState.address,
        plan: selectedPackage.id,
        planLabel: selectedPackage.label,
        slug: createSellerSlug(cityOption?.name ?? formState.citySlug, formState.name),
        description: `${formState.name} connects with buyers looking for ${categoryOption?.name?.toLowerCase() ?? "marketplace goods"} in ${cityOption?.name ?? formState.citySlug}.`,
        products: createProductShowcase(formState.categorySlug, Math.floor(Math.random() * 50)),
        rating: 0,
        reviews: 0,
        visitors: 0,
        ...(formState.webLink && { webLink: formState.webLink }),
      };

      // Save to Firestore
      const { createShop } = await import("@/lib/firestore");
      const result = await createShop(newShop);

      if (!result.success) {
        setStatus({
          type: "error",
          message: "Failed to register shop. Please try again.",
        });
        return;
      }

      // Also save to localStorage for compatibility
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const shops = stored ? JSON.parse(stored) : [];
      shops.push({ ...newShop, id: result.shopId });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));

      setStatus({
        type: "success",
        message: "Shop registered! Redirecting you to your dashboard...",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error) {
      console.error("Unable to save shop registration", error);
      setStatus({
        type: "error",
        message: "Something went wrong while saving. Please try again.",
      });
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.summary}>
          <h1>Complete Your Store Profile</h1>
          <p>
            You selected the {selectedPackage.label} ({selectedPackage.tagline}). Fill in
            the details below so shoppers can find and review your store in the right
            city and category.
          </p>
        </section>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="name">Shop Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              placeholder="Enter your shop name"
              required
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="city">City</label>
              <select
                id="city"
                name="citySlug"
                value={formState.citySlug}
                onChange={handleChange}
              >
                {CITY_OPTIONS.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="categorySlug"
                value={formState.categorySlug}
                onChange={handleChange}
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="contact">Contact Number</label>
            <input
              id="contact"
              name="contact"
              type="tel"
              value={formState.contact}
              onChange={handleChange}
              placeholder="+92 3XX XXXXXXX"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="address">Shop Address</label>
            <textarea
              id="address"
              name="address"
              value={formState.address}
              onChange={handleChange}
              placeholder="Include building, street, and area details"
              rows={3}
              required
            />
          </div>

          {(selectedPackage.id === "standard" || selectedPackage.id === "premium") && (
            <div className={styles.fieldGroup}>
              <label htmlFor="webLink">Website/Social Media Link (Optional)</label>
              <input
                id="webLink"
                name="webLink"
                type="url"
                value={formState.webLink}
                onChange={handleChange}
                placeholder="https://www.yourwebsite.com or social media profile"
              />
            </div>
          )}

          {status.type !== "idle" && (
            <div
              className={
                status.type === "error" ? styles.errorMessage : styles.successMessage
              }
            >
              {status.message}
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            Save and Publish Store
          </button>
        </form>
      </main>
    </div>
  );
}

export default function RegisterDetails() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading registration...</div>}>
      <RegisterDetailsClient />
    </Suspense>
  );
}
