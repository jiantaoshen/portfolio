import fs from "node:fs/promises";
import path from "node:path";

import { hasLocale } from "next-intl";
import { NextResponse } from "next/server";

import type { AboutContent } from "@/career/lib/types";
import { routing } from "@/i18n/routing";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    locale: string;
  }>;
}

function developmentOnly() {
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  return NextResponse.json(
    {
      error: "Local content editing is disabled in production.",
    },
    {
      status: 403,
    },
  );
}

export async function PUT(request: Request, { params }: RouteContext) {
  const blocked = developmentOnly();

  if (blocked) {
    return blocked;
  }

  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return NextResponse.json(
      {
        error: `Unsupported locale: ${locale}`,
      },
      {
        status: 400,
      },
    );
  }

  let content: AboutContent;

  try {
    content = (await request.json()) as AboutContent;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON body.",
      },
      {
        status: 400,
      },
    );
  }

  const filePath = path.join(
    process.cwd(),
    "i18n",
    "locales",
    locale,
    "about.json",
  );

  try {
    await fs.writeFile(
      filePath,
      `${JSON.stringify(content, null, 2)}\n`,
      "utf8",
    );

    return NextResponse.json(content);
  } catch (error) {
    console.error("Failed to save About content:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save About content.",
      },
      {
        status: 500,
      },
    );
  }
}