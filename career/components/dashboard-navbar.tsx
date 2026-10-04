"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { UiLanguageSwitcher } from "./ui-language-switcher";

export function DashboardNavbar() {
  const t = useTranslations("dashboard");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-muted">
      <div className="container flex p-5 min-h-(--nav-min-height) items-center justify-between">
        <Link href="/" className="shrink-0" aria-label="JIANTAO.dev home">
          <Image
            src="/logo.svg"
            alt=""
            aria-hidden
            width={320}
            height={64}
            unoptimized
            loading="eager"
            className="h-(--nav-logo-height) w-auto"
          />
        </Link>

        <span className="truncate text-lg font-semibold sm:text-base">
          {t("title.local")}
        </span>

        {/* Language switcher: desktop + mobile */}
        <UiLanguageSwitcher />
      </div>
    </header>
  );
}