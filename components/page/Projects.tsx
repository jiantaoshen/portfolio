import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { TechList } from "@/components/content/TechList";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { getFeaturedProjects, getProjectSlug } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

interface FeaturedProjectsProps {
  locale: Locale;
}

export default async function FeaturedProjects({ locale }: FeaturedProjectsProps) {
  const [projects, about, common] = await Promise.all([
    getFeaturedProjects(locale),
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
    <section
      id="projects"
      className="bg-muted py-[var(--section-padding-y)]"
    >
      <PageContainer>
        <div className="mb-10 lg:mb-12 min-[1920px]:mb-14">
          <h2 className="m-0 text-[length:var(--section-title-size)] font-bold tracking-tight text-foreground">
            {about("projects.title")}
          </h2>
        </div>

        <div className="border-b border-border">
          {projects.map((project) => (
            <article
              key={project.id}
              className="grid grid-cols-1 gap-4 border-t border-border py-[var(--row-padding-y)] lg:grid-cols-12 lg:items-start lg:gap-6 2xl:gap-8 min-[1920px]:grid-cols-[minmax(20rem,4fr)_minmax(0,6fr)_minmax(10rem,2fr)] min-[1920px]:gap-12 min-[2560px]:grid-cols-[minmax(24rem,4fr)_minmax(0,7fr)_minmax(11rem,2fr)] min-[2560px]:gap-16"
            >
              <div className="grid gap-3 lg:col-span-4 min-[1920px]:col-span-1 min-[1920px]:gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="m-0 text-[length:var(--project-heading-size)] font-bold text-foreground">
                    {project.data.title}
                  </h3>

                  {project.data.status && (
                    <Badge variant="secondary" className="font-mono text-xs">
                      {project.data.status}
                    </Badge>
                  )}
                </div>

                <TechList items={project.data.technologies} />
              </div>

              <p className="m-0 text-[length:var(--project-body-size)] leading-relaxed text-muted-foreground lg:col-span-6 min-[1920px]:col-span-1 min-[1920px]:leading-7">
                {project.data.description}
              </p>

              <Link
                href={`/${locale}/projects/${getProjectSlug(project.id)}/`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-fit justify-self-start font-semibold text-primary hover:text-foreground lg:col-span-2 lg:justify-self-end min-[1920px]:col-span-1 min-[1920px]:h-12 min-[1920px]:px-5 min-[1920px]:text-base",
                )}
              >
                {common("buttons.caseStudy")}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
