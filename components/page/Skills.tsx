import { getTranslations } from "next-intl/server";

import { TechList } from "@/components/content/TechList";
import sharedSkills from "@/i18n/shared/skills.json";
import type { Locale } from "@/i18n/routing";

interface SkillsProps {
  locale: Locale;
}

type Language = {
  id: string;
  name: string;
  proficiency?: string;
};

export default async function Skills({ locale }: SkillsProps) {
  const about = await getTranslations({ locale, namespace: "about" });
  const categories = about.raw("skills.categories") as Record<string, string>;
  const languages = about.raw("languages.items") as Language[];

  return (
    <>
      <section id="skills" aria-labelledby="skills-title">
        <h2 id="skills-title" className="mb-5 font-mono text-xs font-bold uppercase tracking-widest text-primary sm:mb-6 min-[1920px]:text-[0.8125rem]">
          {about("skills.title")}
        </h2>
        <div className="grid gap-5 sm:gap-6 min-[2560px]:gap-8">
          {sharedSkills.items.map((group) => {
            const title = categories[group.id];
            if (!title) return null;

            return (
              <div key={group.id} className="grid gap-3 min-[2560px]:gap-4">
                <h3 className="text-sm font-bold text-foreground min-[1920px]:text-base min-[2560px]:text-lg">{title}</h3>
                <TechList items={group.items} />
              </div>
            );
          })}
        </div>
      </section>

      <section id="languages" aria-labelledby="languages-title">
        <h2 id="languages-title" className="mb-5 font-mono text-xs font-bold uppercase tracking-widest text-primary sm:mb-6 min-[1920px]:text-[0.8125rem]">
          {about("languages.title")}
        </h2>
        <div className="divide-y divide-border/40 border-y border-border/40">
          {languages.map((language) => (
            <div key={language.id} className="flex items-center justify-between gap-6 py-3 text-sm min-[1920px]:text-base">
              <span className="font-medium text-foreground">{language.name}</span>
              {language.proficiency && <span className="font-mono text-xs text-muted-foreground min-[1920px]:text-sm">{language.proficiency}</span>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
