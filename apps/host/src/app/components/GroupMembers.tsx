import React from "react";
import { useChatStore } from "../store/chats.store";
import Image from "next/image";
import { useSocket } from "../context/SocketContext";

export const GroupMembers = () => {
  const { currentChat } = useChatStore();

  const { onlineUsers } = useSocket();
  const otherUsers = Array.isArray(currentChat?.otherUsers)
    ? currentChat.otherUsers.slice(0, 4)
    : null;
  return (
    <div className="mx-4 mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-medium text-base">members</h2>

        <p className="text-[#A0A4A6]">see all</p>
      </div>

      <div className="flex flex-col gap-6 mt-4">
        {otherUsers?.map((user) => (
          <div key={user._id} className="flex items-center gap-2">
            <div className="relative">
              <Image
                src={user.avatar}
                alt="user"
                width={48}
                height={48}
                className="rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <div className="size-2.5 bg-[#34C759] rounded-full absolute top-1 right-0" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-white">{user.username}</h2>
              <p
                className={` transition-all duration-300 ${onlineUsers.includes(user._id) ? "text-[#34C759]" : "text-[#A0A4A6]"}`}
              >
                {onlineUsers.includes(user._id) ? "online" : "offline"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
