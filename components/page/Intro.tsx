import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface IntroProps {
  locale: Locale;
}

export default async function Intro({ locale }: IntroProps) {
  const [about, common] = await Promise.all([
    getTranslations({
      locale,
      namespace: "about",
    }),
    getTranslations({
      locale,
      namespace: "common",
    }),
  ]);

  return (
    <section aria-labelledby="intro-title">
      <h1
        id="intro-title"
        className="max-w-(--hero-title-max-width) text-(length:--hero-title-size) font-extrabold tracking-tighter text-foreground"
      >
        {about("hero.titleBefore")}
        <span className="block text-primary sm:inline">
          {about("hero.titleHighlight")}
        </span>
      </h1>

      <p className="mt-5 max-w-(--hero-description-max-width) text-(length:--hero-description-size) leading-relaxed text-muted-foreground sm:mt-6">
        {about("about.description")}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap min-[1920px]:mt-9 min-[1920px]:gap-3.5">
        <a
          href="https://github.com/jiantaoshen"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "xl" }),
            "w-full sm:w-auto",
          )}
        >
          {common("buttons.github")}
          <span aria-hidden="true">↗</span>
        </a>

        <a
          href="https://www.linkedin.com/in/jiantaoshen"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "xl" }),
            "w-full sm:w-auto",
          )}
        >
          {common("buttons.linkedin")}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
