import { useEffect, useState } from "react";
import { User } from "../types/types";
import { useSocket } from "../context/SocketContext";
import { useChatStore } from "../store/chats.store";

export const useTypingIndicator = () => {
  const [userTyping, setUserTyping] = useState<User | User[] | null>(null);
  const { socket } = useSocket();
  const { currentChat, setCurrentChat } = useChatStore();
  useEffect(() => {
    socket?.on("userTyping", (data: { chatId: string; userId: string }) => {
      console.log("DATA", data);
      if (data.chatId !== currentChat?._id) return;

      const user = Array.isArray(currentChat?.otherUsers)
        ? currentChat.otherUsers.find((user) => data.userId === user._id)
        : currentChat?.otherUsers;

      if (!user) return;
      setUserTyping(user);
    });

    socket?.on("stopTyping", (data: { chatId: string; userId: string }) => {
      if (data.chatId !== currentChat?._id) return;

      if (Array.isArray(userTyping)) {
        const userTypingCopy = [...userTyping];

        const filteredUserTyping = userTypingCopy.filter(
          (user) => user._id !== data.userId
        );

        setUserTyping(filteredUserTyping);
      } else {
        setUserTyping(null);
      }
    });

    return () => {
      socket?.off("userTyping");
      socket?.off("stopTyping");
    };
  }, [socket, currentChat]);

  return { userTyping };
};
