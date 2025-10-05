"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { getUserChats } from "../services/chats";
import { Chats as ChatsType } from "../types/types";
import { useChatStore } from "../store/chats.store";
import useSWR from "swr";
import { getAvatar } from "../utils/getUserAvatar";
import { useSocket } from "../context/SocketContext";
import { useNotificationStore } from "../store/notification.store";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { EmptyChats } from "./EmptyChats";
import { Loading } from "./icons";
import { convertTime } from "../utils/convertDate";
import { GroupChatImage } from "./GroupChatImage";

const Chats = () => {
  const [allUserChats, setAllUserChats] = useState<ChatsType[]>([]);
  const {
    data: userChats,
    isLoading,
    error,
  } = useSWR("userChats", getUserChats);
  const { user } = useAuth();
  const initNotifications = useNotificationStore(
    (state) => state.initNotifications
  );
  const notifications = useNotificationStore((state) => state.notifications);
  const { setCurrentChat, currentChat } = useChatStore();
  const { socket, onlineUsers } = useSocket();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (user?._id) {
      initNotifications(user._id);
    }
  }, [user]);

  useEffect(() => {
    audioRef.current = new Audio(
      "https://res.cloudinary.com/dh3c9ay9z/video/upload/v1755364016/notification-sound_txordh.mp3"
    );

    const unlockSound = () => {
      audioRef.current?.play().catch(() => {
        console.log("Sound unlocked after user interaction");
      });
    };

    document.addEventListener("click", unlockSound, { once: true });

    return () => {
      document.removeEventListener("click", unlockSound);
    };
  }, []);

  useEffect(() => {
    if (!notifications.length) return;
    const latestNotification = notifications[notifications.length - 1];

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Notification sound blocked:", err);
      });
    }

    toast.custom((t) => (
      <div
        className={`p-4 rounded-xl flex items-center gap-3  bg-[#1E1E1E] text-[#EDEDED]  shadow-[0px_4px_12px_rgba(0,0,0,0.3)] ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <img
          src={latestNotification.sender.avatar}
          alt={latestNotification.sender.username}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span>
          <span>{latestNotification.sender.username}</span>{" "}
          {latestNotification.type === "sendFriendRequest"
            ? "sent you a friend request"
            : "accepted your friend request"}
        </span>
      </div>
    ));
  }, [notifications]);
  useEffect(() => {
    if (userChats?.chats.length) {
      setAllUserChats(userChats.chats);
    }
  }, [userChats, isLoading]);

  const handleUpdateChat = (data: { chatId: string; content: string }) => {
    setAllUserChats((prevUserChats) =>
      prevUserChats.map((chat) => {
        if (chat._id === data.chatId) {
          return {
            ...chat,
            lastMessage: data.content,
            unreadMessages: chat.unreadMessages + 1,
          };
        }
        return chat;
      })
    );
  };
  useEffect(() => {
    socket?.on("addToChats", (data: { chatId: string; content: string }) => {
      if (currentChat?._id === data.chatId) return;
      handleUpdateChat(data);
    });

    return () => {
      socket?.off("addToChats");
    };
  }, [socket]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center flex-1">
        <Loading width="32" height="32" />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div
      className={`flex-col mt-8 flex justify-center   ${!allUserChats.length && "flex-1 px-0"} gap-6`}
    >
      <h2 className="text-white text-2xl font-medium mx-4">Messages</h2>
      {allUserChats && allUserChats?.length > 0 ? (
        allUserChats
          ?.sort((a, b) => b.updatedAt - a.updatedAt)
          .map((chat: ChatsType) => {
            const userIsOnline = !Array.isArray(chat.otherUsers)
              ? onlineUsers.includes(chat.otherUsers._id)
              : null;
            return (
              <div
                onClick={() => {
                  if (currentChat?._id === chat._id) return;
                  setCurrentChat(chat);
                }}
                key={chat._id}
                className={`flex cursor-pointer transition-all duration-400 items-center justify-between ${currentChat?._id === chat._id ? "bg-[#181D21] mx-0 p-4" : "mx-4"} `}
              >
                <div className="flex items-center  w-full justify-between">
                  <div className="flex items-center gap-2">
                    {chat.type === "private" &&
                    !Array.isArray(chat.otherUsers) ? (
                      <div className="relative">
                        <Image
                          width={48}
                          height={48}
                          src={getAvatar(chat.otherUsers.avatar)}
                          alt="user"
                          className="rounded-full"
                          quality={100}
                        />

                        {userIsOnline && (
                          <div className="size-2.5 bg-[#34C759] rounded-full absolute top-1 -right-0" />
                        )}
                      </div>
                    ) : (
                      <GroupChatImage chat={chat} />
                    )}

                    <div className="flex flex-col gap-1">
                      <h1 className="font-medium text-white">
                        {chat.type === "private" &&
                        !Array.isArray(chat.otherUsers)
                          ? chat.otherUsers.username
                          : chat.groupName}
                      </h1>
                      <p
                        className={`text-[#A0A4A6]  ${chat.lastMessage ? "w-[250px]  truncate " : ""}text-sm font-normal`}
                      >
                        {chat.lastMessage ||
                          "This is the beginning of our Conversation"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-[#7C7F82]  text-right text-xs">
                      {" "}
                      {convertTime(chat.updatedAt)}
                    </p>

                    <div
                      className={`bg-[#F25C5C] text-[11px] ${
                        chat.unreadMessages > 0
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-1  "
                      } flex items-center justify-center  size-4 rounded-full text-white`}
                    >
                      {chat.unreadMessages}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
      ) : (
        <EmptyChats />
      )}
    </div>
  );
};

export default Chats;
