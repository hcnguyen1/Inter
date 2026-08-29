"use client";

import { useEffect, useRef } from "react";
import type { Chat } from "@/lib/api";
import { MessageBubble } from "./MessageBubble";

/* This is the message view of an active chat between the user and the AI */

type ConversationViewProps = {
  activeChat: Chat | null;
  isSending: boolean;
};

export function ConversationView({ activeChat, isSending }: ConversationViewProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const messages = activeChat?.messages ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded p-4">
      {!activeChat ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
          Click &ldquo;+ New chat&rdquo; to start a conversation.
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
          Send a message to get started.
        </div>
      ) : (
        messages.map((message, index) => <MessageBubble key={index} message={message} />)
      )}
      {isSending && (
        <div className="self-start rounded-2xl bg-slate-700 px-4 py-2 text-sm text-slate-400">
          Thinking…
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
