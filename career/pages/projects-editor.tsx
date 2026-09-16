"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Clipboard, Save, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { EditorTabs, type EditorTab } from "../components/dashboard/editor-tabs";
import { localeLabels } from "../components/dashboard/locale-switcher";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { getProjectsByLocale } from "../lib/projects";
import type { DashboardMode, Locale, Project } from "../lib/types";
import { useCareerWorkspace } from "../workspace";

export function ProjectsEditorPage() {
  const t = useTranslations("dashboard");
  const { data, actions, mode, saving } = useCareerWorkspace();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const localeParam = searchParams.get("lang");
  const locale: Locale =
    localeParam && localeParam in localeLabels ? (localeParam as Locale) : "en";

  const selectedId = searchParams.get("project") ?? "";

  const visibleProjects = useMemo(
    () => getProjectsByLocale(data.projects, locale),
    [data.projects, locale],
  );

  const selected = useMemo(
    () => visibleProjects.find((project) => project.id === selectedId) ?? null,
    [visibleProjects, selectedId],
  );

  const replaceSearchParams = useCallback(
    ({ lang, project }: { lang: Locale; project?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("lang", lang);

      if (project) {
        params.set("project", project);
      } else {
        params.delete("project");
      }

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (selected) return;

    const firstProject = visibleProjects[0];

    if (!firstProject) {
      if (selectedId || searchParams.get("lang") !== locale) {
        replaceSearchParams({ lang: locale });
      }

      return;
    }

    replaceSearchParams({
      lang: locale,
      project: firstProject.id,
    });
  }, [
    locale,
    selected,
    selectedId,
    visibleProjects,
    searchParams,
    replaceSearchParams,
  ]);

  async function saveProject(project: Project) {
    const saved = await actions.saveProject(project);

    if (saved.id !== selectedId || saved.language !== locale) {
      replaceSearchParams({
        lang: saved.language,
        project: saved.id,
      });
    }

    return saved;
  }

  async function deleteProject(project: Project) {
    await actions.deleteProject(project);

    const remaining = getProjectsByLocale(
      data.projects.filter((item) => item.id !== project.id),
      locale,
    );

    const nextProject = remaining[0];

    if (nextProject) {
      replaceSearchParams({
        lang: locale,
        project: nextProject.id,
      });
    } else {
      replaceSearchParams({
        lang: locale,
      });
    }
  }

  return (
    <div className="space-y-6">
      {selected ? (
        <ProjectEditor
          key={selected.id}
          project={selected}
          mode={mode}
          saving={saving}
          onSave={saveProject}
          onDelete={deleteProject}
        />
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h1 className="m-0 text-2xl font-bold tracking-tight text-foreground">
              {t("projects.title")}
            </h1>

            <p className="mt-2 mb-0 text-sm text-muted-foreground">
              {visibleProjects.length === 0
                ? t("projects.empty", {
                    language: localeLabels[locale],
                  })
                : t("projects.opening")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProjectEditor({
  project,
  mode,
  saving,
  onSave,
  onDelete,
}: {
  project: Project;
  mode: DashboardMode;
  saving: boolean;
  onSave: (project: Project) => Promise<Project>;
  onDelete: (project: Project) => Promise<void>;
}) {
  const t = useTranslations("dashboard");

  const [draft, setDraft] = useState(project);
  const [techText, setTechText] = useState(project.technologies.join(", "));
  const [tab, setTab] = useState<EditorTab>("edit");

  async function copyMarkdown() {
    await navigator.clipboard.writeText(draft.contentMarkdown);
  }

  async function save() {
    try {
      const saved = await onSave(draft);

      setDraft(saved);
      setTechText(saved.technologies.join(", "));
    } catch {
      // Workspace banner already shows the error.
    }
  }

  async function remove() {
    if (
      mode === "admin" &&
      !window.confirm(
        t("projects.confirmDelete", {
          sourceId: draft.sourceId,
        }),
      )
    ) {
      return;
    }

    try {
      await onDelete(draft);
    } catch {
      // Workspace banner already shows the error.
    }
  }

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>
              {draft.title || t("projects.untitled")}
            </CardTitle>

            <Badge variant="secondary">
              {localeLabels[draft.language]}
            </Badge>
          </div>

          <CardDescription>
            {mode === "trial"
              ? t("projects.demoCopy")
              : t("projects.source", {
                  sourceId: draft.sourceId,
                })}
          </CardDescription>
        </div>

        <EditorTabs value={tab} onChange={setTab} />
      </CardHeader>

      {tab === "edit" ? (
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label={t("projects.fields.title")}>
            <Input
              value={draft.title}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  title: event.target.value,
                })
              }
            />
          </Field>

          <Field label={t("projects.fields.slug")}>
            <Input
              value={draft.slug}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  slug: event.target.value,
                })
              }
            />
          </Field>

          <Field label={t("projects.fields.status")}>
            <Input
              value={draft.status}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  status: event.target.value,
                })
              }
              placeholder={t("projects.placeholders.status")}
            />
          </Field>

          <div className="flex items-end">
            <div className="pb-2 text-sm text-muted-foreground">
              {t("projects.fields.language")}:{" "}
              <strong className="font-semibold text-foreground">
                {localeLabels[draft.language]}
              </strong>
            </div>
          </div>

          <div className="md:col-span-2">
            <Field label={t("projects.fields.summary")}>
              <Textarea
                rows={3}
                value={draft.summary}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    summary: event.target.value,
                  })
                }
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label={t("projects.fields.technologies")}>
              <Input
                value={techText}
                onChange={(event) => {
                  const value = event.target.value;

                  setTechText(value);

                  setDraft({
                    ...draft,
                    technologies: splitComma(value),
                  });
                }}
              />
            </Field>
          </div>

          <Field label={t("projects.fields.githubUrl")}>
            <Input
              value={draft.githubUrl}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  githubUrl: event.target.value,
                })
              }
            />
          </Field>

          <Field label={t("projects.fields.liveUrl")}>
            <Input
              value={draft.demoUrl}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  demoUrl: event.target.value,
                })
              }
            />
          </Field>

          <Field label={t("projects.fields.sortOrder")}>
            <Input
              type="number"
              value={draft.sortOrder}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  sortOrder: Number(event.target.value),
                })
              }
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  published: event.target.checked,
                })
              }
              className="size-4 accent-primary"
            />

            {t("projects.fields.published")}
          </label>

          <div className="md:col-span-2">
            <Field label={t("projects.fields.markdown")}>
              <Textarea
                rows={30}
                className="font-mono leading-6"
                value={draft.contentMarkdown}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    contentMarkdown: event.target.value,
                  })
                }
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button
              type="button"
              disabled={saving}
              onClick={() => void save()}
            >
              <Save className="mr-2 size-4" />

              {saving
                ? t("actions.saving")
                : mode === "trial"
                  ? t("actions.applyInDemo")
                  : t("actions.saveMarkdown")}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => void copyMarkdown()}
            >
              <Clipboard className="mr-2 size-4" />
              {t("actions.copyMarkdown")}
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={saving}
              onClick={() => void remove()}
            >
              <Trash2 className="mr-2 size-4" />

              {mode === "trial"
                ? t("actions.removeFromDemo")
                : t("actions.deleteSource")}
            </Button>
          </div>
        </CardContent>
      ) : (
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-border bg-muted p-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{draft.status}</Badge>

              {draft.published && (
                <Badge>{t("projects.preview.published")}</Badge>
              )}
            </div>

            <h2 className="mt-4 mb-0 text-2xl font-bold tracking-tight text-foreground">
              {draft.title}
            </h2>

            {draft.summary && (
              <p className="mt-2 mb-0 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {draft.summary}
              </p>
            )}

            {draft.technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {draft.technologies.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="prose-lite">
            <ReactMarkdown>{draft.contentMarkdown}</ReactMarkdown>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function splitComma(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}