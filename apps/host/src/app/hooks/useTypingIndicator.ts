import { useEffect, useState } from "react";
import { User } from "../types/types";
import { useSocket } from "../context/SocketContext";
import { useChatStore } from "../store/chats.store";

export const useTypingIndicator = () => {
  const [userTyping, setUserTyping] = useState<User | User[] | null>(null);
  const { socket } = useSocket();
  const { currentChat } = useChatStore();
  useEffect(() => {
    const handleUserTyping = (data: { chatId: string; userId: string }) => {
      if (data.chatId !== currentChat?._id) return;

      const user = Array.isArray(currentChat?.otherUsers)
        ? currentChat.otherUsers.find((u) => u._id === data.userId)
        : currentChat?.otherUsers;

      console.log("got to user", user);

      if (!user) return;

      setUserTyping((prev) => {
        if (!prev) return [user];
        if (Array.isArray(prev)) {
          if (prev.some((u) => u._id === user._id)) return prev;
          return [...prev, user];
        }
        return [prev, user];
      });
    };

    const handleStopTyping = (data: { chatId: string; userId: string }) => {
      if (data.chatId !== currentChat?._id) return;

      setUserTyping((prev) => {
        if (!prev) return null;
        if (Array.isArray(prev)) {
          const filtered = prev.filter((u) => u._id !== data.userId);
          return filtered.length > 0 ? filtered : null;
        }
        return prev._id === data.userId ? null : prev;
      });
    };

    socket?.on("userTyping", (data) => {
      console.log("receive event");
      handleUserTyping(data);
    });
    socket?.on("stopTyping", handleStopTyping);

    return () => {
      socket?.off("userTyping", handleUserTyping);
      socket?.off("stopTyping", handleStopTyping);
    };
  }, [socket, currentChat]);



  console.log("userTyping", userTyping)
  return { userTyping };
};

