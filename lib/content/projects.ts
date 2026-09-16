import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import type { Locale } from "@/i18n";

import {
  projectSchema,
  type ProjectData,
} from "@/lib/content/project-schema";

/* ============================================================
   Types
   ============================================================ */

export interface ProjectEntry {
  id: string;

  data: ProjectData;

  /**
   * Markdown body without frontmatter.
   */
  content: string;
}


/* ============================================================
   Paths
   ============================================================ */

/**
 * Next project structure:
 *
 * content/
 * └── projects/
 *     ├── en/
 *     ├── sv/
 *     └── zh/
 */
const projectsDirectory = path.join(
  process.cwd(),
  "content",
  "projects",
);


/* ============================================================
   File helpers
   ============================================================ */

async function getMarkdownFiles(
  directory: string,
): Promise<string[]> {
  const entries = await fs.readdir(
    directory,
    {
      withFileTypes: true,
    },
  );

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(
        directory,
        entry.name,
      );

      if (entry.isDirectory()) {
        return getMarkdownFiles(
          fullPath,
        );
      }

      if (
        entry.isFile() &&
        /\.(md|mdx)$/.test(
          entry.name,
        )
      ) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}


/**
 * Example:
 *
 * content/projects/sv/light-manager.md
 *
 * becomes:
 *
 * sv/light-manager
 */
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


/* ============================================================
   Slug helpers
   ============================================================ */

/**
 * Remove the locale part from a project id.
 *
 * Example:
 *
 * sv/light-manager
 * ->
 * light-manager
 *
 * sv/backend/light-manager
 * ->
 * backend/light-manager
 */
export function getProjectSlug(
  id: string,
): string {
  const [, ...slugParts] =
    id.split("/");

  return slugParts.join("/");
}


/* ============================================================
   Project queries
   ============================================================ */

/**
 * Read all projects.
 *
 * Includes:
 * - all locales
 * - draft projects
 *
 * Usually other helper functions should be preferred
 * instead of calling this directly from components.
 */
export async function getProjects(): Promise<
  ProjectEntry[]
> {
  const files =
    await getMarkdownFiles(
      projectsDirectory,
    );

  const projects =
    await Promise.all(
      files.map(
        async (
          filePath,
        ): Promise<ProjectEntry> => {
          const source =
            await fs.readFile(
              filePath,
              "utf8",
            );

          const {
            data,
            content,
          } = matter(source);

          /**
           * Validate frontmatter and apply
           * defaults from projectSchema.
           */
          const parsedData =
            projectSchema.parse(
              data,
            );

          return {
            id: filePathToId(
              filePath,
            ),

            data: parsedData,

            content,
          };
        },
      ),
    );

  return projects;
}


/**
 * Projects shown on the landing page.
 *
 * Rules:
 * - correct language
 * - not draft
 * - sorted by order
 * - only first 3
 */
export async function getFeaturedProjects(lang: Locale): Promise<ProjectEntry[]> {
  const projects = await getProjects();

  return projects
    .filter(
      (project) =>
        project.data.lang ===
          lang &&
        !project.data.draft,
    )
    .sort(
      (a, b) =>
        a.data.order -
        b.data.order,
    )
    .slice(0, 3);
}


/**
 * Find one project from the URL.
 *
 * Example URL:
 *
 * /sv/projects/light-manager
 *
 * lang:
 * "sv"
 *
 * slug:
 * ["light-manager"]
 *
 * project id:
 * "sv/light-manager"
 *
 *
 * Nested example:
 *
 * /sv/projects/backend/light-manager
 *
 * slug:
 * ["backend", "light-manager"]
 *
 * project id:
 * "sv/backend/light-manager"
 */
export async function getProject(
  lang: Locale,
  slug: string[],
): Promise<ProjectEntry | null> {
  const projects =
    await getProjects();

  const id = [
    lang,
    ...slug,
  ].join("/");

  return (
    projects.find(
      (project) =>
        project.id === id &&
        project.data.lang ===
          lang &&
        !project.data.draft,
    ) ?? null
  );
}