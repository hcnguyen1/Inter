import type { Message } from "@/lib/api";

export function MessageBubble({ message }: { message: Message }) {
  return (
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
        message.role === "user"
          ? "self-end bg-slate-100 text-slate-900"
          : "self-start bg-slate-700 text-slate-100"
      }`}
    >
      {message.content}
    </div>
  );
}
