import fs from "node:fs/promises";
import path from "node:path";

import {
  NextResponse,
} from "next/server";

import {
  isLocale,
} from "@/i18n";

import type {
  AboutContent,
} from "@/career/lib/types";


interface RouteContext {
  params: Promise<{
    locale: string;
  }>;
}


export async function PUT(
  request: Request,
  {
    params,
  }: RouteContext,
) {
  const {
    locale,
  } = await params;

  if (!isLocale(locale)) {
    return NextResponse.json(
      {
        error:
          `Unsupported locale: ${locale}`,
      },
      {
        status: 400,
      },
    );
  }


  let content: AboutContent;

  try {
    content =
      (await request.json()) as AboutContent;
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid JSON body.",
      },
      {
        status: 400,
      },
    );
  }


  const filePath =
    path.join(
      process.cwd(),
      "i18n",
      "locales",
      locale,
      "about.json",
    );


  try {
    await fs.writeFile(
      filePath,
      `${JSON.stringify(
        content,
        null,
        2,
      )}\n`,
      "utf8",
    );

    return NextResponse.json(
      content,
    );
  } catch (error) {
    console.error(
      "Failed to write About content:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to write About content.",
      },
      {
        status: 500,
      },
    );
  }
}