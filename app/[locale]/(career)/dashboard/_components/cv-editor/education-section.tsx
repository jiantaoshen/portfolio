"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Field } from "@/app/[locale]/(career)/dashboard/_components/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { blankEducation, move, type Updater } from "@/app/[locale]/(career)/dashboard/_lib/editor-utils";
import type { AboutContent, AboutEducationItem } from "@/lib/types";

import { DeleteButton, SortableCard } from "./editor-fields";

export function EducationSection({
  locale,
  draft,
  setDraft,
}: {
  locale: string;
  draft: AboutContent;
  setDraft: (updater: Updater<AboutContent>) => void;
}) {
  const t = useTranslations("dashboard");

  const patchEducation = (items: AboutEducationItem[]) =>
    setDraft((current) => ({
      ...current,
      education: { ...current.education, items },
    }));

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
        <CardTitle>{t("cv.education.title")}</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            patchEducation([...draft.education.items, blankEducation()])
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
                education: { ...current.education, title: event.target.value },
              }))
            }
          />
        </Field>

        <div className="space-y-4">
          {draft.education.items.map((item, index) => (
            <EducationEditor
              key={`${locale}-education-${index}`}
              index={index}
              item={item}
              onMove={(from, to) =>
                patchEducation(move(draft.education.items, from, to))
              }
              onChange={(next) =>
                patchEducation(
                  draft.education.items.map((entry, itemIndex) =>
                    itemIndex === index ? next : entry,
                  ),
                )
              }
              onDelete={() =>
                patchEducation(
                  draft.education.items.filter(
                    (_, itemIndex) => itemIndex !== index,
                  ),
                )
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EducationEditor({
  item,
  index,
  onMove,
  onChange,
  onDelete,
}: {
  item: AboutEducationItem;
  index: number;
  onMove: (from: number, to: number) => void;
  onChange: (next: AboutEducationItem) => void;
  onDelete: () => void;
}) {
  const t = useTranslations("dashboard");

  return (
    <SortableCard group="education" index={index} onMove={onMove}>
      <CardContent className="grid gap-4 p-4 pr-12 md:grid-cols-2">
        <Field label={t("cv.education.period")}>
          <Input
            value={item.period}
            onChange={(event) => onChange({ ...item, period: event.target.value })}
          />
        </Field>
        <Field label={t("cv.education.degree")}>
          <Input
            value={item.degree}
            onChange={(event) => onChange({ ...item, degree: event.target.value })}
          />
        </Field>
        <Field label={t("cv.education.school")}>
          <Input
            value={item.school}
            onChange={(event) => onChange({ ...item, school: event.target.value })}
          />
        </Field>
        <div />

        <div className="md:col-span-2">
          <Field label={t("cv.education.description")}>
            <Textarea
              rows={4}
              value={item.description ?? ""}
              onChange={(event) =>
                onChange({ ...item, description: event.target.value })
              }
            />
          </Field>
        </div>

        <Field label={t("cv.education.thesis")}>
          <Input
            value={item.thesis ?? ""}
            onChange={(event) => onChange({ ...item, thesis: event.target.value })}
          />
        </Field>
        <Field label={t("cv.education.thesisUrl")}>
          <Input
            value={item.thesisUrl ?? ""}
            onChange={(event) => onChange({ ...item, thesisUrl: event.target.value })}
          />
        </Field>

        <div className="md:col-span-2">
          <DeleteButton label={t("cv.education.delete")} onClick={onDelete} />
        </div>
      </CardContent>
    </SortableCard>
  );
}
