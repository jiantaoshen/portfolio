import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

interface EducationProps {
  locale: Locale;
}

type EducationItem = {
  period: string;
  degree: string;
  school: string;
  description?: string;
  thesis?: string;
  thesisUrl?: string;
};

export default async function Education({ locale }: EducationProps) {
  const about = await getTranslations({
    locale,
    namespace: "about",
  });

  const educationItems = about.raw("education.items") as EducationItem[];

  return (
    <section id="education" aria-labelledby="education-title">
      <h2
        id="education-title"
        className="mb-6 font-mono text-xs font-bold uppercase tracking-widest text-primary min-[1920px]:text-[0.8125rem]"
      >
        {about("education.title")}
      </h2>

      <div className="grid gap-0 border-b border-border">
        {educationItems.map((item) => (
          <article
            key={`${item.period}-${item.degree}`}
            className="border-t border-border py-6 first:pt-0 first:border-t-0 min-[1920px]:py-7"
          >
            <p className="font-mono text-xs font-semibold text-primary min-[1920px]:text-sm">
              {item.period}
            </p>

            <h3 className="mt-2 text-base font-bold leading-snug text-foreground min-[1920px]:text-lg">
              {item.degree}
            </h3>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              {item.school}
            </p>

            {item.description && (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            )}

            {item.thesis && (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                <span className="font-semibold text-foreground">Thesis: </span>

                {item.thesisUrl ? (
                  <a
                    href={item.thesisUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary transition-colors hover:text-foreground"
                  >
                    {item.thesis}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                ) : (
                  <span>{item.thesis}</span>
                )}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
