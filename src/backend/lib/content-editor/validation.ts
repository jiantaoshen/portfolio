/*
  Feat: Validate slugs and url from content editor
  Export Const: SUPPORTED_LOCALES
  Export Type: SupportedLocale
  Export Function: isSupportedLocale; normalizeProjectSlug; isValidOptionalHttpUrl

*/

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

//Ban empty slug; remove all space and / before and after slug;
//replace \ to /;  and remove .md if any; and segment check 
export function normalizeProjectSlug(value: string): string {
  if (value.trim() === "") {
    throw new Error("Slug is required.");
  }

  let normalized = value.trim().replaceAll("\\", "/");

  normalized = normalized.replace(/^\/+|\/+$/g, "");

  if (normalized.toLowerCase().endsWith(".md")) {
    normalized = normalized.slice(0, -3);
  }

  const segments = normalized
    .split("/")
    .filter((segment) => segment.length > 0);

  if (segments.length === 0) {
    throw new Error("Slug is required.");
  }

  for (const segment of segments) {
    validateSlugSegment(segment);
  }

  return segments.join("/");
}

//Ban . and .. in slug
function validateSlugSegment(segment: string,): void {
  if (
    segment === "." ||
    segment === ".."
  ) {
    throw new Error(
      "Slug cannot contain '.' or '..' path segments.",
    );
  }

  if (hasInvalidFilenameChars(segment)) {
    throw new Error(
      `Slug contains invalid filename characters: ${segment}`,
    );
  }
}

//Ban < > : " \\ | ? * and ASCII control characters in slug
function hasInvalidFilenameChars(value: string): boolean {
  const hasInvalidChars = /[<>:"\\|?*]/.test(value);

  const hasControlChars = [...value].some((char) => char.charCodeAt(0) < 32);

  return hasInvalidChars || hasControlChars;
}

export function isValidOptionalHttpUrl(value: string | null | undefined): boolean {
  if (!value || value.trim() === "") {
    return true;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}