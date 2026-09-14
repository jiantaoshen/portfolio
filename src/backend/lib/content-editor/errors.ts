/*
  Feat: API Error Handling
  Export Class: ContentEditorError
  Export Function: badRequest, notFound, conflict

*/

import "server-only";

export class ContentEditorError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ContentEditorError";
  }
}

export function badRequest(message: string): ContentEditorError {
  return new ContentEditorError(
    message,
    400,
  );
}

export function notFound(message: string): ContentEditorError {
  return new ContentEditorError(
    message,
    404,
  );
}

export function conflict(message: string): ContentEditorError {
  return new ContentEditorError(
    message,
    409,
  );
}