/*
  Feat: Project content creation, modification, rename, locale move and delete
  Export Interface: ProjectContent
  Export Function: parseProjectContent, validateProjectContent, serializeProjectContent, saveProjectContent, deleteProjectContent

*/

import fs from "node:fs/promises";
import path from "node:path";

import {badRequest,notFound} from "./errors";

import {PROJECT_CONTENT_ROOT,resolveSafePath} from "./paths";

import {deleteFileIfExists,writeFileAtomic} from "./file-system";

import {isSupportedLocale,isValidOptionalHttpUrl,normalizeProjectSlug} from "./validation";

import type {SupportedLocale} from "./validation";

export interface ProjectContent {
  id: string;
  sourceId: string;
  language: string;
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  status: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  published: boolean;
  sortOrder: number;
}

function isRecord(value: unknown): value is Record<string,unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readString(object: Record<string,unknown>,key: string,defaultValue = ""): string {
  const value = object[key];

  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "string") {
    throw badRequest(
      "Invalid Project content.",
    );
  }

  return value;
}

function readBoolean(object: Record<string,unknown>,key: string,defaultValue = false): boolean {
  const value = object[key];

  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "boolean") {
    throw badRequest(
      "Invalid Project content.",
    );
  }

  return value;
}

function readNumber(object: Record<string,unknown>,key: string,defaultValue: number): number {
  const value = object[key];

  if (value === undefined) {
    return defaultValue;
  }

  if (
    typeof value !== "number" ||
    !Number.isInteger(value)
  ) {
    throw badRequest(
      "Invalid Project content.",
    );
  }

  return value;
}

function readStringArray(object: Record<string,unknown>,key: string): string[] {
  const value = object[key];

  if (value === undefined) {
    return [];
  }

  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === "string")
  ) {
    throw badRequest(
      "Invalid Project content.",
    );
  }

  return value;
}

export function parseProjectContent(value: unknown): ProjectContent {
  if (!isRecord(value)) {
    throw badRequest(
      "Invalid Project content.",
    );
  }

  const project: ProjectContent = {
    id: readString(value,"id"),
    sourceId: readString(value,"sourceId"),
    language: readString(value,"language","en"),
    title: readString(value,"title"),
    slug: readString(value,"slug"),
    summary: readString(value,"summary"),
    contentMarkdown: readString(value,"contentMarkdown"),
    status: readString(value,"status"),
    technologies: readStringArray(value,"technologies"),
    githubUrl: readString(value,"githubUrl"),
    demoUrl: readString(value,"demoUrl"),
    published: readBoolean(value,"published"),
    sortOrder: readNumber(value,"sortOrder",999),
  };

  validateProjectContent(project);

  return project;
}

function normalizeLocale(locale: string): SupportedLocale {
  const normalized = locale.toLowerCase();

  if (!isSupportedLocale(normalized)) {
    throw badRequest(
      "Locale must be en, sv or zh.",
    );
  }

  return normalized;
}

function getTargetMarkdownPath(locale: string,slug: string): string {
  const normalizedLocale = normalizeLocale(locale);

  const normalizedSlug = normalizeProjectSlug(slug);

  return resolveSafePath(
    PROJECT_CONTENT_ROOT,
    path.join(
      normalizedLocale,
      `${normalizedSlug}.md`,
    ),
  );
}

function getExistingSourcePath(sourceId: string): string | null {
  if (
    sourceId.trim() === "" ||
    sourceId.toLowerCase().startsWith("new/")
  ) {
    return null;
  }

  let normalized = sourceId
    .replaceAll("/", path.sep)
    .replaceAll("\\", path.sep);

  if (!normalized.toLowerCase().endsWith(".md")) {
    normalized += ".md";
  }

  return resolveSafePath(
    PROJECT_CONTENT_ROOT,
    normalized,
  );
}

function pathsEqual(left: string,right: string): boolean {
  const leftPath = path.resolve(left);

  const rightPath = path.resolve(right);

  if (process.platform === "win32") {
    return leftPath.toLowerCase() === rightPath.toLowerCase();
  }

  return leftPath === rightPath;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);

    return true;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }

    throw error;
  }
}

async function ensureNoCollision(sourcePath: string | null,targetPath: string): Promise<void> {
  if (!(await fileExists(targetPath))) {
    return;
  }

  if (
    sourcePath !== null &&
    pathsEqual(sourcePath,targetPath)
  ) {
    return;
  }

  throw badRequest(
    "Another content file already uses this language and slug.",
  );
}

function toSourceId(fullPath: string): string {
  return path
    .relative(
      PROJECT_CONTENT_ROOT,
      fullPath,
    )
    .split(path.sep)
    .join("/");
}

function yamlString(value: string): string {
  return JSON.stringify(value ?? "");
}

function appendList(key: string,values: readonly string[]): string {
  if (values.length === 0) {
    return `${key}: []\n`;
  }

  let result = `${key}:\n`;

  for (const value of values) {
    result += `  - ${yamlString(value)}\n`;
  }

  return result;
}

function normalizeBody(body: string): string {
  const normalized = (body ?? "")
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replace(/^\n+/, "");

  if (normalized.endsWith("\n")) {
    return normalized;
  }

  return `${normalized}\n`;
}

export function validateProjectContent(project: ProjectContent): void {
  normalizeLocale(project.language);

  normalizeProjectSlug(project.slug);

  if (project.title.trim() === "") {
    throw badRequest(
      "Project title is required.",
    );
  }

  if (project.summary.trim() === "") {
    throw badRequest(
      "Project description is required.",
    );
  }

  if (project.status.trim() === "") {
    throw badRequest(
      "Project status is required.",
    );
  }

  if (project.technologies.length > 50) {
    throw badRequest(
      "Too many project technologies.",
    );
  }

  if (!isValidOptionalHttpUrl(project.githubUrl)) {
    throw badRequest(
      "GitHub URL must be an absolute http/https URL.",
    );
  }

  if (!isValidOptionalHttpUrl(project.demoUrl)) {
    throw badRequest(
      "Live URL must be an absolute http/https URL.",
    );
  }
}

export function serializeProjectContent(project: ProjectContent): string {
  let markdown = "---\n";

  markdown += `lang: ${normalizeLocale(project.language)}\n`;

  markdown += `title: ${yamlString(project.title)}\n`;

  markdown += `description: ${yamlString(project.summary)}\n`;

  markdown += `status: ${yamlString(project.status)}\n`;

  markdown += `order: ${project.sortOrder}\n`;

  markdown += appendList(
    "technologies",
    project.technologies,
  );

  if (
    project.githubUrl.trim() !== "" ||
    project.demoUrl.trim() !== ""
  ) {
    markdown += "links:\n";

    if (project.githubUrl.trim() !== "") {
      markdown += `  github: ${yamlString(project.githubUrl)}\n`;
    }

    if (project.demoUrl.trim() !== "") {
      markdown += `  live: ${yamlString(project.demoUrl)}\n`;
    }
  }

  markdown += `draft: ${project.published ? "false" : "true"}\n`;

  markdown += "---\n\n";

  markdown += normalizeBody(project.contentMarkdown);

  return markdown;
}

export async function saveProjectContent(project: ProjectContent): Promise<ProjectContent> {
  validateProjectContent(project);

  const targetPath = getTargetMarkdownPath(
    project.language,
    project.slug,
  );

  const sourcePath = getExistingSourcePath(
    project.sourceId,
  );

  await ensureNoCollision(
    sourcePath,
    targetPath,
  );

  await fs.mkdir(
    path.dirname(targetPath),
    {
      recursive: true,
    },
  );

  const markdown = serializeProjectContent(project);

  await writeFileAtomic(
    targetPath,
    markdown,
  );

  if (
    sourcePath !== null &&
    !pathsEqual(sourcePath,targetPath)
  ) {
    await deleteFileIfExists(sourcePath);
  }

  project.sourceId = toSourceId(targetPath);

  return project;
}

export async function deleteProjectContent(sourceId: string): Promise<void> {
  const sourcePath = getExistingSourcePath(sourceId);

  if (sourcePath === null) {
    throw badRequest(
      "This item has not been saved to a source file yet.",
    );
  }

  const deleted = await deleteFileIfExists(sourcePath);

  if (!deleted) {
    throw notFound(
      "The source Markdown file does not exist.",
    );
  }
}