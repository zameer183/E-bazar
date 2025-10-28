"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const statusStyles = {
  error: "border-red-300/70 bg-red-50/80 text-red-700 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-200",
  success:
    "border-emerald-300/70 bg-emerald-50/80 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200",
};

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!formData.email || !formData.password) {
      setStatus({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    const { signInUser } = await import("@/lib/auth");
    const result = await signInUser(formData.email, formData.password);

    if (!result.success) {
      setStatus({
        type: "error",
        message: result.error,
      });
      return;
    }

    window.localStorage.setItem("eBazarLoggedIn", "true");
    window.localStorage.setItem("eBazarCurrentUser", result.user.uid);

    setStatus({
      type: "success",
      message: "Login successful! Redirecting...",
    });

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-white via-bazar-background to-white py-16 dark:from-bazar-darkBg dark:via-bazar-darkCard dark:to-bazar-darkBg"
      suppressHydrationWarning
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 md:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-bazar-primary text-white shadow-bazar-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,107,0,0.32),_transparent_60%)] opacity-90" />
          <div className="relative grid gap-8 px-8 py-12 md:grid-cols-[1.3fr_1fr] md:px-12 md:py-16 lg:px-16">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
                Seller Login
              </span>
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Welcome back to the bazaar
              </h1>
              <p className="text-sm text-white/85 sm:text-base">
                Sign in to access your stall dashboard, update catalogues, and respond quickly to new buyer
                enquiries across Pakistan.
              </p>
              <div className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Marketplace perks</p>
                  <p className="mt-2 leading-relaxed">
                    Real-time buyer requests, verified review badges, and curated placements by city and category.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Need an account?</p>
                  <p className="mt-2 leading-relaxed">
                    <Link href="/signup" className="font-semibold text-white underline-offset-4 hover:underline">
                      Register your shop
                    </Link>{" "}
                    to join our vetted wholesale community.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
              <div className="grid gap-4 text-sm text-white/80">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Active highlights</p>
                <div className="grid gap-3">
                  {[
                    { label: "Verified sellers this month", value: "42" },
                    { label: "Buyer enquiries responded", value: "1.8K" },
                    { label: "Cities sourcing daily", value: "12" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start justify-between rounded-2xl bg-black/15 px-4 py-3"
                    >
                      <p className="text-xs uppercase tracking-[0.3em]">{item.label}</p>
                      <span className="text-base font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/70">
                Need help? Email{" "}
                <a href="mailto:support@ebazar.pk" className="font-semibold text-white underline-offset-4 hover:underline">
                  support@ebazar.pk
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-bazar-primary/10 bg-white/85 p-6 shadow-bazar-card backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-10 dark:border-white/10 dark:bg-bazar-darkCard/90">
          <div className="flex flex-col gap-6">
            <header className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-bazar-primary/20 bg-bazar-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-bazar-primary dark:border-white/10 dark:bg-white/10 dark:text-white">
                Sign in
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-bazar-text dark:text-white">Access your dashboard</h2>
              <p className="text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
                Enter the credentials linked to your registered bazaar account. Your activity is protected with
                marketplace-grade security.
              </p>
            </header>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.18em] text-bazar-text/70 dark:text-bazar-darkText/70">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="rounded-2xl border border-bazar-primary/15 bg-white px-4 py-3 text-sm text-bazar-text shadow-sm transition focus:border-bazar-primary/60 focus:outline-none focus:ring-4 focus:ring-bazar-primary/15 dark:border-white/10 dark:bg-bazar-darkBg dark:text-bazar-darkText dark:focus:border-white/40"
                  suppressHydrationWarning
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.18em] text-bazar-text/70 dark:text-bazar-darkText/70">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="rounded-2xl border border-bazar-primary/15 bg-white px-4 py-3 text-sm text-bazar-text shadow-sm transition focus:border-bazar-primary/60 focus:outline-none focus:ring-4 focus:ring-bazar-primary/15 dark:border-white/10 dark:bg-bazar-darkBg dark:text-bazar-darkText dark:focus:border-white/40"
                  suppressHydrationWarning
                />
              </div>

              {status.type !== "idle" && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold tracking-wide ${statusStyles[status.type]}`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-bazar-gradient px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-bazar-card transition duration-200 hover:-translate-y-0.5 hover:shadow-bazar-hover"
                suppressHydrationWarning
              >
                Log In
              </button>
            </form>
          </div>

          <aside className="flex flex-col justify-between rounded-3xl border border-bazar-primary/10 bg-white/80 p-6 shadow-inner dark:border-white/10 dark:bg-bazar-darkBg/80">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-bazar-primary dark:text-white/80">
                Don&apos;t have an account?
              </h3>
              <p className="text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
                Join the platform to list your shop, connect with nationwide buyers, and stay ahead of seasonal demand.
              </p>
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-full border border-bazar-primary/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-bazar-primary transition hover:-translate-y-0.5 hover:bg-bazar-primary/10 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Create Seller Account
              </Link>
            </div>
            <div className="space-y-2 text-xs text-bazar-text/50 dark:text-bazar-darkText/60">
              <p className="uppercase tracking-[0.3em]">Secure login powered by Firebase</p>
              <p>All sessions are encrypted. You can log out anytime from your profile area.</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
