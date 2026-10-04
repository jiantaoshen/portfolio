"use client";

import { useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { localeMeta } from "@/lib/locales";

import { Field } from "../components/field";
import { LocaleSwitcher } from "../components/locale-switcher";
import type {
  AboutContent,
  AboutEducationItem,
  AboutLanguageItem,
  AboutProject,
  Locale,
  SharedProject,
  SharedProjects,
  SharedProjectTechnologyGroup,
  SharedSkillGroup,
  SharedSkills,
} from "../lib/types";
import { parseCommaList, parseLineList } from "../lib/text";
import { useCareerWorkspace } from "../workspace";

const move = <T,>(items: T[], from: number, to: number) => {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return items;
  const next = [...items];
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
};

const clone = <T,>(value: T): T => structuredClone(value);
const newId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;
const newTempId = (prefix: string) => `tmp_${prefix}_${crypto.randomUUID()}`;
const blankEducation = (): AboutEducationItem => ({ period: "", degree: "", school: "", description: "", thesis: "", thesisUrl: "" });
const blankLanguage = (): AboutLanguageItem => ({ id: newTempId("lang"), name: "", proficiency: "" });
const blankLocalizedProject = (): AboutProject => ({ title: "", description: "", highlights: [], technologyCategories: {} });
const blankSharedProject = (): SharedProject => ({ id: newTempId("project"), status: "Live", githubUrl: "", liveUrl: "", technologyGroups: [] });
const blankTechnologyGroup = (): SharedProjectTechnologyGroup => ({ id: newTempId("project-tech"), items: [] });

export function CvEditorPage() {
  const t = useTranslations("dashboard");
  const { data, actions, saving } = useCareerWorkspace();
  const [locale, setLocale] = useState<Locale>("en");
  const [drafts, setDrafts] = useState(() => clone(data.about));
  const [skillDrafts, setSkillDrafts] = useState<Record<Locale, SharedSkills>>(() =>
    Object.fromEntries((Object.keys(data.about) as Locale[]).map((key) => [key, clone(data.skills)])) as Record<Locale, SharedSkills>,
  );
  const [projectDrafts, setProjectDrafts] = useState<Record<Locale, SharedProjects>>(() =>
    Object.fromEntries((Object.keys(data.about) as Locale[]).map((key) => [key, clone(data.projects)])) as Record<Locale, SharedProjects>,
  );

  const draft = drafts[locale];
  const skillDraft = skillDrafts[locale];
  const projectDraft = projectDrafts[locale];

  const setDraft = (updater: AboutContent | ((current: AboutContent) => AboutContent)) =>
    setDrafts((current) => ({
      ...current,
      [locale]: clone(typeof updater === "function" ? updater(current[locale]) : updater),
    }));

  const setSkillsDraft = (updater: SharedSkills | ((current: SharedSkills) => SharedSkills)) =>
    setSkillDrafts((current) => ({
      ...current,
      [locale]: clone(typeof updater === "function" ? updater(current[locale]) : updater),
    }));

  const setProjectsDraft = (updater: SharedProjects | ((current: SharedProjects) => SharedProjects)) =>
    setProjectDrafts((current) => ({
      ...current,
      [locale]: clone(typeof updater === "function" ? updater(current[locale]) : updater),
    }));

  const patchEducation = (items: AboutEducationItem[]) =>
    setDraft((current) => ({ ...current, education: { ...current.education, items } }));

  const addProject = () => {
    const project = blankSharedProject();
    setProjectsDraft((current) => ({ ...current, items: [...current.items, project] }));
    setDraft((current) => ({
      ...current,
      projects: {
        ...current.projects,
        items: { ...current.projects.items, [project.id]: blankLocalizedProject() },
      },
    }));
  };

  const removeProject = (id: string) => {
    setProjectsDraft((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));
    setDraft((current) => {
      const items = { ...current.projects.items };
      delete items[id];
      return { ...current, projects: { ...current.projects, items } };
    });
  };

  const addSkill = () => {
    const id = newTempId("skill");
    setSkillsDraft((current) => ({ ...current, items: [...current.items, { id, items: [] }] }));
    setDraft((current) => ({ ...current, skills: { ...current.skills, categories: { ...current.skills.categories, [id]: "" } } }));
  };

  const removeSkill = (id: string) => {
    setSkillsDraft((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));
    setDraft((current) => {
      const categories = { ...current.skills.categories };
      delete categories[id];
      return { ...current, skills: { ...current.skills, categories } };
    });
  };

  const save = async () => {
    let nextAbout: AboutContent = {
      ...clone(draft),
      languages: {
        ...draft.languages,
        items: draft.languages.items.map((item) =>
          item.id.startsWith("tmp_") ? { ...item, id: newId("lang") } : item,
        ),
      },
    };

    const skillIdMap = new Map<string, string>();
    const nextSkills: SharedSkills = {
      items: skillDraft.items.map((group) => {
        if (!group.id.startsWith("tmp_")) return group;
        const id = newId("skill");
        skillIdMap.set(group.id, id);
        return { ...group, id };
      }),
    };

    if (skillIdMap.size) {
      const categories = { ...nextAbout.skills.categories };
      for (const [temporaryId, id] of skillIdMap) {
        categories[id] = categories[temporaryId] ?? "";
        delete categories[temporaryId];
      }
      nextAbout = { ...nextAbout, skills: { ...nextAbout.skills, categories } };
    }

    const projectIdMap = new Map<string, string>();
    const technologyIdMaps = new Map<string, Map<string, string>>();
    const nextProjects: SharedProjects = {
      items: projectDraft.items.map((project) => {
        const oldProjectId = project.id;
        const projectId = oldProjectId.startsWith("tmp_") ? newId("project") : oldProjectId;
        if (projectId !== oldProjectId) projectIdMap.set(oldProjectId, projectId);

        const technologyIdMap = new Map<string, string>();
        const technologyGroups = project.technologyGroups.map((group) => {
          if (!group.id.startsWith("tmp_")) return group;
          const id = newId("project-tech");
          technologyIdMap.set(group.id, id);
          return { ...group, id };
        });
        technologyIdMaps.set(oldProjectId, technologyIdMap);

        return { ...project, id: projectId, technologyGroups };
      }),
    };

    const localizedProjects = Object.fromEntries(
      projectDraft.items.map((project) => {
        const id = projectIdMap.get(project.id) ?? project.id;
        const localized = nextAbout.projects.items[project.id] ?? blankLocalizedProject();
        const technologyCategories = { ...localized.technologyCategories };

        for (const [temporaryId, categoryId] of technologyIdMaps.get(project.id) ?? []) {
          technologyCategories[categoryId] = technologyCategories[temporaryId] ?? "";
          delete technologyCategories[temporaryId];
        }

        return [id, { ...localized, technologyCategories }];
      }),
    );

    nextAbout = {
      ...nextAbout,
      projects: { ...nextAbout.projects, items: localizedProjects },
    };

    const saved = await actions.saveCv(locale, nextAbout, nextSkills, nextProjects);

    setDrafts((current) => ({ ...current, [locale]: clone(saved.about) }));
    setSkillDrafts((current) =>
      Object.fromEntries(
        (Object.keys(current) as Locale[]).map((key) => [
          key,
          {
            items: [
              ...clone(saved.skills.items),
              ...(key === locale ? [] : current[key].items.filter((item) => item.id.startsWith("tmp_"))),
            ],
          },
        ]),
      ) as Record<Locale, SharedSkills>,
    );
    setProjectDrafts((current) =>
      Object.fromEntries(
        (Object.keys(current) as Locale[]).map((key) => [
          key,
          {
            items: [
              ...clone(saved.projects.items),
              ...(key === locale ? [] : current[key].items.filter((item) => item.id.startsWith("tmp_"))),
            ],
          },
        ]),
      ) as Record<Locale, SharedProjects>,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-(length:--dashboard-heading-size) font-bold tracking-tight text-foreground">{t("cv.title")}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{t("cv.description")}</p>
        </div>
        <LocaleSwitcher value={locale} onChange={setLocale} />
      </div>

      <Card>
        <CardHeader><CardTitle>{t("cv.introduction.title")}</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label={t("cv.introduction.titleBefore")}>
            <Input value={draft.hero.titleBefore} onChange={(e) => setDraft((c) => ({ ...c, hero: { ...c.hero, titleBefore: e.target.value } }))} />
          </Field>
          <Field label={t("cv.introduction.titleHighlight")}>
            <Input value={draft.hero.titleHighlight} onChange={(e) => setDraft((c) => ({ ...c, hero: { ...c.hero, titleHighlight: e.target.value } }))} />
          </Field>
          <div className="md:col-span-2">
            <Field label={t("cv.introduction.description")}>
              <Textarea rows={8} value={draft.about.description} onChange={(e) => setDraft((c) => ({ ...c, about: { ...c.about, description: e.target.value } }))} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>{t("projects.title")}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{t("projects.sharedNote")}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addProject}>
            <Plus className="mr-2 size-4" />{t("actions.newProject")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label={t("cv.sectionTitle")}>
            <Input value={draft.projects.title} onChange={(e) => setDraft((c) => ({ ...c, projects: { ...c.projects, title: e.target.value } }))} />
          </Field>
          <div className="space-y-4">
            {projectDraft.items.map((project, index) => (
              <ProjectEditor
                key={project.id}
                index={index}
                project={project}
                localized={draft.projects.items[project.id] ?? blankLocalizedProject()}
                onMove={(from, to) => setProjectsDraft((current) => ({ ...current, items: move(current.items, from, to) }))}
                onProjectChange={(next) => setProjectsDraft((current) => ({
                  ...current,
                  items: current.items.map((item) => (item.id === project.id ? next : item)),
                }))}
                onLocalizedChange={(next) => setDraft((current) => ({
                  ...current,
                  projects: { ...current.projects, items: { ...current.projects.items, [project.id]: next } },
                }))}
                onDelete={() => removeProject(project.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>{t("cv.skills.title")}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{t("cv.skills.sharedNote")}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addSkill}>
            <Plus className="mr-2 size-4" />{t("cv.skills.addCategory")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label={t("cv.sectionTitle")}>
            <Input value={draft.skills.title} onChange={(e) => setDraft((c) => ({ ...c, skills: { ...c.skills, title: e.target.value } }))} />
          </Field>
          <div className="space-y-4">
            {skillDraft.items.map((group, index) => (
              <SkillGroupEditor
                key={group.id}
                index={index}
                group={group}
                title={draft.skills.categories[group.id] ?? ""}
                onMove={(from, to) => setSkillsDraft((current) => ({ ...current, items: move(current.items, from, to) }))}
                onTitleChange={(title) => setDraft((current) => ({
                  ...current,
                  skills: { ...current.skills, categories: { ...current.skills.categories, [group.id]: title } },
                }))}
                onChange={(next) => setSkillsDraft((current) => ({
                  ...current,
                  items: current.items.map((item) => (item.id === group.id ? next : item)),
                }))}
                onDelete={() => removeSkill(group.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <CardTitle>{t("cv.languages.title")}</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => setDraft((c) => ({ ...c, languages: { ...c.languages, items: [...c.languages.items, blankLanguage()] } }))}>
            <Plus className="mr-2 size-4" />{t("cv.languages.add")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label={t("cv.sectionTitle")}>
            <Input value={draft.languages.title} onChange={(e) => setDraft((c) => ({ ...c, languages: { ...c.languages, title: e.target.value } }))} />
          </Field>
          <div className="space-y-3">
            {draft.languages.items.map((language, index) => (
              <LanguageEditor
                key={language.id}
                language={language}
                onChange={(next) => setDraft((c) => ({
                  ...c,
                  languages: { ...c.languages, items: c.languages.items.map((item, i) => (i === index ? next : item)) },
                }))}
                onDelete={() => setDraft((c) => ({ ...c, languages: { ...c.languages, items: c.languages.items.filter((_, i) => i !== index) } }))}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <CardTitle>{t("cv.education.title")}</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => patchEducation([...draft.education.items, blankEducation()])}>
            <Plus className="mr-2 size-4" />{t("cv.education.add")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label={t("cv.sectionTitle")}>
            <Input value={draft.education.title} onChange={(e) => setDraft((c) => ({ ...c, education: { ...c.education, title: e.target.value } }))} />
          </Field>
          <div className="space-y-4">
            {draft.education.items.map((item, index) => (
              <EducationEditor
                key={`${locale}-education-${index}`}
                index={index}
                item={item}
                onMove={(from, to) => patchEducation(move(draft.education.items, from, to))}
                onChange={(next) => patchEducation(draft.education.items.map((entry, i) => (i === index ? next : entry)))}
                onDelete={() => patchEducation(draft.education.items.filter((_, i) => i !== index))}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="sticky bottom-[max(.5rem,env(safe-area-inset-bottom))] z-10 shadow-lg">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{locale}</Badge>
            <span className="min-w-0 break-all font-mono text-xs">i18n/locales/{locale}/about.json</span>
            <Badge variant="outline">shared</Badge>
            <span className="min-w-0 break-all font-mono text-xs">i18n/shared/skills.json</span>
            <span className="min-w-0 break-all font-mono text-xs">i18n/shared/projects.json</span>
          </div>
          <Button type="button" className="w-full sm:w-auto" disabled={saving} onClick={() => void save().catch(() => {})}>
            <Save className="mr-2 size-4" />{saving ? t("actions.saving") : t("actions.saveLanguage", { language: localeMeta[locale].label })}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SortableCard({ group, index, onMove, children }: { group: string; index: number; onMove: (from: number, to: number) => void; children: ReactNode }) {
  const drop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const [sourceGroup, sourceIndex] = e.dataTransfer.getData("text/plain").split(":");
    if (sourceGroup === group) onMove(Number(sourceIndex), index);
  };

  return (
    <Card className="relative bg-background" onDragOver={(e) => e.preventDefault()} onDrop={drop}>
      <button
        type="button"
        draggable
        title="Drag to reorder"
        aria-label="Drag to reorder"
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", `${group}:${index}`);
        }}
        className="absolute right-3 top-3 z-10 cursor-grab rounded-md p-1.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      {children}
    </Card>
  );
}

function ListField({ label, items, lines, placeholder, onChange }: { label: string; items: string[]; lines?: boolean; placeholder?: string; onChange: (items: string[]) => void }) {
  const value = items.join(lines ? "\n" : ", ");
  const [text, setText] = useState(value);
  const [editing, setEditing] = useState(false);
  const props = {
    value: editing ? text : value,
    placeholder,
    onFocus: () => { setText(value); setEditing(true); },
    onBlur: () => setEditing(false),
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setText(e.target.value);
      onChange((lines ? parseLineList : parseCommaList)(e.target.value));
    },
  };

  return <Field label={label}>{lines ? <Textarea rows={4} {...props} /> : <Input {...props} />}</Field>;
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
    onProjectChange({ ...project, technologyGroups: [...project.technologyGroups, group] });
    onLocalizedChange({
      ...localized,
      technologyCategories: { ...localized.technologyCategories, [group.id]: "" },
    });
  };

  const removeTechnologyGroup = (id: string) => {
    onProjectChange({ ...project, technologyGroups: project.technologyGroups.filter((group) => group.id !== id) });
    const technologyCategories = { ...localized.technologyCategories };
    delete technologyCategories[id];
    onLocalizedChange({ ...localized, technologyCategories });
  };

  return (
    <SortableCard group="projects" index={index} onMove={onMove}>
      <CardContent className="grid gap-4 p-4 pr-12 md:grid-cols-2">
        <Field label={t("projects.fields.title")}>
          <Input value={localized.title} onChange={(e) => onLocalizedChange({ ...localized, title: e.target.value })} />
        </Field>
        <Field label={t("projects.fields.status")}>
          <Input value={project.status} placeholder={t("projects.placeholders.status")} onChange={(e) => onProjectChange({ ...project, status: e.target.value })} />
        </Field>
        <div className="md:col-span-2">
          <Field label={t("projects.fields.summary")}>
            <Textarea rows={3} value={localized.description} onChange={(e) => onLocalizedChange({ ...localized, description: e.target.value })} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <ListField label={t("projects.highlights")} lines items={localized.highlights ?? []} onChange={(highlights) => onLocalizedChange({ ...localized, highlights })} />
        </div>

        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{t("projects.technologyCategories")}</span>
            <Button type="button" variant="outline" size="xs" onClick={addTechnologyGroup}>
              <Plus className="mr-1 size-3" />{t("projects.addCategory")}
            </Button>
          </div>
          {project.technologyGroups.map((group) => (
            <div key={group.id} className="grid gap-3 rounded-lg border border-foreground/10 p-3 md:grid-cols-[minmax(10rem,.35fr)_1fr_auto] md:items-end">
              <Field label={t("projects.category")}>
                <Input
                  value={localized.technologyCategories[group.id] ?? ""}
                  placeholder={t("projects.categoryPlaceholder")}
                  onChange={(e) => onLocalizedChange({
                    ...localized,
                    technologyCategories: { ...localized.technologyCategories, [group.id]: e.target.value },
                  })}
                />
              </Field>
              <ListField
                label={t("projects.fields.technologies")}
                items={group.items}
                placeholder={t("projects.technologiesPlaceholder")}
                onChange={(items) => onProjectChange({
                  ...project,
                  technologyGroups: project.technologyGroups.map((item) => item.id === group.id ? { ...item, items } : item),
                })}
              />
              <Button type="button" variant="ghost" size="icon" aria-label={t("projects.deleteCategory")} onClick={() => removeTechnologyGroup(group.id)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <Field label={t("projects.fields.githubUrl")}>
          <Input value={project.githubUrl} onChange={(e) => onProjectChange({ ...project, githubUrl: e.target.value })} />
        </Field>
        <Field label={t("projects.fields.liveUrl")}>
          <Input value={project.liveUrl} onChange={(e) => onProjectChange({ ...project, liveUrl: e.target.value })} />
        </Field>
        <div className="md:col-span-2"><DeleteButton label={t("actions.delete")} onClick={onDelete} /></div>
      </CardContent>
    </SortableCard>
  );
}

function SkillGroupEditor({ group, index, title, onMove, onTitleChange, onChange, onDelete }: { group: SharedSkillGroup; index: number; title: string; onMove: (from: number, to: number) => void; onTitleChange: (title: string) => void; onChange: (next: SharedSkillGroup) => void; onDelete: () => void }) {
  const t = useTranslations("dashboard");
  return (
    <SortableCard group="skills" index={index} onMove={onMove}>
      <CardContent className="space-y-3 p-4 pr-12">
        <div className="flex items-center gap-2">
          <Input value={title} placeholder={t("cv.skills.categoryPlaceholder")} onChange={(e) => onTitleChange(e.target.value)} />
          <Button type="button" variant="ghost" size="icon" aria-label={t("cv.skills.deleteCategory")} onClick={onDelete}><Trash2 className="size-4" /></Button>
        </div>
        <ListField label={t("cv.skills.technologies")} items={group.items} placeholder={t("cv.skills.technologiesPlaceholder")} onChange={(items) => onChange({ ...group, items })} />
      </CardContent>
    </SortableCard>
  );
}

function LanguageEditor({ language, onChange, onDelete }: { language: AboutLanguageItem; onChange: (next: AboutLanguageItem) => void; onDelete: () => void }) {
  const t = useTranslations("dashboard");
  return (
    <div className="grid gap-3 rounded-lg border border-foreground/10 p-3 sm:grid-cols-[1fr_minmax(8rem,.35fr)_auto] sm:items-end">
      <Field label={t("cv.languages.name")}><Input value={language.name} placeholder={t("cv.languages.namePlaceholder")} onChange={(e) => onChange({ ...language, name: e.target.value })} /></Field>
      <Field label={t("cv.languages.proficiency")}><Input value={language.proficiency ?? ""} placeholder={t("cv.languages.proficiencyPlaceholder")} onChange={(e) => onChange({ ...language, proficiency: e.target.value })} /></Field>
      <Button type="button" variant="ghost" size="icon" aria-label={t("cv.languages.delete")} onClick={onDelete}><Trash2 className="size-4" /></Button>
    </div>
  );
}

function EducationEditor({ item, index, onMove, onChange, onDelete }: { item: AboutEducationItem; index: number; onMove: (from: number, to: number) => void; onChange: (next: AboutEducationItem) => void; onDelete: () => void }) {
  const t = useTranslations("dashboard");
  return (
    <SortableCard group="education" index={index} onMove={onMove}>
      <CardContent className="grid gap-4 p-4 pr-12 md:grid-cols-2">
        <Field label={t("cv.education.period")}><Input value={item.period} onChange={(e) => onChange({ ...item, period: e.target.value })} /></Field>
        <Field label={t("cv.education.degree")}><Input value={item.degree} onChange={(e) => onChange({ ...item, degree: e.target.value })} /></Field>
        <Field label={t("cv.education.school")}><Input value={item.school} onChange={(e) => onChange({ ...item, school: e.target.value })} /></Field><div />
        <div className="md:col-span-2"><Field label={t("cv.education.description")}><Textarea rows={4} value={item.description ?? ""} onChange={(e) => onChange({ ...item, description: e.target.value })} /></Field></div>
        <Field label={t("cv.education.thesis")}><Input value={item.thesis ?? ""} onChange={(e) => onChange({ ...item, thesis: e.target.value })} /></Field>
        <Field label={t("cv.education.thesisUrl")}><Input value={item.thesisUrl ?? ""} onChange={(e) => onChange({ ...item, thesisUrl: e.target.value })} /></Field>
        <div className="md:col-span-2"><DeleteButton label={t("cv.education.delete")} onClick={onDelete} /></div>
      </CardContent>
    </SortableCard>
  );
}

function DeleteButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <Button type="button" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onClick}><Trash2 className="mr-2 size-4" />{label}</Button>;
}
