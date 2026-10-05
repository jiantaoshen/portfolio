import { useState } from "react";

import { localContentApi } from "@/lib/api";
import type {
  AboutByLocale,
  AboutContent,
  CareerSnapshot,
  Locale,
  SharedProjects,
  SharedSkills,
} from "@/lib/types";

const clone = <T,>(value: T): T => structuredClone(value);

export function useCareerData(
  initialAbout: AboutByLocale,
  initialSkills: SharedSkills,
  initialProjects: SharedProjects,
) {
  const [data, setData] = useState<CareerSnapshot>(() =>
    clone({ about: initialAbout, skills: initialSkills, projects: initialProjects }),
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const patchLocal = (updater: (current: CareerSnapshot) => CareerSnapshot) => setData(updater);

  function stageAbout(locale: Locale, update: AboutContent | ((current: AboutContent) => AboutContent)) {
    patchLocal((current) => ({
      ...current,
      about: {
        ...current.about,
        [locale]: clone(typeof update === "function" ? update(current.about[locale]) : update),
      },
    }));
  }

  function stageSkills(update: SharedSkills | ((current: SharedSkills) => SharedSkills)) {
    patchLocal((current) => ({
      ...current,
      skills: clone(typeof update === "function" ? update(current.skills) : update),
    }));
  }

  function stageProjects(update: SharedProjects | ((current: SharedProjects) => SharedProjects)) {
    patchLocal((current) => ({
      ...current,
      projects: clone(typeof update === "function" ? update(current.projects) : update),
    }));
  }

  async function saveCv(
    locale: Locale,
    content: AboutContent,
    skills: SharedSkills,
    projects: SharedProjects,
  ) {
    setActionError(null);
    setSaving(true);

    try {
      const skillCategories = Object.fromEntries(
        skills.items.map(({ id }) => [id, content.skills.categories[id] ?? ""]),
      );

      const projectItems = Object.fromEntries(
        projects.items.map((project) => {
          const localized = content.projects.items[project.id] ?? {
            title: "",
            description: "",
            highlights: [],
            technologyCategories: {},
          };
          const technologyCategories = Object.fromEntries(
            project.technologyGroups.map(({ id }) => [id, localized.technologyCategories[id] ?? ""]),
          );
          return [project.id, { ...localized, technologyCategories }];
        }),
      );

      const nextAbout: AboutContent = {
        ...content,
        projects: { ...content.projects, items: projectItems },
        skills: { ...content.skills, categories: skillCategories },
      };

      const [savedAbout, savedSkills, savedProjects] = await Promise.all([
        localContentApi.updateAbout(locale, nextAbout),
        localContentApi.updateSkills(skills),
        localContentApi.updateProjects(projects),
      ]);

      patchLocal((current) => ({
        about: { ...current.about, [locale]: clone(savedAbout) },
        skills: clone(savedSkills),
        projects: clone(savedProjects),
      }));

      return { about: savedAbout, skills: savedSkills, projects: savedProjects };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save CV content";
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
    actions: { stageAbout, stageSkills, stageProjects, saveCv },
  };
}
