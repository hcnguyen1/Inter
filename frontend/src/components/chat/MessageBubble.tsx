import type { ComponentProps } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/lib/api";

/* User and AI's message bubbles */
/* Features to add:
   - Read receipts
   - Message reactions
*/

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-slate-500 pl-3 italic text-slate-300 last:mb-0">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs last:mb-0 [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }: ComponentProps<"code">) => (
    <code
      className={`rounded bg-slate-900/70 px-1 py-0.5 font-mono text-xs ${className ?? ""}`}
      {...props}
    >
      {children}
    </code>
  ),
};

export function MessageBubble({ message }: { message: Message }) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex max-w-[75%] flex-col rounded-2xl px-4 py-2 text-sm ${
        message.role === "user"
          ? "self-end bg-slate-100 text-slate-900"
          : "self-start bg-slate-700 text-slate-100"
      }`}
    >
      <div>
        {message.role === "assistant" ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {message.content}
          </ReactMarkdown>
        ) : (
          message.content
        )}
      </div>
      <span
        className={`mt-1 text-[10px] ${message.role === "user" ? "text-slate-500" : "text-slate-400"}`}
      >
        {time}
      </span>
    </div>
  );
}

