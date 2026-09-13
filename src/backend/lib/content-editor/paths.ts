/*
  Feat: Safe path resolution (Prevents users from entering prohibited folders)
  Export Const: PROJECT_CONTENT_ROOT; LOCALE_CONTENT_ROOT
  Export Function: resolveSafePath

*/

import "server-only";
import path from "node:path";

export const PROJECT_CONTENT_ROOT = path.resolve(
  process.cwd(),
  "src",
  "content",
  "projects",
);

export const LOCALE_CONTENT_ROOT = path.resolve(
  process.cwd(),
  "src",
  "i18n",
  "locales",
);

export function resolveSafePath(root: string,relativePath: string): string {
  const resolvedRoot = path.resolve(root);

  const resolvedTarget = path.resolve(resolvedRoot, relativePath);

  const relative = path.relative(resolvedRoot, resolvedTarget);

  const escapesRoot =
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative);

  if (escapesRoot) {
    throw new Error(
      "Path escapes the allowed content directory.",
    );
  }

  return resolvedTarget;
}