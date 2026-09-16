"use client";

import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

import type {
  Locale,
} from "@/i18n";

import {
  cn,
} from "@/lib/utils";


interface LanguageSwitcherProps {
  lang: Locale;
}


const languages: {
  code: Locale;
  label: string;
}[] = [
  {
    code: "en",
    label: "EN",
  },
  {
    code: "sv",
    label: "SV",
  },
  {
    code: "zh",
    label: "中文",
  },
];


export default function LanguageSwitcher({
  lang,
}: LanguageSwitcherProps) {
  const pathname =
    usePathname();

  const pathWithoutLanguage =
    pathname.replace(
      /^\/(en|sv|zh)(?=\/|$)/,
      "",
    );


  function languageHref(
    locale: Locale,
  ) {
    return `/${locale}${
      pathWithoutLanguage || "/"
    }`;
  }


  return (
    <div
      className="flex items-center gap-1"
      aria-label="Language"
    >
      {languages.map(
        (language) => {
          const isActive =
            language.code === lang;

          return (
            <Link
              key={
                language.code
              }
              href={languageHref(
                language.code,
              )}
              lang={
                language.code
              }
              hrefLang={
                language.code
              }
              aria-current={
                isActive
                  ? "page"
                  : undefined
              }
              className={cn(
                "nav-link",
                isActive &&
                  "nav-active",
              )}
            >
              {language.label}
            </Link>
          );
        },
      )}
    </div>
  );
}