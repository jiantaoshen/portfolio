import { useState } from "react";

import { localContentApi } from "../lib/api";
import type { AboutByLocale, AboutContent, CareerSnapshot, Locale } from "../lib/types";

const clone = <T,>(value: T): T => structuredClone(value);

function makeSnapshot(initialAbout: AboutByLocale): CareerSnapshot {
  return clone({ about: initialAbout });
}

export function useCareerData(initialAbout: AboutByLocale) {
  const [data, setData] = useState<CareerSnapshot>(() => makeSnapshot(initialAbout));
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function patchLocal(updater: (current: CareerSnapshot) => CareerSnapshot) {
    setData((current) => updater(current));
  }

  function stageAbout(locale: Locale, update: AboutContent | ((current: AboutContent) => AboutContent)) {
    patchLocal((current) => {
      const currentLocale = current.about[locale];
      const next = typeof update === "function" ? update(currentLocale) : update;

      return {
        ...current,
        about: {
          ...current.about,
          [locale]: clone(next),
        },
      };
    });
  }

  async function saveAbout(locale: Locale, content: AboutContent) {
    setActionError(null);
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
      const message = error instanceof Error ? error.message : "Failed to save About content";
      setActionError(message);
      throw error;
    } finally {
      setSaving(false);
    }
  }

  return {
    data,
    saving,
    actionError,
    dismissActionError: () => setActionError(null),
    actions: {
      stageAbout,
      saveAbout,
    },
  };
}