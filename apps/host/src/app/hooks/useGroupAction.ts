import { useSWRConfig } from "swr";
import { useSocket } from "../context/SocketContext";
import { Message } from "../types/types";
import { useChatStore } from "../store/chats.store";
import { useEffect } from "react";

export const useGroupAction = (
  setAllMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
  const { socket } = useSocket();
  const { mutate } = useSWRConfig();
  const { currentChat, setCurrentChat } = useChatStore();
  const handleAddMember = (data: {
    chatId: string;
    messageType: "system";
    content: string;
    systemAction: "user_added";
    messageId: string;
    createdAt: Date;
    meta: {
      actorId: string;
      memberId: string;
      memberAvatar: string;
    };
  }) => {
    const {
      chatId,
      messageType,
      content,
      systemAction,
      meta,
      createdAt,
      messageId,
    } = data;
    if (currentChat) {
      const updated = {
        ...currentChat,
        participants: [...currentChat.participants, meta.memberId],
      };
      setCurrentChat(updated);
    }

    setAllMessages((prev) => [
      ...prev,
      {
        content,
        chatId,
        senderId: "",
        messageType,
        systemAction,
        _id: messageId,
        createdAt,
        meta,
      },
    ]);
    mutate("userChats");
  };

  const handleRemove = (data: {
    chatId: string;
    messageType: "system";
    content: string;
    systemAction: "user_removed";
    messageId: string;
    createdAt: Date;
    meta: {
      actorId: string;
      memberId: string;
      memberAvatar: string;
    };
  }) => {
    const {
      chatId,
      messageType,
      content,
      systemAction,
      meta,
      createdAt,
      messageId,
    } = data;
    if (currentChat && Array.isArray(currentChat.otherUsers)) {
      const updated = {
        ...currentChat,
        participants: currentChat.participants.filter(
          (id: string) => id !== meta.memberId
        ),
        otherUsers: currentChat.otherUsers.filter(
          (user) => user._id !== data.meta.memberId
        ),
      };
      setCurrentChat(updated);
    }

    setAllMessages((prev) => [
      ...prev,
      {
        content,
        chatId,
        senderId: "",
        messageType,
        systemAction,
        _id: messageId,
        createdAt,
        meta,
      },
    ]);
    mutate("userChats");
  };

  useEffect(() => {
    if (currentChat?.type !== "group") return;
    socket?.on(
      "memberRemoved",
      (data: {
        chatId: string;
        messageType: "system";
        content: string;
        systemAction: "user_removed";
        createdAt: Date;
        messageId: string;
        meta: {
          actorId: string;
          memberId: string;
          memberAvatar: string;
        };
      }) => {
        if (data.chatId !== currentChat._id) return;

        console.log("DATA", data);
        handleRemove(data);
      }
    );
    return () => {
      socket?.off("memberRemoved");
    };
  }, [currentChat?._id, socket]);

  useEffect(() => {
    if (currentChat?.type !== "group") return;
    socket?.on(
      "memberAdded",
      (data: {
        chatId: string;
        messageType: "system";
        content: string;
        systemAction: "user_added";
        createdAt: Date;
        messageId: string;
        meta: {
          actorId: string;
          memberId: string;
          memberAvatar: string;
        };
      }) => {
        if (data.chatId !== currentChat._id) return;
        handleAddMember(data);
      }
    );

    return () => {
      socket?.off("memberAdded");
    };
  }, [currentChat?._id, socket]);
};
