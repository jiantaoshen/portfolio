import { getTranslations } from "next-intl/server";

import { TechList } from "@/components/content/TechList";
import type { Locale } from "@/i18n/routing";

interface SkillsProps {
  locale: Locale;
}

type SkillGroup = {
  title: string;
  items: string[];
};

export default async function Skills({ locale }: SkillsProps) {
  const about = await getTranslations({
    locale,
    namespace: "about",
  });

  const skillGroups = about.raw("skills.items") as SkillGroup[];

  return (
    <section id="skills" aria-labelledby="skills-title">
      <h2
        id="skills-title"
        className="mb-5 font-mono text-xs font-bold uppercase tracking-widest text-primary sm:mb-6 min-[1920px]:text-[0.8125rem]"
      >
        {about("skills.title")}
      </h2>

      <div className="grid gap-5 sm:gap-6 min-[2560px]:gap-8">
        {skillGroups.map((group) => (
          <div key={group.title} className="grid gap-3 min-[2560px]:gap-4">
            <h3 className="text-sm font-bold text-foreground min-[1920px]:text-base min-[2560px]:text-lg">
              {group.title}
            </h3>

            <TechList items={group.items} />
          </div>
        ))}
      </div>
    </section>
  );
}
