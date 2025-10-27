"use client";

import styles from "./page.module.css";
import "./global-test.css";
import TestComponent from "@/components/TestComponent/TestComponent";

export default function TestCSSPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CSS Test Page</h1>
      <p className={styles.description}>This page tests if CSS modules are working correctly.</p>
      <div className={styles.testBox}>
        <p>If you can see this text with styling, CSS modules are working!</p>
      </div>
      <div className="test-global-style">
        <p>If this text is red with a yellow background, global CSS is working!</p>
      </div>
      <TestComponent />
    </div>
  );
}