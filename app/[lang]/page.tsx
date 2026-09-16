import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Hero from "@/components/page/Hero";
import FeaturedProjects from "@/components/page/Projects";
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

  const home =
    getTranslations(
      lang,
      "home",
    );

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
        home={home}
        common={common}
        skills={about.skills}
      />

      <FeaturedProjects
        lang={lang}
        home={home}
        common={common}
      />

      <Education
        about={about}
      />
    </>
  );
}