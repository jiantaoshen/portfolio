import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import "@/app/globals.css";

import enDashboard from "@/i18n/locales/en/dashboard.json";
import svDashboard from "@/i18n/locales/sv/dashboard.json";
import zhDashboard from "@/i18n/locales/zh/dashboard.json";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

const CAREER_LOCALE_COOKIE = "career-ui-locale";

const messagesByLocale: Record<Locale, { dashboard: typeof enDashboard }> = {
  en: { dashboard: enDashboard },
  sv: { dashboard: svDashboard },
  zh: { dashboard: zhDashboard },
};

function getBrowserLocale(acceptLanguage: string | null): Locale {
  const languages = acceptLanguage?.toLowerCase() ?? "";

  if (languages.includes("zh")) return "zh";
  if (languages.includes("sv")) return "sv";

  return "en";
}

export default async function CareerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [cookieStore, headerStore] = await Promise.all([
    cookies(),
    headers(),
  ]);

  const savedLocale = cookieStore.get(CAREER_LOCALE_COOKIE)?.value;
  const browserLocale = getBrowserLocale(
    headerStore.get("accept-language"),
  );

  const locale: Locale =
    savedLocale && hasLocale(routing.locales, savedLocale)
      ? savedLocale
      : browserLocale;

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
    >
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messagesByLocale[locale]}
        >
          <Suspense
            fallback={
              <div className="min-h-screen bg-background" />
            }
          >
            {children}
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}