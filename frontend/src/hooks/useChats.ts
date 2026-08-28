import { useEffect, useState } from "react";
import { createChat, deleteChat, listChats, renameChat, sendMessage, type Chat } from "@/lib/api";

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
    const chatId = activeChatId;
    setSendingChatIds((prev) => new Set(prev).add(chatId));
    // Show the user's message right away instead of waiting for the assistant reply.
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, { role: "user", content }] }
          : chat
      )
    );
    try {
      const updated = await sendMessage(chatId, content);
      setChats((prev) => prev.map((chat) => (chat.id === chatId ? updated : chat)));
    } catch (err) {
      console.error("Failed to send message", err);
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
  };
}
