import React from "react";
import { useChatStore } from "../store/chats.store";
import Image from "next/image";
import { useSocket } from "../context/SocketContext";
import { GroupChatImage } from "./GroupChatImage";

export const EmptyMessages = () => {
  const { currentChat } = useChatStore();
  const { onlineUsers } = useSocket();
  const isPrivate = currentChat?.type === "private";

  if (!currentChat) return null;
  const userIsOnline = !Array.isArray(currentChat?.otherUsers)
    ? onlineUsers.includes(currentChat?.otherUsers._id)
    : null;
  return (
    <div className="flex w-fit  flex-1 flex-col gap-6 items-start justify-end mb-4">
      {!Array.isArray(currentChat.otherUsers) ? (
        <div className="relative">
          <Image
            src={currentChat.otherUsers.avatar}
            alt={currentChat.otherUsers.username}
            width={96}
            height={96}
            className="rounded-full"
            quality={100}
          />

          {userIsOnline && (
            <div className="size-2.5 bg-[#34C759] rounded-full absolute top-3 right-2" />
          )}
        </div>
      ) : (
        <GroupChatImage chat={currentChat} from="messages" />
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-white text-left text-2xl  font-medium">
          {isPrivate && !Array.isArray(currentChat.otherUsers)
            ? currentChat.otherUsers.username
            : currentChat.groupName}
        </h2>
        {!Array.isArray(currentChat.otherUsers) ? (
          <p className="text-[#A0A4A6]">
            This is the beginning of your legendary conversation with{" "}
            {currentChat.otherUsers.username}
          </p>
        ) : (
          <p className="text-[#A0A4A6]">
            {" "}
            This is the beginning of your legendary conversation on{" "}
            {currentChat.groupName}
          </p>
        )}
      </div>
    </div>
  );
};
