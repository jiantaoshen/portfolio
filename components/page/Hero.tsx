import {Badge} from "@/components/ui/badge";
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/i18n/routing";

interface HeroProps {
  locale: Locale;
}

type SkillGroup = {
  title: string;
  items: string[];
};

export default async function Hero({locale}: HeroProps) {

  const common = await getTranslations({ 
    locale,
    namespace: "common",
  });

  const about = await getTranslations({
      locale,
      namespace: "about",
  });

  const skillGroups = about.raw("skills.items") as SkillGroup[];

  return (
    <section id="skills" className="hero-shell">
      <div className="container">
        <div className="hero-grid">

          {/* Hero copy */}
          <div className="hero-copy">
            <h1 className="hero-title">
              {about("hero.titleBefore")}
              {" "}
              <span className="text-primary">
                {about("hero.titleHighlight")}
              </span>
            </h1>

            <p className="hero-description">
              {about("about.description")}
            </p>

            {/* Actions */}
            <div className="hero-actions">
              <a
                href="#projects"
                className={cn(
                  buttonVariants({
                    variant: "default",
                  }),
                  "h-12 w-full px-5 sm:w-auto",
                )}
              >
                {common("buttons.caseStudy")}

                <span aria-hidden="true">
                  ↓
                </span>
              </a>

              <a
                href="https://github.com/jiantaoshen"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "h-12 w-full px-5 sm:w-auto",
                )}
              >
                {common("buttons.github")}

                <span aria-hidden="true">
                  ↗
                </span>
              </a>

              <a
                href="https://www.linkedin.com/in/jiantaoshen"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({variant: "outline"}), "h-12 w-full px-5 sm:w-auto")}
              >
                {common("buttons.linkedin")}
                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>


          {/* Skills */}
          <aside
            className="hero-skills"
            aria-labelledby="hero-skills-title"
          >
            <h2
              id="hero-skills-title"
              className="skills-heading"
            >
              {about("skills.title")}
            </h2>

            <div className="skill-groups">
              {skillGroups.map(
                (group) => (
                  <div key={group.title} className="skill-group">
                    <h3>
                      {group.title}
                    </h3>

                    <div className="skill-tags">
                      {group.items.map(
                        (item) => (
                          <Badge
                            key={item}
                            variant="outline"
                            className="min-h-9 px-3 font-mono text-xs text-muted-foreground"
                          >
                            {item}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}