"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { localeMeta, locales, type Locale } from "@/lib/locales";
import { cn } from "@/lib/utils";

import { dashboardSwitcherItemVariants } from "./switcher-variants";

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
    <div className="flex items-center gap-1" role="group" aria-label={t("interfaceLanguage.label")}>
      {locales.map((locale) => {
        const active = locale === currentLocale;

        return (
          <Button
            key={locale}
            type="button"
            variant="ghost"
            aria-pressed={active}
            onClick={() => changeLocale(locale)}
            className={cn("h-9 rounded-none px-3 text-(length:--nav-link-size) font-medium", dashboardSwitcherItemVariants({ active, underlineInset: "md" }))}
          >
            {localeMeta[locale].shortLabel}
          </Button>
        );
      })}
    </div>
  );
}