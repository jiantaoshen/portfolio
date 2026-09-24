"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import LanguageSwitcher from "./LanguageSwitcher";
import { navLinkActive, navLinkBase } from "./navigation-styles";

interface NavbarProps {
  locale: Locale;
}

/* Navbar 可以高亮的 section。Hero 和 Skills 属于同一个 #skills section。 */
const sectionIds = ["skills", "projects", "education"] as const;

/* 自动生成 "skills" | "projects" | "education"，避免重复维护类型。 */
type SectionId = (typeof sectionIds)[number];

/* 检查 URL hash / DOM id 是否属于 Navbar 支持的 section。 */
function isSectionId(value: string): value is SectionId {
  return sectionIds.includes(value as SectionId);
}

export default function Navbar({ locale }: NavbarProps) {
  const about = useTranslations("about");
  const pathname = usePathname();

  /* Hero + Skills 是同一个 section，所以页面顶部默认 Skills active。 */
  const [activeSection, setActiveSection] = useState<SectionId>("skills");

  /* 控制手机 Sheet 打开 / 关闭。 */
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    /* 保存每个 section 当前的 intersection ratio。 */
    const visibility = new Map<SectionId, number>(sectionIds.map((id) => [id, 0]));

    /* 读取 #skills / #projects / #education，并同步 Navbar active 状态。 */
    function syncHash() {
      const id = window.location.hash.slice(1);
      if (isSectionId(id)) setActiveSection(id);
    }

    /* 支持直接打开 /en/#projects 之类的 URL。 */
    syncHash();

    const observer = new IntersectionObserver(
      (entries) => {
        /* entries 只包含本次发生变化的元素，所以先保存每个 section 的最新状态。 */
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!isSectionId(id)) return;
          visibility.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        /* 从全部 section 中选择当前可见比例最大的一个。 */
        const current = sectionIds
          .map((id) => ({ id, ratio: visibility.get(id) ?? 0 }))
          .filter(({ ratio }) => ratio > 0)
          .sort((a, b) => b.ratio - a.ratio)[0];

        if (current) setActiveSection(current.id);
      },
      {
        /* 只把 viewport 中上部作为 active detection area，避免 section 刚出现就过早切换。 */
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    /* 开始观察 #skills / #projects / #education。 */
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    window.addEventListener("hashchange", syncHash);

    /* pathname 改变或 Navbar unmount 时清理 observer 和 listener。 */
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, [pathname]);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  /* Mobile active link 使用 secondary，其他使用 ghost。 */
  function mobileLinkClass(section: SectionId) {
    return cn(buttonVariants({ variant: activeSection === section ? "secondary" : "ghost" }), "w-full justify-start");
  }

  /* Desktop link 始终使用 base style，active 时再增加 active style。 */
  function desktopLinkClass(section: SectionId) {
    return cn(navLinkBase, activeSection === section && navLinkActive);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-muted">
      <PageContainer className="flex min-h-(--nav-min-height) items-center justify-between gap-6">
        {/* Logo：width / height 只提供 SVG 比例，实际显示高度由 --nav-logo-height 控制。 */}
        <Link href={`/${locale}/`} className="inline-flex shrink-0 items-center" aria-label="JIANTAO.dev home">
          <Image src="/logo.svg" alt="" aria-hidden="true" width={320} height={64} unoptimized className="block h-(--nav-logo-height) w-auto" />
        </Link>

        {/* Desktop navigation：>= 768px 显示。 */}
        <nav className="hidden items-center gap-1 md:flex min-[1920px]:gap-1.5">
          <Link href={`/${locale}/#skills`} className={desktopLinkClass("skills")} aria-current={activeSection === "skills" ? "location" : undefined}>
            {about("skills.title")}
          </Link>

          <Link href={`/${locale}/#projects`} className={desktopLinkClass("projects")} aria-current={activeSection === "projects" ? "location" : undefined}>
            {about("projects.title")}
          </Link>

          <Link href={`/${locale}/#education`} className={desktopLinkClass("education")} aria-current={activeSection === "education" ? "location" : undefined}>
            {about("education.title")}
          </Link>

          <LanguageSwitcher />
        </nav>

        {/* Mobile navigation：< 768px 使用 Sheet。 */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger aria-label="Open menu" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">
                <Link href={`/${locale}/#skills`} className={mobileLinkClass("skills")} aria-current={activeSection === "skills" ? "location" : undefined} onClick={closeMobileMenu}>
                  {about("skills.title")}
                </Link>

                <Link href={`/${locale}/#projects`} className={mobileLinkClass("projects")} aria-current={activeSection === "projects" ? "location" : undefined} onClick={closeMobileMenu}>
                  {about("projects.title")}
                </Link>

                <Link href={`/${locale}/#education`} className={mobileLinkClass("education")} aria-current={activeSection === "education" ? "location" : undefined} onClick={closeMobileMenu}>
                  {about("education.title")}
                </Link>

                <div className="mt-4 border-t border-border pt-4">
                  <LanguageSwitcher />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  );
}