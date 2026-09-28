import Image from "next/image";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import type { Locale } from "@/i18n/routing";

import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
  locale: Locale;
}

export default function Navbar({ locale }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-muted">
      <PageContainer className="flex min-h-(--nav-min-height) items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href={`/${locale}/`}
          className="inline-flex shrink-0 items-center"
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
            className="block h-(--nav-logo-height) w-auto"
          />
        </Link>

        {/* Language switcher: desktop + mobile */}
        <nav
          className="flex shrink-0 items-center gap-1 min-[1920px]:gap-1.5"
          aria-label="Language"
        >
          <LanguageSwitcher />
        </nav>
      </PageContainer>
    </header>
  );
}