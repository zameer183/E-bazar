"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { onAuthChange } from "@/lib/auth";
import { STORAGE_KEY } from "@/data/markets";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasShop, setHasShop] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isHamburgerActive, setIsHamburgerActive] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);
  const profileActionsRef = useRef(null);
  const profileToggleRef = useRef(null);

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        // User is logged in
        setIsLoggedIn(true);
        window.localStorage.setItem("eBazarLoggedIn", "true");
        window.localStorage.setItem("eBazarCurrentUser", user.uid);

        // Check if user has shops
        if (typeof window !== "undefined") {
          const stored = window.localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const shops = JSON.parse(stored);
            setHasShop(shops.length > 0);
          }
        }

        // Load user profile picture
        const storedProfile = window.localStorage.getItem("eBazarUserProfile");
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        }
      } else {
        // User is logged out
        setIsLoggedIn(false);
        setHasShop(false);
        setUserProfile(null);
        setIsHamburgerActive(false);
        window.localStorage.removeItem("eBazarLoggedIn");
        window.localStorage.removeItem("eBazarCurrentUser");
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      // Sign out from Firebase
      const { signOutUser } = await import("@/lib/auth");
      await signOutUser();

      // Clear localStorage
      window.localStorage.removeItem("eBazarLoggedIn");
      window.localStorage.removeItem("eBazarCurrentUser");

      setShowLogoutModal(false);
      setIsLoggedIn(false);
      setHasShop(false);
      setIsHamburgerActive(false);
      router.push("/");
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const profileData = {
          image: reader.result,
          name: file.name,
        };
        setUserProfile(profileData);
        window.localStorage.setItem("eBazarUserProfile", JSON.stringify(profileData));
        setShowProfileModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfilePic = () => {
    setUserProfile(null);
    window.localStorage.removeItem("eBazarUserProfile");
    setShowDeleteConfirmModal(false);
  };

  const handleDeleteAccount = () => {
    if (typeof window !== "undefined") {
      // Clear all user data
      window.localStorage.removeItem("eBazarLoggedIn");
      window.localStorage.removeItem("eBazarCurrentUser");
      window.localStorage.removeItem("eBazarUserProfile");
      window.localStorage.removeItem("eBazarUsers");
      window.localStorage.removeItem(STORAGE_KEY);

      setShowAccountDeleteModal(false);
      setIsLoggedIn(false);
      setHasShop(false);
      setUserProfile(null);
      setIsHamburgerActive(false);

      // Redirect to login page
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!isHamburgerActive) {
      return undefined;
    }
    const handleClickOutside = (event) => {
      if (
        profileActionsRef.current &&
        !profileActionsRef.current.contains(event.target)
      ) {
        setIsHamburgerActive(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsHamburgerActive(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isHamburgerActive]);

  const closeProfileMenu = () => {
    setIsHamburgerActive(false);
    if (profileToggleRef.current) {
      profileToggleRef.current.focus();
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          E-Bazar
        </Link>
        <div className={styles.navLinks}>

          <Link href="/" className={styles.navLink}>
            Home
          </Link>
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
              <div className={styles.profileActions} ref={profileActionsRef}>
                <button
                  type="button"
                  className={`${styles.hamburger} ${isHamburgerActive ? styles.hamburgerActive : ""}`}
                  onClick={() => setIsHamburgerActive((prev) => !prev)}
                  aria-label="Toggle profile actions"
                  aria-pressed={isHamburgerActive}
                  aria-expanded={isHamburgerActive}
                  aria-controls="profile-actions-menu"
                  ref={profileToggleRef}
                >
                  <span className={styles.hamburgerContainer}>
                    <span className={styles.hamburgerInner} />
                    <span className={styles.hamburgerHidden} />
                  </span>
                </button>
                {isHamburgerActive && (
                  <button
                    type="button"
                    className={styles.profileDropdownOverlay}
                    onClick={closeProfileMenu}
                    aria-label="Close account menu"
                    tabIndex={-1}
                  />
                )}
                <div
                  id="profile-actions-menu"
                  className={`${styles.profileDropdown} ${isHamburgerActive ? styles.profileDropdownOpen : ""}`}
                  role="menu"
                  aria-hidden={!isHamburgerActive}
                  hidden={!isHamburgerActive}
                >
                  <div className={styles.profileDropdownContent}>
                    <div className={styles.profileDropdownHeader}>
                      <span className={styles.profileDropdownTitle}>Account Controls</span>
                      <span className={styles.profileDropdownSubtitle}>
                        Manage your profile and sessions.
                      </span>
                    </div>
                    <ul className={styles.profileDropdownList}>
                      <li>
                        <Link
                          href="/profile"
                          className={styles.profileDropdownItem}
                          role="menuitem"
                          tabIndex={isHamburgerActive ? 0 : -1}
                          onClick={closeProfileMenu}
                        >
                          <span className={styles.profileDropdownIcon}>S</span>
                          <span>
                            Profile Settings
                            <small>Update details, avatar, and password.</small>
                          </span>
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`${styles.profileDropdownItem} ${styles.profileDropdownDanger}`}
                          role="menuitem"
                          tabIndex={isHamburgerActive ? 0 : -1}
                          onClick={() => {
                            closeProfileMenu();
                            setShowLogoutModal(true);
                          }}
                        >
                          <span className={styles.profileDropdownIcon}>O</span>
                          <span>
                            Logout
                            <small>Sign out from this device.</small>
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
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

      {/* Profile Picture Upload Modal */}
      {showProfileModal && (
        <div className={styles.modal} onClick={() => setShowProfileModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>{userProfile ? "Change Profile Picture" : "Add Profile Picture"}</h2>
            <p>Upload a profile picture to personalize your account.</p>
            {userProfile && (
              <div className={styles.currentProfile}>
                <Image
                  src={userProfile.image}
                  alt="Current Profile"
                  width={120}
                  height={120}
                  className={styles.currentProfileImage}
                  unoptimized
                />
              </div>
            )}
            <label className={styles.uploadLabel}>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                name="profile-image-upload"
                id="profile-image-upload"
                style={{ display: "none" }}
              />
              <span className={styles.uploadButtonModal}>
                {userProfile ? "Upload New Picture" : "Upload Picture"}
              </span>
            </label>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowProfileModal(false)}
                className={styles.cancelButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className={styles.modal} onClick={() => setShowLogoutModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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

      {/* Delete Profile Picture Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Delete Profile Picture</h2>
            <p>Are you sure you want to delete your profile picture?</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleDeleteProfilePic} className={styles.confirmDeleteButton}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showAccountDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 style={{ color: '#c53030' }}>Delete Account</h2>
            <p>Are you sure you want to delete your account? This will permanently delete all your data including shops, images, and profile information. This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowAccountDeleteModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleDeleteAccount} className={styles.confirmDeleteButton}>
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
