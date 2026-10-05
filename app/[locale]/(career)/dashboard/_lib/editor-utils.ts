import type {
  AboutEducationItem,
  AboutLanguageItem,
  AboutProject,
  SharedProject,
  SharedProjectTechnologyGroup,
} from "@/lib/types";

export type Updater<T> = T | ((current: T) => T);

export function move<T>(items: T[], from: number, to: number) {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= items.length ||
    to >= items.length
  ) {
    return items;
  }

  const next = [...items];
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
}

export const clone = <T,>(value: T): T => structuredClone(value);
export const newId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;
export const newTempId = (prefix: string) => `tmp_${prefix}_${crypto.randomUUID()}`;

export const blankEducation = (): AboutEducationItem => ({
  period: "",
  degree: "",
  school: "",
  description: "",
  thesis: "",
  thesisUrl: "",
});

export const blankLanguage = (): AboutLanguageItem => ({
  id: newTempId("lang"),
  name: "",
  proficiency: "",
});

export const blankLocalizedProject = (): AboutProject => ({
  title: "",
  description: "",
  highlights: [],
  technologyCategories: {},
});

export const blankSharedProject = (): SharedProject => ({
  id: newTempId("project"),
  status: "Live",
  githubUrl: "",
  liveUrl: "",
  technologyGroups: [],
});

export const blankTechnologyGroup = (): SharedProjectTechnologyGroup => ({
  id: newTempId("project-tech"),
  items: [],
});
