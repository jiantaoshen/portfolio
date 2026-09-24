"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { localeMeta } from "@/lib/locales";

import { Field } from "../components/field";
import { LocaleSwitcher } from "../components/locale-switcher";
import type { AboutContent, AboutEducationItem, AboutProject, AboutSkillGroup, Locale } from "../lib/types";
import { parseCommaList } from "../lib/text";
import { useCareerWorkspace } from "../workspace";

/* Creates an empty Skills category when the user adds a new group. */
function blankSkillGroup(): AboutSkillGroup {
  return {
    title: "",
    items: [],
  };
}

/* Creates an empty Education entry with the same shape as about.json. */
function blankEducation(): AboutEducationItem {
  return {
    period: "",
    degree: "",
    school: "",
    description: "",
    thesis: "",
    thesisUrl: "",
  };
}

/* Creates an empty Project entry with sensible defaults. */
function blankProject(): AboutProject {
  return {
    title: "",
    description: "",
    status: "Live",
    technologies: [],
    githubUrl: "",
    liveUrl: "",
  };
}

export function CvEditorPage() {
  const t = useTranslations("dashboard");

  /* Shared Dashboard state and actions provided by CareerWorkspace. */
  const { data, actions, saving } = useCareerWorkspace();

  /* The content language being edited is independent from the Dashboard UI language. */
  const [locale, setLocale] = useState<Locale>("en");

  /* Current in-memory draft for the selected content language. */
  const draft = data.about[locale];

  /* Display the JSON source file that will be written when Save is pressed. */
  const sourcePath = `i18n/locales/${locale}/about.json`;

  /* Stage changes in React state only. This does not write to the JSON file. */
  function setDraft(updater: AboutContent | ((current: AboutContent) => AboutContent)) {
    actions.stageAbout(locale, updater);
  }

  /* Replace one Skills group without mutating the existing array. */
  function updateSkillGroup(index: number, next: AboutSkillGroup) {
    setDraft((current) => ({
      ...current,
      skills: {
        ...current.skills,
        items: current.skills.items.map((group, i) => (i === index ? next : group)),
      },
    }));
  }

  /* Remove one Skills group from the current draft. */
  function removeSkillGroup(index: number) {
    setDraft((current) => ({
      ...current,
      skills: {
        ...current.skills,
        items: current.skills.items.filter((_, i) => i !== index),
      },
    }));
  }

  /* Replace one Project without mutating the existing array. */
  function updateProject(index: number, next: AboutProject) {
    setDraft((current) => ({
      ...current,
      projects: {
        ...current.projects,
        items: current.projects.items.map((project, i) => (i === index ? next : project)),
      },
    }));
  }

  /* Remove one Project from the current draft. */
  function removeProject(index: number) {
    setDraft((current) => ({
      ...current,
      projects: {
        ...current.projects,
        items: current.projects.items.filter((_, i) => i !== index),
      },
    }));
  }

  /* Replace one Education entry without mutating the existing array. */
  function updateEducation(index: number, next: AboutEducationItem) {
    setDraft((current) => ({
      ...current,
      education: {
        ...current.education,
        items: current.education.items.map((item, i) => (i === index ? next : item)),
      },
    }));
  }

  /* Remove one Education entry from the current draft. */
  function removeEducation(index: number) {
    setDraft((current) => ({
      ...current,
      education: {
        ...current.education,
        items: current.education.items.filter((_, i) => i !== index),
      },
    }));
  }

  return (
    <div className="space-y-6">
      {/* Page heading and content-language selector. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-(length:--dashboard-heading-size) font-bold tracking-tight text-foreground">
            {t("cv.title")}
          </h1>

          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("cv.description")}
          </p>
        </div>

        <LocaleSwitcher value={locale} onChange={setLocale} />
      </div>

      {/* Introduction / Hero content. */}
      <Card>
        <CardHeader>
          <CardTitle>{t("cv.introduction.title")}</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label={t("cv.introduction.titleBefore")}>
            <Input
              value={draft.hero.titleBefore}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  hero: {
                    ...current.hero,
                    titleBefore: event.target.value,
                  },
                }))
              }
            />
          </Field>

          <Field label={t("cv.introduction.titleHighlight")}>
            <Input
              value={draft.hero.titleHighlight}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  hero: {
                    ...current.hero,
                    titleHighlight: event.target.value,
                  },
                }))
              }
            />
          </Field>

          <div className="md:col-span-2">
            <Field label={t("cv.introduction.description")}>
              <Textarea
                rows={8}
                value={draft.about.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    about: {
                      ...current.about,
                      description: event.target.value,
                    },
                  }))
                }
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Projects section. */}
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <CardTitle>{t("projects.title")}</CardTitle>

          {/* Append a blank Project to the current draft. */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                projects: {
                  ...current.projects,
                  items: [...current.projects.items, blankProject()],
                },
              }))
            }
          >
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
                  projects: {
                    ...current.projects,
                    title: event.target.value,
                  },
                }))
              }
            />
          </Field>

          <div className="grid gap-4 xl:grid-cols-2">
            {draft.projects.items.map((project, index) => (
              <ProjectEditor key={`${locale}-${index}`} project={project} onChange={(next) => updateProject(index, next)} onDelete={() => removeProject(index)} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills section. */}
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <CardTitle>{t("cv.skills.title")}</CardTitle>

          {/* Append a blank Skills category to the current draft. */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                skills: {
                  ...current.skills,
                  items: [...current.skills.items, blankSkillGroup()],
                },
              }))
            }
          >
            <Plus className="mr-2 size-4" />
            {t("cv.skills.addCategory")}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <Field label={t("cv.sectionTitle")}>
            <Input
              value={draft.skills.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  skills: {
                    ...current.skills,
                    title: event.target.value,
                  },
                }))
              }
            />
          </Field>

          <div className="grid gap-4 xl:grid-cols-2">
            {draft.skills.items.map((group, index) => (
              <SkillGroupEditor key={`${locale}-${index}`} group={group} onChange={(next) => updateSkillGroup(index, next)} onDelete={() => removeSkillGroup(index)} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Education section. */}
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <CardTitle>{t("cv.education.title")}</CardTitle>

          {/* Append a blank Education entry to the current draft. */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                education: {
                  ...current.education,
                  items: [...current.education.items, blankEducation()],
                },
              }))
            }
          >
            <Plus className="mr-2 size-4" />
            {t("cv.education.add")}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <Field label={t("cv.sectionTitle")}>
            <Input
              value={draft.education.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  education: {
                    ...current.education,
                    title: event.target.value,
                  },
                }))
              }
            />
          </Field>

          <div className="space-y-4">
            {draft.education.items.map((item, index) => (
              <EducationEditor key={`${locale}-${index}`} item={item} onChange={(next) => updateEducation(index, next)} onDelete={() => removeEducation(index)} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sticky save bar: staged changes are written to the selected locale's JSON file here. */}
      <Card className="sticky bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-10 shadow-lg">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{locale}</Badge>
            <span className="min-w-0 break-all font-mono text-xs">{sourcePath}</span>
          </div>

          <Button type="button" className="w-full sm:w-auto" disabled={saving} onClick={() => void actions.saveAbout(locale, draft).catch(() => {})}>
            <Save className="mr-2 size-4" />
            {saving ? t("actions.saving") : t("actions.saveLanguage", { language: localeMeta[locale].label })}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* Editor for a single Project entry. */
function ProjectEditor({
  project,
  onChange,
  onDelete,
}: {
  project: AboutProject;
  onChange: (next: AboutProject) => void;
  onDelete: () => void;
}) {
  const t = useTranslations("dashboard");

  /*
   * Keep the raw comma-separated text while editing.
   * The persisted Project model continues to store technologies as string[].
   */
  const [itemsText, setItemsText] = useState(project.technologies.join(", "));
  const [editingItems, setEditingItems] = useState(false);
  const itemsValue = project.technologies.join(", ");

  return (
    <Card className="bg-background">
      <CardContent className="grid gap-4 p-4 md:grid-cols-2">
        <Field label={t("projects.fields.title")}>
          <Input value={project.title} onChange={(event) => onChange({ ...project, title: event.target.value })} />
        </Field>

        <Field label={t("projects.fields.status")}>
          <Input value={project.status} onChange={(event) => onChange({ ...project, status: event.target.value })} placeholder={t("projects.placeholders.status")} />
        </Field>

        <div className="md:col-span-2">
          <Field label={t("projects.fields.summary")}>
            <Textarea rows={3} value={project.description} onChange={(event) => onChange({ ...project, description: event.target.value })} />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label={t("projects.fields.technologies")}>
            <Input
              value={editingItems ? itemsText : itemsValue}
              onFocus={() => {
                /* Refresh the editable string when the field receives focus. */
                setItemsText(itemsValue);
                setEditingItems(true);
              }}
              onBlur={() => setEditingItems(false)}
              onChange={(event) => {
                const value = event.target.value;

                /* Preserve exactly what the user is typing. */
                setItemsText(value);

                /* Convert the text into the string[] used by the content model. */
                onChange({ ...project, technologies: parseCommaList(value) });
              }}
            />
          </Field>
        </div>

        <Field label={t("projects.fields.githubUrl")}>
          <Input value={project.githubUrl} onChange={(event) => onChange({ ...project, githubUrl: event.target.value })} />
        </Field>

        <Field label={t("projects.fields.liveUrl")}>
          <Input value={project.liveUrl} onChange={(event) => onChange({ ...project, liveUrl: event.target.value })} />
        </Field>

        <div className="md:col-span-2">
          <Button type="button" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onDelete}>
            <Trash2 className="mr-2 size-4" />
            {t("actions.delete")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* Editor for one Skills category and its comma-separated technology list. */
function SkillGroupEditor({
  group,
  onChange,
  onDelete,
}: {
  group: AboutSkillGroup;
  onChange: (next: AboutSkillGroup) => void;
  onDelete: () => void;
}) {
  const t = useTranslations("dashboard");

  /*
   * Keep a temporary text representation while typing.
   * group.items remains the normalized string[] source of truth.
   */
  const [itemsText, setItemsText] = useState(group.items.join(", "));
  const [editingItems, setEditingItems] = useState(false);
  const itemsValue = group.items.join(", ");

  return (
    <Card className="bg-background">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Input value={group.title} placeholder={t("cv.skills.categoryPlaceholder")} onChange={(event) => onChange({ ...group, title: event.target.value })} />

          <Button type="button" variant="ghost" size="icon" aria-label={t("cv.skills.deleteCategory")} onClick={onDelete}>
            <Trash2 className="size-4" />
          </Button>
        </div>

        <Field label={t("cv.skills.technologies")}>
          <Textarea
            rows={3}
            value={editingItems ? itemsText : itemsValue}
            onFocus={() => {
              setItemsText(itemsValue);
              setEditingItems(true);
            }}
            onBlur={() => setEditingItems(false)}
            onChange={(event) => {
              const value = event.target.value;

              /* Keep the current text stable while the user types commas and spaces. */
              setItemsText(value);

              /* Normalize the text into the array stored in about.json. */
              onChange({ ...group, items: parseCommaList(value) });
            }}
            placeholder={t("cv.skills.technologiesPlaceholder")}
          />
        </Field>
      </CardContent>
    </Card>
  );
}

/* Editor for a single Education entry. */
function EducationEditor({
  item,
  onChange,
  onDelete,
}: {
  item: AboutEducationItem;
  onChange: (next: AboutEducationItem) => void;
  onDelete: () => void;
}) {
  const t = useTranslations("dashboard");

  return (
    <Card className="bg-background">
      <CardContent className="grid gap-4 p-4 md:grid-cols-2">
        <Field label={t("cv.education.period")}>
          <Input value={item.period} onChange={(event) => onChange({ ...item, period: event.target.value })} />
        </Field>

        <Field label={t("cv.education.degree")}>
          <Input value={item.degree} onChange={(event) => onChange({ ...item, degree: event.target.value })} />
        </Field>

        <Field label={t("cv.education.school")}>
          <Input value={item.school} onChange={(event) => onChange({ ...item, school: event.target.value })} />
        </Field>

        {/* Keeps the desktop grid aligned while School occupies only the first column. */}
        <div />

        <div className="md:col-span-2">
          <Field label={t("cv.education.description")}>
            <Textarea rows={4} value={item.description ?? ""} onChange={(event) => onChange({ ...item, description: event.target.value })} />
          </Field>
        </div>

        <Field label={t("cv.education.thesis")}>
          <Input value={item.thesis ?? ""} onChange={(event) => onChange({ ...item, thesis: event.target.value })} />
        </Field>

        <Field label={t("cv.education.thesisUrl")}>
          <Input value={item.thesisUrl ?? ""} onChange={(event) => onChange({ ...item, thesisUrl: event.target.value })} />
        </Field>

        <div className="md:col-span-2">
          <Button type="button" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onDelete}>
            <Trash2 className="mr-2 size-4" />
            {t("cv.education.delete")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}