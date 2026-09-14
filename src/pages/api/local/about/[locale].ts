/*
  Feat: API Route of about editor
  Export const: prerender; PUT: APIRoute
*/

import type {APIRoute} from "astro";

import {
  assertLocalContentEditingEnabled,
} from "@/backend/lib/content-editor/environment";

import {
  badRequest,
} from "@/backend/lib/content-editor/errors";

import {
  handleContentEditorError,
} from "@/backend/lib/content-editor/http";

import {
  parseAboutContent,
  saveAboutContent,
} from "@/backend/lib/content-editor/about";

import {
  isSupportedLocale,
} from "@/backend/lib/content-editor/validation";

export const prerender = false;

export const PUT: APIRoute = async ({params,request}) => {
  try {
    assertLocalContentEditingEnabled();

    const locale = params.locale;

    if (!locale || !isSupportedLocale(locale)) {
      throw badRequest(
        "Locale must be en, sv or zh.",
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      throw badRequest(
        "Request body must be valid JSON.",
      );
    }

    const content = parseAboutContent(body);

    const saved =await saveAboutContent(locale, content);

    return Response.json(
      saved,
      {
        status: 200,
      },
    );
  } catch (error) {
    return handleContentEditorError(
      error,
    );
  }
};