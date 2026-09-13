import "server-only";

export const SUPPORTED_LOCALES = [
  "en",
  "sv",
  "zh",
] as const;

export type SupportedLocale =
  (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(
  value: string,
): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(
    value as SupportedLocale,
  );
}