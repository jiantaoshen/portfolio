import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

import type { Locale } from "@/i18n/routing";
import {
  projectSchema,
  type ProjectData,
} from "@/lib/content/project-schema";

export interface ProjectEntry {
  id: string;
  data: ProjectData;
  content: string;
}

const projectsDirectory = path.join(
  process.cwd(),
  "content",
  "projects",
);

async function getMarkdownFiles(
  directory: string,
): Promise<string[]> {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(
        directory,
        entry.name,
      );

      if (entry.isDirectory()) {
        return getMarkdownFiles(fullPath);
      }

      if (
        entry.isFile() &&
        /\.(md|mdx)$/.test(entry.name)
      ) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}

function filePathToId(
  filePath: string,
): string {
  return path
    .relative(
      projectsDirectory,
      filePath,
    )
    .replaceAll("\\", "/")
    .replace(/\.(md|mdx)$/, "");
}

export function getProjectSlug(
  id: string,
): string {
  const [, ...slugParts] = id.split("/");

  return slugParts.join("/");
}

export async function getProjects(): Promise<
  ProjectEntry[]
> {
  const files = await getMarkdownFiles(
    projectsDirectory,
  );

  const projects = await Promise.all(
    files.map(
      async (
        filePath,
      ): Promise<ProjectEntry> => {
        const source = await fs.readFile(
          filePath,
          "utf8",
        );

        const { data, content } =
          matter(source);

        const parsedData =
          projectSchema.parse(data);

        return {
          id: filePathToId(filePath),
          data: parsedData,
          content,
        };
      },
    ),
  );

  return projects;
}

export async function getFeaturedProjects(
  lang: Locale,
): Promise<ProjectEntry[]> {
  const projects = await getProjects();

  return projects
    .filter(
      (project) =>
        project.data.lang === lang &&
        !project.data.draft,
    )
    .sort(
      (a, b) =>
        a.data.order -
        b.data.order,
    )
    .slice(0, 3);
}

export async function getProject(
  lang: Locale,
  slug: string[],
): Promise<ProjectEntry | null> {
  const projects = await getProjects();
  const id = [lang, ...slug].join("/");

  return (
    projects.find(
      (project) =>
        project.id === id &&
        project.data.lang === lang &&
        !project.data.draft,
    ) ?? null
  );
}