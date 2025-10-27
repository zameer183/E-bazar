"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { seedMockShops, clearMockShops, getDataStats } from "@/lib/seedData";
import { checkIsAdmin } from "@/lib/adminAuth";
import { onAuthChange } from "@/lib/auth";
import styles from "./page.module.css";

export default function AdminPanel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ status: "", progress: 0, current: 0, total: 0 });
  const [stats, setStats] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userUid, setUserUid] = useState("");

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthChange(async (user) => {
      if (!user) {
        // User not logged in - redirect to login
        setIsCheckingAuth(false);
        setIsAuthorized(false);
        return;
      }

      // Check if user is admin
      const { isAdmin, uid } = await checkIsAdmin();

      if (isAdmin) {
        setIsAuthorized(true);
        setUserUid(uid);
        loadStats();
        showNotification("Access granted!", "success");
      } else {
        setIsAuthorized(false);
        setUserUid(uid);
        showNotification("You are not authorized to access this page", "error");
      }

      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const loadStats = async () => {
    const result = await getDataStats();
    if (result.success) {
      setStats(result.stats);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleSeedData = async () => {
    if (!confirm("This will add all mock shop data to Firebase. Continue?")) {
      return;
    }

    setIsLoading(true);
    setProgress({ status: "Starting...", progress: 0, current: 0, total: 0 });

    const result = await seedMockShops((progressData) => {
      setProgress(progressData);
    });

    setIsLoading(false);

    if (result.success) {
      showNotification(result.message, "success");
      loadStats();
    } else {
      showNotification(result.message, "error");
    }

    setProgress({ status: "", progress: 0, current: 0, total: 0 });
  };

  const handleClearData = async () => {
    if (!confirm("Warning WARNING: This will DELETE ALL shops from Firebase! This cannot be undone. Are you absolutely sure?")) {
      return;
    }

    if (!confirm("Last chance! Are you REALLY sure you want to delete everything?")) {
      return;
    }

    setIsLoading(true);
    setProgress({ status: "Starting deletion...", progress: 0, current: 0, total: 0 });

    const result = await clearMockShops((progressData) => {
      setProgress(progressData);
    });

    setIsLoading(false);

    if (result.success) {
      showNotification(result.message, "success");
      loadStats();
    } else {
      showNotification(result.message, "error");
    }

    setProgress({ status: "", progress: 0, current: 0, total: 0 });
  };

  const handleReloadData = async () => {
    if (!confirm("This will DELETE all existing data and reload fresh mock data. Continue?")) {
      return;
    }

    setIsLoading(true);

    // First clear
    setProgress({ status: "Clearing old data...", progress: 0 });
    const clearResult = await clearMockShops((progressData) => {
      setProgress({ ...progressData, status: `Clearing: ${progressData.status}` });
    });

    if (!clearResult.success) {
      showNotification("Failed to clear data: " + clearResult.message, "error");
      setIsLoading(false);
      return;
    }

    // Then seed
    setProgress({ status: "Loading new data...", progress: 0 });
    const seedResult = await seedMockShops((progressData) => {
      setProgress({ ...progressData, status: `Seeding: ${progressData.status}` });
    });

    setIsLoading(false);

    if (seedResult.success) {
      showNotification(`Done Successfully reloaded! ${seedResult.count} shops added.`, "success");
      loadStats();
    } else {
      showNotification(seedResult.message, "error");
    }

    setProgress({ status: "", progress: 0, current: 0, total: 0 });
  };

  // Show loading while checking authorization
  if (isCheckingAuth) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <div className={styles.spinner}></div>
          <h2>Checking authorization...</h2>
        </div>
      </div>
    );
  }

  // Show unauthorized message if not admin
  if (!isAuthorized) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h1>Locked Admin Access Required</h1>
          <p style={{ marginBottom: '20px' }}>
            You need administrator privileges to access this page.
          </p>
          {userUid ? (
            <>
              <div className={styles.unauthorizedInfo}>
                <p><strong>Your User ID:</strong></p>
                <code className={styles.uidCode}>{userUid}</code>
                <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                  To grant yourself admin access:
                </p>
                <ol style={{ textAlign: 'left', fontSize: '14px', color: '#666' }}>
                  <li>Copy your User ID above</li>
                  <li>Open your <code>.env.local</code> file</li>
                  <li>Add: <code>NEXT_PUBLIC_ADMIN_UIDS=your_uid_here</code></li>
                  <li>Restart the development server</li>
                </ol>
              </div>
              <button
                onClick={() => router.push('/')}
                className={styles.loginButton}
                style={{ marginTop: '20px' }}
              >
                Return to Home
              </button>
            </>
          ) : (
            <>
              <p style={{ marginBottom: '20px' }}>
                Please log in to continue.
              </p>
              <button
                onClick={() => router.push('/login')}
                className={styles.loginButton}
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Notification Toast */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <span className={styles.notificationIcon}>
            {notification.type === "success" ? "Success" : notification.type === "error" ? "Error" : notification.type === "warning" ? "Warning" : "Info"}
          </span>
          <span className={styles.notificationMessage}>{notification.message}</span>
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Admin Panel</h1>
          <p>Manage Firebase data and seed mock shops</p>
        </div>

        {/* Statistics Section */}
        <div className={styles.section}>
          <h2>Current Database Statistics</h2>
          {stats ? (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>Shops</div>
                <div className={styles.statInfo}>
                  <h3>Total Shops</h3>
                  <p className={styles.statNumber}>{stats.shops}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>Photos</div>
                <div className={styles.statInfo}>
                  <h3>Shop Images</h3>
                  <p className={styles.statNumber}>{stats.shopImages}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>Videos</div>
                <div className={styles.statInfo}>
                  <h3>Shop Videos</h3>
                  <p className={styles.statNumber}>{stats.shopVideos}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>Graphics</div>
                <div className={styles.statInfo}>
                  <h3>Product Images</h3>
                  <p className={styles.statNumber}>{stats.productImages}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className={styles.loading}>Loading statistics...</p>
          )}
          <button onClick={loadStats} className={styles.refreshButton} disabled={isLoading}>
            Refresh Stats
          </button>
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <div className={styles.progressSection}>
            <h3>{progress.status}</h3>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress.progress}%` }}
              />
            </div>
            <p className={styles.progressText}>
              {progress.current > 0 && `${progress.current} / ${progress.total} `}
              ({progress.progress}%)
            </p>
          </div>
        )}

        {/* Actions Section */}
        <div className={styles.section}>
          <h2>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>Refresh</div>
              <h3>Reload Mock Data</h3>
              <p>Clear all existing data and reload fresh mock shops from /src/data/markets.js</p>
              <button
                onClick={handleReloadData}
                className={styles.actionButton}
                disabled={isLoading}
              >
                Reload All Data
              </button>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>Add</div>
              <h3>Seed Mock Data</h3>
              <p>Add mock shops to Firebase (keeps existing data)</p>
              <button
                onClick={handleSeedData}
                className={styles.actionButton}
                disabled={isLoading}
              >
                Seed Data
              </button>
            </div>

            <div className={`${styles.actionCard} ${styles.dangerCard}`}>
              <div className={styles.actionIcon}>Delete</div>
              <h3>Clear All Data</h3>
              <p>Warning: Permanently delete ALL shops from Firebase</p>
              <button
                onClick={handleClearData}
                className={`${styles.actionButton} ${styles.dangerButton}`}
                disabled={isLoading}
              >
                Clear Database
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className={styles.infoSection}>
          <h3>Information</h3>
          <ul>
            <li><strong>Reload All Data:</strong> Best option to get a fresh database. Deletes everything and reloads ~800+ mock shops.</li>
            <li><strong>Seed Data:</strong> Adds mock shops without deleting existing data. Use when you want to add more shops.</li>
            <li><strong>Clear Database:</strong> Dangerous! Deletes ALL shop data from Firebase. Cannot be undone.</li>
            <li><strong>Mock Data Source:</strong> All data comes from <code>/src/data/markets.js</code></li>
            <li><strong>Cities Included:</strong> Karachi, Lahore, Faisalabad, Quetta, Islamabad, Rawalpindi, Peshawar, Multan, Hyderabad, Sialkot, Gujranwala, Bahawalpur, Sargodha, Sukkur</li>
            <li><strong>Categories:</strong> Clothes, Perfumes, Electronics</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
