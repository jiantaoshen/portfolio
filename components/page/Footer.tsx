import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

interface FooterProps {
  locale: Locale;
}

export default async function Footer({ locale }: FooterProps) {
  const common = await getTranslations({ locale, namespace: "common" });
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground/90 text-background w-full">
      <div className="mx-auto container flex flex-col items-center justify-between gap-4 p-8 md:flex-row">

        {/* Logo */}
        <Link
          href={`/${locale}/`}
          className="shrink-0"
          aria-label="JIANTAO.dev home"
        >
          <Image
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            width={320}
            height={64}
            unoptimized
            loading="eager"
            className="h-(--nav-logo-height) w-auto"
          />
        </Link>

        {/* Social links */}
        <nav className="flex flex-wrap items-center gap-5" aria-label="Social links">
          <a href="https://github.com/jiantaoshen" target="_blank" rel="noopener noreferrer" className="inline-flex text-(length:--footer-link-size) font-medium gap-1  transition-colors hover:text-primary">
            GitHub <span aria-hidden="true">↗</span>
          </a>

          <a href="https://www.linkedin.com/in/jiantaoshen" target="_blank" rel="noopener noreferrer" className="inline-flex text-(length:--footer-link-size) font-medium gap-1 transition-colors hover:text-primary">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </nav>

        {/* Copyright notice */}
        <p className=" text-(length:--footer-copy-size) leading-relaxed">
          © {year} Jiantao Shen. {common("rights")}
        </p>
      </div>
    </footer>
  );
}