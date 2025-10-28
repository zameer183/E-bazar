"use client";

import clsx from "clsx";
import { useI18n } from "@/lib/i18n";

const LANG_OPTIONS = [
  { value: "en", labelKey: "nav.language.english" },
  { value: "ur", labelKey: "nav.language.urdu" },
];

export default function LanguageToggle({ className = "" }) {
  const { language, setLanguage, t } = useI18n();

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 rounded-full bg-white/70 p-1 text-sm font-semibold text-bazar-text/80 shadow-sm backdrop-blur",
        "dark:bg-bazar-darkCard/80 dark:text-bazar-darkText",
        className,
      )}
      role="group"
      aria-label="Language selector"
    >
      {LANG_OPTIONS.map((option) => {
        const isActive = language === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            aria-pressed={isActive}
            className={clsx(
              "rounded-full px-3 py-1.5 transition-all duration-200",
              isActive
                ? "bg-bazar-primary text-white shadow-bazar-card"
                : "text-bazar-text/80 hover:bg-white hover:text-bazar-text dark:hover:bg-bazar-darkBg",
            )}
          >
            {t(option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
