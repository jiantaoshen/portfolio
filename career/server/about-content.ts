import en from "../../i18n/locales/en/about.json"
import sv from "../../i18n/locales/sv/about.json"
import zh from "../../i18n/locales/zh/about.json"
import type { AboutByLocale } from "../lib/types"

// These JSON files remain the source of truth for the public About/CV content.
// Trial receives a browser copy. Admin can save a locale through ASP.NET in development.
export function getAboutContent(): AboutByLocale {
  return { en, sv, zh } as AboutByLocale
}
