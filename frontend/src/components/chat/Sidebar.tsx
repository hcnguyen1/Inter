"use client";

import type { Chat } from "@/lib/api";
import { ChatListItem } from "./ChatListItem";
import { UserProfile } from "./UserProfile";

type SidebarProps = {
  isCompact: boolean;
  onToggleCompact: () => void;
  chats: Chat[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
  onNewChat: () => void;
  onDeleteChat: (id: number) => void;
  onRenameChat: (id: number, title: string) => void;
};

export function Sidebar({
  isCompact,
  onToggleCompact,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
}: SidebarProps) {
  return (
    <aside className={`flex ${isCompact ? "w-16" : "w-72"} flex-col gap-4 bg-slate-900 p-4 transition-[width]`}>
      <div className="flex items-center justify-between">
        {!isCompact && <div className="text-sm font-semibold text-slate-100">InterAI</div>}
        <button
          onClick={onToggleCompact}
          aria-label="Toggle compact mode"
          className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
        >
          «»
        </button>
      </div>
      <div className="h-px w-full bg-slate-700" />
      <button
        onClick={onNewChat}
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
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onSelect={() => onSelectChat(chat.id)}
                onDelete={() => onDeleteChat(chat.id)}
                onRename={(title) => onRenameChat(chat.id, title)}
              />
            ))
          )}
        </div>
      )}

      <div className="mt-auto h-px w-full bg-slate-700" />
      <UserProfile isCompact={isCompact} />
    </aside>
  );
}
