"use client";

import { useState } from "react";

import { useCareerWorkspace } from "@/app/[locale]/(career)/dashboard/workspace";
import {
  blankLocalizedProject,
  blankSharedProject,
  clone,
  newId,
  newTempId,
  type Updater,
} from "@/app/[locale]/(career)/dashboard/_lib/editor-utils";
import type { Locale } from "@/i18n/routing";
import type {
  AboutContent,
  SharedProjects,
  SharedSkills,
} from "@/lib/types";

export function useCvEditor(initialLocale: Locale) {
  const { data, actions, saving } = useCareerWorkspace();

  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [drafts, setDrafts] = useState(() => clone(data.about));
  const [skillDrafts, setSkillDrafts] = useState<Record<Locale, SharedSkills>>(
    () =>
      Object.fromEntries(
        (Object.keys(data.about) as Locale[]).map((key) => [
          key,
          clone(data.skills),
        ]),
      ) as Record<Locale, SharedSkills>,
  );
  const [projectDrafts, setProjectDrafts] = useState<
    Record<Locale, SharedProjects>
  >(
    () =>
      Object.fromEntries(
        (Object.keys(data.about) as Locale[]).map((key) => [
          key,
          clone(data.projects),
        ]),
      ) as Record<Locale, SharedProjects>,
  );

  const draft = drafts[locale];
  const skillDraft = skillDrafts[locale];
  const projectDraft = projectDrafts[locale];

  const setDraft = (updater: Updater<AboutContent>) =>
    setDrafts((current) => ({
      ...current,
      [locale]: clone(
        typeof updater === "function" ? updater(current[locale]) : updater,
      ),
    }));

  const setSkillsDraft = (updater: Updater<SharedSkills>) =>
    setSkillDrafts((current) => ({
      ...current,
      [locale]: clone(
        typeof updater === "function" ? updater(current[locale]) : updater,
      ),
    }));

  const setProjectsDraft = (updater: Updater<SharedProjects>) =>
    setProjectDrafts((current) => ({
      ...current,
      [locale]: clone(
        typeof updater === "function" ? updater(current[locale]) : updater,
      ),
    }));

  const addProject = () => {
    const project = blankSharedProject();
    setProjectsDraft((current) => ({
      ...current,
      items: [...current.items, project],
    }));
    setDraft((current) => ({
      ...current,
      projects: {
        ...current.projects,
        items: {
          ...current.projects.items,
          [project.id]: blankLocalizedProject(),
        },
      },
    }));
  };

  const removeProject = (id: string) => {
    setProjectsDraft((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
    setDraft((current) => {
      const items = { ...current.projects.items };
      delete items[id];
      return { ...current, projects: { ...current.projects, items } };
    });
  };

  const addSkill = () => {
    const id = newTempId("skill");
    setSkillsDraft((current) => ({
      ...current,
      items: [...current.items, { id, items: [] }],
    }));
    setDraft((current) => ({
      ...current,
      skills: {
        ...current.skills,
        categories: { ...current.skills.categories, [id]: "" },
      },
    }));
  };

  const removeSkill = (id: string) => {
    setSkillsDraft((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
    setDraft((current) => {
      const categories = { ...current.skills.categories };
      delete categories[id];
      return { ...current, skills: { ...current.skills, categories } };
    });
  };

  const save = async () => {
    let nextAbout: AboutContent = {
      ...clone(draft),
      languages: {
        ...draft.languages,
        items: draft.languages.items.map((item) =>
          item.id.startsWith("tmp_") ? { ...item, id: newId("lang") } : item,
        ),
      },
    };

    const skillIdMap = new Map<string, string>();
    const nextSkills: SharedSkills = {
      items: skillDraft.items.map((group) => {
        if (!group.id.startsWith("tmp_")) return group;
        const id = newId("skill");
        skillIdMap.set(group.id, id);
        return { ...group, id };
      }),
    };

    if (skillIdMap.size) {
      const categories = { ...nextAbout.skills.categories };
      for (const [temporaryId, id] of skillIdMap) {
        categories[id] = categories[temporaryId] ?? "";
        delete categories[temporaryId];
      }
      nextAbout = {
        ...nextAbout,
        skills: { ...nextAbout.skills, categories },
      };
    }

    const projectIdMap = new Map<string, string>();
    const technologyIdMaps = new Map<string, Map<string, string>>();

    const nextProjects: SharedProjects = {
      items: projectDraft.items.map((project) => {
        const oldProjectId = project.id;
        const projectId = oldProjectId.startsWith("tmp_")
          ? newId("project")
          : oldProjectId;

        if (projectId !== oldProjectId) {
          projectIdMap.set(oldProjectId, projectId);
        }

        const technologyIdMap = new Map<string, string>();
        const technologyGroups = project.technologyGroups.map((group) => {
          if (!group.id.startsWith("tmp_")) return group;
          const id = newId("project-tech");
          technologyIdMap.set(group.id, id);
          return { ...group, id };
        });

        technologyIdMaps.set(oldProjectId, technologyIdMap);
        return { ...project, id: projectId, technologyGroups };
      }),
    };

    const localizedProjects = Object.fromEntries(
      projectDraft.items.map((project) => {
        const id = projectIdMap.get(project.id) ?? project.id;
        const localized =
          nextAbout.projects.items[project.id] ?? blankLocalizedProject();
        const technologyCategories = { ...localized.technologyCategories };

        for (const [temporaryId, categoryId] of
          technologyIdMaps.get(project.id) ?? []) {
          technologyCategories[categoryId] =
            technologyCategories[temporaryId] ?? "";
          delete technologyCategories[temporaryId];
        }

        return [id, { ...localized, technologyCategories }];
      }),
    );

    nextAbout = {
      ...nextAbout,
      projects: { ...nextAbout.projects, items: localizedProjects },
    };

    const saved = await actions.saveCv(
      locale,
      nextAbout,
      nextSkills,
      nextProjects,
    );

    setDrafts((current) => ({
      ...current,
      [locale]: clone(saved.about),
    }));

    setSkillDrafts((current) =>
      Object.fromEntries(
        (Object.keys(current) as Locale[]).map((key) => [
          key,
          {
            items: [
              ...clone(saved.skills.items),
              ...(key === locale
                ? []
                : current[key].items.filter((item) =>
                    item.id.startsWith("tmp_"),
                  )),
            ],
          },
        ]),
      ) as Record<Locale, SharedSkills>,
    );

    setProjectDrafts((current) =>
      Object.fromEntries(
        (Object.keys(current) as Locale[]).map((key) => [
          key,
          {
            items: [
              ...clone(saved.projects.items),
              ...(key === locale
                ? []
                : current[key].items.filter((item) =>
                    item.id.startsWith("tmp_"),
                  )),
            ],
          },
        ]),
      ) as Record<Locale, SharedProjects>,
    );
  };

  return {
    locale,
    setLocale,
    draft,
    skillDraft,
    projectDraft,
    setDraft,
    setSkillsDraft,
    setProjectsDraft,
    addProject,
    removeProject,
    addSkill,
    removeSkill,
    save,
    saving,
  };
}
