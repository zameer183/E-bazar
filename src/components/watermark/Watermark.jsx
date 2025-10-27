"use client";

import styles from "./Watermark.module.css";

export default function Watermark() {
  return (
    <div className={styles.watermarkContainer} aria-hidden="true" suppressHydrationWarning>
      <div className={styles.watermark} suppressHydrationWarning>
        <span className={styles.icon}>📱</span>
        <span className={styles.icon}>👔</span>
        <span className={styles.icon}>🚗</span>
        <span className={styles.icon}>💍</span>
      </div>
    </div>
  );
}
