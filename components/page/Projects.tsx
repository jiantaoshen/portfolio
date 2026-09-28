import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { TechList } from "@/components/content/TechList";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface FeaturedProjectsProps {
  locale: Locale;
}

type ProjectCard = {
  title: string;
  description: string;
  status?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  imageAlt?: string;
};

export default async function Projects({ locale }: FeaturedProjectsProps) {
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

  const projects = about.raw("projects.items") as ProjectCard[];

  return (
    <section id="projects" aria-labelledby="projects-title">
      <div className="mb-7 sm:mb-8 min-[1920px]:mb-10">
        <h2
          id="projects-title"
          className="text-(length:--section-title-size) font-bold tracking-tight text-foreground"
        >
          {about("projects.title")}
        </h2>
      </div>

      <div className="grid gap-5 lg:gap-6 min-[1920px]:gap-8">
        {projects.map((project) => (
          <Card
            key={project.title}
            className="overflow-hidden bg-background p-0"
          >
            <div className="grid md:grid-cols-[minmax(12rem,0.9fr)_minmax(0,1.35fr)]">
              <div className="relative min-h-48 overflow-hidden border-b border-border bg-muted/40 md:min-h-64 md:border-r md:border-b-0">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.imageAlt ?? project.title}
                    fill
                    sizes="(min-width: 1024px) 32vw, (min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">
                      Image
                    </span>
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-col p-5 sm:p-6 min-[1920px]:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-(length:--project-heading-size) font-bold text-foreground">
                    {project.title}
                  </h3>

                  {project.status && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {project.status}
                    </Badge>
                  )}
                </div>

                <p className="mt-4 text-(length:--project-body-size) leading-relaxed text-muted-foreground min-[1920px]:leading-7">
                  {project.description}
                </p>

                <div className="mt-5">
                  <TechList items={project.technologies} />
                </div>

                {(project.liveUrl || project.githubUrl) && (
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "w-full sm:w-auto",
                        )}
                      >
                        {common("buttons.liveDemo")}
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full sm:w-auto",
                        )}
                      >
                        {common("buttons.github")}
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
