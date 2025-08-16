import Image from "next/image";
import React from "react";
import { Check } from "lucide-react";
import { getUserName } from "../utils/getUsername";
import { getAvatar, getMetaAvatar } from "../utils/getUserAvatar";
import { convertTime } from "../utils/convertDate";
import DoubleTick from "./icons/DoubleTick";
import { Message as MessageType } from "../types/types";
import { useChatStore } from "../store/chats.store";
import { useAuth } from "../context/AuthContext";
import { FileMessage } from "./FileMessage";

type Props = {
  msg: MessageType;
  messageRefs: React.RefObject<(HTMLDivElement | null)[]>;
  index: number;
};

export const Message = ({ msg, messageRefs, index }: Props) => {
  const { currentChat } = useChatStore();
  const { user } = useAuth();

  const isSender = msg.senderId === user?._id;
  return (
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
                isSender
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
            {currentChat?.type === "group" && (
              <div
                className={`flex ${isSender ? "flex-row-reverse" : ""} items-center gap-4`}
              >
                <h2>
                  {isSender
                    ? user.username
                    : getUserName(currentChat?.otherUsers, msg.senderId)}
                </h2>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div
                className={`${
                  isSender
                    ? "bg-[#14222B] items-end rounded-bl-xl ml-auto"
                    : "bg-[#1A1F21] items-start rounded-br-xl "
                } ${msg.fileType?.startsWith("image/") ? "flex-col flex  p-1" : "px-4 py-3"} text-white text-xs xl:text-sm leading-[150%] max-w-[400px] rounded-t-xl flex gap-2 `}
              >
                {msg.file && <FileMessage msg={msg} />}

                <div className={`flex  items-end gap-2`}>
                  <p className="break-all"> {msg.content && msg.content}</p>
                  {currentChat?.type !== "group" &&
                    isSender &&
                    (msg.status === "sent" ? (
                      <Check size={16} color="#A0A4A6" className="shrink-0" />
                    ) : msg.status === "delivered" ? (
                      <DoubleTick />
                    ) : (
                      <DoubleTick color="#4AA4F9" />
                    ))}
                </div>
              </div>
              <p
                className={`text-[#8C8C8C] ${isSender ? "ml-auto" : ""} xl:text-xs  text-[10px]`}
              >
                {convertTime(msg.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
