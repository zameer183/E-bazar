import Link from "next/link";
import { Poppins, Inter } from "next/font/google";
import Watermark from "@/components/watermark/Watermark";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-Bazar | Digital Marketplace of Pakistan",
  description:
    "Discover industry-wise marketplaces across every city of Pakistan on E-Bazar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        <Watermark />
        {children}
        <Link href="/register" className="stickyRegister">
          Register Apni Dukan
        </Link>
      </body>
    </html>
  );
}
