"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Field } from "@/app/[locale]/(career)/dashboard/_components/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { blankLanguage, type Updater } from "@/app/[locale]/(career)/dashboard/_lib/editor-utils";
import type { AboutContent, AboutLanguageItem } from "@/lib/types";

export function LanguagesSection({
  draft,
  setDraft,
}: {
  draft: AboutContent;
  setDraft: (updater: Updater<AboutContent>) => void;
}) {
  const t = useTranslations("dashboard");

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
        <CardTitle>{t("cv.languages.title")}</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setDraft((current) => ({
              ...current,
              languages: {
                ...current.languages,
                items: [...current.languages.items, blankLanguage()],
              },
            }))
          }
        >
          <Plus className="mr-2 size-4" />
          {t("cv.languages.add")}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <Field label={t("cv.sectionTitle")}>
          <Input
            value={draft.languages.title}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                languages: { ...current.languages, title: event.target.value },
              }))
            }
          />
        </Field>

        <div className="space-y-3">
          {draft.languages.items.map((language, index) => (
            <LanguageEditor
              key={language.id}
              language={language}
              onChange={(next) =>
                setDraft((current) => ({
                  ...current,
                  languages: {
                    ...current.languages,
                    items: current.languages.items.map((item, itemIndex) =>
                      itemIndex === index ? next : item,
                    ),
                  },
                }))
              }
              onDelete={() =>
                setDraft((current) => ({
                  ...current,
                  languages: {
                    ...current.languages,
                    items: current.languages.items.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  },
                }))
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LanguageEditor({
  language,
  onChange,
  onDelete,
}: {
  language: AboutLanguageItem;
  onChange: (next: AboutLanguageItem) => void;
  onDelete: () => void;
}) {
  const t = useTranslations("dashboard");

  return (
    <div className="grid gap-3 rounded-lg border border-foreground/10 p-3 sm:grid-cols-[1fr_minmax(8rem,.35fr)_auto] sm:items-end">
      <Field label={t("cv.languages.name")}>
        <Input
          value={language.name}
          placeholder={t("cv.languages.namePlaceholder")}
          onChange={(event) =>
            onChange({ ...language, name: event.target.value })
          }
        />
      </Field>

      <Field label={t("cv.languages.proficiency")}>
        <Input
          value={language.proficiency ?? ""}
          placeholder={t("cv.languages.proficiencyPlaceholder")}
          onChange={(event) =>
            onChange({ ...language, proficiency: event.target.value })
          }
        />
      </Field>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t("cv.languages.delete")}
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
