"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Locale } from "@/i18n/routing";

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "sv", label: "SV" },
  { code: "zh", label: "中文" },
];

export function UiLanguageSwitcher() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const currentLocale = useLocale() as Locale;

  function changeLocale(locale: Locale) {
    document.cookie = `career-ui-locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={t("interfaceLanguage.label")}
    >
      {languages.map((language) => {
        const active = language.code === currentLocale;

        return (
          <Button
            key={language.code}
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={active}
            onClick={() => changeLocale(language.code)}
            className={cn(
              "h-8 px-2 font-mono text-xs",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            {language.label}
          </Button>
        );
      })}
    </div>
  );
}