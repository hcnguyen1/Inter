const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Request to ${path} failed (${res.status}): ${detail}`);
  }
  return res.json() as Promise<T>;
}

export function listChats(): Promise<Chat[]> {
  return request("/chats");
}

export function createChat(): Promise<Chat> {
  return request("/chats", { method: "POST" });
}

export function deleteChat(chatId: number): Promise<void> {
  return request(`/chats/${chatId}`, { method: "DELETE" });
}

export function renameChat(chatId: number, title: string): Promise<Chat> {
  return request(`/chats/${chatId}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
}

export function sendMessage(chatId: number, content: string): Promise<Chat> {
  return request(`/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
