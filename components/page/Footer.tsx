import Link from "next/link";

import type { Locale } from "@/i18n";
import type {
  CommonTranslation,
} from "@/i18n/types";

interface FooterProps {
  lang: Locale;
  common: CommonTranslation;
}

export default function Footer({
  lang,
  common,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <Link
            href={`/${lang}/`}
            className="footer-brand"
          >
            JIANTAO<span>.dev</span>
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
              <span aria-hidden="true">
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
              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </nav>

          <p className="footer-copyright">
            © {year} Jiantao Shen.{" "}
            {common.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}