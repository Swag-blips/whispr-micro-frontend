import { X } from "lucide-react";
import React, { useRef } from "react";
import { useChatStore } from "../store/chats.store";
import Image from "next/image";
import { useSocket } from "../context/SocketContext";
import { Doc, Picture, Star } from "./icons";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const ChatDetails = () => {
  const { currentChat } = useChatStore();
  const { onlineUsers } = useSocket();

  const headerRef = useRef(null);
  const avatarRef = useRef(null);
  const usernameRef = useRef(null);
  const onlineRef = useRef(null);

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
        <></>
      )}

      <div className="px-4 mt-8 ">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-white text-2xl">Files</h2>
          <p className="text-[#CFCFCF]">see all</p>
        </div>

        <div className="flex flex-col py-3 mt-4 gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-[#181D21] flex items-center justify-center size-12 rounded-full">
              <Picture />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#EDEDED]">Design.png</p>
              <p className="text-[#A3A3A3] text-xs">1.2mb • Jul 22, 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#181D21] flex items-center justify-center size-12 rounded-full">
              <Picture />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#EDEDED]">Swag.png</p>
              <p className="text-[#A3A3A3] text-xs">50kb • Jul 30, 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#181D21] flex items-center justify-center size-12 rounded-full">
              <Doc />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#EDEDED]">Swag.docx</p>
              <p className="text-[#A3A3A3] text-xs">8kb • Jul 30, 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mx-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-white text-2xl">Starred messages</h2>
          <p className="text-[#CFCFCF]">see all</p>
        </div>

        <div className="flex flex-col mt-4 gap-4">
          <div className="flex flex-col gap-2">
            <div className="bg-[#14222B] flex items-center gap-2 rounded-t-lg rounded-bl-lg  px-4 py-3">
              <Star />
              <p className="text-white text-xs leading-[150%]  ">
                Alright, I’ll look in the Trash first. If it’s really gone, I’ll
                let you know. Appreciate the help
              </p>
            </div>

            <p className="text-[10px] ml-auto text-[#A0A4A6]">10:00pm</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-[#1A1F21] flex items-center gap-2 rounded-t-lg rounded-bl-lg  px-4 py-3">
              <Star />

              <p className="text-white text-xs leading-[150%]  ">
                Thanks for checking. Could you please share the name of the
                file, the folder it was in....
              </p>
            </div>
            <p className="text-[10px] ml-auto text-[#A0A4A6]">10:00pm</p>
          </div>
        </div>
      </div>
    </div>
  );
};
