"use client";

import { useTranslations } from "next-intl";

import { EducationSection } from "@/app/[locale]/(career)/dashboard/_components/cv-editor/education-section";
import { IntroductionSection } from "@/app/[locale]/(career)/dashboard/_components/cv-editor/introduction-section";
import { LanguagesSection } from "@/app/[locale]/(career)/dashboard/_components/cv-editor/languages-section";
import { ProjectsSection } from "@/app/[locale]/(career)/dashboard/_components/cv-editor/projects-section";
import { SaveBar } from "@/app/[locale]/(career)/dashboard/_components/cv-editor/save-bar";
import { SkillsSection } from "@/app/[locale]/(career)/dashboard/_components/cv-editor/skills-section";
import { useCvEditor } from "@/app/[locale]/(career)/dashboard/_hooks/use-cv-editor";
import type { Locale } from "@/i18n/routing";

interface CvEditorPageProps {
  initialLocale: Locale;
}

export function CvEditorPage({ initialLocale }: CvEditorPageProps) {
  const t = useTranslations("dashboard");
  const editor = useCvEditor(initialLocale);

  return (
    <div className="space-y-6">
      <h1>{t("cv.title")}</h1>

      <IntroductionSection
        draft={editor.draft}
        setDraft={editor.setDraft}
      />

      <ProjectsSection
        draft={editor.draft}
        projectDraft={editor.projectDraft}
        setDraft={editor.setDraft}
        setProjectsDraft={editor.setProjectsDraft}
        addProject={editor.addProject}
        removeProject={editor.removeProject}
      />

      <SkillsSection
        draft={editor.draft}
        skillDraft={editor.skillDraft}
        setDraft={editor.setDraft}
        setSkillsDraft={editor.setSkillsDraft}
        addSkill={editor.addSkill}
        removeSkill={editor.removeSkill}
      />

      <LanguagesSection
        draft={editor.draft}
        setDraft={editor.setDraft}
      />

      <EducationSection
        locale={editor.locale}
        draft={editor.draft}
        setDraft={editor.setDraft}
      />

      <SaveBar
        locale={editor.locale}
        setLocale={editor.setLocale}
        saving={editor.saving}
        onSave={editor.save}
      />
    </div>
  );
}
