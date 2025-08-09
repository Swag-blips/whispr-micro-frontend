"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
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
  const { socket } = useSocket();

  useEffect(() => {
    if (user?._id) {
      initNotifications(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (!notifications.length) return;
    const latestNotification = notifications[notifications.length - 1];
    toast.custom((t) => (
      <div
        className={`bg-white p-4 rounded shadow-md flex items-center gap-3 max-w-sm ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <img
          src={latestNotification.sender.avatar}
          alt={latestNotification.sender.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-gray-800 text-sm">
          <strong>{latestNotification.sender.username}</strong>{" "}
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
    console.log("new chat for user");
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
  if (isLoading) return <div>Loading....</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {allUserChats && allUserChats?.length > 0 ? (
        allUserChats
          ?.sort((a, b) => b.updatedAt - a.updatedAt)
          .map((chat: ChatsType) => (
            <div
              onClick={() => setCurrentChat(chat)}
              key={chat._id}
              className="flex cursor-pointer items-center justify-between"
            >
              <div className="flex items-center  w-full justify-between">
                <div className="flex items-center gap-2">
                  {chat.type === "private" &&
                  !Array.isArray(chat.otherUsers) ? (
                    <Image
                      width={48}
                      height={48}
                      src={getAvatar(chat.otherUsers.avatar)}
                      alt="user"
                      className="rounded-full"
                    />
                  ) : (
                    <div className="bg-[#F5F5F5] flex items-center justify-center size-12 rounded-full">
                      {chat.groupName[0]}
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <h1 className="font-medium">
                      {chat.type === "private" &&
                      !Array.isArray(chat.otherUsers)
                        ? chat.otherUsers.username
                        : chat.groupName}
                    </h1>
                    <p className="text-[#8C8C8C] text-sm font-normal">
                      {chat.lastMessage ||
                        "This is the beginning of our Conversation"}
                    </p>
                  </div>
                </div>

                {chat.unreadMessages > 0 && (
                  <div className="bg-red-500 text-sm flex items-center justify-center  size-6 rounded-full text-white">
                    {chat.unreadMessages}
                  </div>
                )}
              </div>
            </div>
          ))
      ) : (
        <EmptyChats />
      )}
    </>
  );
};

export default Chats;
