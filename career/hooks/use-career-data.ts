import { useMemo, useState } from "react";

import { localContentApi } from "../lib/api";
import type {
  AboutByLocale,
  AboutContent,
  CareerSnapshot,
  DashboardMode,
  Locale,
} from "../lib/types";

const clone = <T,>(value: T): T => structuredClone(value);

function makeSnapshot(initialAbout: AboutByLocale): CareerSnapshot {
  return clone({ about: initialAbout });
}

export function useCareerData(
  mode: DashboardMode,
  initialAbout: AboutByLocale,
) {
  const [data, setData] = useState<CareerSnapshot>(() => makeSnapshot(initialAbout));
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const patchLocal = (updater: (current: CareerSnapshot) => CareerSnapshot) => {
    setData((current) => updater(current));
  };

  const reset = () => {
    setActionError(null);
    setData(makeSnapshot(initialAbout));
  };

  const actions = useMemo(
    () => ({
      stageAbout(
        locale: Locale,
        update: AboutContent | ((current: AboutContent) => AboutContent),
      ) {
        patchLocal((current) => {
          const currentLocale = current.about[locale];
          const next =
            typeof update === "function" ? update(currentLocale) : update;

          return {
            ...current,
            about: {
              ...current.about,
              [locale]: clone(next),
            },
          };
        });
      },

      async saveAbout(locale: Locale, content: AboutContent) {
        setActionError(null);

        if (mode === "trial") {
          const saved = clone(content);
          patchLocal((current) => ({
            ...current,
            about: {
              ...current.about,
              [locale]: saved,
            },
          }));
          return saved;
        }

        setSaving(true);

        try {
          const saved = await localContentApi.updateAbout(locale, content);
          patchLocal((current) => ({
            ...current,
            about: {
              ...current.about,
              [locale]: clone(saved),
            },
          }));
          return saved;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to save About content";
          setActionError(message);
          throw error;
        } finally {
          setSaving(false);
        }
      },
    }),
    [mode],
  );

  return {
    data,
    loading: false,
    error: null as string | null,
    actionError,
    dismissActionError: () => setActionError(null),
    saving,
    reload: reset,
    actions,
  };
}
