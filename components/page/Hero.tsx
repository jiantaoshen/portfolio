import { getTranslations } from "next-intl/server";

import { TechList } from "@/components/content/TechList";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface HeroProps {
  locale: Locale;
}

type SkillGroup = {
  title: string;
  items: string[];
};

export default async function Hero({ locale }: HeroProps) {
  const common = await getTranslations({
    locale,
    namespace: "common",
  });

  const about = await getTranslations({
    locale,
    namespace: "about",
  });

  const skillGroups = about.raw("skills.items") as SkillGroup[];

  return (
    <section
      id="skills"
      className="flex items-center bg-muted py-[var(--hero-padding-y)]"
    >
      <PageContainer>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-3 lg:gap-16 2xl:gap-[4.5rem] min-[1920px]:grid-cols-[minmax(0,2.15fr)_minmax(20rem,0.85fr)] min-[1920px]:gap-[5.5rem] min-[2560px]:grid-cols-[minmax(0,2.25fr)_minmax(23rem,0.75fr)] min-[2560px]:gap-28">
          <div className="max-w-3xl lg:col-span-2 xl:max-w-4xl 2xl:max-w-[60rem] min-[1920px]:col-span-1">
            <h1 className="m-0 max-w-[var(--hero-title-max-width)] text-[length:var(--hero-title-size)] leading-[0.94] font-extrabold tracking-tighter text-foreground">
              {about("hero.titleBefore")} {" "}
              <span className="text-primary">
                {about("hero.titleHighlight")}
              </span>
            </h1>

            <p className="mt-6 mb-0 max-w-[var(--hero-description-max-width)] text-[length:var(--hero-description-size)] leading-relaxed text-muted-foreground md:mt-8 min-[1920px]:leading-[1.55]">
              {about("about.description")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap min-[1920px]:mt-9 min-[1920px]:gap-3.5">
              <a
                href="#projects"
                className={cn(
                  buttonVariants({ variant: "default", size: "xl" }),
                  "w-full sm:w-auto",
                )}
              >
                {common("buttons.viewProjects")}
                <span aria-hidden="true">↓</span>
              </a>

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
          </div>

          <aside
            className="flex flex-col justify-center border-t border-border pt-8 lg:col-span-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-11 2xl:pl-14 min-[1920px]:pl-14 min-[2560px]:pl-[4.5rem]"
            aria-labelledby="hero-skills-title"
          >
            <h2
              id="hero-skills-title"
              className="mt-0 mb-5 font-mono text-xs font-bold uppercase tracking-widest text-primary sm:mb-6 min-[1920px]:text-[0.8125rem]"
            >
              {about("skills.title")}
            </h2>

            <div className="grid gap-5 sm:gap-6 min-[2560px]:gap-8">
              {skillGroups.map((group) => (
                <div
                  key={group.title}
                  className="grid gap-3 min-[2560px]:gap-4"
                >
                  <h3 className="m-0 text-sm font-bold text-foreground min-[1920px]:text-base min-[2560px]:text-lg">
                    {group.title}
                  </h3>

                  <TechList items={group.items} />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </PageContainer>
    </section>
  );
}
