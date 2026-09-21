"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { PageContainer } from "@/components/layout/page-container";
import LanguageSwitcher from "./LanguageSwitcher";
import { navLinkActive, navLinkBase } from "./navigation-styles";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface NavbarProps {
  locale: Locale;
}

const sectionIds = ["skills", "projects", "education"] as const;

type SectionId = (typeof sectionIds)[number];

function isSectionId(value: string): value is SectionId {
  return sectionIds.includes(value as SectionId);
}

function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function getHashSnapshot() {
  return window.location.hash.replace("#", "");
}

function getServerHashSnapshot() {
  return "";
}

export default function Navbar({ locale }: NavbarProps) {
  const about = useTranslations("about");
  const pathname = usePathname();
  const [observed, setObserved] = useState<{
    pathname: string;
    section: SectionId;
  } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const hash = useSyncExternalStore(
    subscribeToHash,
    getHashSnapshot,
    getServerHashSnapshot,
  );

  const observedSection = observed?.pathname === pathname ? observed.section : null;
  const hashSection = isSectionId(hash) ? hash : null;
  const routeSection: SectionId | null = pathname.includes("/projects/")
    ? "projects"
    : null;
  const activeSection = observedSection ?? hashSection ?? routeSection ?? "skills";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const id = visible[0]?.target.id;

        if (id && isSectionId(id)) {
          setObserved({ pathname, section: id });
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    function handleHashChange() {
      const id = window.location.hash.replace("#", "");
      if (isSectionId(id)) setObserved({ pathname, section: id });
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function mobileLinkClass(section: SectionId) {
    return cn(
      buttonVariants({
        variant: activeSection === section ? "secondary" : "ghost",
      }),
      "w-full justify-start",
    );
  }

  function desktopLinkClass(section: SectionId) {
    return cn(navLinkBase, activeSection === section && navLinkActive);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-muted">
      <PageContainer className="flex min-h-(--nav-min-height) items-center justify-between gap-6">
        <Link
          href={`/${locale}/`}
          className="inline-flex items-baseline text-(length:--nav-logo-size) font-extrabold tracking-tight text-foreground transition-colors hover:text-primary"
          aria-label="JIANTAO.dev home"
        >
          <span>JIANTAO</span>
          <span className="text-primary">.dev</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex min-[1920px]:gap-1.5">
          <Link
            href={`/${locale}/#skills`}
            className={desktopLinkClass("skills")}
            aria-current={activeSection === "skills" ? "location" : undefined}
          >
            {about("skills.title")}
          </Link>

          <Link
            href={`/${locale}/#projects`}
            className={desktopLinkClass("projects")}
            aria-current={activeSection === "projects" ? "location" : undefined}
          >
            {about("projects.title")}
          </Link>

          <Link
            href={`/${locale}/#education`}
            className={desktopLinkClass("education")}
            aria-current={activeSection === "education" ? "location" : undefined}
          >
            {about("education.title")}
          </Link>

          <LanguageSwitcher />
        </div>

        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "icon",
                }),
              )}
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4">
                <Link
                  href={`/${locale}/#skills`}
                  className={mobileLinkClass("skills")}
                  aria-current={activeSection === "skills" ? "location" : undefined}
                  onClick={closeMobileMenu}
                >
                  {about("skills.title")}
                </Link>

                <Link
                  href={`/${locale}/#projects`}
                  className={mobileLinkClass("projects")}
                  aria-current={activeSection === "projects" ? "location" : undefined}
                  onClick={closeMobileMenu}
                >
                  {about("projects.title")}
                </Link>

                <Link
                  href={`/${locale}/#education`}
                  className={mobileLinkClass("education")}
                  aria-current={activeSection === "education" ? "location" : undefined}
                  onClick={closeMobileMenu}
                >
                  {about("education.title")}
                </Link>

                <div className="mt-4 border-t border-border pt-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  );
}
