"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "@/components/page/LanguageSwitcher";
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

  const [observedSection, setObservedSection] = useState<SectionId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const hash = useSyncExternalStore(
    subscribeToHash,
    getHashSnapshot,
    getServerHashSnapshot,
  );

  const hashSection = isSectionId(hash) ? hash : null;
  const activeSection = observedSection ?? hashSection ?? "skills";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const id = visible[0]?.target.id;

        if (id && isSectionId(id)) {
          setObservedSection(id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);

      if (section) {
        observer.observe(section);
      }
    });

    function handleHashChange() {
      const id = window.location.hash.replace("#", "");

      if (isSectionId(id)) {
        setObservedSection(id);
      }
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

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

  return (
    <header className="site-header">
      <nav className="container nav-shell">
        <Link
          href={`/${locale}/`}
          className="site-logo"
          aria-label="JIANTAO.dev home"
        >
          <span>JIANTAO</span>
          <span>.dev</span>
        </Link>

        <div className="desktop-nav">
          <Link
            href={`/${locale}/#skills`}
            className={cn(
              "nav-link",
              activeSection === "skills" && "nav-active",
            )}
            aria-current={
              activeSection === "skills" ? "location" : undefined
            }
          >
            {about("skills.title")}
          </Link>

          <Link
            href={`/${locale}/#projects`}
            className={cn(
              "nav-link",
              activeSection === "projects" && "nav-active",
            )}
            aria-current={
              activeSection === "projects" ? "location" : undefined
            }
          >
            {about("projects.title")}
          </Link>

          <Link
            href={`/${locale}/#education`}
            className={cn(
              "nav-link",
              activeSection === "education" && "nav-active",
            )}
            aria-current={
              activeSection === "education" ? "location" : undefined
            }
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

            <SheetContent
              side="right"
              className="w-full sm:max-w-sm"
            >
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4">
                <Link
                  href={`/${locale}/#skills`}
                  className={mobileLinkClass("skills")}
                  aria-current={
                    activeSection === "skills" ? "location" : undefined
                  }
                  onClick={closeMobileMenu}
                >
                  {about("skills.title")}
                </Link>

                <Link
                  href={`/${locale}/#projects`}
                  className={mobileLinkClass("projects")}
                  aria-current={
                    activeSection === "projects" ? "location" : undefined
                  }
                  onClick={closeMobileMenu}
                >
                  {about("projects.title")}
                </Link>

                <Link
                  href={`/${locale}/#education`}
                  className={mobileLinkClass("education")}
                  aria-current={
                    activeSection === "education" ? "location" : undefined
                  }
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
      </nav>
    </header>
  );
}