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
  id: string;
  title: string;
  status: string;
  description: string;

  technologies?: string[];

  overview: string;
  problem: string;
  solution: string;

  features?: DetailItem[];
  challenges?: DetailItem[];

  deployment: string;

  links?: ProjectLinks;
};

export type BlogPost = {
  id: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
};

export type AboutTranslation = {
  hero: {
    title: string;
    description: string;
  };

  story: {
    title: string;
    paragraphs: string[];
  };

  skills: {
    title: string;
    description: string;
    items: SkillGroup[];
  };

  education: {
    title: string;
    description: string;
    items: {
      period: string;
      degree: string;
      school: string;
      description?: string;
      thesis?: string;
    }[];
  };
};

export type HomeTranslation = {
  hero: {
    titleBefore: string;
    titleHighlight: string;
    description: string;
  };

  featuredProjects: {
    title: string;
    description: string;
    viewAll: string;
  };

  technicalNotes: {
    title: string;
    description: string;
    viewAll: string;
  };

  contact: {
    title: string;
    description: string;
  };
};

export type ProjectTranslation = {
  page: {
    title: string;
    description: string;
  };

  detail: {
    back: string;
    technologies: string;
    status: string;
    type: string;
  };
};

export type BlogTranslation = {
  hero: {
    title: string;
    description: string;
  };

  posts: {
    title: string;
    description: string;
  };

  pagination: {
    previous: string;
    next: string;
    page: string;
  };
};

export type CommonTranslation = {
  nav: {
    about: string;
    projects: string;
    contact: string;
  };

  buttons: {
    discussProject: string;
    viewWork: string;
    downloadCV: string;
    caseStudy: string;
    liveDemo: string;
    github: string;
  };

  readArticle: string;
  rights: string;
};

