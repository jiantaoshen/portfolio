export type SkillGroup = {
  title: string;
  items: string[];
};

export type DetailItem = {
  title: string;
  description: string;
};

export type ProjectLinks = {
  github?: string;
  live?: string;
};

export type ProjectItem = {
  slug: string;
  title: string;
  status: string;
  description: string;
  technologies?: string[];
  links?: ProjectLinks;
};

export type EducationItem = {
      period: string;
      degree: string;
      school: string;
      description?: string;

      thesis?: string;
      thesisUrl?: string;
};

export type AboutTranslation = {
  hero: {
    titleBefore: string;
    titleHighlight: string;
  };

  about: {
    introduction: string;
    description: string;
  };

  projects: {
    title: string;
  };

  skills: {
    title: string;
    items: SkillGroup[];
  };

  education: {
    title: string;
    items: EducationItem[];
  };
};

export type ProjectTranslation = {
  detail: {
    back: string;
    technologies: string;
    status: string;
    type: string;
  };
};

export type CommonTranslation = {
  buttons: {
    linkedin: string;
    github: string;
    caseStudy: string;
    liveDemo: string;
  };

  language: {
    english: string;
    swedish: string;
    chinese: string;
  };

  rights: string;

  notFound: {
    title: string;
    description: string;
    home: string;
  };
};