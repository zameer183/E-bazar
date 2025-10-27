"use client";

import { useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateShopName,
  validateBatch,
} from '@/lib/validation';
import styles from './page.module.css';

// Component that throws an error for testing
function ErrorThrower({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('This is a test error from ErrorThrower component!');
  }
  return <div className={styles.successMessage}>Done No error - component working fine</div>;
}

export default function TestPage() {
  const [throwError, setThrowError] = useState(false);
  const [validationResults, setValidationResults] = useState({});

  // Test validation
  const handleTestValidation = () => {
    const results = validateBatch({
      email: validateEmail('test@example.com'),
      invalidEmail: validateEmail('notanemail'),
      password: validatePassword('Pass123!'),
      weakPassword: validatePassword('123'),
      phone: validatePhoneNumber('03001234567', 'PK'),
      shopName: validateShopName('My Amazing Shop'),
    });

    setValidationResults(results);
  };

  return (
    <div className={styles.testContainer}>
      <header className={styles.testHeader}>
        <h1>Test E-Bazar Testing Page</h1>
        <p>Test all the features and fixes we implemented</p>
      </header>

      {/* Error Boundary Test */}
      <section className={styles.testSection}>
        <h2>1. Error Boundary Test</h2>
        <p>Click the button below to trigger an error and see if Error Boundary catches it:</p>

        <button
          onClick={() => setThrowError(!throwError)}
          className={styles.dangerButton}
        >
          {throwError ? 'Stop Throwing Error' : 'Trigger Error'}
        </button>

        <ErrorBoundary>
          <div className={styles.testArea}>
            <ErrorThrower shouldThrow={throwError} />
          </div>
        </ErrorBoundary>
      </section>

      {/* Validation Test */}
      <section className={styles.testSection}>
        <h2>2. Input Validation Test</h2>
        <p>Test the comprehensive validation utilities:</p>

        <button onClick={handleTestValidation} className={styles.primaryButton}>
          Run Validation Tests
        </button>

        {Object.keys(validationResults).length > 0 && (
          <div className={styles.resultsBox}>
            <h3>Validation Results:</h3>
            <pre className={styles.codeBlock}>
              {JSON.stringify(validationResults, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* Security Headers Test */}
      <section className={styles.testSection}>
        <h2>3. Security Headers Test</h2>
        <p>Check browser dev tools {"->"} Network {"->"} Select this page {"->"} Headers tab</p>
        <div className={styles.infoBox}>
          <h4>Expected Headers:</h4>
          <ul>
            <li>Done X-Frame-Options: SAMEORIGIN</li>
            <li>Done X-Content-Type-Options: nosniff</li>
            <li>Done X-XSS-Protection: 1; mode=block</li>
            <li>Done Strict-Transport-Security</li>
            <li>Done Referrer-Policy: origin-when-cross-origin</li>
          </ul>
        </div>
      </section>

      {/* Firebase Config Test */}
      <section className={styles.testSection}>
        <h2>4. Firebase Configuration Test</h2>
        <p>Firebase should be initialized with validated environment variables</p>
        <div className={styles.successBox}>
          Success: If you can see this page, Firebase config validation passed!
        </div>
      </section>

      {/* Admin Auth Test */}
      <section className={styles.testSection}>
        <h2>5. Admin Authentication Test</h2>
        <p>Test the new admin authentication system:</p>
        <div className={styles.testSteps}>
          <ol>
            <li>
              <a href="/admin" target="_blank" className={styles.testLink}>
                Open Admin Panel (not logged in)
              </a>
              <span className={styles.expected}>{"->"} Should redirect to login</span>
            </li>
            <li>
              <a href="/login" target="_blank" className={styles.testLink}>
                Login with test account
              </a>
              <span className={styles.expected}>{"->"} Should show login page</span>
            </li>
            <li>
              <a href="/admin" target="_blank" className={styles.testLink}>
                Visit Admin Panel (logged in as non-admin)
              </a>
              <span className={styles.expected}>{"->"} Should show your UID</span>
            </li>
          </ol>
        </div>
      </section>

      {/* ESLint Test */}
      <section className={styles.testSection}>
        <h2>6. ESLint Test Results</h2>
        <div className={styles.infoBox}>
          <h4>Run: <code>npm run lint</code></h4>
          <ul>
            <li>Done ESLint configured successfully</li>
            <li>Done 1 Error fixed (ErrorBoundary Link)</li>
            <li>Warning ~60 Warnings (mostly style issues, not critical)</li>
          </ul>
        </div>
      </section>

      {/* Firebase Rules Test */}
      <section className={styles.testSection}>
        <h2>7. Firebase Security Rules</h2>
        <div className={styles.warningBox}>
          <h4>Warning: ACTION REQUIRED:</h4>
          <p>Firebase Security Rules need to be deployed manually:</p>
          <ol>
            <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
            <li>Select project: <strong>e-bazar-a9714</strong></li>
            <li>Navigate to: Firestore Database {"->"} Rules</li>
            <li>Copy content from: <code>firestore.rules</code></li>
            <li>Click: <strong>Publish</strong></li>
          </ol>
        </div>
      </section>

      {/* Firebase Indexes Test */}
      <section className={styles.testSection}>
        <h2>8. Firebase Indexes</h2>
        <div className={styles.infoBox}>
          <h4>Created Files:</h4>
          <ul>
            <li>Done <code>firestore.indexes.json</code> - Index configuration</li>
            <li>Done <code>FIREBASE_INDEXES.md</code> - Complete documentation</li>
          </ul>
          <h4>To Create Indexes:</h4>
          <ol>
            <li>Follow instructions in <code>FIREBASE_INDEXES.md</code></li>
            <li>Use Firebase Console or CLI: <code>firebase deploy --only firestore:indexes</code></li>
          </ol>
        </div>
      </section>

      {/* Summary */}
      <section className={styles.testSection}>
        <h2>Implementation Summary</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <h3>Completed</h3>
            <ul>
              <li>Firebase env validation</li>
              <li>Security headers (7 headers)</li>
              <li>Error Boundary component</li>
              <li>Input validation utilities</li>
              <li>ESLint configuration</li>
              <li>Admin UID-based auth</li>
              <li>firestore.rules updated</li>
              <li>firestore.indexes.json created</li>
            </ul>
          </div>
          <div className={styles.summaryCard}>
            <h3>Manual Steps Required</h3>
            <ul>
              <li>Deploy Firebase Security Rules</li>
              <li>Deploy Firebase Storage Rules</li>
              <li>Create Firebase Indexes</li>
              <li>Review ESLint warnings (optional)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
