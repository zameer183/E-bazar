'use client';

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const isBrowserEnvironment = typeof window !== "undefined";

// Validate Firebase environment variables
const validateFirebaseConfig = (options = {}) => {
  const { strict = true } = options;
  const requiredEnvVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    const errorMessage = `Missing Firebase configuration! Please add the following to your .env.local file:\n${missingVars.join('\n')}`;
    if (strict) {
      console.error(errorMessage);
      throw new Error(`Firebase configuration error: Missing ${missingVars.length} required environment variable(s). Check console for details.`);
    }
    console.warn(errorMessage);
  }

  return { missingVars };
};

// Validate before initializing (only throw in the browser to avoid breaking static builds)
const { missingVars } = validateFirebaseConfig({ strict: isBrowserEnvironment });
const hasCompleteFirebaseConfig = missingVars.length === 0;

if (!hasCompleteFirebaseConfig && !isBrowserEnvironment && process.env.NODE_ENV !== "test") {
  console.warn(
    `Firebase configuration incomplete during server build. Missing: ${missingVars.join(
      ", ",
    )}. The app will rely on fallback data until environment variables are provided.`,
  );
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (avoid multiple initializations)
const app =
  hasCompleteFirebaseConfig && getApps().length === 0
    ? initializeApp(firebaseConfig)
    : hasCompleteFirebaseConfig
    ? getApp()
    : null;

// Initialize Firebase services
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const isFirebaseConfigured = hasCompleteFirebaseConfig;

// Initialize Analytics (only in browser environment)
export const analytics =
  typeof window !== "undefined" && app ? getAnalytics(app) : null;

export default app;
