import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";

import "@/app/globals.css";

import enDashboard from "@/i18n/locales/en/dashboard.json";
import svDashboard from "@/i18n/locales/sv/dashboard.json";
import zhDashboard from "@/i18n/locales/zh/dashboard.json";
import { getPreferredLocaleFromAcceptLanguage, isLocale, type Locale } from "@/lib/locales";

const CAREER_LOCALE_COOKIE = "career-ui-locale";

const messagesByLocale: Record<Locale, { dashboard: typeof enDashboard }> = {
  en: { dashboard: enDashboard },
  sv: { dashboard: svDashboard },
  zh: { dashboard: zhDashboard },
};


export default async function CareerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [cookieStore, headerStore] = await Promise.all([
    cookies(),
    headers(),
  ]);

  const savedLocale = cookieStore.get(CAREER_LOCALE_COOKIE)?.value;
  const browserLocale = getPreferredLocaleFromAcceptLanguage(
    headerStore.get("accept-language"),
  );

  const locale: Locale = isLocale(savedLocale) ? savedLocale : browserLocale;

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