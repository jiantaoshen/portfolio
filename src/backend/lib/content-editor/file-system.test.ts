/*
    Test: File system
    Test1: Create a new file if target file does not exist
    Test2: Write text on target file if exist
    Test3: Delete tmp file after writing text
    Test4: Create a new file and delete it
    Test5: Delete a non-existent file
*/

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";


import {afterEach, describe, expect, it} from "vitest";
import {deleteFileIfExists, writeFileAtomic} from "./file-system";

const testDirectories: string[] = [];

async function createTestDirectory() {
  const directory = await fs.mkdtemp(
    path.join(
      os.tmpdir(),
      "content-editor-",
    ),
  );

  testDirectories.push(directory);

  return directory;
}

afterEach(async () => {
  await Promise.all(
    testDirectories.splice(0).map(
      (directory) =>
        fs.rm(directory, {
          recursive: true,
          force: true,
        }),
    ),
  );
});

describe("writeFileAtomic", () => {
  it("writes a new file", async () => {

    const directory = await createTestDirectory();
    const targetPath = path.join(directory, "example.txt");

    await writeFileAtomic(targetPath, "hello");

    const content = await fs.readFile(targetPath, "utf8");

    expect(content).toBe("hello");
  });

  it("replaces an existing file", async () => {
    const directory = await createTestDirectory();
    const targetPath = path.join(directory,"example.txt");

    await fs.writeFile(targetPath, "old content", "utf8");

    await writeFileAtomic(targetPath, "new content");

    const content = await fs.readFile(targetPath, "utf8");

    expect(content).toBe("new content");
  });

  it("does not leave the temporary file", async () => {
    
    const directory =await createTestDirectory();

    const targetPath = path.join(directory,"example.txt");

    await writeFileAtomic(targetPath, "hello");

    await expect(fs.access(`${targetPath}.tmp`)).rejects.toThrow();
  });
});

describe("deleteFileIfExists", () => {
  it("deletes an existing file", async () => {
    const directory = await createTestDirectory();

    const targetPath = path.join(directory,"example.txt");

    await fs.writeFile(targetPath, "hello", "utf8");

    const deleted =await deleteFileIfExists(targetPath);

    expect(deleted).toBe(true);

    await expect(fs.access(targetPath)).rejects.toThrow();
  });

  it("returns false when the file does not exist", async () => {
    const directory = await createTestDirectory();

    const targetPath = path.join(directory,"missing.txt");

    const deleted =await deleteFileIfExists(targetPath);

    expect(deleted).toBe(false);
  });
});