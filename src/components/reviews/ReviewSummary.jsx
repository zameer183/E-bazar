"use client";

import { useRouter } from "next/navigation";
import StarRating from "@/components/star-rating/StarRating";
import styles from "./ReviewSummary.module.css";

const ReviewSummary = ({
  rating = 0,
  count = 0,
  readHref = "#reviews",
  readLabel = "Read reviews",
  writeHref = "#share",
  writeLabel = "Write a review",
  onRate,
}) => {
  const router = useRouter();
  const isInteractive = typeof onRate === "function";
  const handleNavigate = (href) => {
    if (!href) return;
    router.push(href);
  };

  return (
    <div className={styles.reviewSummary}>
      <div className={styles.score}>
        <StarRating value={rating} max={5} size="sm" interactive={isInteractive} onSelect={onRate} />
        <span className={styles.scoreValue} suppressHydrationWarning>
          {rating ? rating.toFixed(1) : "New"}
        </span>
      </div>
      <p className={styles.meta}>
        {count > 0 ? `${count} review${count === 1 ? "" : "s"}` : "Awaiting reviews"}
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.reviewLink}
          onClick={() => handleNavigate(writeHref)}
        >
          {writeLabel}
        </button>
        <button
          type="button"
          className={styles.reviewLink}
          onClick={() => handleNavigate(readHref)}
        >
          {readLabel}
        </button>
      </div>
    </div>
  );
};

export default ReviewSummary;
