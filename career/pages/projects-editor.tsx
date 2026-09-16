"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Clipboard,
  Save,
  Trash2,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import {
  EditorTabs,
  type EditorTab,
} from "../components/dashboard/editor-tabs";

import {
  localeLabels,
} from "../components/dashboard/locale-switcher";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  getProjectsByLocale,
} from "../lib/projects";

import type {
  DashboardMode,
  Locale,
  Project,
} from "../lib/types";

import {
  useCareerWorkspace,
} from "../workspace";


export function ProjectsEditorPage() {
  const {
    data,
    actions,
    mode,
    saving,
  } = useCareerWorkspace();

  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const localeParam =
    searchParams.get(
      "lang",
    );

  const locale: Locale =
    localeParam &&
    localeParam in localeLabels
      ? (localeParam as Locale)
      : "en";

  const selectedId =
    searchParams.get(
      "project",
    ) ?? "";

  const visibleProjects =
    useMemo(
      () =>
        getProjectsByLocale(
          data.projects,
          locale,
        ),
      [
        data.projects,
        locale,
      ],
    );

  const selected =
    useMemo(
      () =>
        visibleProjects.find(
          (project) =>
            project.id ===
            selectedId,
        ) ?? null,
      [
        visibleProjects,
        selectedId,
      ],
    );


  /*
   * Next useSearchParams()
   * is read-only.
   *
   * Update the URL using
   * router.replace().
   */
  const replaceSearchParams =
    useCallback(
      ({
        lang,
        project,
      }: {
        lang: Locale;
        project?: string;
      }) => {
        const params =
          new URLSearchParams(
            searchParams.toString(),
          );

        params.set(
          "lang",
          lang,
        );

        if (project) {
          params.set(
            "project",
            project,
          );
        } else {
          params.delete(
            "project",
          );
        }

        const query =
          params.toString();

        router.replace(
          query
            ? `${pathname}?${query}`
            : pathname,
          {
            scroll: false,
          },
        );
      },
      [
        pathname,
        router,
        searchParams,
      ],
    );


  /*
   * Handles:
   *
   * /dashboard/projects
   * /dashboard/projects?lang=en
   * invalid project ids
   *
   * Always selects the first
   * project according to sortOrder.
   */
  useEffect(() => {
    if (selected) {
      return;
    }

    const firstProject =
      visibleProjects[0];

    /*
     * No projects exist
     * for this locale.
     */
    if (!firstProject) {
      if (
        selectedId ||
        searchParams.get(
          "lang",
        ) !== locale
      ) {
        replaceSearchParams({
          lang: locale,
        });
      }

      return;
    }

    replaceSearchParams({
      lang: locale,
      project:
        firstProject.id,
    });
  }, [
    locale,
    selected,
    selectedId,
    visibleProjects,
    searchParams,
    replaceSearchParams,
  ]);


  async function saveProject(
    project: Project,
  ) {
    const saved =
      await actions.saveProject(
        project,
      );

    /*
     * Normally the id remains
     * unchanged, but keep the URL
     * in sync if backend returns
     * a different id.
     */
    if (
      saved.id !==
        selectedId ||
      saved.language !==
        locale
    ) {
      replaceSearchParams({
        lang:
          saved.language,

        project:
          saved.id,
      });
    }

    return saved;
  }


  async function deleteProject(
    project: Project,
  ) {
    await actions.deleteProject(
      project,
    );

    /*
     * Pick the first remaining
     * project according to
     * sortOrder.
     */
    const remaining =
      getProjectsByLocale(
        data.projects.filter(
          (item) =>
            item.id !==
            project.id,
        ),
        locale,
      );

    const nextProject =
      remaining[0];

    if (nextProject) {
      replaceSearchParams({
        lang: locale,

        project:
          nextProject.id,
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
          onSave={
            saveProject
          }
          onDelete={
            deleteProject
          }
        />
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h1 className="m-0 text-2xl font-bold tracking-tight text-foreground">
              Projects
            </h1>

            <p className="mt-2 mb-0 text-sm text-muted-foreground">
              {visibleProjects.length ===
              0
                ? `No ${localeLabels[locale]} projects yet. Create one from the sidebar.`
                : "Opening the first project…"}
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
  onSave: (
    project: Project,
  ) => Promise<Project>;
  onDelete: (
    project: Project,
  ) => Promise<void>;
}) {
  const [
    draft,
    setDraft,
  ] =
    useState(project);

  const [
    techText,
    setTechText,
  ] =
    useState(
      project.technologies.join(
        ", ",
      ),
    );

  const [
    tab,
    setTab,
  ] =
    useState<EditorTab>(
      "edit",
    );


  async function copyMarkdown() {
    await navigator.clipboard.writeText(
      draft.contentMarkdown,
    );
  }


  async function save() {
    try {
      const saved =
        await onSave(
          draft,
        );

      setDraft(
        saved,
      );

      setTechText(
        saved.technologies.join(
          ", ",
        ),
      );
    } catch {
      /*
       * Workspace banner already
       * shows the error.
       */
    }
  }


  async function remove() {
    if (
      mode === "admin" &&
      !window.confirm(
        `Delete source file ${draft.sourceId}?`,
      )
    ) {
      return;
    }

    try {
      await onDelete(
        draft,
      );
    } catch {
      /*
       * Workspace banner already
       * shows the error.
       */
    }
  }


  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>
              {draft.title ||
                "Untitled project"}
            </CardTitle>

            <Badge
              variant="secondary"
            >
              {
                localeLabels[
                  draft.language
                ]
              }
            </Badge>
          </div>

          <CardDescription>
            {mode === "trial"
              ? "Browser-only demo copy."
              : `Source: ${draft.sourceId}`}
          </CardDescription>
        </div>

        <EditorTabs
          value={tab}
          onChange={setTab}
        />
      </CardHeader>


      {tab === "edit" ? (
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Title */}

          <Field label="Title">
            <Input
              value={
                draft.title
              }
              onChange={(
                event,
              ) =>
                setDraft({
                  ...draft,

                  title:
                    event.target
                      .value,
                })
              }
            />
          </Field>


          {/* Slug */}

          <Field label="Slug">
            <Input
              value={
                draft.slug
              }
              onChange={(
                event,
              ) =>
                setDraft({
                  ...draft,

                  slug:
                    event.target
                      .value,
                })
              }
            />
          </Field>


          {/* Status */}

          <Field label="Project status">
            <Input
              value={
                draft.status
              }
              onChange={(
                event,
              ) =>
                setDraft({
                  ...draft,

                  status:
                    event.target
                      .value,
                })
              }
              placeholder="Live"
            />
          </Field>


          {/* Language */}

          <div className="flex items-end">
            <div className="pb-2 text-sm text-muted-foreground">
              Language:{" "}

              <strong className="font-semibold text-foreground">
                {
                  localeLabels[
                    draft.language
                  ]
                }
              </strong>
            </div>
          </div>


          {/* Summary */}

          <div className="md:col-span-2">
            <Field label="Description / summary">
              <Textarea
                rows={3}
                value={
                  draft.summary
                }
                onChange={(
                  event,
                ) =>
                  setDraft({
                    ...draft,

                    summary:
                      event.target
                        .value,
                  })
                }
              />
            </Field>
          </div>


          {/* Technologies */}

          <div className="md:col-span-2">
            <Field label="Technologies (comma separated)">
              <Input
                value={
                  techText
                }
                onChange={(
                  event,
                ) => {
                  const value =
                    event.target
                      .value;

                  setTechText(
                    value,
                  );

                  setDraft({
                    ...draft,

                    technologies:
                      splitComma(
                        value,
                      ),
                  });
                }}
              />
            </Field>
          </div>


          {/* GitHub */}

          <Field label="GitHub URL">
            <Input
              value={
                draft.githubUrl
              }
              onChange={(
                event,
              ) =>
                setDraft({
                  ...draft,

                  githubUrl:
                    event.target
                      .value,
                })
              }
            />
          </Field>


          {/* Live URL */}

          <Field label="Live URL">
            <Input
              value={
                draft.demoUrl
              }
              onChange={(
                event,
              ) =>
                setDraft({
                  ...draft,

                  demoUrl:
                    event.target
                      .value,
                })
              }
            />
          </Field>


          {/* Display order */}

          <Field label="Display order">
            <Input
              type="number"
              value={
                draft.sortOrder
              }
              onChange={(
                event,
              ) =>
                setDraft({
                  ...draft,

                  sortOrder:
                    Number(
                      event.target
                        .value,
                    ),
                })
              }
            />
          </Field>


          {/* Published */}

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={
                draft.published
              }
              onChange={(
                event,
              ) =>
                setDraft({
                  ...draft,

                  published:
                    event.target
                      .checked,
                })
              }
              className="size-4 accent-primary"
            />

            Published (`draft: false`)
          </label>


          {/* Markdown */}

          <div className="md:col-span-2">
            <Field label="Content (Markdown)">
              <Textarea
                rows={30}
                className="font-mono leading-6"
                value={
                  draft.contentMarkdown
                }
                onChange={(
                  event,
                ) =>
                  setDraft({
                    ...draft,

                    contentMarkdown:
                      event.target
                        .value,
                  })
                }
              />
            </Field>
          </div>


          {/* Actions */}

          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button
              type="button"
              disabled={
                saving
              }
              onClick={() =>
                void save()
              }
            >
              <Save className="mr-2 size-4" />

              {saving
                ? "Saving…"
                : mode ===
                    "trial"
                  ? "Apply in demo"
                  : "Save Markdown file"}
            </Button>


            <Button
              type="button"
              variant="outline"
              onClick={() =>
                void copyMarkdown()
              }
            >
              <Clipboard className="mr-2 size-4" />

              Copy body Markdown
            </Button>


            <Button
              type="button"
              variant="destructive"
              disabled={
                saving
              }
              onClick={() =>
                void remove()
              }
            >
              <Trash2 className="mr-2 size-4" />

              {mode === "trial"
                ? "Remove from demo"
                : "Delete source file"}
            </Button>
          </div>
        </CardContent>
      ) : (
        <CardContent className="space-y-6">
          {/* Preview header */}

          <div className="rounded-xl border border-border bg-muted p-5">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
              >
                {draft.status}
              </Badge>

              {draft.published && (
                <Badge>
                  Published
                </Badge>
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

            {draft
              .technologies
              .length >
              0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {draft.technologies.map(
                  (item) => (
                    <Badge
                      key={
                        item
                      }
                      variant="outline"
                    >
                      {item}
                    </Badge>
                  ),
                )}
              </div>
            )}
          </div>


          {/* Markdown preview */}

          <div className="prose-lite">
            <ReactMarkdown>
              {
                draft.contentMarkdown
              }
            </ReactMarkdown>
          </div>
        </CardContent>
      )}
    </Card>
  );
}


function splitComma(
  value: string,
) {
  return value
    .split(",")
    .map(
      (item) =>
        item.trim(),
    )
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
      <Label>
        {label}
      </Label>

      {children}
    </div>
  );
}