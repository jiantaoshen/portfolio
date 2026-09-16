import Link from "next/link";

import {
  Badge,
} from "@/components/ui/badge";

import {
  buttonVariants,
} from "@/components/ui/button";

import {
  cn,
} from "@/lib/utils";

import type {
  Locale,
} from "@/i18n";

import type {
  CommonTranslation,
  AboutTranslation
} from "@/i18n/types";

import {
  getFeaturedProjects,
  getProjectSlug,
} from "@/lib/content/projects";


interface FeaturedProjectsProps {
  lang: Locale;
  about: AboutTranslation;
  common: CommonTranslation;
}


export default async function FeaturedProjects({lang, common, about}: FeaturedProjectsProps) {
  const featuredProjects =
    await getFeaturedProjects(
      lang,
    );

  return (
    <section
      id="projects"
      className="projects-section section"
    >
      <div className="container">
        {/* Header */}

        <div className="projects-header">
          <h2 className="projects-title">
            {about.projects.title}
          </h2>
        </div>


        {/* Projects */}

        <div className="projects-list">
          {featuredProjects.map(
            (
              project,
              index,
            ) => (
              <article
                key={
                  project.id
                }
                className="project-row"
              >
                {/* Index */}

                <div className="project-index">
                  {String(
                    index + 1,
                  ).padStart(
                    2,
                    "0",
                  )}
                </div>


                {/* Project */}

                <div className="project-main">
                  <div className="project-heading">
                    <h3>
                      {
                        project.data
                          .title
                      }
                    </h3>

                    {project.data
                      .status && (
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs"
                      >
                        {
                          project.data
                            .status
                        }
                      </Badge>
                    )}
                  </div>


                  {/* Technologies */}

                  {project.data
                    .technologies
                    .length >
                    0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.data
                        .technologies
                        .map(
                          (
                            tech,
                          ) => (
                            <Badge
                              key={
                                tech
                              }
                              variant="outline"
                              className="font-mono text-xs text-muted-foreground"
                            >
                              {
                                tech
                              }
                            </Badge>
                          ),
                        )}
                    </div>
                  )}
                </div>


                {/* Description */}

                <p className="project-description">
                  {
                    project.data
                      .description
                  }
                </p>


                {/* Case study */}

                <Link
                  href={`/${lang}/projects/${getProjectSlug(
                    project.id,
                  )}/`}
                  className={cn(
                    buttonVariants({
                      variant:
                        "ghost",
                    }),
                    "w-fit justify-self-start text-primary hover:text-foreground lg:justify-self-end",
                  )}
                >
                  {common.buttons.caseStudy}

                  <span
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}