import { getTranslations } from "next-intl/server";

import { PageContainer } from "@/components/layout/page-container";
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
    <section
      id="education"
      className="bg-muted py-[var(--section-padding-y)]"
    >
      <PageContainer>
        <div className="mb-10 sm:mb-12 min-[1920px]:mb-14">
          <h2 className="m-0 text-[length:var(--section-title-size)] font-bold tracking-tight text-foreground">
            {about("education.title")}
          </h2>
        </div>

        <div className="border-b border-border">
          {educationItems.map((item) => (
            <article
              key={`${item.period}-${item.degree}`}
              className="grid grid-cols-1 gap-3 border-t border-border py-[var(--row-padding-y)] md:grid-cols-4 md:gap-8 lg:gap-12 min-[1920px]:grid-cols-[minmax(13rem,1fr)_minmax(0,3fr)] min-[1920px]:gap-16 min-[2560px]:grid-cols-[minmax(15rem,1fr)_minmax(0,3.2fr)] min-[2560px]:gap-20"
            >
              <p className="m-0 font-mono text-sm font-semibold text-primary min-[1920px]:text-base">
                {item.period}
              </p>

              <div className="grid gap-2 md:col-span-3 min-[1920px]:col-span-1">
                <h3 className="m-0 text-[length:var(--project-heading-size)] font-bold text-foreground">
                  {item.degree}
                </h3>

                <p className="m-0 text-sm font-medium text-muted-foreground min-[1920px]:text-base">
                  {item.school}
                </p>

                {item.description && (
                  <p className="m-0 max-w-3xl text-[length:var(--education-body-size)] leading-relaxed text-muted-foreground min-[1920px]:max-w-[58rem] min-[1920px]:leading-7">
                    {item.description}
                  </p>
                )}

                {item.thesis && (
                  <p className="m-0 pt-1 text-[length:var(--education-body-size)] leading-relaxed text-muted-foreground min-[1920px]:max-w-[58rem] min-[1920px]:leading-7">
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
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
