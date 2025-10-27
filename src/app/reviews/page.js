"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import StarRating from "@/components/star-rating/StarRating";

const SELLER_REVIEWS_KEY = "eBazarSellerStories";
const BUYER_REVIEWS_KEY = "eBazarBuyerExperiences";

const initialReviewForm = {
  name: "",
  business: "",
  city: "",
  rating: 5,
  review: "",
};

const buildReviewEntry = (formState, type) => ({
  id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: formState.name.trim(),
  business: formState.business?.trim() || undefined,
  city: formState.city.trim(),
  rating: formState.rating,
  review: formState.review.trim(),
  createdAt: new Date().toISOString(),
});

const readStoredReviews = (key) => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Unable to read stored reviews", error);
    return [];
  }
};

const writeStoredReviews = (key, reviews) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(reviews));
  window.dispatchEvent(new CustomEvent("ebazar:reviews-updated", { detail: { key } }));
};

const useStoredReviewList = (storageKey) => {
  const [entries, setEntries] = useState([]);

  // Initialize entries only on the client side
  useEffect(() => {
    setEntries(readStoredReviews(storageKey));
  }, [storageKey]);

  // Set up event listeners only on the client side
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const sync = () => setEntries(readStoredReviews(storageKey));
    const handleStorage = (event) => {
      if (event.key === storageKey || event.key === null) {
        sync();
      }
    };
    const handleCustom = (event) => {
      if (!event.detail || event.detail.key === storageKey) {
        sync();
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("ebazar:reviews-updated", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("ebazar:reviews-updated", handleCustom);
    };
  }, [storageKey]);

  return [entries, setEntries];
};

const ReviewForm = ({ title, storageKey, allowBusinessField = false }) => {
  const [formState, setFormState] = useState(initialReviewForm);
  const [, setEntries] = useStoredReviewList(storageKey);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetStatus = () => {
    setError("");
    setSuccess("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    resetStatus();
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value) => {
    resetStatus();
    setFormState((prev) => ({ ...prev, rating: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetStatus();

    if (!formState.name.trim() || !formState.city.trim() || !formState.review.trim()) {
      setError("Please fill in your name, city, and review.");
      return;
    }

    setSubmitting(true);
    try {
      const entry = buildReviewEntry(formState, storageKey);
      const current = readStoredReviews(storageKey);
      const next = [entry, ...current];
      writeStoredReviews(storageKey, next);
      setEntries(next);
      setFormState(initialReviewForm);
      setSuccess("Thank you! Your review has been added.");
    } catch (submitError) {
      console.error("Unable to save review", submitError);
      setError("Something went wrong while saving your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.formSection}>
      <header className={styles.formHeader}>
        <h2>{title}</h2>
        <p>Share your experience to help the community make confident choices.</p>
      </header>
      <form className={styles.reviewForm} onSubmit={handleSubmit}>
        <label className={styles.formField}>
          <span>Your Name</span>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </label>
        {allowBusinessField && (
          <label className={styles.formField}>
            <span>Shop / Business</span>
            <input
              type="text"
              name="business"
              value={formState.business}
              onChange={handleInputChange}
              placeholder="e.g. Clifton Essence Vault"
            />
          </label>
        )}
        <label className={styles.formField}>
          <span>City</span>
          <input
            type="text"
            name="city"
            value={formState.city}
            onChange={handleInputChange}
            placeholder="e.g. Karachi"
            required
          />
        </label>
        <label className={styles.formField}>
          <span>Your Rating</span>
          <StarRating
            value={formState.rating}
            max={5}
            interactive
            onSelect={handleRatingChange}
            size="lg"
          />
        </label>
        <label className={styles.formField}>
          <span>Your Review</span>
          <textarea
            name="review"
            value={formState.review}
            onChange={handleInputChange}
            placeholder="Tell others about your experience"
            rows={5}
            required
          />
        </label>
        {error && <p className={styles.formError}>{error}</p>}
        {success && <p className={styles.formSuccess}>{success}</p>}
        <button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? "Saving..." : "Add Review"}
        </button>
      </form>
    </section>
  );
};

const ReviewList = ({ title, storageKey, emptyMessage, renderMeta }) => {
  const [entries] = useStoredReviewList(storageKey);

  if (entries.length === 0) {
    return (
      <section className={styles.reviewSection}>
        <header className={styles.sectionHeader}>
          <h2>{title}</h2>
          <p>{emptyMessage}</p>
        </header>
        <p className={styles.emptyState}>No reviews yet. Be the first to share your experience.</p>
      </section>
    );
  }

  const ratings = entries.map((entry) => entry.rating || 0);
  const averageRating = ratings.length
    ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length
    : 0;

  return (
    <section className={styles.reviewSection}>
      <header className={styles.sectionHeader}>
        <h2>{title}</h2>
        <ReviewSummary
          rating={Number(averageRating.toFixed(1))}
          count={entries.length}
          readHref="#"
          readLabel={`${entries.length} review${entries.length === 1 ? "" : "s"}`}
          writeHref="#reviews-form"
          writeLabel="Add your review"
        />
      </header>
      <div className={styles.reviewGrid}>
        {entries.map((entry) => (
          <article key={entry.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div>
                <h3>{entry.name}</h3>
                {renderMeta(entry)}
              </div>
              <span className={styles.reviewRating}>{entry.rating.toFixed(1)} ★</span>
            </div>
            <p className={styles.reviewBody}>{entry.review}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default function ReviewsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Reviews</span>
        </nav>
      </header>

      <div className={styles.hero}>
        <h1>Marketplace Stories & Experiences</h1>
        <p>
          Real voices from sellers and buyers across Pakistan. Share your story and help the
          community discover trusted partners.
        </p>
      </div>

      <div className={styles.layout}>
        <div id="reviews-form" className={styles.formsColumn}>
          <ReviewForm
            title="Seller Stories"
            storageKey={SELLER_REVIEWS_KEY}
            allowBusinessField
          />
          <ReviewForm
            title="Buyer Experiences"
            storageKey={BUYER_REVIEWS_KEY}
          />
        </div>

        <div className={styles.listColumn}>
          <ReviewList
            title="Seller Stories"
            storageKey={SELLER_REVIEWS_KEY}
            emptyMessage="Sellers from every lane are invited to share their journey."
            renderMeta={(entry) => (
              <p className={styles.reviewMeta}>
                {entry.business ? `${entry.business} — ` : ""}
                {entry.city}
              </p>
            )}
          />

          <ReviewList
            title="Buyer Experiences"
            storageKey={BUYER_REVIEWS_KEY}
            emptyMessage="Buyers, tell others about the sellers who impressed you."
            renderMeta={(entry) => <p className={styles.reviewMeta}>{entry.city}</p>}
          />
        </div>
      </div>
    </div>
  );
}
