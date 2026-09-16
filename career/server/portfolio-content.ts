import "server-only";

import {
  getProjects,
  getProjectSlug,
} from "@/lib/content/projects";

import type {
  PortfolioContent,
  Project,
} from "../lib/types";

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const projectEntries =
    await getProjects();

  const projects: Project[] =
    projectEntries.map(
      (entry) => {
        const { data } = entry;

        return {
          id: `project:${entry.id}`,

          sourceId:
            entry.id,

          language:
            data.lang,

          title:
            data.title,

          slug:
            getProjectSlug(
              entry.id,
            ),

          summary:
            data.description,

          contentMarkdown:
            entry.content,

          status:
            data.status,

          technologies:
            data.technologies,

          githubUrl:
            data.links?.github ??
            "",

          demoUrl:
            data.links?.live ??
            "",

          published:
            !data.draft,

          sortOrder:
            data.order,
        };
      },
    );

  return {
    projects,
  };
}