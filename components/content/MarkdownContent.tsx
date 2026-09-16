import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({
  content,
}: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkGfm,
      ]}
      rehypePlugins={[
        rehypeSlug,
      ]}
    >
      {content}
    </ReactMarkdown>
  );
}