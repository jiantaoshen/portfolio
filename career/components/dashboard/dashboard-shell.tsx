"use client";

import { UiLanguageSwitcher } from "./ui-language-switcher";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  FileUser,
  Home,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { isLocale, localeMeta, locales } from "@/lib/locales";
import { cn } from "@/lib/utils";

import { emptyProject, getNextProjectSortOrder, getProjectsByLocale } from "../../lib/projects";
import type { DashboardMode, Locale } from "../../lib/types";
import { useCareerWorkspace } from "../../workspace";
import { dashboardNavItemVariants } from "./nav-variants";

interface DashboardShellProps {
  mode: DashboardMode;
  onReset?: () => void;
  actionError?: string | null;
  onDismissError?: () => void;
  children: React.ReactNode;
}

export function DashboardShell({
  mode,
  onReset,
  actionError,
  onDismissError,
  children,
}: DashboardShellProps) {
  const t = useTranslations("dashboard");
  const { data, actions } = useCareerWorkspace();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const base = mode === "trial" ? "/trial" : "/dashboard";
  const cvPath = `${base}/cv`;
  const projectsPath = `${base}/projects`;

  const cvActive = pathname === cvPath;
  const projectsActive = pathname.startsWith(projectsPath);

  const localeParam = searchParams.get("lang");
  const projectLocale: Locale = isLocale(localeParam) ? localeParam : "en";

  const selectedProjectId = searchParams.get("project") ?? "";
  const visibleProjects = getProjectsByLocale(data.projects, projectLocale);

  function openProjects() {
    if (projectsActive) return;

    const firstProject = visibleProjects[0];
    const params = new URLSearchParams();

    params.set("lang", projectLocale);

    if (firstProject) {
      params.set("project", firstProject.id);
    }

    router.push(`${projectsPath}?${params.toString()}`);
  }

  function changeProjectLocale(locale: Locale) {
    const projects = getProjectsByLocale(data.projects, locale);
    const firstProject = projects[0];
    const params = new URLSearchParams();

    params.set("lang", locale);

    if (firstProject) {
      params.set("project", firstProject.id);
    }

    router.push(`${projectsPath}?${params.toString()}`);
  }

  function openProject(projectId: string) {
    const params = new URLSearchParams();

    params.set("lang", projectLocale);
    params.set("project", projectId);

    router.push(`${projectsPath}?${params.toString()}`);
  }

  function createProject() {
    const nextSortOrder = getNextProjectSortOrder(data.projects, projectLocale);
    const staged = actions.stageProject(emptyProject(projectLocale, nextSortOrder));
    const params = new URLSearchParams();

    params.set("lang", projectLocale);
    params.set("project", staged.id);

    router.push(`${projectsPath}?${params.toString()}`);
  }

  return (
    <div className="dashboard-shell min-h-screen bg-muted text-foreground lg:grid lg:grid-cols-[var(--dashboard-sidebar-width)_minmax(0,1fr)]">
      <aside className="border-b border-border bg-background p-4 lg:min-h-screen lg:border-r lg:border-b-0 lg:p-[var(--dashboard-sidebar-padding)]">
        <div className="mb-6 flex items-center justify-between lg:block">
          <div>
            <div className="text-sm font-semibold text-primary">JIANTAO.dev</div>

            <div className="mt-1 text-xl font-bold tracking-tight text-foreground">
              {mode === "trial" ? t("title.trial") : t("title.local")}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:mt-3 lg:flex-col lg:items-start">
            <Badge variant="outline" className="font-mono text-primary">
              {mode === "trial" ? t("status.trial") : t("status.local")}
            </Badge>

            <UiLanguageSwitcher />
          </div>
        </div>

        <nav className="space-y-1">
          <Link
            href={cvPath}
            aria-current={cvActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium",
              dashboardNavItemVariants({ active: cvActive, underlineInset: "lg" }),
            )}
          >
            <FileUser className="size-4" />
            {t("nav.cv")}
          </Link>

          <div>
            <Button
              type="button"
              variant="ghost"
              onClick={openProjects}
              aria-expanded={projectsActive}
              className={cn(
                "h-auto w-full justify-start rounded-none px-3 py-2",
                dashboardNavItemVariants({ active: projectsActive, underlineInset: "lg" }),
              )}
            >
              <BriefcaseBusiness className="size-4" />
              <span className="flex-1 text-left">{t("nav.projects")}</span>
              {projectsActive ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </Button>

            {projectsActive && (
              <div className="mt-2 ml-5 border-l border-border pl-3">
                <div className="mb-3 flex flex-wrap gap-1 px-2">
                  {locales.map((locale) => {
                    const active = locale === projectLocale;

                    return (
                      <Button
                        key={locale}
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => changeProjectLocale(locale)}
                        className={cn(
                          "h-auto rounded-none px-2 py-1",
                          dashboardNavItemVariants({ active, underlineInset: "sm" }),
                        )}
                      >
                        {localeMeta[locale].label}
                      </Button>
                    );
                  })}
                </div>

                <div className="space-y-1">
                  {visibleProjects.map((project) => {
                    const selected = selectedProjectId === project.id;

                    return (
                      <Button
                        key={project.id}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openProject(project.id)}
                        className={cn(
                          "h-auto w-full justify-start truncate px-2 py-2 text-left",
                          selected
                            ? "bg-accent font-medium text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <span className="truncate">{project.title}</span>
                      </Button>
                    );
                  })}

                  {visibleProjects.length === 0 && (
                    <p className="m-0 px-2 py-2 text-xs text-muted-foreground">
                      {t("projects.empty", { language: localeMeta[projectLocale].label })}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={createProject}
                  className="mt-2 h-auto w-full justify-start px-2 py-2 text-primary hover:bg-accent hover:text-accent-foreground"
                >
                  <Plus className="size-4" />
                  {t("actions.newProject")}
                </Button>
              </div>
            )}
          </div>
        </nav>

        <div className="mt-6 space-y-2">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}
          >
            <Home className="mr-2 size-4" />
            {t("nav.portfolio")}
          </Link>

          {mode === "trial" && onReset && (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={onReset}
            >
              <RotateCcw className="mr-2 size-4" />
              {t("actions.resetDemo")}
            </Button>
          )}
        </div>
      </aside>

      <main className="min-w-0">
        {mode === "trial" && (
          <div className="border-b border-border bg-accent px-5 py-3 text-sm text-accent-foreground sm:px-6">
            <strong>{t("notices.trialTitle")}</strong>{" "}
            {t("notices.trialDescription")}
          </div>
        )}

        {mode === "admin" && (
          <div className="border-b border-border bg-background px-5 py-3 text-sm text-muted-foreground sm:px-6">
            <strong className="text-foreground">{t("notices.localTitle")}</strong>{" "}
            {t("notices.localDescription")}
          </div>
        )}

        {actionError && (
          <div className="flex items-center justify-between gap-3 border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive sm:px-6">
            <span>
              <strong>{t("errors.saveFailed")}</strong>{" "}
              {actionError}
            </span>

            {onDismissError && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={onDismissError}
                aria-label={t("actions.dismiss")}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        )}

        <div className="mx-auto w-full max-w-[var(--dashboard-content-max-width)] p-5 sm:p-[var(--dashboard-content-padding)]">
          {children}
        </div>
      </main>
    </div>
  );
}