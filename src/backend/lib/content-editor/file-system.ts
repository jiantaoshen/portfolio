/*
  Feat: File creation, modification and delete
  Export Function: writeFileAtomic; deleteFileIfExists

*/
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

export async function deleteFileIfExists(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    //Skip the error if and only if it is No such file or directory.
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }

    throw error;
  }
}