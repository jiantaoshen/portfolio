"use client";

import { Save } from "lucide-react";
import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/app/[locale]/(career)/dashboard/_components/locale-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { localeMeta } from "@/lib/locales";

export function SaveBar({
  locale,
  setLocale,
  saving,
  onSave,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  saving: boolean;
  onSave: () => Promise<void>;
}) {
  const t = useTranslations("dashboard");

  return (
    <Card className="sticky bottom-[max(.5rem,env(safe-area-inset-bottom))] z-10 shadow-lg">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <LocaleSwitcher value={locale} onChange={setLocale} />

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{locale}</Badge>
          <span className="min-w-0 break-all font-mono text-xs">
            i18n/locales/{locale}/about.json
          </span>
          <Badge variant="outline">shared</Badge>
          <span className="min-w-0 break-all font-mono text-xs">
            i18n/shared/skills.json
          </span>
          <span className="min-w-0 break-all font-mono text-xs">
            i18n/shared/projects.json
          </span>
        </div>

        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={saving}
          onClick={() => void onSave().catch(() => {})}
        >
          <Save className="mr-2 size-4" />
          {saving
            ? t("actions.saving")
            : t("actions.saveLanguage", {
                language: localeMeta[locale].label,
              })}
        </Button>
      </CardContent>
    </Card>
  );
}
