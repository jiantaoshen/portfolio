import { getTranslations } from "next-intl/server";

import { TechList } from "@/components/content/TechList";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
};

export default async function FeaturedProjects({ locale }: FeaturedProjectsProps) {
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
    <section id="projects" className="py-(--section-padding-y)">
      <PageContainer>
        <div className="mb-10 lg:mb-12 min-[1920px]:mb-14">
          <h2 className=" text-(length:--section-title-size) font-bold tracking-tight text-foreground">
            {about("projects.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6 min-[1920px]:gap-8">
          {projects.map((project) => (
            <Card key={project.title} className="h-full bg-background">
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="text-(length:--project-heading-size) font-bold">
                    {project.title}
                  </CardTitle>

                  {project.status && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {project.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-(length:--project-body-size) leading-relaxed text-muted-foreground min-[1920px]:leading-7">
                  {project.description}
                </p>

                <TechList items={project.technologies} />
              </CardContent>

              {(project.liveUrl || project.githubUrl) && (
                <CardFooter className="flex flex-wrap gap-2 border-t">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "flex-1 sm:flex-none",
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
                        "flex-1 sm:flex-none",
                      )}
                    >
                      {common("buttons.github")}
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
