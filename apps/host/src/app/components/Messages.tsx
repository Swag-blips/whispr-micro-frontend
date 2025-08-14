"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/chats.store";
import { useAuth } from "../context/AuthContext";
import { getAvatar, getMetaAvatar } from "../utils/getUserAvatar";
import { convertTime } from "../utils/convertDate";
import { useSocket } from "../context/SocketContext";
import { Message, User } from "../types/types";
import { Check } from "lucide-react";
import { getUserName } from "../utils/getUsername";
import { mutate } from "swr";
import { EmptyMessages } from "./EmptyMessages";
import { Loading } from "./icons";
import { Typing } from "./Typing";
import DoubleTick from "./icons/DoubleTick";
import { useTypingIndicator } from "../hooks/useTypingIndicator";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMessage } from "../hooks/useMessage";

interface MessagesProps {
  allMessages: Message[];
  setAllMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  error: Error;
}

export const Messages = ({
  allMessages,
  setAllMessages,
  isLoading,
  error,
}: MessagesProps) => {
  const { currentChat, setCurrentChat } = useChatStore();
  const { userTyping } = useTypingIndicator();
  const { socket } = useSocket();

  const { user } = useAuth();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  useMessage(setAllMessages, allMessages);

  const scrollToBottom = () => {
    return lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    scrollToBottom();
  }, [allMessages]);

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

  useEffect(() => {
    if (allMessages.length === 0) return;
    const lastIndex = allMessages.length - 1;
    const lastMessageEl = messageRefs.current[lastIndex];
    if (!lastMessageEl) return;

    gsap.fromTo(
      lastMessageEl,
      {
        y: 20,
        opacity: 0,
      },
      { y: 0, opacity: 100, duration: 0.3, ease: "power1.out" }
    );
  }, [allMessages]);

  if (isLoading)
    return (
      <div className="flex items-center flex-1 h-full flex-col justify-center">
        <Loading width="32" height="32" />
      </div>
    );
  if (error) return <p>{error.message || "Something went wrong"}</p>;

  return (
    <div className="flex flex-col h-full overflow-y-auto chat-scrollbar px-4 ">
      <div className="flex-col  flex-1 mt-8  flex gap-">
        {allMessages.length > 0 ? (
          allMessages.map((msg, index) => (
            <div
              key={msg._id}
              ref={(el) => {
                messageRefs.current[index] = el;
              }}
              className="messages"
            >
              {currentChat?.type === "group" && msg.messageType === "system" ? (
                <div className="flex items-center gap-2 justify-center">
                  <Image
                    width={20}
                    height={20}
                    src={getMetaAvatar(msg.meta?.memberAvatar)}
                    alt="avatar"
                    className="rounded-full"
                    quality={100}
                  />
                  {msg.content}
                </div>
              ) : (
                <div
                  key={index}
                  className={`flex ${msg.senderId === user?._id ? "ml-auto flex-row-reverse" : ""} items-start gap-2`}
                >
                  {currentChat?.type === "private" &&
                  !Array.isArray(currentChat.otherUsers) ? (
                    <>
                      {msg.senderId !== user?._id && (
                        <Image
                          src={getAvatar(currentChat?.otherUsers.avatar)}
                          alt={"user"}
                          width={48}
                          quality={100}
                          height={48}
                          className="rounded-full"
                        />
                      )}
                    </>
                  ) : (
                    <Image
                      src={
                        msg.senderId === user?._id
                          ? getAvatar(user.avatar)
                          : getAvatar(
                              undefined,
                              "group",
                              currentChat?.otherUsers,
                              msg.senderId
                            )
                      }
                      alt={"user"}
                      width={48}
                      height={48}
                      quality={100}
                      className="rounded-full"
                    />
                  )}

                  <div className="flex flex-col gap-2">
                    <div
                      className={`flex ${msg.senderId === user?._id ? "flex-row-reverse" : ""} items-center gap-4`}
                    >
                      {currentChat?.type === "private" &&
                      !Array.isArray(currentChat.otherUsers) ? (
                        <></>
                      ) : (
                        <h2>
                          {msg.senderId === user?._id
                            ? user.username
                            : getUserName(
                                currentChat?.otherUsers,
                                msg.senderId
                              )}
                        </h2>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <p
                        className={`${
                          msg.senderId === user?._id
                            ? "bg-[#14222B]  rounded-bl-xl ml-auto"
                            : "bg-[#1A1F21] rounded-br-xl"
                        } w-fit  text-white text-xs xl:text-sm leading-[150%] max-w-[400px]  rounded-t-xl  flex items-end gap-2 px-4 py-3`}
                      >
                        {msg.content}
                        {currentChat?.type !== "group" &&
                          msg.senderId === user?._id &&
                          (msg.status === "sent" ? (
                            <Check
                              size={16}
                              color="#A0A4A6"
                              className="shrink-0"
                            />
                          ) : msg.status === "delivered" ? (
                            <DoubleTick />
                          ) : (
                            <DoubleTick color="#4AA4F9" />
                          ))}
                      </p>
                      <p
                        className={`text-[#8C8C8C] ${msg.senderId === user?._id ? "ml-auto" : ""} xl:text-xs  text-[10px]`}
                      >
                        {convertTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <EmptyMessages />
        )}

        {allMessages && userTyping && !Array.isArray(userTyping) && (
          <Typing userTyping={userTyping} />
        )}

        <div ref={lastMessageRef} className="mb-18" />
      </div>
    </div>
  );
};
