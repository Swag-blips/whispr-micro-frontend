import React from "react";
import useSWR from "swr";
import { getStarredMessages } from "../services/chats";
import { useChatStore } from "../store/chats.store";
import { convertTime } from "../utils/convertDate";
import { Message } from "../types/types";
import { useAuth } from "../context/AuthContext";
import { Star, Check } from "lucide-react";
import DoubleTick from "./icons/DoubleTick";

export const StarredMessages = () => {
  const { currentChat } = useChatStore();
  const { user } = useAuth();

  const {
    data: starredData,
    error,
    isValidating,
  } = useSWR(
    currentChat?._id ? `starred-messages-${currentChat._id}` : null,
    () => (currentChat?._id ? getStarredMessages(currentChat._id) : null)
  );

  const starredMessages: Message[] = starredData?.data || [];

  return (
    <div className="mt-8 mx-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-white text-2xl">Starred messages</h2>
        {starredMessages.length > 0 && (
          <p className="text-[#CFCFCF] cursor-pointer hover:text-white transition-colors">
            see all
          </p>
        )}
      </div>

      <div className="flex flex-col mt-4 gap-4">
        {isValidating ? (
          <div className="text-center py-8">
            <p className="text-[#A0A4A6] text-sm">
              Loading starred messages...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400 text-sm">
              Failed to load starred messages
            </p>
          </div>
        ) : starredMessages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#A0A4A6] text-sm">No starred messages yet</p>
          </div>
        ) : (
          starredMessages.slice(0, 5).map((message: Message) => {
            const isSender = message.senderId === user?._id;
            // determine status icon based on message.status
            const statusIcon =
              message.status === "sent" ? (
                <Check size={16} color="#A0A4A6" />
              ) : message.status === "delivered" ? (
                <DoubleTick />
              ) : (
                // seen / read
                <DoubleTick color="#4AA4F9" />
              );

            return (
              <div key={message._id} className="flex flex-col gap-2">
                <div
                  className={`${
                    isSender
                      ? "bg-[#14222B] rounded-t-lg rounded-bl-lg"
                      : "bg-[#1A1F21] rounded-t-lg rounded-br-lg"
                  } flex items-center gap-2 px-4 py-3`}
                >
                  <Star fill="#fff" size={16} className="shrink-0" />
                  {/** truncate long messages to keep the list compact */}
                  <p
                    className="text-white text-xs leading-[150%] break-words"
                    title={message.content}
                  >
                    {typeof message.content === "string" &&
                    message.content.length > 120
                      ? `${message.content.slice(0, 120)}...`
                      : message.content}
                  </p>
                  <span className="ml-auto shrink-0">{statusIcon}</span>
                </div>
                <p className="text-[10px] ml-auto text-[#A0A4A6]">
                  {convertTime(message.createdAt)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
