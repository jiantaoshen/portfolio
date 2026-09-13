import "server-only";

import fs from "node:fs/promises";

export async function writeFileAtomic(targetPath: string,content: string): Promise<void> {
  const tempPath = `${targetPath}.tmp`;

  try {
    await fs.writeFile(tempPath, content, "utf8");
    await fs.rename(tempPath, targetPath);
    
  } catch (error) {
    await fs.rm(tempPath, {force: true});

    throw error;
  }
}