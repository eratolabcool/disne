import MDEditor from "@uiw/react-md-editor";
import type { ReactNode } from "react";
import { MarkdownHeading, slugifyHeadingText } from "@/lib/markdown";
import "./markdown.css";

function getNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    return getNodeText((node as { props?: { children?: ReactNode } }).props?.children);
  }

  return "";
}

export default function Markdown({
  content,
  headings = [],
}: {
  content: string;
  headings?: MarkdownHeading[];
}) {
  const headingIds = headings.reduce(
    (acc, heading) => {
      acc[heading.level] = [...(acc[heading.level] || []), heading.id];
      return acc;
    },
    {} as Record<number, string[]>
  );
  const headingIndexes: Record<number, number> = {};

  const createHeading =
    (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6", level: number) =>
    ({ children, ...props }: { children?: ReactNode }) => {
      const currentIndex = headingIndexes[level] || 0;
      headingIndexes[level] = currentIndex + 1;

      const text = getNodeText(children).trim();
      const id = headingIds[level]?.[currentIndex] || slugifyHeadingText(text);

      return (
        <Tag {...props} id={id} className="group scroll-mt-24">
          {children}
          <a
            href={`#${id}`}
            className="ml-2 text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Link to section ${text}`}
          >
            #
          </a>
        </Tag>
      );
    };

  return (
    <MDEditor.Markdown
      className="markdown"
      source={content}
      components={{
        a: ({ children, href = "", ...props }) => {
          const isInternal = href.startsWith("/") || href.startsWith("#");

          return (
            <a
              {...props}
              href={href}
              target={isInternal ? undefined : "_blank"}
              rel={isInternal ? undefined : "noopener noreferrer nofollow"}
            >
              {children}
            </a>
          );
        },
        h1: createHeading("h1", 1),
        h2: createHeading("h2", 2),
        h3: createHeading("h3", 3),
        h4: createHeading("h4", 4),
        h5: createHeading("h5", 5),
        h6: createHeading("h6", 6),
      }}
    />
  );
}
