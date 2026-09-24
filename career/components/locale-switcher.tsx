"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { localeMeta, locales, type Locale } from "@/lib/locales";

import { dashboardNavItemVariants } from "./nav-variants";

export function LocaleSwitcher({
  value,
  onChange,
}: {
  value: Locale;
  onChange: (locale: Locale) => void;
}) {
  const t = useTranslations("dashboard");

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label={t("contentLanguage.label")}
    >
      {locales.map((locale) => {
        const isActive = value === locale;

        return (
          <Button
            key={locale}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(locale)}
            aria-pressed={isActive}
            className={cn(
              "h-auto rounded-none px-2 py-2",
              dashboardNavItemVariants({ active: isActive, underlineInset: "md" }),
            )}
          >
            {localeMeta[locale].label}
          </Button>
        );
      })}
    </div>
  );
}
