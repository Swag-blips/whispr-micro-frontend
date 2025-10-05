"use client";
import React, { useEffect, useRef, useState } from "react";
import { Message as MessageType } from "../types/types";
import { EmptyMessages } from "./EmptyMessages";
import { Loading } from "./icons";
import { Typing } from "./Typing";
import { useTypingIndicator } from "../hooks/useTypingIndicator";
import gsap from "gsap";
import { useMessage } from "../hooks/useMessage";
import { useGroupAction } from "../hooks/useGroupAction";
import Message from "./Message";

interface MessagesProps {
  allMessages: MessageType[];
  setAllMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  isLoading: boolean;
  error: Error;
}

export const Messages = ({
  allMessages,
  setAllMessages,
  isLoading,
  error,
}: MessagesProps) => {
  const { userTyping } = useTypingIndicator();
  useGroupAction(setAllMessages);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  return (
    <div className="flex flex-col h-full overflow-y-auto chat-scrollbar px-4 ">
      <div className="flex-col  flex-1 mt-8  flex gap-4">
        {allMessages.length > 0 ? (
          allMessages.map((msg, index) => {
            return (
              <Message
                key={msg._id}
                msg={msg}
                messageRefs={messageRefs}
                index={index}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
              />
            );
          })
        ) : (
          <EmptyMessages />
        )}

        {allMessages.length && userTyping && Array.isArray(userTyping) ? (
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
