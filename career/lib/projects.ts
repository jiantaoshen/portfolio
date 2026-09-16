import type {
  Locale,
  Project,
} from "./types"

export function emptyProject(
  language: Locale,
  sortOrder: number,
): Project {
  return {
    id: crypto.randomUUID(),
    sourceId: "new/local",
    language,
    title: "New project",
    slug: `project-${Date.now()}`,
    summary: "",
    contentMarkdown:
      "## Overview\n\nDescribe the project here.",
    status: "In development",
    technologies: [
      "ASP.NET Core",
    ],
    githubUrl: "",
    demoUrl: "",
    published: false,
    sortOrder,
  }
}

export function getProjectsByLocale(
  projects: Project[],
  locale: Locale,
) {
  return projects
    .filter(
      (project) =>
        project.language === locale,
    )
    .sort((a, b) => {
      if (
        a.sortOrder !==
        b.sortOrder
      ) {
        return (
          a.sortOrder -
          b.sortOrder
        )
      }

      return a.title.localeCompare(
        b.title,
      )
    })
}

export function getNextProjectSortOrder(
  projects: Project[],
  locale: Locale,
) {
  const localeProjects =
    getProjectsByLocale(
      projects,
      locale,
    )

  if (
    localeProjects.length === 0
  ) {
    return 1
  }

  return (
    Math.max(
      ...localeProjects.map(
        (project) =>
          project.sortOrder,
      ),
    ) + 1
  )
}