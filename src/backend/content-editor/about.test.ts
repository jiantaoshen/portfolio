/*
    Test: About editor
    Test1: Add story, skill and education
    Test2: Missing story title
    Test3: Too many story paragraphs.
    Test4: Test malformed data (data with incorrect format)
*/

import {describe, expect, it} from "vitest";
import {parseAboutContent} from "./about";

const validAbout = {
  story: {
    title: "About me",
    paragraphs: [
      "First paragraph.",
    ],
  },
  skills: {
    title: "Skills",
    items: [
      {
        title: "Frontend",
        items: [
          "Astro",
          "TypeScript",
        ],
      },
    ],
  },
  education: {
    title: "Education",
    items: [
      {
        period: "2020–2023",
        degree: "Example",
        school: "Example University",
      },
    ],
  },
};

describe("parseAboutContent", () => {
  it("accepts valid About content", () => {
    expect(
      parseAboutContent(validAbout),
    ).toEqual(validAbout);
  });

  it("rejects a missing story title", () => {
    expect(() =>
      parseAboutContent({
        ...validAbout,
        story: {
          ...validAbout.story,
          title: " ",
        },
      }),
    ).toThrow(
      "Story title is required.",
    );
  });

  it("rejects too many story paragraphs", () => {
    expect(() =>
      parseAboutContent({
        ...validAbout,
        story: {
          ...validAbout.story,
          paragraphs: Array(
            21,
          ).fill("paragraph"),
        },
      }),
    ).toThrow(
      "Too many story paragraphs.",
    );
  });

  it("rejects malformed content", () => {
    expect(() =>
      parseAboutContent({
        story: "invalid",
      }),
    ).toThrow(
      "Invalid About content.",
    );
  });
});