import { getTranslations } from "next-intl/server";

import { TechList } from "@/components/content/TechList";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import sharedProjects from "@/i18n/shared/projects.json";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocalizedProject = {
  title: string;
  description: string;
  highlights?: string[];
  technologyCategories: Record<string, string>;
};

export default async function Projects({ locale }: { locale: Locale }) {
  const [about, common] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const localized = about.raw("projects.items") as Record<string, LocalizedProject>;

  return (
    <section id="projects" aria-labelledby="projects-title">
      <div className="mb-7 sm:mb-8 min-[1920px]:mb-10">
        <h2 id="projects-title" className="text-(length:--section-title-size) font-bold tracking-tight text-foreground">
          {about("projects.title")}
        </h2>
      </div>

      <div className="space-y-5">
        {sharedProjects.items.map((shared) => {
          const project = localized[shared.id];

          if (!project?.title) return null;

          const groups = shared.technologyGroups
            .map((group) => ({ ...group, title: project.technologyCategories?.[group.id] ?? "" }))
            .filter((group) => group.title && group.items.length);

          return (
            <Card key={shared.id} className="overflow-hidden p-0">
              <div className={cn("grid", groups.length && "lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,.95fr)]")}>
                <div className={cn("flex min-w-0 flex-col p-5", groups.length && "lg:border-r-2 lg:border-muted-foreground/30")}>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-(length:--project-heading-size) font-bold text-foreground">{project.title}</h3>
                    {shared.status && <Badge variant="outline" className="font-mono text-xs">{shared.status}</Badge>}
                  </div>

                  <p className="mt-4 text-(length:--project-body-size) leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  {!!project.highlights?.length && (
                    <ul className="mt-5 space-y-2 text-(length:--project-body-size) text-foreground/80">
                      {project.highlights.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="font-bold text-primary" aria-hidden="true">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {(shared.liveUrl || shared.githubUrl) && (
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:mt-auto lg:pt-6">
                      {shared.liveUrl && (
                        <a href={shared.liveUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), "w-full sm:w-auto")}>
                          {common("buttons.liveDemo")} <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {shared.githubUrl && (
                        <a href={shared.githubUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
                          {common("buttons.github")} <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {!!groups.length && (
                  <div className="space-y-5 p-5">
                    {groups.map((group) => (
                      <div key={group.id}>
                        <h4>{group.title}</h4>
                        <TechList items={group.items} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
