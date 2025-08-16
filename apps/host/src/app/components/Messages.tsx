"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/chats.store";
import { useAuth } from "../context/AuthContext";
import { getAvatar, getMetaAvatar } from "../utils/getUserAvatar";
import { convertTime } from "../utils/convertDate";
import { Message } from "../types/types";
import { ArrowDownToLine, Check } from "lucide-react";
import { getUserName } from "../utils/getUsername";
import { EmptyMessages } from "./EmptyMessages";
import { DocumentAlt, Loading } from "./icons";
import { Typing } from "./Typing";
import DoubleTick from "./icons/DoubleTick";
import { useTypingIndicator } from "../hooks/useTypingIndicator";
import gsap from "gsap";
import { useMessage } from "../hooks/useMessage";
import { useGroupAction } from "../hooks/useGroupAction";
import { bytesToMegabytes } from "./SelectedImages";

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
  const { currentChat } = useChatStore();
  const { userTyping } = useTypingIndicator();
  useGroupAction(setAllMessages);
  const { user } = useAuth();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  useMessage(setAllMessages, allMessages);

  const scrollToBottom = () => {
    return lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const prevLastMessageId = useRef<string | null>(null);

  useEffect(() => {
    if (allMessages.length === 0) return;

    const lastIndex = allMessages.length - 1;
    const lastMessage = allMessages[lastIndex];

    if (lastMessage._id !== prevLastMessageId.current) {
      const lastMessageEl = messageRefs.current[lastIndex];
      if (lastMessageEl) {
        gsap.fromTo(
          lastMessageEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power1.out" }
        );
      }
      prevLastMessageId.current = lastMessage._id;
    }
  }, [allMessages]);

  if (isLoading)
    return (
      <div className="flex items-center flex-1 h-full flex-col justify-center">
        <Loading width="32" height="32" />
      </div>
    );
  if (error) return <p>{error.message || "Something went wrong"}</p>;

  console.log(allMessages);

  return (
    <div className="flex flex-col h-full overflow-y-auto chat-scrollbar px-4 ">
      <div className="flex-col  flex-1 mt-8  flex gap-4">
        {allMessages.length > 0 ? (
          allMessages.map((msg, index) => {
            return (
              <div
                key={msg._id}
                ref={(el) => {
                  messageRefs.current[index] = el;
                }}
                className="messages"
              >
                {currentChat?.type === "group" &&
                msg.messageType === "system" ? (
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
                        <div
                          className={`${
                            msg.senderId === user?._id
                              ? "bg-[#14222B] items-end rounded-bl-xl ml-auto"
                              : "bg-[#1A1F21] items-start rounded-br-xl "
                          } ${msg.fileType?.startsWith("image/") ? "flex-col flex p-1" : "px-4 py-3"} text-white text-xs xl:text-sm leading-[150%] max-w-[400px] rounded-t-xl flex gap-2 break-words whitespace-pre-line`}
                        >
                          {msg.file && (
                            <>
                              {msg.fileType?.startsWith("image/") && (
                                <div className="w-[126px] h-[107px]">
                                  <img
                                    src={msg.file}
                                    alt="image"
                                    className="rounded-xl w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              {msg.fileType?.startsWith("application/") && (
                                <div
                                  className={`p-2.5 rounded-xl flex items-end justify-between 
                                      ${
                                        msg.senderId === user?._id
                                          ? "bg-[#1E2D38]"
                                          : "bg-[#2A2F32]"
                                      }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <DocumentAlt />

                                    <div className="flex flex-col gap-1">
                                      <h2 className="max-w-[400px] text-sm font-medium truncate">
                                        {msg.fileName}
                                      </h2>
                                      <p className="text-[#868686] text-xs">
                                        {bytesToMegabytes(msg.fileSize)} mb
                                      </p>
                                    </div>
                                  </div>
                                  <ArrowDownToLine
                                    size={16}
                                    className="shrink-0 cursor-pointer"
                                  />
                                </div>
                              )}
                            </>
                          )}

                          <div className={`flex w-full items-end gap-2`}>
                            <p className="break-all">
                              {" "}
                              {msg.content && msg.content}
                            </p>
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
                          </div>
                        </div>
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
            );
          })
        ) : (
          <EmptyMessages />
        )}

        {allMessages.length && userTyping && !Array.isArray(userTyping) ? (
          <Typing userTyping={userTyping} />
        ) : (
          ""
        )}

        {allMessages.length ? (
          <div ref={lastMessageRef} className="mb-18" />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
