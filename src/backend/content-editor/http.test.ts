import {describe, expect,it,vi} from "vitest";

import {badRequest, notFound} from "./errors";

import {handleContentEditorError} from "./http";

describe("handleContentEditorError", () => {
  it("returns the status and message for known content editor errors", async () => {
    const response =
      handleContentEditorError(
        badRequest("Invalid request."),
      );

    expect(response.status).toBe(400);

    await expect(
      response.json(),
    ).resolves.toEqual({
      error: "Invalid request.",
    });
  });

  it("preserves other known error statuses", async () => {
    const response =
      handleContentEditorError(
        notFound("Project not found."),
      );

    expect(response.status).toBe(404);

    await expect(
      response.json(),
    ).resolves.toEqual({
      error: "Project not found.",
    });
  });

  it("returns 500 for unexpected errors", async () => {
    const consoleError =
      vi.spyOn(console, "error")
        .mockImplementation(() => {});

    const response =
      handleContentEditorError(
        new Error("Sensitive internal error"),
      );

    expect(response.status).toBe(500);

    await expect(
      response.json(),
    ).resolves.toEqual({
      error: "Internal server error.",
    });

    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});