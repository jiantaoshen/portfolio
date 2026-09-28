import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing, type Locale } from "@/i18n/routing";
import Intro from "@/components/page/Intro";
import Skills from "@/components/page/Skills";
import Projects from "@/components/page/Projects";
import Education from "@/components/page/Education";
import { PageContainer } from "@/components/layout/page-container";

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
    <div className="py-8 sm:py-10 lg:py-12 min-[1920px]:py-14">
      <PageContainer>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,2.15fr)_minmax(18rem,0.85fr)] lg:gap-12 xl:gap-16 min-[1920px]:grid-cols-[minmax(0,2.2fr)_minmax(21rem,0.8fr)] min-[1920px]:gap-18 min-[2560px]:grid-cols-[minmax(0,2.3fr)_minmax(23rem,0.7fr)] min-[2560px]:gap-22">
          <div className="min-w-0">
            <Intro locale={currentLocale} />

            <div className="mt-10 sm:mt-12 lg:mt-12 min-[1920px]:mt-14">
              <Projects locale={currentLocale} />
            </div>
          </div>

          <aside className="min-w-0 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10 xl:pl-12 min-[1920px]:pl-14 min-[2560px]:pl-18">
            <Skills locale={currentLocale} />

            <div className="mt-10 border-t border-border pt-8 min-[1920px]:mt-12 min-[1920px]:pt-10">
              <Education locale={currentLocale} />
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}