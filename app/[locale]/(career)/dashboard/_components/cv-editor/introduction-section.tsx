"use client";

import { useTranslations } from "next-intl";

import { Field } from "@/app/[locale]/(career)/dashboard/_components/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Updater } from "@/app/[locale]/(career)/dashboard/_lib/editor-utils";
import type { AboutContent } from "@/lib/types";

export function IntroductionSection({
  draft,
  setDraft,
}: {
  draft: AboutContent;
  setDraft: (updater: Updater<AboutContent>) => void;
}) {
  const t = useTranslations("dashboard");

  return (
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
                hero: { ...current.hero, titleBefore: event.target.value },
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
                hero: { ...current.hero, titleHighlight: event.target.value },
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
                  about: { ...current.about, description: event.target.value },
                }))
              }
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}
