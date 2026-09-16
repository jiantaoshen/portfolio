import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Hero from "@/components/page/Hero";
import Projects from "@/components/page/Projects";
import Education from "@/components/page/Education";

import {
  getTranslations,
  isLocale,
} from "@/i18n";

export const metadata: Metadata = {
  title: "Jiantao Shen | Backend Software Developer",
  description: "A backend developer in Eskilstuna",
};

interface HomePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function HomePage({
  params,
}: HomePageProps) {
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
    <>
      <Hero
        common={common}
        about={about}
      />

      <Projects
        lang={lang}
        common={common}
        about={about}
      />

      <Education
        about={about}
      />
    </>
  );
}