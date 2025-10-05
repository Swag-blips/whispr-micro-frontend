import { PencilLine, X } from "lucide-react";
import React, { useRef } from "react";
import { useChatStore } from "../store/chats.store";
import Image from "next/image";
import { useSocket } from "../context/SocketContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChatFiles } from "./ChatFiles";
import { StarredMessages } from "./StarredMessages";
import { GroupChatImage } from "./GroupChatImage";
import { GroupMembers } from "./GroupMembers";

export const ChatDetails = () => {
  const { currentChat } = useChatStore();
  const { onlineUsers } = useSocket();

  const headerRef = useRef(null);
  const avatarRef = useRef(null);
  const usernameRef = useRef(null);

  const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
  useGSAP(() => {
    timeline
      .fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
        }
      )
      .fromTo(
        avatarRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 0.5 },
        "+=0.2"
      )
      .fromTo(
        usernameRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        "+=0.1"
      );
  }, [currentChat]);
  if (!currentChat) return null;

  const userIsOnline = !Array.isArray(currentChat?.otherUsers)
    ? onlineUsers.includes(currentChat?.otherUsers._id)
    : null;

  return (
    <div className="w-[298px] relative chat-scrollbar  overflow-y-auto bg-[#101516] border-l border-[#232728] h-full">
      <div
        id="chat-header"
        ref={headerRef}
        className=" sticky top-0 bg-inherit z-50  flex items-center justify-between p-7 border-b border-[#232728]"
      >
        <h2 className="text-white text-2xl font-medium">Chat details</h2>

        <div className="size-12 flex items-center justify-center border border-[#232728] rounded-full">
          <X color="#ffffff" />
        </div>
      </div>

      {!Array.isArray(currentChat.otherUsers) ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <Image
            ref={avatarRef}
            src={currentChat.otherUsers.avatar}
            alt={currentChat.otherUsers.username}
            width={120}
            height={120}
            quality={100}
            className="rounded-full"
          />

          <div className="flex flex-col gap-2 items-center">
            <p ref={usernameRef} className="text-white text-2xl font-semibold">
              {currentChat.otherUsers.username}
            </p>
            <p
              className={`text-[#00FF7F] flex items-center  gap-2 transition-all duration-300 ${
                userIsOnline
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1"
              }`}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF7F] opacity-75"></span>

                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF7F]"></span>
              </span>
              online
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 mt-4">
          <GroupChatImage chat={currentChat} from="messages" />

          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold text-2xl">
              {currentChat.groupName}
            </h2>
            <PencilLine color="#A0A4A6" size={16} className="cursor-pointer" />
          </div>
        </div>
      )}

      {currentChat.type === "group" && (
        <div className="flex flex-col text-left gap-2 mx-4 mt-4">
          <h2 className="text-base font-medium text-white">Details</h2>
          <p className="text-[#A0A4A6] leading-[150%] xl:text-sm">
            {currentChat.bio}
          </p>
        </div>
      )}

      {currentChat.type === "group" && <GroupMembers />}

      {!Array.isArray(currentChat.otherUsers) &&
        currentChat.type === "private" && <ChatFiles />}

      <StarredMessages />
    </div>
  );
};
