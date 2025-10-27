"use client";

import { useEffect, useState } from "react";

export default function TestFirebase() {
  const [status, setStatus] = useState("Testing...");
  const [error, setError] = useState(null);
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Check environment variables
        const env = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Missing",
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Missing",
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Missing",
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "Set" : "Missing",
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "Set" : "Missing",
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Missing",
        };
        setEnvVars(env);

        // Test Firebase initialization
        const { db, auth } = await import("@/lib/firebase");
        console.warn("Firebase initialized:", { db, auth });

        // Test Firestore connection
        const { collection, addDoc, getDocs } = await import("firebase/firestore");

        setStatus("Testing Firestore write...");
        const testData = {
          test: "Hello Firebase",
          timestamp: new Date().toISOString(),
        };

        const docRef = await addDoc(collection(db, "test"), testData);
        console.warn("Document written with ID:", docRef.id);

        setStatus("Testing Firestore read...");
        const querySnapshot = await getDocs(collection(db, "test"));
        console.warn("Documents found:", querySnapshot.size);

        setStatus(`Firebase is working! Test collection has ${querySnapshot.size} document(s)`);
      } catch (err) {
        console.error("Firebase test error:", err);
        setError(err.message);
        setStatus("Firebase test failed");
      }
    };

    testFirebase();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>Firebase Connection Test</h1>

      <h2>Environment Variables:</h2>
      <pre style={{ background: "#f5f5f5", padding: "20px" }}>
        {JSON.stringify(envVars, null, 2)}
      </pre>

      <h2>Connection Status:</h2>
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>{status}</p>

      {error && (
        <>
          <h2 style={{ color: "red" }}>Error:</h2>
          <pre style={{ background: "#ffe6e6", padding: "20px", color: "red" }}>
            {error}
          </pre>
        </>
      )}

      <h2>Instructions:</h2>
      <ol>
        <li>Check the environment variables above - all should show &quot;Set&quot;</li>
        <li>Check the browser console (F12) for detailed logs</li>
        <li>If you see a permission error, update your Firestore security rules</li>
        <li>If env vars are missing, restart the dev server: <code>npm run dev</code></li>
      </ol>
    </div>
  );
}
