"use client";

import { useRef, useState } from "react";
import { FiPaperclip, FiX } from "react-icons/fi";

/* User's message input bar */

const ACCEPTED_FILE_TYPES = ".txt,.md,.csv,.json,.log,.pdf,text/*,application/pdf";

type MessageInputBarProps = {
  hasActiveChat: boolean;
  isSending: boolean;
  onSend: (content: string) => void;
  onSendWithFile: (content: string, file: File) => void;
};

export function MessageInputBar({ hasActiveChat, isSending, onSend, onSendWithFile }: MessageInputBarProps) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const disabled = !hasActiveChat || isSending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed && !file) return;
    setInput("");
    if (file) {
      onSendWithFile(trimmed, file);
      setFile(null);
    } else {
      onSend(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {file && (
        <div className="flex w-fit items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          <FiPaperclip className="shrink-0" /> {file.name}
          <button
            type="button"
            onClick={() => setFile(null)}
            aria-label="Remove attached file"
            className="text-slate-400 hover:text-slate-100"
          >
            <FiX />
          </button>
        </div>
      )}
      <div className="flex w-full items-center gap-2 rounded-full bg-slate-800 px-4 py-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          aria-label="Attach a file"
          className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiPaperclip />
        </button>
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
