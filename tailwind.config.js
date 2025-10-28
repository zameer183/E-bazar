/** @type {import('tailwindcss').Config} */
console.log("Loaded Tailwind config");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        emerald: {
          600: "#0E9F6E",
        },
        bazar: {
          primary: "#0E9F6E",
          accent: "#FF6B00",
          gold: "#D4AF37",
          background: "#F9FAFB",
          text: "#1F2937",
          darkBg: "#0D1117",
          darkCard: "#161B22",
          darkText: "#E5E7EB",
        },
      },
      fontFamily: {
        display: ["var(--font-poppins)", "Inter", "sans-serif"],
        urdu: ["var(--font-noto-nastaliq)", "Noto Nastaliq Urdu", "serif"],
      },
      boxShadow: {
        "bazar-card": "0 20px 60px -30px rgba(15, 23, 42, 0.35)",
        "bazar-hover": "0 25px 80px -25px rgba(14, 159, 110, 0.45)",
      },
      backgroundImage: {
        "bazar-gradient": "linear-gradient(135deg, #FF6B00 0%, #D4AF37 100%)",
      },
      transitionDuration: {
        200: "200ms",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};
