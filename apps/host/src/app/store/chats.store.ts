import { create } from "zustand";
import { Chats } from "../types/types";

interface ChatStore {
  currentChat: Chats | null;
  setCurrentChat: (chat: Chats | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentChat: null,
  setCurrentChat: (chat) => {
    set({ currentChat: chat });
    localStorage.setItem("currentChat", JSON.stringify(chat));
  },
}));
