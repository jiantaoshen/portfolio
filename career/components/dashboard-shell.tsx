"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { DashboardNavbar } from "./dashboard-navbar";

interface DashboardShellProps {
  actionError?: string | null;
  onDismissError?: () => void;
  children: React.ReactNode;
}

export function DashboardShell({ actionError, onDismissError, children }: DashboardShellProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="dashboard-shell min-h-screen bg-muted text-foreground">
      {/* Dashboard uses the same visual Navbar system as the public Portfolio. */}
      <DashboardNavbar />

      <main>
        {/* Save errors are shown globally above the editor content. */}
        {actionError && (
          <div className="flex items-center justify-between gap-3 border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive sm:px-6">
            <span>
              <strong>{t("errors.saveFailed")}</strong>{" "}
              {actionError}
            </span>

            {onDismissError && (
              <Button type="button" variant="ghost" size="icon-xs" onClick={onDismissError} aria-label={t("actions.dismiss")} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                <X className="size-4" />
              </Button>
            )}
          </div>
        )}

        {/* Shared width and responsive padding for Dashboard pages. */}
        <div className="mx-auto w-full max-w-(--dashboard-content-max-width) p-5 sm:p-(--dashboard-content-padding)">
          {children}
        </div>
      </main>
    </div>
  );
}