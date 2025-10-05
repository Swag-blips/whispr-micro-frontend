import Image from "next/image";
import React, { SetStateAction } from "react";
import { Check, Star } from "lucide-react";
import { getUserName } from "../utils/getUsername";
import { getAvatar, getMetaAvatar } from "../utils/getUserAvatar";
import { convertTime } from "../utils/convertDate";
import DoubleTick from "./icons/DoubleTick";
import { Message as MessageType } from "../types/types";
import { useChatStore } from "../store/chats.store";
import { useAuth } from "../context/AuthContext";
import { FileMessage } from "./FileMessage";
import { starMessage } from "../services/chats";
import useSWRMutation from "swr/mutation";
import { toastComponent } from "@repo/ui/toast";
import { Success } from "@repo/ui/icons/Success";
import { Error } from "@repo/ui/icons/Error";

export type HoveredMessage = {
  index: number | null;
  isHover: boolean;
};
type Props = {
  msg: MessageType;
  messageRefs: React.RefObject<(HTMLDivElement | null)[]>;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: React.Dispatch<SetStateAction<number | null>>;
};

const Message = 
  ({ msg, messageRefs, index, setHoveredIndex, hoveredIndex }: Props) => {
    const { currentChat } = useChatStore();
    const { user } = useAuth();

    const { trigger: handleStarMessage, isMutating: isStarring } =
      useSWRMutation(`/chat/star-message/${currentChat?._id}`, starMessage);

    const isSender = msg.senderId === user?._id;
    const isStarredByUser = msg.starredBy?.includes(user?._id || "");

    const onStarMessage = async () => {
      if (!currentChat?._id || !msg._id || isStarring) return;

      try {
        await handleStarMessage({ messageId: msg._id });
        toastComponent.success(
          "Message starred successfully",
          <Success />,
          1000
        );
        setHoveredIndex(null);
      } catch (error) {
        toastComponent.error("Failed to star message", <Error />);
        console.error("Error starring message:", error);
      }
    };

    const handleOpenContextMenu = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: number,
      senderId: string
    ) => {
      e.preventDefault();

      if (index === hoveredIndex) {
        setHoveredIndex(null);
        return;
      }
      if (senderId === user?._id) return;
      setHoveredIndex(index);
      return;
    };

    console.log("hoveredIndex", hoveredIndex);

    return (
      <div
        key={msg._id}
        ref={(el) => {
          messageRefs.current[index] = el;
        }}
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

              <div className=" relative w-fit flex items-center justify-center gap-2">
                <div className=" relative flex flex-col gap-2">
                  <div
                    onContextMenu={(e) =>
                      handleOpenContextMenu(e, index, msg.senderId)
                    }
                    className={`${
                      isSender
                        ? "bg-[#14222B] items-end rounded-bl-xl ml-auto"
                        : "bg-[#1A1F21] items-start rounded-br-xl "
                    } ${msg.fileType?.startsWith("image/") ? "flex-col flex w-[180px] p-1" : "px-4 max-w-[400px] py-3"} text-white text-xs xl:text-sm leading-[150%] cursor-pointer rounded-t-xl flex gap-2 `}
                  >
                    {msg.file && <FileMessage msg={msg} />}

                    <div className={`flex  items-end gap-2`}>
                      <p className="break-all"> {msg.content && msg.content}</p>
                      {currentChat?.type !== "group" &&
                        isSender &&
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
                    className={`text-[#8C8C8C] ${isSender ? "ml-auto" : ""} xl:text-xs  text-[10px]`}
                  >
                    {convertTime(msg.createdAt)}
                  </p>
                </div>
                {hoveredIndex === index && (
                  <div
                    className={` cursor-pointer absolute ${isStarredByUser ? "-right-[11rem]" : "-right-[10rem]"}   top-0 bg-[#1A1F21] border border-[#232728] rounded-lg p-2 shadow-lg z-50 ml-2`}
                  >
                    <button
                      onClick={onStarMessage}
                      disabled={isStarring || isStarredByUser}
                      className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors whitespace-nowrap ${
                        isStarredByUser
                          ? "text-yellow-400 bg-[#2A2E2F]"
                          : "text-white hover:bg-[#2E3235]"
                      }`}
                    >
                      {isStarring ? (
                        <div className="w-4 h-4 animate-spin border border-gray-300 border-t-transparent rounded-full" />
                      ) : (
                        <Star
                          size={16}
                          fill={isStarredByUser ? "currentColor" : "none"}
                        />
                      )}
                      {isStarredByUser ? "Message starred" : "Star Message"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


export default Message;
