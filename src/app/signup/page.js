"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setStatus({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match",
      });
      return;
    }

    if (formData.password.length < 6) {
      setStatus({
        type: "error",
        message: "Password must be at least 6 characters",
      });
      return;
    }

    // Check if email already exists
    const stored = window.localStorage.getItem("eBazarUsers");
    const users = stored ? JSON.parse(stored) : [];

    if (users.find((u) => u.email === formData.email)) {
      setStatus({
        type: "error",
        message: "Email already registered. Please login instead.",
      });
      return;
    }

    // Save new user
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    window.localStorage.setItem("eBazarUsers", JSON.stringify(users));

    // Set logged in status
    window.localStorage.setItem("eBazarLoggedIn", "true");
    window.localStorage.setItem("eBazarCurrentUser", formData.email);

    setStatus({
      type: "success",
      message: "Account created successfully! Redirecting...",
    });

    setTimeout(() => {
      router.push("/register");
    }, 1000);
  };

  return (
    <div className={styles.page} suppressHydrationWarning>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.formContainer} suppressHydrationWarning>
          <div className={styles.formHeader} suppressHydrationWarning>
            <h1>Create Account</h1>
            <p>Join E-Bazar and start growing your business today</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup} suppressHydrationWarning>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

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
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className={styles.fieldGroup} suppressHydrationWarning>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
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
              Create Account
            </button>
          </form>

          <div className={styles.footer} suppressHydrationWarning>
            <p>
              Already have an account?{" "}
              <Link href="/login" className={styles.footerLink}>
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
