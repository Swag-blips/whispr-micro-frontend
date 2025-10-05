import React from "react";
import useSWR from "swr";
import { Doc, Picture } from "./icons";
import { getChatFiles } from "../services/chats";
import { useChatStore } from "../store/chats.store";
import { Message } from "../types/types";

export const ChatFiles = () => {
  const { currentChat } = useChatStore();

  const { data, error, isValidating } = useSWR(
    currentChat?._id ? `chat-files-${currentChat._id}` : null,
    () => (currentChat?._id ? getChatFiles(currentChat._id) : null)
  );

  const files = data?.data || [];

  return (
    <div className="px-4 mt-8 ">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-white text-2xl">Files</h2>
        {files.length > 0 && (
          <p className="text-[#CFCFCF] cursor-pointer hover:text-white transition-colors">
            see all
          </p>
        )}
      </div>

      <div className="flex flex-col py-3 mt-4 gap-6">
        {isValidating ? (
          <p className="text-[#A0A4A6] text-sm">Loading files...</p>
        ) : error ? (
          <p className="text-red-400 text-sm">Failed to load files</p>
        ) : files.length === 0 ? (
          <p className="text-[#A0A4A6] text-sm">No files yet</p>
        ) : (
          files.slice(0, 6).map((fileMessage: Message) => {
            const fileType = fileMessage.fileType || "image";
            const name = fileMessage.fileName || fileMessage.file || "file";
            const size = fileMessage.fileSize
              ? `${(fileMessage.fileSize / 1024).toFixed(1)}kb`
              : "-";
            return (
              <div key={fileMessage._id} className="flex items-center gap-2">
                <div className="bg-[#181D21] flex items-center justify-center size-12 rounded-full">
                  {fileType.includes("image") ? <Picture /> : <Doc />}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[#EDEDED]">{name}</p>
                  <p className="text-[#A3A3A3] text-xs">
                    {size} •{" "}
                    {new Date(fileMessage.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
