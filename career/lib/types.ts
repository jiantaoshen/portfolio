import type { Locale } from "@/lib/locales";

export type { Locale } from "@/lib/locales";

export type DashboardMode = "trial" | "admin";

export type AboutSkillGroup = {
  title: string;
  items: string[];
};

export type AboutEducationItem = {
  period: string;
  degree: string;
  school: string;
  description: string;
  thesis?: string;
  thesisUrl?: string;
};

export type AboutProject = {
  title: string;
  description: string;
  status: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
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
    items: AboutProject[];
  };

  skills: {
    title: string;
    items: AboutSkillGroup[];
  };

  education: {
    title: string;
    items: AboutEducationItem[];
  };
};

export type AboutByLocale = Record<Locale, AboutContent>;

export type CareerSnapshot = {
  about: AboutByLocale;
};
