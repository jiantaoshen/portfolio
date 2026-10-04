import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing, type Locale } from "@/i18n/routing";
import Intro from "@/components/page/Intro";
import Skills from "@/components/page/Skills";
import Projects from "@/components/page/Projects";
import Education from "@/components/page/Education";

interface HomePageProps {
  params: Promise<{locale: string;}>;
}

export async function generateMetadata({params}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const about = await getTranslations({locale, namespace: "about"});

  return {
    title: "Jiantao Shen | Fullstack Developer",
    description: about("about.description"),
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;

  return (
      <div className="mx-auto container grid grid-cols-1 items-start lg:grid-cols-[minmax(0,2.15fr)_minmax(18rem,0.85fr)]">
        <div>
          <Intro locale={currentLocale} />
          <Projects locale={currentLocale} />
        </div>

        <div className="lg:border-l-4 border-accent/50">
          <Skills locale={currentLocale} />
          <Education locale={currentLocale} />
        </div>
      </div>
  );
}