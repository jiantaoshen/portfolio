import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";

import MarkdownContent from "@/components/content/MarkdownContent";
import {Badge} from "@/components/ui/badge";
import {buttonVariants} from "@/components/ui/button";
import {getTranslations, isLocale} from "@/i18n";
import {getMarkdownHeadings} from "@/lib/content/markdown";
import {getProject, getProjects} from "@/lib/content/projects";
import {cn} from "@/lib/utils";


interface ProjectPageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}


export async function generateStaticParams() {
  const projects =
    await getProjects();

  return projects
    .filter(
      (project) =>
        !project.data.draft,
    )
    .map(
      (project) => {
        const [
          locale,
          ...slug
        ] =
          project.id.split("/");

        return {
          locale,
          slug,
        };
      },
    );
}


export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const {
    locale,
    slug,
  } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const project =
    await getProject(
      locale,
      slug,
    );

  if (!project) {
    notFound();
  }

  return {
    title:
      `${project.data.title} | JIANTAO.dev`,

    description:
      project.data.description,
  };
}


export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const {
    locale,
    slug,
  } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const project =
    await getProject(
      locale,
      slug,
    );

  if (!project) {
    notFound();
  }

  const projectTranslation =
    getTranslations(
      locale,
      "project",
    );

  const common =
    getTranslations(
      locale,
      "common",
    );

  const detail =
    projectTranslation.detail;

  const headings =
    getMarkdownHeadings(
      project.content,
    );


  return (
    <>
      {/* Project header */}

      <section className="project-detail-header">
        <div className="container">
          {/* Back */}

          <Link
            href={`/${locale}/#projects`}
            className="project-detail-back"
          >
            <span
              aria-hidden="true"
            >
              ←
            </span>

            {detail.back}
          </Link>


          {/* Status */}

          {project.data.status && (
            <div className="project-detail-meta">
              <Badge
                variant="secondary"
                className="font-mono text-xs"
              >
                {project.data.status}
              </Badge>
            </div>
          )}


          {/* Title */}

          <h1 className="project-detail-title">
            {project.data.title}
          </h1>

          <p className="project-detail-description">
            {project.data.description}
          </p>


          {/* Technologies */}

          {project.data
            .technologies
            .length >
            0 && (
            <div className="project-detail-technologies">
              <p className="text-label project-detail-label">
                {detail.technologies}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.data
                  .technologies
                  .map(
                    (
                      technology,
                    ) => (
                      <Badge
                        key={
                          technology
                        }
                        variant="outline"
                        className="font-mono text-xs text-muted-foreground"
                      >
                        {technology}
                      </Badge>
                    ),
                  )}
              </div>
            </div>
          )}


          {/* Actions */}

          {(project.data
            .links?.live ||
            project.data
              .links?.github) && (
            <div className="project-detail-actions">
              {project.data
                .links
                ?.live && (
                <a
                  href={
                    project
                      .data
                      .links
                      .live
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({
                      variant:
                        "default",
                    }),
                    "h-12 w-full px-5 sm:w-auto",
                  )}
                >
                  {common.buttons.liveDemo}

                  <span
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>
              )}

              {project.data
                .links
                ?.github && (
                <a
                  href={
                    project
                      .data
                      .links
                      .github
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({
                      variant:
                        "outline",
                    }),
                    "h-12 w-full px-5 sm:w-auto",
                  )}
                >
                  {
                    common
                      .buttons
                      .github
                  }

                  <span
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </section>


      {/* Content */}

      <section className="project-detail-body">
        <div className="container project-detail-grid">
          {/* Article */}

          <article className="project-detail-article">
            <div className="article-content">
              <MarkdownContent
                content={
                  project.content
                }
              />
            </div>
          </article>


          {/* Table of contents */}

          {headings.length >
            0 && (
            <aside className="project-detail-sidebar">
              <div className="project-detail-toc">
                <p className="text-label text-muted-foreground">
                  Contents
                </p>

                <nav
                  className="project-detail-toc-links"
                  aria-label="Table of contents"
                >
                  {headings.map(
                    (
                      heading,
                    ) => (
                      <a
                        key={
                          heading.slug
                        }
                        href={`#${heading.slug}`}
                        className={cn(
                          "project-detail-toc-link",

                          heading.depth ===
                            3 &&
                            "project-detail-toc-child",
                        )}
                      >
                        {heading.text}
                      </a>
                    ),
                  )}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}