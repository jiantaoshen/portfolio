import {
  Badge,
} from "@/components/ui/badge";

import {
  buttonVariants,
} from "@/components/ui/button";

import {
  cn,
} from "@/lib/utils";

import type {
  HomeTranslation,
  CommonTranslation,
  AboutTranslation,
} from "@/i18n/types";


interface HeroProps {
  home: HomeTranslation;
  common: CommonTranslation;
  skills: AboutTranslation["skills"];
}


export default function Hero({
  home,
  common,
  skills,
}: HeroProps) {
  return (
    <section
      id="about"
      className="hero-shell"
    >
      <div className="container">
        <div className="hero-grid">
          {/* Hero copy */}

          <div className="hero-copy">
            <h1 className="hero-title">
              {home.hero.titleBefore}{" "}

              <span className="text-primary">
                {home.hero.titleHighlight}
              </span>
            </h1>

            <p className="hero-description">
              {home.hero.description}
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
                {common.buttons.viewWork}

                <span aria-hidden="true">
                  →
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
                GitHub

                <span aria-hidden="true">
                  ↗
                </span>
              </a>

              <a
                href="https://www.linkedin.com/in/jiantaoshen"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "h-12 w-full px-5 sm:w-auto",
                )}
              >
                LinkedIn

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
              {skills.title}
            </h2>

            <div className="skill-groups">
              {skills.items.map(
                (group) => (
                  <div
                    key={group.title}
                    className="skill-group"
                  >
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