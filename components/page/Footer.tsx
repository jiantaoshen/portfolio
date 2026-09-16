import Link from "next/link";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/i18n/routing";

interface FooterProps {
  locale: Locale;
}

export default async function Footer({locale}: FooterProps) {
  const common = await getTranslations({
      locale,
      namespace: "common",
    });

  const year = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <Link
            href={`/${locale}/`}
            className="footer-brand"
          >
            JIANTAO
            <span>.dev</span>
          </Link>

          <nav
            className="footer-links"
            aria-label="Social links"
          >
            <a
              href="https://github.com/jiantaoshen"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub

              <span
                aria-hidden="true"
              >
                ↗
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/jiantaoshen"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              LinkedIn

              <span
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          </nav>

          <p className="footer-copyright">
            © {year} Jiantao Shen.{" "}
            {common("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}