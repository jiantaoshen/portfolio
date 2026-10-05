"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { localeMeta, locales, stripLocalePrefix, type Locale } from "@/lib/locales";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const pathWithoutLanguage = stripLocalePrefix(pathname);
  const navLinkBase = "p-3 text-(length:--nav-link-size) font-medium text-muted-foreground transition-colors hover:text-foreground";
  const navLinkActive = "text-foreground border-b-2 border-primary";

  function languageHref(locale: Locale) {
    return `/${locale}${pathWithoutLanguage || "/"}`;
  }

  return (
    <nav aria-label="Language">
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
    </nav>
  );
}
