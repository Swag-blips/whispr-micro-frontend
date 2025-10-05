import React from "react";
import { Chats } from "../types/types";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

type Props = {
  chat: Chats;
  from?: "messages" | "chats";
};
export const GroupChatImage = ({ chat, from }: Props) => {
  const otherUsers =
    Array.isArray(chat.otherUsers) && chat.otherUsers.slice(0, 2);
  const { user } = useAuth();

  if (!user) return null;
  return (
    <div className="flex items-center flex-col">
      <Image
        src={user.avatar}
        width={from === "messages" ? 48 : 24}
        height={from === "messages" ? 48 : 24}
        quality={100}
        className="rounded-full"
        alt="user"
      />

      <div className="flex items-center">
        {Array.isArray(otherUsers) &&
          otherUsers.map((user) => (
            <div key={user._id} className="flex items-center">
              <Image
                src={user.avatar}
                width={from === "messages" ? 48 : 24}
                height={from === "messages" ? 48 : 24}
                quality={100}
                className="rounded-full"
                alt="user"
              />
            </div>
          ))}
      </div>
    </div>
  );
};
