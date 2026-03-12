import MDEditor from "@uiw/react-md-editor";
import "./markdown.css";

export default function Markdown({ content }: { content: string }) {
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
      }}
    />
  );
}
