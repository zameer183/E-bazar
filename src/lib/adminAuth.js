"use client";

import { getCurrentUser } from "./auth";

/**
 * List of authorized admin user IDs
 * In production, this should come from:
 * 1. Environment variable (NEXT_PUBLIC_ADMIN_UIDS)
 * 2. Firebase Firestore collection
 * 3. Firebase Custom Claims
 */
const getAuthorizedAdmins = () => {
  // Try to get from environment variable first
  const envAdmins = process.env.NEXT_PUBLIC_ADMIN_UIDS;
  if (envAdmins) {
    return envAdmins.split(',').map(uid => uid.trim()).filter(Boolean);
  }

  // Fallback: Return empty array - no admins authorized by default
  // You need to add admin UIDs to .env.local
  return [];
};

/**
 * Check if current user is an admin
 * @returns {Promise<{isAdmin: boolean, uid?: string}>}
 */
export const checkIsAdmin = async () => {
  try {
    const user = getCurrentUser();

    if (!user) {
      return { isAdmin: false };
    }

    const authorizedAdmins = getAuthorizedAdmins();
    const isAdmin = authorizedAdmins.includes(user.uid);

    return { isAdmin, uid: user.uid };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false };
  }
};

/**
 * Get current user's admin status synchronously
 * @returns {boolean}
 */
export const isCurrentUserAdmin = () => {
  try {
    const user = getCurrentUser();
    if (!user) return false;

    const authorizedAdmins = getAuthorizedAdmins();
    return authorizedAdmins.includes(user.uid);
  } catch {
    return false;
  }
};

/**
 * Admin guard hook for React components
 * @param {Function} onUnauthorized - Callback when user is not authorized
 */
export const useAdminGuard = (onUnauthorized) => {
  const checkAdmin = async () => {
    const { isAdmin } = await checkIsAdmin();

    if (!isAdmin) {
      if (onUnauthorized) {
        onUnauthorized();
      }
      return false;
    }

    return true;
  };

  return { checkAdmin };
};

/**
 * Instructions for setting up admin access:
 *
 * METHOD 1: Using Environment Variables (Recommended for small teams)
 * 1. Get your user UID by logging in and checking Firebase Console > Authentication
 * 2. Add to .env.local:
 *    NEXT_PUBLIC_ADMIN_UIDS=your_uid_here,another_uid_here
 *
 * METHOD 2: Using Firestore (Recommended for larger teams)
 * 1. Create an "admins" collection in Firestore
 * 2. Add documents with user UIDs
 * 3. Update getAuthorizedAdmins() to read from Firestore
 *
 * METHOD 3: Using Firebase Custom Claims (Most Secure)
 * 1. Use Firebase Admin SDK to set custom claims
 * 2. Update checkIsAdmin() to check user.getIdTokenResult()
 *
 * For now, use METHOD 1 for quick setup.
 */
