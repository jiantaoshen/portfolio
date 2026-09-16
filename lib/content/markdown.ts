import GithubSlugger from "github-slugger";

import {
  toString,
} from "mdast-util-to-string";

import remarkParse from "remark-parse";

import {
  unified,
} from "unified";

import {
  visit,
} from "unist-util-visit";

import type {
  Heading,
} from "mdast";

export interface MarkdownHeading {
  depth: 2 | 3;
  text: string;
  slug: string;
}

export function getMarkdownHeadings(
  markdown: string,
): MarkdownHeading[] {
  const tree =
    unified()
      .use(remarkParse)
      .parse(markdown);

  const slugger =
    new GithubSlugger();

  const headings:
    MarkdownHeading[] = [];

  visit(
    tree,
    "heading",
    (node: Heading) => {
      const text =
        toString(node);

      /*
       * 所有 heading 都必须经过 slugger，
       * 即使 TOC 只显示 h2/h3。
       *
       * 这样才能和 rehype-slug
       * 对重复标题的处理完全一致。
       */
      const slug =
        slugger.slug(text);

      if (
        node.depth === 2 ||
        node.depth === 3
      ) {
        headings.push({
          depth: node.depth,
          text,
          slug,
        });
      }
    },
  );

  return headings;
}