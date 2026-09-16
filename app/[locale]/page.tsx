import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Hero from "@/components/page/Hero";
import Projects from "@/components/page/Projects";
import Education from "@/components/page/Education";

import {hasLocale} from "next-intl";
import {getTranslations,} from "next-intl/server";
import {routing} from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Jiantao Shen | Backend Software Developer",
  description: "A backend developer in Eskilstuna",
};

interface HomePageProps {
  params: Promise<{locale: string;}>;
}

export default async function HomePage({params}: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const common = await getTranslations({    
    locale,
    namespace: "common"
  });

  const about =await getTranslations({    
    locale,
    namespace: "about"
  });

  return (
    <>
      <Hero locale={locale}/>
      <Projects locale={locale}/>
      <Education locale={locale}/>
    </>
  );
}