"use client";

import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { Messages } from "./Messages";
import { useChatStore } from "../store/chats.store";
import { useSocket } from "../context/SocketContext";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { getMessages } from "../services/chats";
import { Message } from "../types/types";
import { useAuth } from "../context/AuthContext";
import { NotSelectedChat } from "./NotSelectedChat";
import { ChatDetails } from "./ChatDetails";

export const Chat = () => {
  const { currentChat } = useChatStore();
  const { socket } = useSocket();
  const { user } = useAuth();
  const { data, isLoading, error } = useSWR(currentChat?._id, getMessages);

  const [allMessages, setAllMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket?.emit("joinRoom", currentChat?._id);

    return () => {
      socket?.emit("leaveRoom", currentChat?._id);
    };
  }, [currentChat]);

  useEffect(() => {
    if (data?.messages) {
      setAllMessages(data.messages);
    }
  }, [data?.messages, isLoading]);

  const addMessage = (msg: Message) => {
    setAllMessages((prev) => [...prev, msg]);
  };

  useEffect(() => {
    if (!socket || !currentChat?._id) return;

    const handleNewMessage = (newMsg: Message) => {
      console.log("new Message!", newMsg);
      if (newMsg.chatId === currentChat._id) {
        if (newMsg.tempId && newMsg.senderId === user?._id) {
          setAllMessages((prev) =>
            prev.map((msg) =>
              msg.tempId === newMsg.tempId
                ? {
                    ...msg,
                    status: newMsg.status,
                    receiverId: newMsg.receiverId,

                    ...newMsg,
                  }
                : msg
            )
          );
        } else {
          setAllMessages((prev) => [...prev, newMsg]);
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, currentChat?._id]);

  if (!currentChat) return <NotSelectedChat />;

  return (
    <div className=" flex items-start h-full flex-1 ">
      <div className="bg-[#0A0E0F] relative  flex-1  h-full flex flex-col ">
        <ChatHeader currentChat={currentChat} />
        <div className="flex-1 overflow-hidden">
          <Messages
            allMessages={allMessages}
            setAllMessages={setAllMessages}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <MessageInput addMessage={addMessage} />
      </div>
      <ChatDetails />
    </div>
  );
};
