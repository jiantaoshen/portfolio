/*
    Test: API Error handling
    Test1: Invalid request
    Test2: Not Found
    Test3: Conflict
*/

import {describe,expect,it} from "vitest";

import {badRequest,conflict,notFound} from "./errors";

describe("content editor errors", () => {
  it("creates a bad request error", () => {
    const error = badRequest(
      "Invalid request.",
    );

    expect(error.message).toBe(
      "Invalid request.",
    );
    expect(error.status).toBe(400);
    expect(error.name).toBe(
      "ContentEditorError",
    );
  });

  it("creates a not found error", () => {
    const error = notFound("Project not found.");

    expect(error.status).toBe(404);
  });

  it("creates a conflict error", () => {
    const error = conflict("Project already exists.");

    expect(error.status).toBe(409);
  });
});