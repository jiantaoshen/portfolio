import type { Locale } from "@/lib/locales";

export type { Locale } from "@/lib/locales";

export type SharedSkillGroup = {
  id: string;
  items: string[];
};

export type SharedSkills = {
  items: SharedSkillGroup[];
};

export type SharedProjectTechnologyGroup = {
  id: string;
  items: string[];
};

export type SharedProject = {
  id: string;
  status: string;
  githubUrl: string;
  liveUrl: string;
  technologyGroups: SharedProjectTechnologyGroup[];
};

export type SharedProjects = {
  items: SharedProject[];
};

export type AboutProject = {
  title: string;
  description: string;
  highlights?: string[];
  technologyCategories: Record<string, string>;
};

export type AboutLanguageItem = {
  id: string;
  name: string;
  proficiency?: string;
};

export type AboutEducationItem = {
  period: string;
  degree: string;
  school: string;
  description: string;
  thesis?: string;
  thesisUrl?: string;
};

export type AboutContent = {
  hero: {
    titleBefore: string;
    titleHighlight: string;
  };
  about: {
    description: string;
  };
  projects: {
    title: string;
    items: Record<string, AboutProject>;
  };
  skills: {
    title: string;
    categories: Record<string, string>;
  };
  languages: {
    title: string;
    items: AboutLanguageItem[];
  };
  education: {
    title: string;
    items: AboutEducationItem[];
  };
};

export type AboutByLocale = Record<Locale, AboutContent>;
export type CareerSnapshot = {
  about: AboutByLocale;
  skills: SharedSkills;
  projects: SharedProjects;
};
