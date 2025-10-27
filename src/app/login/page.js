"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!formData.email || !formData.password) {
      setStatus({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    // Get stored users
    const stored = window.localStorage.getItem("eBazarUsers");
    if (!stored) {
      setStatus({
        type: "error",
        message: "No account found. Please sign up first.",
      });
      return;
    }

    const users = JSON.parse(stored);
    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (!user) {
      setStatus({
        type: "error",
        message: "Invalid email or password",
      });
      return;
    }

    // Set logged in status
    window.localStorage.setItem("eBazarLoggedIn", "true");
    window.localStorage.setItem("eBazarCurrentUser", formData.email);

    setStatus({
      type: "success",
      message: "Login successful! Redirecting...",
    });

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className={styles.page} suppressHydrationWarning>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.formContainer} suppressHydrationWarning>
          <div className={styles.formHeader} suppressHydrationWarning>
            <h1>Welcome Back</h1>
            <p>Log in to manage your shop and track your performance</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup} suppressHydrationWarning>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className={styles.fieldGroup} suppressHydrationWarning>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {status.type !== "idle" && (
              <div
                className={
                  status.type === "error"
                    ? styles.errorMessage
                    : styles.successMessage
                }
              >
                {status.message}
              </div>
            )}

            <button type="submit" className={styles.submitButton}>
              Log In
            </button>
          </form>

          <div className={styles.footer} suppressHydrationWarning>
            <p>
              Don't have an account?{" "}
              <Link href="/signup" className={styles.footerLink}>
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
