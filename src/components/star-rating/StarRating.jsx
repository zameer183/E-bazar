"use client";

import { memo, useMemo } from "react";
import styles from "./StarRating.module.css";

const buildStars = (value, max) => {
  const clampedValue = Math.max(0, Math.min(value ?? 0, max));
  const fullStars = Math.floor(clampedValue);
  const hasHalf = clampedValue - fullStars >= 0.5;
  return { fullStars, hasHalf };
};

const StarRating = ({
  value = 0,
  max = 5,
  size = "md",
  interactive = false,
  onSelect,
  label,
}) => {
  const stars = useMemo(() => buildStars(value, max), [value, max]);
  const isInteractive = interactive && typeof onSelect === "function";
  const starItems = [];

  for (let i = 1; i <= max; i += 1) {
    let state = "empty";
    if (i <= stars.fullStars) {
      state = "full";
    } else if (i === stars.fullStars + 1 && stars.hasHalf) {
      state = "half";
    }
    starItems.push({ index: i, state });
  }

  const handleSelect = (score) => {
    if (!isInteractive) return;
    onSelect(score);
  };

  return (
    <div
      className={`${styles.starRating} ${styles[`size-${size}`]} ${
        isInteractive ? styles.interactive : ""
      }`}
      role={isInteractive ? "radiogroup" : "img"}
      aria-label={label ?? `Rated ${value} out of ${max}`}
    >
      {starItems.map((star) => (
        <button
          key={star.index}
          type="button"
          className={`${styles.star} ${styles[star.state]}`}
          onClick={() => handleSelect(star.index)}
          role={isInteractive ? "radio" : undefined}
          aria-checked={isInteractive ? Math.round(value) === star.index : undefined}
          aria-label={isInteractive ? `Rate ${star.index} out of ${max}` : undefined}
          tabIndex={isInteractive ? 0 : -1}
          aria-hidden={isInteractive ? undefined : "true"}
        >
          <span aria-hidden="true">★</span>
        </button>
      ))}
    </div>
  );
};

export default memo(StarRating);
