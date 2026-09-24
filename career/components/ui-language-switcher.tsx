"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { localeMeta, locales, type Locale } from "@/lib/locales";
import { cn } from "@/lib/utils";

export function UiLanguageSwitcher() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const currentLocale = useLocale() as Locale;

  function changeLocale(locale: Locale) {
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `career-ui-locale=${locale}; path=/; max-age=31536000; samesite=lax`;

    router.refresh();
  }
  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={t("interfaceLanguage.label")}
    >
      {locales.map((locale) => {
        const active = locale === currentLocale;

        return (
          <Button
            key={locale}
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={active}
            onClick={() => changeLocale(locale)}
            className={cn(
              "h-8 px-2 font-mono text-xs",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            {localeMeta[locale].shortLabel}
          </Button>
        );
      })}
    </div>
  );
}