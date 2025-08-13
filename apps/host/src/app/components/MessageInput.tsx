"use client";
import { Mic } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { sendGroupMessage, sendMessage } from "../services/chats";
import { useChatStore } from "../store/chats.store";
import { useSocket } from "../context/SocketContext";
import { mutate } from "swr";
import { v4 as uuid } from "uuid";
import { useAuth } from "../context/AuthContext";
import { Message } from "../types/types";
import { Attachment, Send } from "./icons";

function debounce(cb: (...args: unknown[]) => void, delay = 1000) {
  let timeout: NodeJS.Timeout;
  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export const MessageInput = ({
  addMessage,
}: {
  addMessage: (msg: Message) => void;
}) => {
  const { currentChat } = useChatStore();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [userIsTyping, setUserIsTyping] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const debounceStopTypingRef = useRef(
    debounce(() => {
      socket?.emit("stopTyping", {
        chatId: currentChat?._id,
        userId: user?._id,
      });
    }, 500)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContent(value);

    if (value.trim()) {
      socket?.emit("startTyping", { chatId: currentChat?._id });
      debounceStopTypingRef.current();
    }
  };

  const handleSendMessage = async () => {
    if (loading) return;
    if (!content) return;
    setLoading(true);
    if (!currentChat?._id || !user?._id) return;
    const tempId = uuid();

    addMessage({
      _id: tempId,
      tempId,
      chatId: currentChat._id,
      content,
      senderId: user._id,
      messageType: "text",
      status: "sent",
      createdAt: new Date().toISOString(),
    });
    try {
      if (currentChat.type === "private") {
        const message = await sendMessage(currentChat?._id, content, tempId);
        if (!message.success) {
          toast.error(message.message);
        }
      } else {
        const message = await sendGroupMessage(
          currentChat._id,
          content,
          tempId
        );
        if (message.success) {
          toast.success(message.message);
        } else {
          toast.error(message.message);
        }
      }
      mutate("userChats");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
      setContent("");
    }
  };

  return (
    <>
      <div className="bg-[#101516] flex items-center gap-2 p-4 h-[72px] w-full">
        <div className="size-8 bg-[#181D21] rounded-full flex items-center justify-center ">
          <Attachment />
        </div>

        <div className="bg-[#1A1F20] p-3  rounded-xl flex items-center w-full">
          <div className="flex flex-1 items-center gap-2">
            <input
              type="text"
              value={content}
              onChange={handleInputChange}
              placeholder="Type a message"
              className="placeholder:text-xs w-full placeholder:text-[#999999] text-white outline-none"
            />
          </div>
        </div>

        <Mic color="#868686" />

        <div
          onClick={handleSendMessage}
          className="size-8 bg-[#181D21] cursor-pointer rounded-full flex items-center justify-center "
        >
          <Send />
        </div>
      </div>
    </>
  );
};
