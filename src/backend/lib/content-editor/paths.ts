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