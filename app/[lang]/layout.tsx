import "../globals.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

// import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "@/components/page/Navbar";
import Footer from "@/components/page/Footer";

import {
  getTranslations,
  isLocale,
  locales,
} from "@/i18n";

interface LangLayoutProps {
  children: React.ReactNode;

  params: Promise<{
    lang: string;
  }>;
}

export const metadata: Metadata = {
  title: "JIANTAO.dev",

  icons: {
    icon: "/favicon-js.svg",
  },
};

export function generateStaticParams() {
  return locales.map((lang) => ({
    lang,
  }));
}

export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const common =
    getTranslations(
      lang,
      "common",
    );

  const about =
    getTranslations(
      lang,
      "about",
    );

  return (
    <html lang={lang}>
      <body>
        <div className="flex min-h-screen w-full flex-col">
          <Navbar
            lang={lang}
            common={common}
            educationLabel={
              about.education.title
            }
          />

          <main className="flex-1">
            {children}
          </main>

          <Footer
            lang={lang}
            common={common}
          />
        </div>

        {/*
        <Analytics />
        <SpeedInsights />
        */}
      </body>
    </html>
  );
}