/*
    Test: File system
    Test_1: Create a new file if target file does not exits
    Test_2: Write text on target file if exits
    Test_3: Delete tmp file after writing text. 
*/

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {afterEach, describe, expect, it} from "vitest";

import {writeFileAtomic} from "./file-system";

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