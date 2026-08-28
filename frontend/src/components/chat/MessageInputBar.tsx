"use client";

import { useState } from "react";

type MessageInputBarProps = {
  hasActiveChat: boolean;
  isSending: boolean;
  onSend: (content: string) => void;
};

export function MessageInputBar({ hasActiveChat, isSending, onSend }: MessageInputBarProps) {
  const [input, setInput] = useState("");
  const disabled = !hasActiveChat || isSending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    onSend(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <div className="flex w-full items-center gap-2 rounded-full bg-slate-800 px-4 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={hasActiveChat ? "Message InterAI..." : "Start a new chat to send a message"}
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  );
}
