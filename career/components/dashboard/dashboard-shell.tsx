"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { FileUser, Home, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { dashboardNavItemVariants } from "./nav-variants";
import { UiLanguageSwitcher } from "./ui-language-switcher";

interface DashboardShellProps {
  actionError?: string | null;
  onDismissError?: () => void;
  children: React.ReactNode;
}

export function DashboardShell({
  actionError,
  onDismissError,
  children,
}: DashboardShellProps) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const cvPath = `/dashboard/cv`;
  const cvActive = pathname === cvPath;

  return (
    <div className="dashboard-shell min-h-screen bg-muted text-foreground lg:grid lg:grid-cols-[var(--dashboard-sidebar-width)_minmax(0,1fr)]">
      <aside className="border-b border-border bg-background p-4 lg:min-h-screen lg:border-r lg:border-b-0 lg:p-[var(--dashboard-sidebar-padding)]">
        <div className="mb-6 flex items-center justify-between lg:block">
          <div>
            <div className="text-sm font-semibold text-primary">JIANTAO.dev</div>

            <div className="mt-1 text-xl font-bold tracking-tight text-foreground">
              {t("title.local")}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:mt-3 lg:flex-col lg:items-start">
            <Badge variant="outline" className="font-mono text-primary">
              {t("status.local")}
            </Badge>

            <UiLanguageSwitcher />
          </div>
        </div>

        <nav className="space-y-1">
          <Link
            href={cvPath}
            aria-current={cvActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium",
              dashboardNavItemVariants({ active: cvActive, underlineInset: "lg" }),
            )}
          >
            <FileUser className="size-4" />
            {t("nav.cv")}
          </Link>
        </nav>

        <div className="mt-6 space-y-2">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}
          >
            <Home className="mr-2 size-4" />
            {t("nav.portfolio")}
          </Link>
        </div>
      </aside>

      <main className="min-w-0">
        <div className="border-b border-border bg-background px-5 py-3 text-sm text-muted-foreground sm:px-6">
          <strong className="text-foreground">{t("notices.localTitle")}</strong>{" "}
          {t("notices.localDescription")}
        </div>


        {actionError && (
          <div className="flex items-center justify-between gap-3 border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive sm:px-6">
            <span>
              <strong>{t("errors.saveFailed")}</strong>{" "}
              {actionError}
            </span>

            {onDismissError && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={onDismissError}
                aria-label={t("actions.dismiss")}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        )}

        <div className="mx-auto w-full max-w-(--dashboard-content-max-width) p-5 sm:p-(--dashboard-content-padding)">
          {children}
        </div>
      </main>
    </div>
  );
}
