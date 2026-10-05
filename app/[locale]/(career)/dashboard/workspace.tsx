"use client";

import { createContext, useContext } from "react";

import sharedProjects from "@/i18n/shared/projects.json";
import sharedSkills from "@/i18n/shared/skills.json";

import { DashboardShell } from "./_components/dashboard-shell";
import { useCareerData } from "./_hooks/use-career-data";
import type { AboutByLocale, SharedProjects, SharedSkills } from "@/career/lib/types";

type WorkspaceValue = ReturnType<typeof useCareerData>;

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function useCareerWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useCareerWorkspace must be used inside CareerWorkspace");
  return value;
}

interface CareerWorkspaceProps {
  initialAbout: AboutByLocale;
  children: React.ReactNode;
}

export function CareerWorkspace({ initialAbout, children }: CareerWorkspaceProps) {
  const state = useCareerData(
    initialAbout,
    sharedSkills as SharedSkills,
    sharedProjects as SharedProjects,
  );

  return (
    <WorkspaceContext.Provider value={state}>
      <DashboardShell actionError={state.actionError} onDismissError={state.dismissActionError}>
        {children}
      </DashboardShell>
    </WorkspaceContext.Provider>
  );
}
