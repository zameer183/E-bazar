"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const HIDDEN_PREFIXES = ["/dashboard", "/admin", "/city", "/bazar", "/login", "/signup"];

export default function StickyRegisterLink() {
  const pathname = usePathname();

  const shouldHide = useMemo(() => {
    if (!pathname) return false;
    return HIDDEN_PREFIXES.some((prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  }, [pathname]);

  if (shouldHide) {
    return null;
  }

  return (
    <Link href="/register" className="stickyRegister">
      Register Apni Dukan
    </Link>
  );
}
