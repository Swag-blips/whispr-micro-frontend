"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/chats.store";
import { useAuth } from "../context/AuthContext";
import { getAvatar, getMetaAvatar } from "../utils/getUserAvatar";
import { convertTime } from "../utils/convertDate";
import { useSocket } from "../context/SocketContext";
import { Message, User } from "../types/types";
import { Check, CheckCheck } from "lucide-react";
import { getUserName } from "../utils/getUsername";
import { mutate } from "swr";
import { EmptyMessages } from "./EmptyMessages";
import { Loading } from "./icons";

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
  const { socket } = useSocket();
  const { user } = useAuth();
  const [userTyping, setUserTyping] = useState<User | User[] | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

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
    socket?.on(
      "messagesDelivered",
      (data: { chatId: string; messageIds: string[]; receiverId: string }) => {
        console.log("incoming data", data);
        if (data.chatId !== currentChat?._id) {
          return;
        }

        console.log("updating state");
        setAllMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg._id && data.messageIds.includes(msg._id)) {
              return {
                ...msg,
                status: "delivered",
              };
            } else if (!msg._id && msg.status === "sent" && msg.receiverId) {
              return {
                ...msg,
                status: "delivered",
              };
            } else if (
              msg.status === "sent" &&
              msg.receiverId === data.receiverId
            ) {
              return {
                ...msg,
                status: "delivered",
              };
            }

            return msg;
          })
        );
      }
    );

    return () => {
      socket?.off("messagesDelivered");
    };
  }, [socket, currentChat?._id, allMessages]);
  useEffect(() => {
    socket?.on(
      "messagesSeen",
      (data: { receiverId: string; chatId: string }) => {
        if (data.chatId !== currentChat?._id) {
          return;
        }
        setAllMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.status !== "seen" && msg.senderId !== data.receiverId) {
              return {
                ...msg,
                status: "seen",
              };
            }
            return msg;
          })
        );
      }
    );

    return () => {
      socket?.off("messagesSeen");
    };
  }, [currentChat?._id, socket]);

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
  if (isLoading)
    return (
      <div className="flex items-center flex-1 h-full flex-col justify-center">
        <Loading width="32" height="32" />
      </div>
    );
  if (error) return <p>{error.message || "Something went wrong"}</p>;
  console.log("user is typing", userTyping);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 ">
      <div className="flex-col  flex-1  flex gap-6">
        {allMessages.length > 0 ? (
          allMessages.map((msg, index) => (
            <div key={msg._id}>
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
                    <Image
                      src={
                        msg.senderId === user?._id
                          ? getAvatar(user.avatar)
                          : getAvatar(currentChat?.otherUsers.avatar)
                      }
                      alt={"user"}
                      width={48}
                      quality={100}
                      height={48}
                      className="rounded-full"
                    />
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
                        <h2 className="font-medium">
                          {msg.senderId === user?._id
                            ? user.username
                            : currentChat?.otherUsers.username}
                        </h2>
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

                      <p className="text-[#8C8C8C] text-sm">
                        {convertTime(msg.createdAt)}
                      </p>
                    </div>
                    <p
                      className={`${
                        msg.senderId === user?._id
                          ? "bg-[#444CE7] text-white ml-auto"
                          : "bg-white text-black"
                      } w-fit rounded-tr-lg rounded-br-lg flex items-center gap-1 rounded-bl-lg p-4`}
                    >
                      {currentChat?.type !== "group" &&
                        msg.senderId === user?._id &&
                        (msg.status === "sent" ? (
                          <Check />
                        ) : msg.status === "delivered" ? (
                          <CheckCheck />
                        ) : (
                          ""
                        ))}

                      {msg.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <EmptyMessages />
        )}

        {allMessages && userTyping && !Array.isArray(userTyping) && (
          <div className="flex items-center gap-2">
            <Image
              src={userTyping.avatar}
              alt={userTyping.username}
              width={32}
              height={32}
              quality={100}
              className="rounded-full"
            />
          </div>
        )}

        <div ref={lastMessageRef} />
      </div>
    </div>
  );
};
