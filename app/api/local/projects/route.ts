import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { hasLocale } from "next-intl";
import { NextResponse } from "next/server";

import type { Project } from "@/career/lib/types";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

export const runtime = "nodejs";

const projectsRoot = path.resolve(
  process.cwd(),
  "content",
  "projects",
);

function developmentOnly() {
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  return NextResponse.json(
    {
      error: "Local content editing is disabled in production.",
    },
    {
      status: 403,
    },
  );
}

function normalizeSlug(slug: string) {
  return slug
    .trim()
    .replaceAll("\\", "/")
    .replace(/^\/+|\/+$/g, "");
}

function resolveInsideProjects(relativePath: string) {
  const resolved = path.resolve(
    projectsRoot,
    relativePath,
  );

  const relative = path.relative(
    projectsRoot,
    resolved,
  );

  if (
    relative.startsWith("..") ||
    path.isAbsolute(relative)
  ) {
    throw new Error("Invalid project path.");
  }

  return resolved;
}

function projectSourceId(
  language: Locale,
  slug: string,
) {
  return `${language}/${slug}`;
}

function projectFilePath(
  language: Locale,
  slug: string,
) {
  return resolveInsideProjects(
    path.join(
      language,
      `${slug}.md`,
    ),
  );
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findSourceFile(sourceId: string) {
  if (
    !sourceId ||
    sourceId.startsWith("new/")
  ) {
    return null;
  }

  const normalized = sourceId
    .replaceAll("\\", "/")
    .replace(/^\/+|\/+$/g, "");

  const markdownPath = resolveInsideProjects(
    `${normalized}.md`,
  );

  if (await fileExists(markdownPath)) {
    return markdownPath;
  }

  const mdxPath = resolveInsideProjects(
    `${normalized}.mdx`,
  );

  if (await fileExists(mdxPath)) {
    return mdxPath;
  }

  return null;
}

function validateProject(
  value: unknown,
): asserts value is Project {
  if (
    !value ||
    typeof value !== "object"
  ) {
    throw new Error(
      "Invalid project payload.",
    );
  }

  const project = value as Partial<Project>;

  if (
    typeof project.title !== "string" ||
    !project.title.trim()
  ) {
    throw new Error(
      "Project title is required.",
    );
  }

  if (
    typeof project.slug !== "string" ||
    !project.slug.trim()
  ) {
    throw new Error(
      "Project slug is required.",
    );
  }

  if (
    typeof project.language !== "string" ||
    !hasLocale(
      routing.locales,
      project.language,
    )
  ) {
    throw new Error(
      "Invalid project language.",
    );
  }

  if (
    typeof project.summary !== "string"
  ) {
    throw new Error(
      "Project summary is invalid.",
    );
  }

  if (
    typeof project.contentMarkdown !==
    "string"
  ) {
    throw new Error(
      "Project Markdown content is invalid.",
    );
  }

  if (
    typeof project.status !== "string"
  ) {
    throw new Error(
      "Project status is invalid.",
    );
  }

  if (
    !Array.isArray(
      project.technologies,
    )
  ) {
    throw new Error(
      "Project technologies are invalid.",
    );
  }

  if (
    typeof project.sortOrder !==
      "number" ||
    !Number.isFinite(
      project.sortOrder,
    )
  ) {
    throw new Error(
      "Project display order is invalid.",
    );
  }
}

export async function PUT(
  request: Request,
) {
  const blocked = developmentOnly();

  if (blocked) {
    return blocked;
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON body.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    validateProject(payload);

    const project = payload;

    const slug = normalizeSlug(
      project.slug,
    );

    if (!slug) {
      throw new Error(
        "Project slug is required.",
      );
    }

    const sourceId = projectSourceId(
      project.language,
      slug,
    );

    const targetPath = projectFilePath(
      project.language,
      slug,
    );

    const links: {
      github?: string;
      live?: string;
    } = {};

    if (project.githubUrl.trim()) {
      links.github =
        project.githubUrl.trim();
    }

    if (project.demoUrl.trim()) {
      links.live =
        project.demoUrl.trim();
    }

    const frontmatter = {
      lang: project.language,
      title: project.title.trim(),
      description:
        project.summary.trim(),
      status: project.status.trim(),
      order: Math.trunc(
        project.sortOrder,
      ),
      technologies:
        project.technologies
          .map((item) => item.trim())
          .filter(Boolean),
      ...(Object.keys(links).length >
      0
        ? {
            links,
          }
        : {}),
      draft: !project.published,
    };

    const body =
      project.contentMarkdown.replace(
        /\s+$/,
        "",
      );

    const markdown = matter.stringify(
      body ? `${body}\n` : "",
      frontmatter,
    );

    await fs.mkdir(
      path.dirname(targetPath),
      {
        recursive: true,
      },
    );

    const previousPath =
      await findSourceFile(
        project.sourceId,
      );

    await fs.writeFile(
      targetPath,
      markdown,
      "utf8",
    );

    if (
      previousPath &&
      path.resolve(previousPath) !==
        path.resolve(targetPath)
    ) {
      await fs.unlink(previousPath);
    }

    const saved: Project = {
      ...project,
      id: `project:${sourceId}`,
      sourceId,
      slug,
      title: project.title.trim(),
      summary: project.summary.trim(),
      status: project.status.trim(),
      technologies:
        frontmatter.technologies,
      githubUrl: links.github ?? "",
      demoUrl: links.live ?? "",
      sortOrder: frontmatter.order,
    };

    return NextResponse.json(saved);
  } catch (error) {
    console.error(
      "Failed to save project:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save project.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(
  request: Request,
) {
  const blocked = developmentOnly();

  if (blocked) {
    return blocked;
  }

  const { searchParams } = new URL(
    request.url,
  );

  const sourceId =
    searchParams.get("sourceId");

  if (!sourceId) {
    return NextResponse.json(
      {
        error:
          "sourceId is required.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    sourceId.startsWith("new/")
  ) {
    return new Response(null, {
      status: 204,
    });
  }

  try {
    const filePath =
      await findSourceFile(sourceId);

    if (!filePath) {
      return NextResponse.json(
        {
          error:
            `Project source not found: ${sourceId}`,
        },
        {
          status: 404,
        },
      );
    }

    await fs.unlink(filePath);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error(
      "Failed to delete project:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete project.",
      },
      {
        status: 500,
      },
    );
  }
}