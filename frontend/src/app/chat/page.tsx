"use client";

import { useState } from "react";
import { useChats } from "@/hooks/useChats";
import { Sidebar } from "@/components/chat/Sidebar";
import { ConversationView } from "@/components/chat/ConversationView";
import { MessageInputBar } from "@/components/chat/MessageInputBar";

export default function ChatPage() {
  const [isCompact, setIsCompact] = useState(false);
  const {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    isSending,
    newChat,
    removeChat,
    rename,
    submitMessage,
  } = useChats();

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="flex h-full">
        <Sidebar
          isCompact={isCompact}
          onToggleCompact={() => setIsCompact((prev) => !prev)}
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onNewChat={newChat}
          onDeleteChat={removeChat}
          onRenameChat={rename}
        />

        {/* Chat panel */}
        <main className="flex flex-1 flex-col gap-4 p-4">
          <ConversationView activeChat={activeChat} isSending={isSending} />
          <MessageInputBar hasActiveChat={!!activeChat} isSending={isSending} onSend={submitMessage} />
        </main>
      </div>
    </div>
  );
}
