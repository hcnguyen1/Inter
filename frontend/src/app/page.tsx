"use client";

import { useEffect, useRef, useState } from "react";

type Chat = {
  id: number;
  title: string;
  messages: string[];
};

export default function Home() {
  const [isCompact, setIsCompact] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [menuChatId, setMenuChatId] = useState<number | null>(null);
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null;
  const messages = activeChat?.messages ?? [];

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuChatId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewChat = () => {
    const id = Date.now();
    setChats((prev) => [...prev, { id, title: `Chat ${prev.length + 1}`, messages: [] }]);
    setActiveChatId(id);
    setInput("");
  };

  const handleDeleteChat = (id: number) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    setActiveChatId((prev) => (prev === id ? null : prev));
    setMenuChatId(null);
  };

  const handleStartRename = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
    setMenuChatId(null);
  };

  const handleCommitRename = () => {
    const trimmed = editingTitle.trim();
    if (editingChatId !== null && trimmed) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === editingChatId ? { ...chat, title: trimmed } : chat
        )
      );
    }
    setEditingChatId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, trimmed] }
          : chat
      )
    );
    setInput("");
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="flex h-full">

        {/* Sidebar */}
        <aside className={`flex ${isCompact ? "w-16" : "w-72"} flex-col gap-4 bg-slate-900 p-4 transition-[width]`}>
          <div className="flex items-center justify-between">
            {!isCompact && (
              <div className="text-sm font-semibold text-slate-100">InterAI</div>
            )}
            <button
              onClick={() => setIsCompact((prev) => !prev)}
              aria-label="Toggle compact mode"
              className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            >
              «»
            </button>
          </div>
          <div className="h-px w-full bg-slate-700" />
          <button
            onClick={handleNewChat}
            className={`w-full rounded px-2 py-2 ${isCompact ? "text-center" : "text-left"} text-sm font-semibold text-white bg-transparent transition-colors hover:bg-slate-800`}
          >
            {isCompact ? "+" : "+ New chat"}
          </button>
          {!isCompact && (
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
              {chats.length === 0 ? (
                <div className="text-xs text-slate-400">
                  Start a new conversation or continue one from the sidebar.
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative flex w-full items-center rounded transition-colors ${
                      chat.id === activeChatId
                        ? "bg-slate-800 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {editingChatId === chat.id ? (
                      <input
                        autoFocus
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={handleCommitRename}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCommitRename();
                          if (e.key === "Escape") setEditingChatId(null);
                        }}
                        className="flex-1 rounded bg-slate-700 px-2 py-2 text-sm text-white outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => setActiveChatId(chat.id)}
                        className="flex-1 truncate px-2 py-2 text-left text-sm"
                      >
                        {chat.title}
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setMenuChatId((prev) => (prev === chat.id ? null : chat.id))
                      }
                      aria-label={`More options for ${chat.title}`}
                      className="px-2 py-2 text-slate-400 opacity-0 transition-opacity hover:text-slate-100 group-hover:opacity-100"
                    >
                      ⋮
                    </button>
                    {menuChatId === chat.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-full z-10 mt-1 w-32 rounded border border-slate-700 bg-slate-800 py-1 shadow-lg"
                      >
                        <button
                          onClick={() => handleStartRename(chat)}
                          className="w-full px-3 py-1.5 text-left text-sm text-slate-200 hover:bg-slate-700"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => handleDeleteChat(chat.id)}
                          className="w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-slate-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* User profile section */}
          <div className="mt-auto h-px w-full bg-slate-700" />
          <div className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 transition-colors hover:bg-slate-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-200">
              JD
            </div>
            {!isCompact && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-slate-100">
                  John Doe
                </span>
                <span className="truncate text-xs text-slate-400">
                  john.doe@gmail.com
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* Chat panel */}
        <main className="flex flex-1 flex-col gap-4 p-4">
          {/* Conversation area */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded bg-slate-800 p-4">
            {!activeChat ? (
              <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
                Click &ldquo;+ New chat&rdquo; to start a conversation.
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
                Send a message to get started.
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className="max-w-[75%] self-end rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-900"
                >
                  {message}
                </div>
              ))
            )}
            <div ref={conversationEndRef} />
          </div>

          {/* Message input bar */}
          <form onSubmit={handleSubmit} className="flex">
            <div className="flex w-full items-center gap-2 rounded-full bg-slate-800 px-4 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!activeChat}
                placeholder={activeChat ? "Message InterAI..." : "Start a new chat to send a message"}
                className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!activeChat}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </main>

      </div>
    </div>
  );
}
