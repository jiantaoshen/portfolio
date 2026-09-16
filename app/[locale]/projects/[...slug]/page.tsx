import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import MarkdownContent from "@/components/content/MarkdownContent";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { routing } from "@/i18n/routing";
import { getMarkdownHeadings } from "@/lib/content/markdown";
import { getProject, getProjects } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects
    .filter((project) => !project.data.draft)
    .map((project) => {
      const [locale, ...slug] = project.id.split("/");

      return {
        locale,
        slug,
      };
    });
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const project = await getProject(locale, slug);

  if (!project) {
    notFound();
  }

  return {
    title: `${project.data.title} | JIANTAO.dev`,
    description: project.data.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const project = await getProject(locale, slug);

  if (!project) {
    notFound();
  }

  const [projectT, commonT] = await Promise.all([
    getTranslations({
      locale,
      namespace: "project",
    }),
    getTranslations({
      locale,
      namespace: "common",
    }),
  ]);

  const headings = getMarkdownHeadings(project.content);

  return (
    <>
      <section className="project-detail-header">
        <div className="container">
          <Link
            href={`/${locale}/#projects`}
            className="project-detail-back"
          >
            <span aria-hidden="true">←</span>
            {projectT("detail.back")}
          </Link>

          {project.data.status && (
            <div className="project-detail-meta">
              <Badge variant="secondary" className="font-mono text-xs">
                {project.data.status}
              </Badge>
            </div>
          )}

          <h1 className="project-detail-title">
            {project.data.title}
          </h1>

          <p className="project-detail-description">
            {project.data.description}
          </p>

          {project.data.technologies.length > 0 && (
            <div className="project-detail-technologies">
              <p className="text-label project-detail-label">
                {projectT("detail.technologies")}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.data.technologies.map((technology) => (
                  <Badge
                    key={technology}
                    variant="outline"
                    className="font-mono text-xs text-muted-foreground"
                  >
                    {technology}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(project.data.links?.live || project.data.links?.github) && (
            <div className="project-detail-actions">
              {project.data.links?.live && (
                <a
                  href={project.data.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-12 w-full px-5 sm:w-auto",
                  )}
                >
                  {commonT("buttons.liveDemo")}
                  <span aria-hidden="true">↗</span>
                </a>
              )}

              {project.data.links?.github && (
                <a
                  href={project.data.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-12 w-full px-5 sm:w-auto",
                  )}
                >
                  {commonT("buttons.github")}
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="project-detail-body">
        <div className="container project-detail-grid">
          <article className="project-detail-article">
            <div className="article-content">
              <MarkdownContent content={project.content} />
            </div>
          </article>

          {headings.length > 0 && (
            <aside className="project-detail-sidebar">
              <div className="project-detail-toc">
                <p className="text-label text-muted-foreground">
                  {projectT("detail.contents")}
                </p>

                <nav
                  className="project-detail-toc-links"
                  aria-label={projectT("detail.contents")}
                >
                  {headings.map((heading) => (
                    <a
                      key={heading.slug}
                      href={`#${heading.slug}`}
                      className={cn(
                        "project-detail-toc-link",
                        heading.depth === 3 && "project-detail-toc-child",
                      )}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}