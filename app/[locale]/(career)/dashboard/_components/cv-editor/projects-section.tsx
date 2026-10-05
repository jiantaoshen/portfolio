"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Field } from "@/app/[locale]/(career)/dashboard/_components/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  blankLocalizedProject,
  blankTechnologyGroup,
  move,
  type Updater,
} from "@/app/[locale]/(career)/dashboard/_lib/editor-utils";
import type {
  AboutContent,
  AboutProject,
  SharedProject,
  SharedProjects,
} from "@/lib/types";

import { DeleteButton, ListField, SortableCard } from "./editor-fields";

export function ProjectsSection({
  draft,
  projectDraft,
  setDraft,
  setProjectsDraft,
  addProject,
  removeProject,
}: {
  draft: AboutContent;
  projectDraft: SharedProjects;
  setDraft: (updater: Updater<AboutContent>) => void;
  setProjectsDraft: (updater: Updater<SharedProjects>) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
}) {
  const t = useTranslations("dashboard");

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <CardTitle>{t("projects.title")}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {t("projects.sharedNote")}
          </p>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={addProject}>
          <Plus className="mr-2 size-4" />
          {t("actions.newProject")}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <Field label={t("cv.sectionTitle")}>
          <Input
            value={draft.projects.title}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projects: { ...current.projects, title: event.target.value },
              }))
            }
          />
        </Field>

        <div className="space-y-4">
          {projectDraft.items.map((project, index) => (
            <ProjectEditor
              key={project.id}
              index={index}
              project={project}
              localized={
                draft.projects.items[project.id] ?? blankLocalizedProject()
              }
              onMove={(from, to) =>
                setProjectsDraft((current) => ({
                  ...current,
                  items: move(current.items, from, to),
                }))
              }
              onProjectChange={(next) =>
                setProjectsDraft((current) => ({
                  ...current,
                  items: current.items.map((item) =>
                    item.id === project.id ? next : item,
                  ),
                }))
              }
              onLocalizedChange={(next) =>
                setDraft((current) => ({
                  ...current,
                  projects: {
                    ...current.projects,
                    items: {
                      ...current.projects.items,
                      [project.id]: next,
                    },
                  },
                }))
              }
              onDelete={() => removeProject(project.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectEditor({
  project,
  localized,
  index,
  onMove,
  onProjectChange,
  onLocalizedChange,
  onDelete,
}: {
  project: SharedProject;
  localized: AboutProject;
  index: number;
  onMove: (from: number, to: number) => void;
  onProjectChange: (next: SharedProject) => void;
  onLocalizedChange: (next: AboutProject) => void;
  onDelete: () => void;
}) {
  const t = useTranslations("dashboard");

  const addTechnologyGroup = () => {
    const group = blankTechnologyGroup();
    onProjectChange({
      ...project,
      technologyGroups: [...project.technologyGroups, group],
    });
    onLocalizedChange({
      ...localized,
      technologyCategories: {
        ...localized.technologyCategories,
        [group.id]: "",
      },
    });
  };

  const removeTechnologyGroup = (id: string) => {
    onProjectChange({
      ...project,
      technologyGroups: project.technologyGroups.filter(
        (group) => group.id !== id,
      ),
    });

    const technologyCategories = { ...localized.technologyCategories };
    delete technologyCategories[id];
    onLocalizedChange({ ...localized, technologyCategories });
  };

  return (
    <SortableCard group="projects" index={index} onMove={onMove}>
      <CardContent className="grid gap-4 p-4 pr-12 md:grid-cols-2">
        <Field label={t("projects.fields.title")}>
          <Input
            value={localized.title}
            onChange={(event) =>
              onLocalizedChange({ ...localized, title: event.target.value })
            }
          />
        </Field>

        <Field label={t("projects.fields.status")}>
          <Input
            value={project.status}
            placeholder={t("projects.placeholders.status")}
            onChange={(event) =>
              onProjectChange({ ...project, status: event.target.value })
            }
          />
        </Field>

        <div className="md:col-span-2">
          <Field label={t("projects.fields.summary")}>
            <Textarea
              rows={3}
              value={localized.description}
              onChange={(event) =>
                onLocalizedChange({
                  ...localized,
                  description: event.target.value,
                })
              }
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <ListField
            label={t("projects.highlights")}
            lines
            items={localized.highlights ?? []}
            onChange={(highlights) =>
              onLocalizedChange({ ...localized, highlights })
            }
          />
        </div>

        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">
              {t("projects.technologyCategories")}
            </span>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={addTechnologyGroup}
            >
              <Plus className="mr-1 size-3" />
              {t("projects.addCategory")}
            </Button>
          </div>

          {project.technologyGroups.map((group) => (
            <div
              key={group.id}
              className="grid gap-3 rounded-lg border border-foreground/10 p-3 md:grid-cols-[minmax(10rem,.35fr)_1fr_auto] md:items-end"
            >
              <Field label={t("projects.category")}>
                <Input
                  value={localized.technologyCategories[group.id] ?? ""}
                  placeholder={t("projects.categoryPlaceholder")}
                  onChange={(event) =>
                    onLocalizedChange({
                      ...localized,
                      technologyCategories: {
                        ...localized.technologyCategories,
                        [group.id]: event.target.value,
                      },
                    })
                  }
                />
              </Field>

              <ListField
                label={t("projects.fields.technologies")}
                items={group.items}
                placeholder={t("projects.technologiesPlaceholder")}
                onChange={(items) =>
                  onProjectChange({
                    ...project,
                    technologyGroups: project.technologyGroups.map((item) =>
                      item.id === group.id ? { ...item, items } : item,
                    ),
                  })
                }
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t("projects.deleteCategory")}
                onClick={() => removeTechnologyGroup(group.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <Field label={t("projects.fields.githubUrl")}>
          <Input
            value={project.githubUrl}
            onChange={(event) =>
              onProjectChange({ ...project, githubUrl: event.target.value })
            }
          />
        </Field>

        <Field label={t("projects.fields.liveUrl")}>
          <Input
            value={project.liveUrl}
            onChange={(event) =>
              onProjectChange({ ...project, liveUrl: event.target.value })
            }
          />
        </Field>

        <div className="md:col-span-2">
          <DeleteButton label={t("actions.delete")} onClick={onDelete} />
        </div>
      </CardContent>
    </SortableCard>
  );
}
