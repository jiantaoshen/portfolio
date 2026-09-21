import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import MarkdownContent from "@/components/content/MarkdownContent";
import { TechList } from "@/components/content/TechList";
import { PageContainer } from "@/components/layout/page-container";
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
      <section className="border-b border-border bg-muted py-[var(--detail-header-padding-y)]">
        <PageContainer>
          <Link
            href={`/${locale}/#projects`}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-foreground"
          >
            <span aria-hidden="true">←</span>
            {projectT("detail.back")}
          </Link>

          {project.data.status && (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="font-mono text-xs">
                {project.data.status}
              </Badge>
            </div>
          )}

          <h1 className="m-0 max-w-[var(--detail-title-max-width)] text-[length:var(--detail-title-size)] font-extrabold tracking-tight text-foreground">
            {project.data.title}
          </h1>

          <p className="mt-6 mb-0 max-w-[var(--detail-description-max-width)] text-[length:var(--detail-description-size)] leading-relaxed text-muted-foreground">
            {project.data.description}
          </p>

          {project.data.technologies.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary min-[1920px]:text-[0.8125rem]">
                {projectT("detail.technologies")}
              </p>

              <TechList items={project.data.technologies} />
            </div>
          )}

          {(project.data.links?.live || project.data.links?.github) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {project.data.links?.live && (
                <a
                  href={project.data.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default", size: "xl" }),
                    "w-full sm:w-auto",
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
                    buttonVariants({ variant: "outline", size: "xl" }),
                    "w-full sm:w-auto",
                  )}
                >
                  {commonT("buttons.github")}
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}
        </PageContainer>
      </section>

      <section className="bg-background py-[var(--detail-body-padding-y)]">
        <PageContainer className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-16 2xl:gap-20 min-[2560px]:grid-cols-[minmax(0,3.2fr)_minmax(18rem,0.8fr)] min-[2560px]:gap-28">
          <article className="min-w-0 lg:col-span-3 min-[2560px]:col-span-1">
            <div className="article-content">
              <MarkdownContent content={project.content} />
            </div>
          </article>

          {headings.length > 0 && (
            <aside className="hidden lg:col-span-1 lg:block min-[2560px]:col-span-1">
              <div className="sticky top-28">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground min-[1920px]:text-[0.8125rem]">
                  {projectT("detail.contents")}
                </p>

                <nav
                  className="mt-4 flex flex-col gap-3"
                  aria-label={projectT("detail.contents")}
                >
                  {headings.map((heading) => (
                    <a
                      key={heading.slug}
                      href={`#${heading.slug}`}
                      className={cn(
                        "text-sm text-muted-foreground transition-colors hover:text-primary min-[1536px]:text-[0.95rem] min-[2560px]:text-base",
                        heading.depth === 3 && "pl-4 text-xs min-[2560px]:text-sm",
                      )}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </PageContainer>
      </section>
    </>
  );
}
