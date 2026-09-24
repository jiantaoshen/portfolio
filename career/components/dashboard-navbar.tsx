"use client";

import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";

import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { UiLanguageSwitcher } from "./ui-language-switcher";

export function DashboardNavbar() {
  const t = useTranslations("dashboard");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-muted">
      <PageContainer className="flex min-h-(--nav-min-height) items-center justify-between gap-4">
        {/* Reuse the same brand asset and responsive sizing as the public Navbar. */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link href="/" className="inline-flex shrink-0 items-center" aria-label="JIANTAO.dev home">
            <Image src="/logo.svg" alt="" aria-hidden="true" width={320} height={64} unoptimized loading="eager" className="block h-(--nav-logo-height) w-auto" />
          </Link>

          <div className="h-6 w-px shrink-0 bg-border" />

          <span className="truncate text-sm font-semibold text-foreground sm:text-base">{t("title.local")}</span>
        </div>

        {/* Dashboard actions stay visible directly; no mobile Sheet is needed. */}
        <div className="flex shrink-0 items-center gap-2">
          <UiLanguageSwitcher />

          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}>
            <Home className="size-4" />
            <span className="hidden sm:inline">{t("nav.portfolio")}</span>
          </Link>
        </div>
      </PageContainer>
    </header>
  );
}