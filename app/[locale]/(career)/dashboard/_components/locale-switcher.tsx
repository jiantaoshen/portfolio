"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { localeMeta, locales, type Locale } from "@/lib/locales";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
  value: Locale;
  onChange: (locale: Locale) => void;
}

export function LocaleSwitcher({ value, onChange }: LocaleSwitcherProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("contentLanguage.label")}>
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
              "relative h-auto rounded-none px-2 py-2 transition-colors",
              isActive
                ? "text-foreground after:absolute after:right-2 after:bottom-0 after:left-2 after:h-0.5 after:rounded-full after:bg-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {localeMeta[locale].label}
          </Button>
        );
      })}
    </div>
  );
}