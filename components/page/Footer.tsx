import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { PageContainer } from "@/components/layout/page-container";
import type { Locale } from "@/i18n/routing";

interface FooterProps {
  locale: Locale;
}

export default async function Footer({ locale }: FooterProps) {
  const common = await getTranslations({ locale, namespace: "common" });
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <PageContainer>
        <div className="flex flex-col gap-5 py-8 sm:py-10 md:flex-row md:items-center md:justify-between 2xl:py-12 min-[1920px]:py-14">
          {/* 使用和 Navbar 相同的品牌 SVG；实际大小由 responsive token 控制。 */}
          <Link href={`/${locale}/`} className="inline-flex w-fit shrink-0 items-center" aria-label="JIANTAO.dev home">
            <Image src="/logo.svg" alt="" aria-hidden="true" width={320} height={64} unoptimized className="block h-(--footer-logo-height) w-auto" />
          </Link>

          {/* 外部职业 / 开发平台链接。 */}
          <nav className="flex flex-wrap items-center gap-5" aria-label="Social links">
            <a href="https://github.com/jiantaoshen" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-(length:--footer-link-size) font-medium text-muted-foreground transition-colors hover:text-foreground">
              GitHub <span aria-hidden="true">↗</span>
            </a>

            <a href="https://www.linkedin.com/in/jiantaoshen" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-(length:--footer-link-size) font-medium text-muted-foreground transition-colors hover:text-foreground">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </nav>

          {/* 年份由 Server Component 生成，rights 继续使用当前语言。 */}
          <p className="m-0 text-(length:--footer-copy-size) leading-relaxed text-muted-foreground">
            © {year} Jiantao Shen. {common("rights")}
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}