/*
  Feat: About Page's story, skill and education creation, modification and delete
  Export interface: AboutContent, AboutStory, AboutSkills, AboutSkillGroup, AboutEducation, AboutEducationItem 
  Export Function: parseAboutContent, validateAboutContent, serializeAboutContent, saveAboutContent

*/

import fs from "node:fs/promises";
import path from "node:path";

import {badRequest} from "./errors";

import {LOCALE_CONTENT_ROOT,resolveSafePath} from "./paths";

import {writeFileAtomic} from "./file-system";

import type {SupportedLocale} from "./validation";

export interface AboutContent {
  story: AboutStory;
  skills: AboutSkills;
  education: AboutEducation;
}

export interface AboutStory {
  title: string;
  paragraphs: string[];
}

export interface AboutSkills {
  title: string;
  description: string;
  items: AboutSkillGroup[];
}

export interface AboutSkillGroup {
  title: string;
  items: string[];
}

export interface AboutEducation {
  title: string;
  description: string;
  items: AboutEducationItem[];
}

export interface AboutEducationItem {
  period: string;
  degree: string;
  school: string;
  description?: string;
  thesis?: string;
  thesisUrl?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readString(object: Record<string, unknown>,key: string): string {
  const value = object[key];

  if (value === undefined) {
    return "";
  }

  if (typeof value !== "string") {
    throw badRequest(
      "Invalid About content.",
    );
  }

  return value;
}

function readStringArray(object: Record<string, unknown>, key: string): string[] {
  const value = object[key];

  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || 
    !value.every((item) => typeof item === "string")
  ) {
    throw badRequest(
      "Invalid About content.",
    );
  }

  return value;
}

function readOptionalString(object: Record<string, unknown>,key: string): string | undefined {
  const value = object[key];

  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw badRequest(
      "Invalid About content.",
    );
  }

  return value;
}

export function parseAboutContent(value: unknown,): AboutContent {
  if (!isRecord(value)) {
    throw badRequest(
      "Invalid About content.",
    );
  }

  const storyValue = value.story;
  const skillsValue = value.skills;
  const educationValue = value.education;

  if (
    !isRecord(storyValue) ||
    !isRecord(skillsValue) ||
    !isRecord(educationValue)
  ) {
    throw badRequest(
      "Invalid About content.",
    );
  }

  const story: AboutStory = {
    title: readString(
      storyValue,
      "title",
    ),
    paragraphs: readStringArray(
      storyValue,
      "paragraphs",
    ),
  };

  const skillsItemsValue =
    skillsValue.items;

  if (
    skillsItemsValue !== undefined &&
    !Array.isArray(skillsItemsValue)
  ) {
    throw badRequest(
      "Invalid About content.",
    );
  }

  const skills: AboutSkills = {
    title: readString(
      skillsValue,
      "title",
    ),
    description: readString(
      skillsValue,
      "description",
    ),
    items: (
      (skillsItemsValue ?? []) as unknown[]
    ).map(parseSkillGroup),
  };

  const educationItemsValue =
    educationValue.items;

  if (
    educationItemsValue !== undefined &&
    !Array.isArray(educationItemsValue)
  ) {
    throw badRequest(
      "Invalid About content.",
    );
  }

  const education: AboutEducation = {
    title: readString(
      educationValue,
      "title",
    ),
    description: readString(
      educationValue,
      "description",
    ),
    items: (
      (educationItemsValue ?? []) as unknown[]
    ).map(parseEducationItem),
  };

  const content: AboutContent = {
    story,
    skills,
    education,
  };

  validateAboutContent(content);

  return content;
}

function parseSkillGroup(value: unknown): AboutSkillGroup {
  if (!isRecord(value)) {
    throw badRequest("Invalid About content.");
  }

  return {
    title: readString(value, "title"),
    items: readStringArray(value,"items")
  };
}

function parseEducationItem(value: unknown,): AboutEducationItem {
  if (!isRecord(value)) {
    throw badRequest("Invalid About content.");
  }

  return {
    period: readString(value,"period"),
    degree: readString(value,"degree"),
    school: readString(value,"school"),
    description: readOptionalString(value,"description"),
    thesis: readOptionalString(value,"thesis"),
    thesisUrl: readOptionalString(value,"thesisUrl"),
  };
}

export function validateAboutContent(content: AboutContent): void {
  if (content.story.title.trim() === "") {
    throw badRequest(
      "Story title is required.",
    );
  }

  if (content.skills.title.trim() === "") {
    throw badRequest(
      "Skills title is required.",
    );
  }

  if (
    content.education.title.trim() === ""
  ) {
    throw badRequest(
      "Education title is required.",
    );
  }

  if (
    content.story.paragraphs.length > 20
  ) {
    throw badRequest(
      "Too many story paragraphs.",
    );
  }

  if (
    content.skills.items.length > 30
  ) {
    throw badRequest(
      "Too many skill groups.",
    );
  }

  if (
    content.education.items.length > 30
  ) {
    throw badRequest(
      "Too many education entries.",
    );
  }
}

export function serializeAboutContent(content: AboutContent): string {
  return `${JSON.stringify(
    content,
    null,
    2,
  )}\n`;
}

export async function saveAboutContent(locale: SupportedLocale,content: AboutContent): Promise<AboutContent> {
  validateAboutContent(content);

  const targetPath = resolveSafePath(
    LOCALE_CONTENT_ROOT,
    path.join(
      locale,
      "about.json",
    ),
  );

  await fs.mkdir(
    path.dirname(targetPath),
    {
      recursive: true,
    },
  );

  const json = serializeAboutContent(content);

  await writeFileAtomic(targetPath, json);

  return content;
}