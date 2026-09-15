/*
  Feat: Local content editor development middleware
  Route: GET /api/health; PUT /api/local/about/{locale}
  Export Default Function: contentEditorIntegration

*/

import type {AstroIntegration} from "astro";

import type {IncomingMessage,ServerResponse} from "node:http";

import {parseAboutContent,saveAboutContent} from "@/backend/content-editor/about";

import {ContentEditorError} from "@/backend/content-editor/errors";

import {isSupportedLocale} from "@/backend/content-editor/validation";

import {
  deleteProjectContent,
  parseProjectContent,
  saveProjectContent,
} from "@/backend/content-editor/projects";

function sendJson(res: ServerResponse,status: number,body: unknown): void {
  res.statusCode = status;

  res.setHeader(
    "Content-Type",
    "application/json",
  );

  res.end(
    JSON.stringify(body),
  );
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(
      Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk),
    );
  }

  const body = Buffer.concat(chunks)
    .toString("utf8");

  return JSON.parse(body);
}

export default function contentEditorIntegration(): AstroIntegration {
  return {
    name: "local-content-editor",

    hooks: {
      "astro:server:setup": ({server}) => {
        server.middlewares.use(
          async (req,res,next) => {
            const url = new URL(
              req.url ?? "/",
              "http://localhost",
            );

            // GET /api/health
            if (url.pathname === "/api/health") {
              if (req.method !== "GET") {
                sendJson(
                  res,
                  405,
                  {
                    error: "Method not allowed.",
                  },
                );

                return;
              }

              sendJson(
                res,
                200,
                {
                  status: "ok",
                },
              );

              return;
            }

            // PUT /api/local/about/{locale}
            const aboutMatch = url.pathname.match(
              /^\/api\/local\/about\/([^/]+)\/?$/,
            );

            if (aboutMatch) {
              if (req.method !== "PUT") {
                sendJson(
                  res,
                  405,
                  {
                    error: "Method not allowed.",
                  },
                );

                return;
              }

              const locale = aboutMatch[1];

              if (
                !locale ||
                !isSupportedLocale(locale)
              ) {
                sendJson(
                  res,
                  400,
                  {
                    error: "Locale must be en, sv or zh.",
                  },
                );

                return;
              }

              let body: unknown;

              try {
                body = await readJsonBody(req);
              } catch {
                sendJson(
                  res,
                  400,
                  {
                    error: "Request body must be valid JSON.",
                  },
                );

                return;
              }

              try {
                const content = parseAboutContent(body);

                const saved = await saveAboutContent(
                  locale,
                  content,
                );

                // Temporary proof that middleware
                // handled the request.
                res.setHeader(
                  "X-Content-Editor",
                  "dev-middleware",
                );

                sendJson(
                  res,
                  200,
                  saved,
                );
              } catch (error) {
                if (error instanceof ContentEditorError) {
                  sendJson(
                    res,
                    error.status,
                    {
                      error: error.message,
                    },
                  );

                  return;
                }

                console.error(error);

                sendJson(
                  res,
                  500,
                  {
                    error: "Internal server error.",
                  },
                );
              }

              return;
            }

            // PUT /api/local/projects
            if (
              url.pathname === "/api/local/projects" &&
              req.method === "PUT"
            ) {
              let body: unknown;

              try {
                body = await readJsonBody(req);
              } catch {
                sendJson(
                  res,
                  400,
                  {
                    error: "Request body must be valid JSON.",
                  },
                );

                return;
              }

              try {
                const project = parseProjectContent(body);

                const saved = await saveProjectContent(
                  project,
                );

                res.setHeader(
                  "X-Content-Editor",
                  "dev-middleware",
                );

                sendJson(
                  res,
                  200,
                  saved,
                );
              } catch (error) {
                if (error instanceof ContentEditorError) {
                  sendJson(
                    res,
                    error.status,
                    {
                      error: error.message,
                    },
                  );

                  return;
                }

                console.error(error);

                sendJson(
                  res,
                  500,
                  {
                    error: "Internal server error.",
                  },
                );
              }

              return;
            }

            // DELETE /api/local/projects?sourceId=...
            if (
              url.pathname === "/api/local/projects" &&
              req.method === "DELETE"
            ) {
              const sourceId = url.searchParams.get("sourceId") ?? "";

              try {
                await deleteProjectContent(sourceId);

                res.statusCode = 204;
                res.end();
              } catch (error) {
                if (error instanceof ContentEditorError) {
                  sendJson(
                    res,
                    error.status,
                    {
                      error: error.message,
                    },
                  );

                  return;
                }

                console.error(error);

                sendJson(
                  res,
                  500,
                  {
                    error: "Internal server error.",
                  },
                );
              }

              return;
            }

            // /api/local/projects only supports PUT and DELETE
            if (url.pathname === "/api/local/projects") {
              sendJson(
                res,
                405,
                {
                  error: "Method not allowed.",
                },
              );

              return;
            }

            next();
          },
        );
      },
    },
  };
}