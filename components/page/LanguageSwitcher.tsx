"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

import { navLinkActive, navLinkBase } from "@/components/page/navigation-styles";
import { localeMeta, locales, stripLocalePrefix, type Locale } from "@/lib/locales";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const pathWithoutLanguage = stripLocalePrefix(pathname);

  function languageHref(locale: Locale) {
    return `/${locale}${pathWithoutLanguage || "/"}`;
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={languageHref(locale)}
            lang={locale}
            hrefLang={locale}
            aria-current={isActive ? "page" : undefined}
            className={cn(navLinkBase, isActive && navLinkActive)}
          >
            {localeMeta[locale].shortLabel}
          </Link>
        );
      })}
    </div>
  );
}
