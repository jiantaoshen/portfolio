"use client";

import { createContext, useContext } from "react";

import { DashboardShell } from "./components/dashboard/dashboard-shell";
import { useCareerData } from "./hooks/use-career-data";
import type { AboutByLocale } from "./lib/types";

type WorkspaceValue = ReturnType<typeof useCareerData>;

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function useCareerWorkspace() {
  const value = useContext(WorkspaceContext);

  if (!value) {
    throw new Error("useCareerWorkspace must be used inside CareerWorkspace");
  }

  return value;
}

interface CareerWorkspaceProps {
  initialAbout: AboutByLocale;
  children: React.ReactNode;
}

export function CareerWorkspace({initialAbout, children}: CareerWorkspaceProps) {
  const state = useCareerData(initialAbout);

  const value = {...state, data: state.data};

  return (
    <WorkspaceContext.Provider value={value}>
      <DashboardShell
        actionError={state.actionError}
        onDismissError={state.dismissActionError}
      >
        {children}
      </DashboardShell>
    </WorkspaceContext.Provider>
  );
}
