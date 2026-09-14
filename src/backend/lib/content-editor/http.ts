/*
    Feat: Https Error handling (Show errors in errors.ts and stop show internal server error)
    Export Function: handleContentEditorError

*/

import {ContentEditorError} from "./errors";

export function handleContentEditorError(error: unknown): Response {
  if (error instanceof ContentEditorError) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: error.status,
      },
    );
  }

  console.error(error);

  return Response.json(
    {
      error: "Internal server error.",
    },
    {
      status: 500,
    },
  );
}