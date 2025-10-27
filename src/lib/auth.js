"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  deleteUser as firebaseDeleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";
import { createUser } from "./firestore";

/**
 * Sign up a new user with email and password
 */
export const signUpUser = async (email, password, name) => {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, error: "Authentication is unavailable. Please configure Firebase." };
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await createUser(user.uid, {
      email: email,
      name: name,
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error signing up:", error);
    let errorMessage = "Failed to create account";

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "This email is already registered";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      case "auth/weak-password":
        errorMessage = "Password should be at least 6 characters";
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

/**
 * Sign in an existing user
 */
export const signInUser = async (email, password) => {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, error: "Authentication is unavailable. Please configure Firebase." };
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error signing in:", error);
    let errorMessage = "Failed to sign in";

    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        errorMessage = "Invalid email or password";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      case "auth/user-disabled":
        errorMessage = "This account has been disabled";
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, error: "Authentication is unavailable. Please configure Firebase." };
  }
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  if (!isFirebaseConfigured || !auth) {
    return null;
  }
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback) => {
  if (!isFirebaseConfigured || !auth) {
    // Return noop unsubscribe
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

/**
 * Change user password
 */
export const changeUserPassword = async (currentPassword, newPassword) => {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, error: "Authentication is unavailable. Please configure Firebase." };
  }
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "No user is signed in" };
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    let errorMessage = "Failed to change password";

    switch (error.code) {
      case "auth/wrong-password":
        errorMessage = "Current password is incorrect";
        break;
      case "auth/weak-password":
        errorMessage = "New password should be at least 6 characters";
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (password) => {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, error: "Authentication is unavailable. Please configure Firebase." };
  }
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "No user is signed in" };
    }

    // Re-authenticate before deletion
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Delete user
    await firebaseDeleteUser(user);

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    let errorMessage = "Failed to delete account";

    switch (error.code) {
      case "auth/wrong-password":
        errorMessage = "Password is incorrect";
        break;
      case "auth/requires-recent-login":
        errorMessage = "Please log in again before deleting your account";
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};
