import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { PageContainer } from "@/components/layout/page-container";
import type { Locale } from "@/i18n/routing";

interface FooterProps {
  locale: Locale;
}

export default async function Footer({ locale }: FooterProps) {
  const common = await getTranslations({
    locale,
    namespace: "common",
  });

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <PageContainer>
        <div className="flex flex-col gap-5 py-8 sm:py-10 md:flex-row md:items-center md:justify-between 2xl:py-12 min-[1920px]:py-14">
          <Link
            href={`/${locale}/`}
            className="w-fit text-[length:var(--footer-link-size)] font-bold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            JIANTAO<span className="text-primary">.dev</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-5" aria-label="Social links">
            <a
              href="https://github.com/jiantaoshen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[length:var(--footer-link-size)] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>

            <a
              href="https://www.linkedin.com/in/jiantaoshen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[length:var(--footer-link-size)] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </nav>

          <p className="m-0 text-[length:var(--footer-copy-size)] leading-relaxed text-muted-foreground">
            © {year} Jiantao Shen. {common("rights")}
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
