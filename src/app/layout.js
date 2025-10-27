import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import StickyRegisterLink from "@/components/StickyRegisterLink";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  preload: false,
});

export const metadata = {
  title: "E-Bazar | Digital Marketplace of Pakistan",
  description:
    "Discover industry-wise marketplaces across every city of Pakistan on E-Bazar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.variable} suppressHydrationWarning>
        <Navbar />
        {children}
        <StickyRegisterLink />
      </body>
    </html>
  );
}
