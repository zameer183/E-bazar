"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { STORAGE_KEY } from "@/data/markets";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasShop, setHasShop] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = window.localStorage.getItem("eBazarLoggedIn");
      setIsLoggedIn(loggedIn === "true");

      // Check if user has a registered shop
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const shops = JSON.parse(stored);
        setHasShop(shops.length > 0);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("eBazarLoggedIn");
      window.localStorage.removeItem("eBazarCurrentUser");
      setShowLogoutModal(false);
      setIsLoggedIn(false);
      setHasShop(false);
      router.push("/");
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          E-Bazar
        </Link>
        <div className={styles.navLinks}>
          <Link href="/about" className={styles.navLink}>
            About Us
          </Link>
          <Link href="/reviews" className={styles.navLink}>
            Customer Reviews
          </Link>
          {isLoggedIn ? (
            <>
              {hasShop ? (
                <Link href="/dashboard" className={styles.navButton}>
                  My Dashboard
                </Link>
              ) : (
                <Link href="/register" className={styles.navButton}>
                  Register Shop
                </Link>
              )}
              <button
                onClick={() => setShowLogoutModal(true)}
                className={styles.logoutButton}
              >
                Logout
              </button>
            </>
          ) : pathname === "/login" ? (
            <Link href="/signup" className={styles.navButton}>
              Sign Up
            </Link>
          ) : pathname === "/signup" ? (
            <Link href="/login" className={styles.navButton}>
              Login
            </Link>
          ) : (
            <Link href="/login" className={styles.navButton}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Logout Confirmation</h2>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleLogout} className={styles.confirmButton}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
