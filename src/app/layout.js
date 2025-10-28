import { Poppins, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import StickyRegisterLink from "@/components/StickyRegisterLink";
import { LanguageProvider } from "@/lib/i18n";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  preload: false,
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const metadata = {
  title: "E-Bazar | Digital Marketplace of Pakistan",
  description:
    "Discover industry-wise marketplaces across every city of Pakistan on E-Bazar.",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${notoNastaliq.variable} bg-bazar-background text-bazar-text`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <Navbar />
          {children}
          <StickyRegisterLink />
        </LanguageProvider>
      </body>
    </html>
  );
}
