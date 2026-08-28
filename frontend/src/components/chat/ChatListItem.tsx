"use client";

import { useRef, useState } from "react";
import type { Chat } from "@/lib/api";
import { useClickOutside } from "@/hooks/useClickOutside";

/* This component is the list of chat items in the sidebar */

type ChatListItemProps = {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
};

export function ChatListItem({ chat, isActive, onSelect, onDelete, onRename }: ChatListItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(chat.title);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const startRename = () => {
    setEditingTitle(chat.title);
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const commitRename = () => {
    const trimmed = editingTitle.trim();
    setIsEditing(false);
    if (trimmed && trimmed !== chat.title) onRename(trimmed);
  };

  return (
    <div
      className={`group relative flex w-full items-center rounded transition-colors ${
        isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
      }`}
    >
      {isEditing ? (
        <input
          autoFocus
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") setIsEditing(false);
          }}
          className="flex-1 rounded bg-slate-700 px-2 py-2 text-sm text-white outline-none"
        />
      ) : (
        <button onClick={onSelect} className="flex-1 truncate px-2 py-2 text-left text-sm">
          {chat.title}
        </button>
      )}
      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={`More options for ${chat.title}`}
        className="px-2 py-2 text-slate-400 opacity-0 transition-opacity hover:text-slate-100 group-hover:opacity-100"
      >
        ⋮
      </button>
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full z-10 mt-1 w-32 rounded border border-slate-700 bg-slate-800 py-1 shadow-lg"
        >
          <button
            onClick={startRename}
            className="w-full px-3 py-1.5 text-left text-sm text-slate-200 hover:bg-slate-700"
          >
            Rename
          </button>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onDelete();
            }}
            className="w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-slate-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
