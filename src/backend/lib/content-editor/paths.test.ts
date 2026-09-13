import { describe, expect, it } from "vitest";

import {
  PROJECT_CONTENT_ROOT,
  resolveSafePath,
} from "./paths";

describe("resolveSafePath", () => {
  it("allows paths inside the content root", () => {
    const result = resolveSafePath(
      PROJECT_CONTENT_ROOT,
      "en/my-project.md",
    );

    expect(result).toContain(
      "src",
    );

    expect(result).toContain(
      "content",
    );

    expect(result).toContain(
      "projects",
    );
  });

  it("allows nested project paths", () => {
    const result = resolveSafePath(
      PROJECT_CONTENT_ROOT,
      "frontend/my-project.md",
    );

    expect(result).toContain(
      "frontend",
    );
  });

  it("rejects parent directory traversal", () => {
    expect(() =>
      resolveSafePath(
        PROJECT_CONTENT_ROOT,
        "../secret.md",
      ),
    ).toThrow(
      "Path escapes the allowed content directory.",
    );
  });

  it("rejects deeply nested traversal", () => {
    expect(() =>
      resolveSafePath(
        PROJECT_CONTENT_ROOT,
        "../../../../.env",
      ),
    ).toThrow(
      "Path escapes the allowed content directory.",
    );
  });

  it("rejects traversal after a valid segment", () => {
    expect(() =>
      resolveSafePath(
        PROJECT_CONTENT_ROOT,
        "en/../../../package.json",
      ),
    ).toThrow(
      "Path escapes the allowed content directory.",
    );
  });
});