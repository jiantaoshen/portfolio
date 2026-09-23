"use client";

import { createContext, useContext } from "react";

import { DashboardShell } from "./components/dashboard/dashboard-shell";
import { useCareerData } from "./hooks/use-career-data";
import type { AboutByLocale, CareerSnapshot, DashboardMode } from "./lib/types";

type WorkspaceValue = ReturnType<typeof useCareerData> & {
  data: CareerSnapshot;
  mode: DashboardMode;
};

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function useCareerWorkspace() {
  const value = useContext(WorkspaceContext);

  if (!value) {
    throw new Error("useCareerWorkspace must be used inside CareerWorkspace");
  }

  return value;
}

interface CareerWorkspaceProps {
  mode: DashboardMode;
  initialAbout: AboutByLocale;
  children: React.ReactNode;
}

export function CareerWorkspace({
  mode,
  initialAbout,
  children,
}: CareerWorkspaceProps) {
  const state = useCareerData(mode, initialAbout);

  const value = {
    ...state,
    data: state.data,
    mode,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      <DashboardShell
        mode={mode}
        onReset={mode === "trial" ? state.reload : undefined}
        actionError={state.actionError}
        onDismissError={state.dismissActionError}
      >
        {children}
      </DashboardShell>
    </WorkspaceContext.Provider>
  );
}
