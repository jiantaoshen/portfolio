"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  Menu,
} from "lucide-react";

import LanguageSwitcher from "@/components/page/LanguageSwitcher";

import {
  buttonVariants,
} from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  cn,
} from "@/lib/utils";

import type {
  Locale,
} from "@/i18n";

import type {
  CommonTranslation,
} from "@/i18n/types";


interface NavbarProps {
  lang: Locale;
  common: CommonTranslation;
  educationLabel: string;
}


const sectionIds = [
  "about",
  "projects",
  "education",
] as const;

type SectionId =
  (typeof sectionIds)[number];


export default function Navbar({
  lang,
  common,
  educationLabel,
}: NavbarProps) {
  const [
    activeSection,
    setActiveSection,
  ] =
    useState<SectionId>(
      "about",
    );

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);


  useEffect(() => {
    const initialSection =
      window.location.hash.replace(
        "#",
        "",
      );

    if (
      sectionIds.includes(
        initialSection as SectionId,
      )
    ) {
      setActiveSection(
        initialSection as SectionId,
      );
    }


    const observer =
      new IntersectionObserver(
        (entries) => {
          const visible =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting,
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio,
              );

          const id =
            visible[0]?.target.id;

          if (
            id &&
            sectionIds.includes(
              id as SectionId,
            )
          ) {
            setActiveSection(
              id as SectionId,
            );
          }
        },
        {
          rootMargin:
            "-30% 0px -55% 0px",

          threshold: [
            0,
            0.1,
            0.25,
            0.5,
          ],
        },
      );


    sectionIds.forEach(
      (id) => {
        const section =
          document.getElementById(
            id,
          );

        if (section) {
          observer.observe(
            section,
          );
        }
      },
    );


    function handleHashChange() {
      const id =
        window.location.hash.replace(
          "#",
          "",
        );

      if (
        sectionIds.includes(
          id as SectionId,
        )
      ) {
        setActiveSection(
          id as SectionId,
        );
      }
    }


    window.addEventListener(
      "hashchange",
      handleHashChange,
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "hashchange",
        handleHashChange,
      );
    };
  }, []);


  function closeMobileMenu() {
    setMobileOpen(false);
  }


  function mobileLinkClass(
    section: SectionId,
  ) {
    return cn(
      buttonVariants({
        variant:
          activeSection === section
            ? "secondary"
            : "ghost",
      }),
      "w-full justify-start",
    );
  }


  return (
    <header className="site-header">
      <nav className="container nav-shell">
        {/* Logo */}

        <Link
          href={`/${lang}/`}
          className="site-logo"
          aria-label="JIANTAO.dev home"
        >
          <span>
            JIANTAO
          </span>

          <span>
            .dev
          </span>
        </Link>


        {/* Desktop */}

        <div className="desktop-nav">
          <Link
            href={`/${lang}/#about`}
            className={cn(
              "nav-link",

              activeSection ===
                "about" &&
                "nav-active",
            )}
            aria-current={
              activeSection ===
              "about"
                ? "location"
                : undefined
            }
          >
            {common.nav.about}
          </Link>


          <Link
            href={`/${lang}/#projects`}
            className={cn(
              "nav-link",

              activeSection ===
                "projects" &&
                "nav-active",
            )}
            aria-current={
              activeSection ===
              "projects"
                ? "location"
                : undefined
            }
          >
            {common.nav.projects}
          </Link>


          <Link
            href={`/${lang}/#education`}
            className={cn(
              "nav-link",

              activeSection ===
                "education" &&
                "nav-active",
            )}
            aria-current={
              activeSection ===
              "education"
                ? "location"
                : undefined
            }
          >
            {educationLabel}
          </Link>


          <LanguageSwitcher
            lang={lang}
          />
        </div>


        {/* Mobile */}

        <div className="md:hidden">
          <Sheet
            open={mobileOpen}
            onOpenChange={
              setMobileOpen
            }
          >
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
                <SheetTitle>
                  Navigation
                </SheetTitle>
              </SheetHeader>


              <div className="flex flex-col gap-1 px-4">
                <Link
                  href={`/${lang}/#about`}
                  className={
                    mobileLinkClass(
                      "about",
                    )
                  }
                  aria-current={
                    activeSection ===
                    "about"
                      ? "location"
                      : undefined
                  }
                  onClick={
                    closeMobileMenu
                  }
                >
                  {common.nav.about}
                </Link>


                <Link
                  href={`/${lang}/#projects`}
                  className={
                    mobileLinkClass(
                      "projects",
                    )
                  }
                  aria-current={
                    activeSection ===
                    "projects"
                      ? "location"
                      : undefined
                  }
                  onClick={
                    closeMobileMenu
                  }
                >
                  {common.nav.projects}
                </Link>


                <Link
                  href={`/${lang}/#education`}
                  className={
                    mobileLinkClass(
                      "education",
                    )
                  }
                  aria-current={
                    activeSection ===
                    "education"
                      ? "location"
                      : undefined
                  }
                  onClick={
                    closeMobileMenu
                  }
                >
                  {educationLabel}
                </Link>


                <div className="mt-4 border-t border-border pt-4">
                  <LanguageSwitcher
                    lang={lang}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}