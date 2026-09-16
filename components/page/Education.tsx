import type {Locale} from "@/i18n/routing";
import {getTranslations} from "next-intl/server";

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

export default async function Education({locale}: EducationProps) {
  const about = await getTranslations({
      locale,
      namespace: "about",
  });

  const educationItem = about.raw("education.items") as EducationItem[];

  return (
    <section
      id="education"
      className="education-section section"
    >
      <div className="container">
        {/* Header */}

        <div className="education-header">
          <h2 className="education-title">
            {about("education.title")}
          </h2>
        </div>


        {/* Education */}
        <div className="education-list">
          {educationItem.map(
            (item) => (
              <article
                key={`${item.period}-${item.degree}`}
                className="education-row"
              >
                {/* Period */}
                <p className="education-period">
                  {item.period}
                </p>


                {/* Content */}
                <div className="education-content">
                  <h3>
                    {item.degree}
                  </h3>

                  <p className="education-school">
                    {item.school}
                  </p>

                  {item.description && (
                    <p className="education-description">
                      {item.description}
                    </p>
                  )}


                  {/* Thesis */}

                  {item.thesis && (
                    <p className="education-thesis">
                      <span>
                        Thesis:{" "}
                      </span>

                      {item.thesisUrl ? (
                        <a
                          href={item.thesisUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.thesis}

                          <span
                            aria-hidden="true"
                          >
                            {" "}↗
                          </span>
                        </a>
                      ) : (
                        <span>
                          {item.thesis}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}