import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import type { SharedProjects } from "@/career/lib/types";

export const runtime = "nodejs";

function developmentOnly() {
  if (process.env.NODE_ENV === "development") return null;
  return NextResponse.json({ error: "Local content editing is disabled in production." }, { status: 403 });
}

export async function PUT(request: Request) {
  const blocked = developmentOnly();
  if (blocked) return blocked;

  let content: SharedProjects;
  try {
    content = (await request.json()) as SharedProjects;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(content?.items)) {
    return NextResponse.json({ error: "Invalid projects payload." }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "i18n", "shared", "projects.json");

  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
    return NextResponse.json(content);
  } catch (error) {
    console.error("Failed to save shared Projects:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save shared Projects." },
      { status: 500 },
    );
  }
}
