import "@/app/globals.css";

import type { Metadata } from "next";
import {NextIntlClientProvider, hasLocale} from "next-intl";
import {routing} from "@/i18n/routing";
import {notFound} from "next/navigation";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "@/components/page/Navbar";
import Footer from "@/components/page/Footer";

interface LocaleLayoutProps {
  children: React.ReactNode;

  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.map(
    (locale) => ({
      locale,
    }),
  );
}

export const metadata: Metadata = {
  title: "JIANTAO.dev",

  icons: {
    icon: "/favicon-js.svg",
  },
};

export default async function localeLayout({children, params}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
        <div className="flex min-h-screen w-full flex-col">
          <Navbar locale={locale}/>

          <main className="flex-1">
            {children}
          </main>

          <Footer locale={locale}/>
        </div>


        <Analytics />
        <SpeedInsights />

        </NextIntlClientProvider>
      </body>
    </html>
  );
}