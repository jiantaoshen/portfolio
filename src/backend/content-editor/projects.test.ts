/*
    Test: Projects
    Test1: uses the ProjectContent default values
    Test2: rejects malformed Project content
    Test3: generates the expected project Markdown
    Test4: serializes empty technologies and omits empty links
    Test5: normalizes project body line endings
    Test6: updates an existing project at the same path
    Test7: renames a project when the slug changes
    Test8: moves a project when the locale changes
    Test9: rejects a duplicate destination path
    Test10: keeps the old file when writing the new file fails
    Test11: deletes an existing project file
    Test12: returns not found when the project file does not exist
    Test13: rejects deleting a project that has not been saved yet
*/

import fs from "node:fs/promises";
import path from "node:path";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  PROJECT_CONTENT_ROOT,
} from "./paths";

import {
  deleteProjectContent,
  parseProjectContent,
  saveProjectContent,
  serializeProjectContent,
} from "./projects";

import type {
  ProjectContent,
} from "./projects";

const TEST_ROOT = path.join(
  PROJECT_CONTENT_ROOT,
  "en",
  "__content-editor-test__",
);

const TEST_ROOTS = [
  "en",
  "sv",
  "zh",
].map((locale) =>
  path.join(
    PROJECT_CONTENT_ROOT,
    locale,
    "__content-editor-test__",
  ),
);

afterEach(async () => {
  await Promise.all(
    TEST_ROOTS.map((root) =>
      fs.rm(
        root,
        {
          recursive: true,
          force: true,
        },
      ),
    ),
  );
});

describe("parseProjectContent", () => {
  it("uses the ProjectContent default values", () => {
    const project = parseProjectContent({
      title: "Example",
      slug: "example",
      summary: "Example description.",
      status: "completed",
    });

    expect(project).toEqual({
      id: "",
      sourceId: "",
      language: "en",
      title: "Example",
      slug: "example",
      summary: "Example description.",
      contentMarkdown: "",
      status: "completed",
      technologies: [],
      githubUrl: "",
      demoUrl: "",
      published: false,
      sortOrder: 999,
    });
  });

  it("rejects malformed Project content", () => {
    expect(() =>
      parseProjectContent({
        title: "Example",
        slug: "example",
        summary: "Example description.",
        status: "completed",
        technologies: "Astro",
      }),
    ).toThrow(
      "Invalid Project content.",
    );
  });
});

describe("serializeProjectContent", () => {
  it("generates the expected project Markdown", () => {
    const project: ProjectContent = {
      id: "example-project",
      sourceId: "new/example-project",
      language: "en",
      title: "Example Project",
      slug: "example-project",
      summary: "An example project.",
      contentMarkdown: "# Overview\n\nProject body.",
      status: "completed",
      technologies: [
        "Astro",
        "TypeScript",
      ],
      githubUrl: "https://github.com/example/project",
      demoUrl: "https://example.com",
      published: true,
      sortOrder: 10,
    };

    const expected =
      "---\n" +
      "lang: en\n" +
      'title: "Example Project"\n' +
      'description: "An example project."\n' +
      'status: "completed"\n' +
      "order: 10\n" +
      "technologies:\n" +
      '  - "Astro"\n' +
      '  - "TypeScript"\n' +
      "links:\n" +
      '  github: "https://github.com/example/project"\n' +
      '  live: "https://example.com"\n' +
      "draft: false\n" +
      "---\n\n" +
      "# Overview\n\n" +
      "Project body.\n";

    expect(
      serializeProjectContent(project),
    ).toBe(
      expected,
    );
  });

  it("serializes empty technologies and omits empty links", () => {
    const project: ProjectContent = {
      id: "draft-project",
      sourceId: "new/draft-project",
      language: "sv",
      title: "Draft Project",
      slug: "draft-project",
      summary: "Draft description.",
      contentMarkdown: "Draft body.",
      status: "in-progress",
      technologies: [],
      githubUrl: "",
      demoUrl: "",
      published: false,
      sortOrder: 999,
    };

    const expected =
      "---\n" +
      "lang: sv\n" +
      'title: "Draft Project"\n' +
      'description: "Draft description."\n' +
      'status: "in-progress"\n' +
      "order: 999\n" +
      "technologies: []\n" +
      "draft: true\n" +
      "---\n\n" +
      "Draft body.\n";

    expect(
      serializeProjectContent(project),
    ).toBe(
      expected,
    );
  });

  it("normalizes project body line endings", () => {
    const project: ProjectContent = {
      id: "newline-project",
      sourceId: "new/newline-project",
      language: "en",
      title: "Newline Project",
      slug: "newline-project",
      summary: "Newline test.",
      contentMarkdown: "\r\n\r\nLine one.\r\nLine two.\r",
      status: "completed",
      technologies: [],
      githubUrl: "",
      demoUrl: "",
      published: true,
      sortOrder: 1,
    };

    const markdown = serializeProjectContent(
      project,
    );

    expect(
      markdown.endsWith(
        "---\n\nLine one.\nLine two.\n",
      ),
    ).toBe(
      true,
    );
  });
});

describe("saveProjectContent", () => {
  it("updates an existing project at the same path", async () => {
    const project: ProjectContent = {
      id: "same-path",
      sourceId: "en/__content-editor-test__/same-path.md",
      language: "en",
      title: "Updated Project",
      slug: "__content-editor-test__/same-path",
      summary: "Updated description.",
      contentMarkdown: "Updated body.",
      status: "completed",
      technologies: [],
      githubUrl: "",
      demoUrl: "",
      published: true,
      sortOrder: 1,
    };

    const targetPath = path.join(
      TEST_ROOT,
      "same-path.md",
    );

    await fs.mkdir(
      TEST_ROOT,
      {
        recursive: true,
      },
    );

    await fs.writeFile(
      targetPath,
      "old content",
      "utf8",
    );

    const saved = await saveProjectContent(
      project,
    );

    const content = await fs.readFile(
      targetPath,
      "utf8",
    );

    expect(content).toBe(
      serializeProjectContent(project),
    );

    expect(saved.sourceId).toBe(
      "en/__content-editor-test__/same-path.md",
    );
  });

  it("renames a project when the slug changes", async () => {
    const oldPath = path.join(
      TEST_ROOT,
      "old-name.md",
    );

    const newPath = path.join(
      TEST_ROOT,
      "new-name.md",
    );

    await fs.mkdir(
      TEST_ROOT,
      {
        recursive: true,
      },
    );

    await fs.writeFile(
      oldPath,
      "old content",
      "utf8",
    );

    const project: ProjectContent = {
      id: "rename-project",
      sourceId: "en/__content-editor-test__/old-name.md",
      language: "en",
      title: "Renamed Project",
      slug: "__content-editor-test__/new-name",
      summary: "Renamed description.",
      contentMarkdown: "Renamed body.",
      status: "completed",
      technologies: [],
      githubUrl: "",
      demoUrl: "",
      published: true,
      sortOrder: 1,
    };

    const saved = await saveProjectContent(
      project,
    );

    const newContent = await fs.readFile(
      newPath,
      "utf8",
    );

    expect(newContent).toBe(
      serializeProjectContent(project),
    );

    await expect(
      fs.access(oldPath),
    ).rejects.toThrow();

    expect(saved.sourceId).toBe(
      "en/__content-editor-test__/new-name.md",
    );
  });

  it("moves a project when the locale changes", async () => {
    const oldPath = path.join(
      PROJECT_CONTENT_ROOT,
      "en",
      "__content-editor-test__",
      "locale-move.md",
    );

    const newPath = path.join(
      PROJECT_CONTENT_ROOT,
      "sv",
      "__content-editor-test__",
      "locale-move.md",
    );

    await fs.mkdir(
      path.dirname(oldPath),
      {
        recursive: true,
      },
    );

    await fs.writeFile(
      oldPath,
      "old content",
      "utf8",
    );

    const project: ProjectContent = {
      id: "locale-move",
      sourceId: "en/__content-editor-test__/locale-move.md",
      language: "sv",
      title: "Locale Move",
      slug: "__content-editor-test__/locale-move",
      summary: "Moved to Swedish.",
      contentMarkdown: "Moved body.",
      status: "completed",
      technologies: [],
      githubUrl: "",
      demoUrl: "",
      published: true,
      sortOrder: 1,
    };

    const saved = await saveProjectContent(
      project,
    );

    const newContent = await fs.readFile(
      newPath,
      "utf8",
    );

    expect(newContent).toBe(
      serializeProjectContent(project),
    );

    await expect(
      fs.access(oldPath),
    ).rejects.toThrow();

    expect(saved.sourceId).toBe(
      "sv/__content-editor-test__/locale-move.md",
    );
  });

  it("rejects a duplicate destination path", async () => {
    const sourcePath = path.join(
      PROJECT_CONTENT_ROOT,
      "en",
      "__content-editor-test__",
      "source.md",
    );

    const targetPath = path.join(
      PROJECT_CONTENT_ROOT,
      "en",
      "__content-editor-test__",
      "existing.md",
    );

    await fs.mkdir(
      path.dirname(sourcePath),
      {
        recursive: true,
      },
    );

    await fs.writeFile(
      sourcePath,
      "source content",
      "utf8",
    );

    await fs.writeFile(
      targetPath,
      "existing content",
      "utf8",
    );

    const project: ProjectContent = {
      id: "collision-project",
      sourceId: "en/__content-editor-test__/source.md",
      language: "en",
      title: "Collision Project",
      slug: "__content-editor-test__/existing",
      summary: "Collision test.",
      contentMarkdown: "New body.",
      status: "completed",
      technologies: [],
      githubUrl: "",
      demoUrl: "",
      published: true,
      sortOrder: 1,
    };

    await expect(
      saveProjectContent(project),
    ).rejects.toThrow(
      "Another content file already uses this language and slug.",
    );

    const sourceContent = await fs.readFile(
      sourcePath,
      "utf8",
    );

    const targetContent = await fs.readFile(
      targetPath,
      "utf8",
    );

    expect(sourceContent).toBe(
      "source content",
    );

    expect(targetContent).toBe(
      "existing content",
    );
  });

  it("keeps the old file when writing the new file fails", async () => {
    const oldPath = path.join(
      PROJECT_CONTENT_ROOT,
      "en",
      "__content-editor-test__",
      "safe-move.md",
    );

    const newPath = path.join(
      PROJECT_CONTENT_ROOT,
      "sv",
      "__content-editor-test__",
      "safe-move.md",
    );

    const tempPath = `${newPath}.tmp`;

    await fs.mkdir(
      path.dirname(oldPath),
      {
        recursive: true,
      },
    );

    await fs.mkdir(
      path.dirname(newPath),
      {
        recursive: true,
      },
    );

    await fs.writeFile(
      oldPath,
      "original content",
      "utf8",
    );

    await fs.mkdir(
      tempPath,
      {
        recursive: true,
      },
    );

    const project: ProjectContent = {
      id: "safe-move",
      sourceId: "en/__content-editor-test__/safe-move.md",
      language: "sv",
      title: "Safe Move",
      slug: "__content-editor-test__/safe-move",
      summary: "Write failure test.",
      contentMarkdown: "New content.",
      status: "completed",
      technologies: [],
      githubUrl: "",
      demoUrl: "",
      published: true,
      sortOrder: 1,
    };

    await expect(
      saveProjectContent(project),
    ).rejects.toThrow();

    const oldContent = await fs.readFile(
      oldPath,
      "utf8",
    );

    expect(oldContent).toBe(
      "original content",
    );

    await expect(
      fs.access(newPath),
    ).rejects.toThrow();
  });
});

describe("deleteProjectContent", () => {
  it("deletes an existing project file", async () => {
    const targetPath = path.join(
      PROJECT_CONTENT_ROOT,
      "en",
      "__content-editor-test__",
      "delete-me.md",
    );

    await fs.mkdir(
      path.dirname(targetPath),
      {
        recursive: true,
      },
    );

    await fs.writeFile(
      targetPath,
      "content",
      "utf8",
    );

    await deleteProjectContent(
      "en/__content-editor-test__/delete-me.md",
    );

    await expect(
      fs.access(targetPath),
    ).rejects.toThrow();
  });

  it("returns not found when the project file does not exist", async () => {
    await expect(
      deleteProjectContent(
        "en/__content-editor-test__/missing.md",
      ),
    ).rejects.toMatchObject({
      status: 404,
      message: "The source Markdown file does not exist.",
    });
  });

  it("rejects deleting a project that has not been saved yet", async () => {
    await expect(
      deleteProjectContent(
        "new/example-project",
      ),
    ).rejects.toMatchObject({
      status: 400,
      message: "This item has not been saved to a source file yet.",
    });
  });
});