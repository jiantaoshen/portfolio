export const locales = ["en", "sv", "zh"] as const;

export type Locale = (typeof locales)[number];

export const localeMeta = {
  en: {
    label: "English",
    shortLabel: "EN",
  },
  sv: {
    label: "Svenska",
    shortLabel: "SV",
  },
  zh: {
    label: "中文",
    shortLabel: "中文",
  },
} satisfies Record<
  Locale,
  {
    label: string;
    shortLabel: string;
  }
>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function getPreferredLocaleFromAcceptLanguage(
  acceptLanguage: string | null,
): Locale {
  const requestedLanguages = (acceptLanguage ?? "")
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const requestedLanguage of requestedLanguages) {
    const locale = locales.find(
      (candidate) =>
        requestedLanguage === candidate ||
        requestedLanguage?.startsWith(`${candidate}-`),
    );

    if (locale) return locale;
  }

  return "en";
}

export function stripLocalePrefix(pathname: string) {
  const localePrefix = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

  return pathname.replace(localePrefix, "");
}
