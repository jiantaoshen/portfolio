"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Field } from "@/app/[locale]/(career)/dashboard/_components/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { move, type Updater } from "@/app/[locale]/(career)/dashboard/_lib/editor-utils";
import type {
  AboutContent,
  SharedSkillGroup,
  SharedSkills,
} from "@/lib/types";

import { ListField, SortableCard } from "./editor-fields";

export function SkillsSection({
  draft,
  skillDraft,
  setDraft,
  setSkillsDraft,
  addSkill,
  removeSkill,
}: {
  draft: AboutContent;
  skillDraft: SharedSkills;
  setDraft: (updater: Updater<AboutContent>) => void;
  setSkillsDraft: (updater: Updater<SharedSkills>) => void;
  addSkill: () => void;
  removeSkill: (id: string) => void;
}) {
  const t = useTranslations("dashboard");

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
        <CardTitle>{t("cv.skills.title")}</CardTitle>

        <Button type="button" variant="outline" size="sm" onClick={addSkill}>
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
                skills: { ...current.skills, title: event.target.value },
              }))
            }
          />
        </Field>

        <div className="space-y-4">
          {skillDraft.items.map((group, index) => (
            <SkillGroupEditor
              key={group.id}
              index={index}
              group={group}
              title={draft.skills.categories[group.id] ?? ""}
              onMove={(from, to) =>
                setSkillsDraft((current) => ({
                  ...current,
                  items: move(current.items, from, to),
                }))
              }
              onTitleChange={(title) =>
                setDraft((current) => ({
                  ...current,
                  skills: {
                    ...current.skills,
                    categories: {
                      ...current.skills.categories,
                      [group.id]: title,
                    },
                  },
                }))
              }
              onChange={(next) =>
                setSkillsDraft((current) => ({
                  ...current,
                  items: current.items.map((item) =>
                    item.id === group.id ? next : item,
                  ),
                }))
              }
              onDelete={() => removeSkill(group.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SkillGroupEditor({
  group,
  index,
  title,
  onMove,
  onTitleChange,
  onChange,
  onDelete,
}: {
  group: SharedSkillGroup;
  index: number;
  title: string;
  onMove: (from: number, to: number) => void;
  onTitleChange: (title: string) => void;
  onChange: (next: SharedSkillGroup) => void;
  onDelete: () => void;
}) {
  const t = useTranslations("dashboard");

  return (
    <SortableCard group="skills" index={index} onMove={onMove}>
      <CardContent className="space-y-3 p-4 pr-12">
        <div className="flex items-center gap-2">
          <Input
            value={title}
            placeholder={t("cv.skills.categoryPlaceholder")}
            onChange={(event) => onTitleChange(event.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("cv.skills.deleteCategory")}
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <ListField
          label={t("cv.skills.technologies")}
          items={group.items}
          placeholder={t("cv.skills.technologiesPlaceholder")}
          onChange={(items) => onChange({ ...group, items })}
        />
      </CardContent>
    </SortableCard>
  );
}
