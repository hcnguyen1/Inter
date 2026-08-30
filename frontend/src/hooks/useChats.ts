import { useEffect, useState } from "react";
import {
  createChat,
  deleteChat,
  listChats,
  renameChat,
  sendMessage,
  sendMessageWithFile,
  type Chat,
} from "@/lib/api";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [sendingChatIds, setSendingChatIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    listChats().then(setChats).catch((err) => console.error("Failed to load chats", err));
  }, []);

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null;
  const isSending = activeChatId !== null && sendingChatIds.has(activeChatId);

  const newChat = async () => {
    const chat = await createChat();
    setChats((prev) => [...prev, chat]);
    setActiveChatId(chat.id);
  };

  const removeChat = async (id: number) => {
    await deleteChat(id);
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    setActiveChatId((prev) => (prev === id ? null : prev));
  };

  const rename = async (id: number, title: string) => {
    const updated = await renameChat(id, title);
    setChats((prev) => prev.map((chat) => (chat.id === id ? updated : chat)));
  };

  const submitMessage = async (content: string) => {
    if (!activeChatId) return;
    await sendPendingMessage(activeChatId, content, () => sendMessage(activeChatId, content));
  };

  const submitMessageWithFile = async (content: string, file: File) => {
    if (!activeChatId) return;
    const pendingContent = content ? `${content}\n\n📎 ${file.name}` : `📎 ${file.name}`;
    await sendPendingMessage(activeChatId, pendingContent, () =>
      sendMessageWithFile(activeChatId, content, file)
    );
  };

  const sendPendingMessage = async (chatId: number, pendingContent: string, request: () => Promise<Chat>) => {
    setSendingChatIds((prev) => new Set(prev).add(chatId));
    // Show the user's message right away instead of waiting for the assistant reply.
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { role: "user", content: pendingContent, timestamp: new Date().toISOString() },
              ],
            }
          : chat
      )
    );
    try {
      const updated = await request();
      setChats((prev) => prev.map((chat) => (chat.id === chatId ? updated : chat)));
    } catch (err) {
      console.error("Failed to send message", err);
      const chatIsGone = err instanceof Error && err.message.includes("(404)");
      if (chatIsGone) {
        // Backend restarted and lost its in-memory chats; this chat no longer exists there.
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        setActiveChatId((prev) => (prev === chatId ? null : prev));
      } else {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      role: "assistant",
                      content: "⚠️ Failed to get a response. Please try again.",
                      timestamp: new Date().toISOString(),
                    },
                  ],
                }
              : chat
          )
        );
      }
    } finally {
      setSendingChatIds((prev) => {
        const next = new Set(prev);
        next.delete(chatId);
        return next;
      });
    }
  };

  return {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    isSending,
    newChat,
    removeChat,
    rename,
    submitMessage,
    submitMessageWithFile,
  };
}
