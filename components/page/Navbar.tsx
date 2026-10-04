import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
  locale: Locale;
  title?: string;
}

export default function Navbar({ locale, title}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-accent bg-muted">
      <div className="container px-5 flex min-h-(--nav-min-height) items-center justify-between">
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

        {/* Dashboard Title */}
        {title && (
          <span className="truncate font-semibold">
            {title}
          </span>
        )}

        {/* Language switcher: desktop + mobile */}
        <LanguageSwitcher aria-label="Language" />
      </div>
    </header>
  );
}