"use client";
import { Mic } from "lucide-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { sendGroupMessage, sendMessage } from "../services/chats";
import { useChatStore } from "../store/chats.store";
import { useSocket } from "../context/SocketContext";
import { mutate } from "swr";
import { v4 as uuid } from "uuid";
import { useAuth } from "../context/AuthContext";
import { Message, TempMessage } from "../types/types";
import { Attachment, Emoji, Send } from "./icons";
import { AttachmentOpen } from "./AttachmentOpen";
import { SelectedFiles } from "./SelectedFiles";
import { useImageUpload } from "../hooks/useImageUpload";
import EmojiPicker from "emoji-picker-react";

function debounce(cb: (...args: unknown[]) => void, delay = 1000) {
  let timeout: NodeJS.Timeout;
  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export const MessageInput = ({
  addMessage,
}: {
  addMessage: (msg: Message) => void;
}) => {
  const { currentChat } = useChatStore();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const {
    fileRef,
    images,
    files,
    handleImagePicker,
    handleImageChange,
    handleRemoveImage,
    handleImageUpload,
  } = useImageUpload();

  const debounceStopTypingRef = useRef(
    debounce(() => {
      socket?.emit("stopTyping", {
        chatId: currentChat?._id,
        userId: user?._id,
      });
    }, 500)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContent(value);
    if (value.trim()) {
      socket?.emit("startTyping", { chatId: currentChat?._id });
      debounceStopTypingRef.current();
    }
  };

  const buildTempMessage = (
    tempId: string,
    chatId: string,
    senderId: string,
    content: string,
    file?: {
      file: string;
      fileType: string;
      fileName: string;
      fileSize: number;
    }
  ): TempMessage => ({
    _id: tempId,
    tempId,
    chatId,
    content,
    senderId,
    messageType: "text",
    status: "sent",
    createdAt: new Date().toISOString(),
    ...(file
      ? {
          file: file.file,
          fileType: file.fileType,
          fileName: file.fileName,
          fileSize: file.fileSize,
        }
      : {}),
  });

  const sendChatMessage = async (
    chat: typeof currentChat,
    tempId: string,
    content: string,
    file?: {
      file: string;
      fileType: string;
      fileName: string;
      fileSize: number;
    }
  ) => {
    if (chat?.type === "private") {
      return sendMessage(
        chat._id,
        tempId,
        content,
        file?.file,
        file?.fileType,
        file?.fileName,
        file?.fileSize
      );
    } else {
      return sendGroupMessage(
        chat!._id,
        tempId,
        content,
        file?.file,
        file?.fileType,
        file?.fileName,
        file?.fileSize
      );
    }
  };

  const handleSendMessage = async () => {
    if (
      loading ||
      (!content && !images.length) ||
      !currentChat?._id ||
      !user?._id
    )
      return;

    setLoading(true);

    try {
      const uploadedImages = images.length
        ? (await handleImageUpload()) || []
        : [];

      if (uploadedImages.length) {
        for (const img of uploadedImages) {
          const tempId = uuid();
          const tempMessage = buildTempMessage(
            tempId,
            currentChat._id,
            user._id,
            content,
            img
          );
          addMessage(tempMessage);

          await sendChatMessage(currentChat, tempId, content, img);
        }
      } else {
        const tempId = uuid();
        const tempMessage = buildTempMessage(
          tempId,
          currentChat._id,
          user._id,
          content
        );
        addMessage(tempMessage);

        await sendChatMessage(currentChat, tempId, content);
      }

      mutate("userChats");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setLoading(false);
      setContent("");
    }
  };

  console.log("Content", content);

  return (
    <div
      className={`bg-[#101516] ${images.length ? "flex-col px-4 pb-4 pt-2 " : "h-[72px] items-center p-4"} transition-all duration-300 relative flex  gap-2   w-full`}
    >
      {images.length > 0 && (
        <SelectedFiles
          files={files}
          selectedImages={images}
          handleRemoveImages={handleRemoveImage}
        />
      )}
      {attachmentOpen && (
        <AttachmentOpen handleImagePicker={handleImagePicker} />
      )}
      {emojiPickerOpen && (
        <div className="absolute right-15 -top-[22rem]">
          <EmojiPicker
            height={"350px"}
            onEmojiClick={(emoji) => {
              setContent((prevContent) => prevContent + " " + emoji.emoji);
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-2 w-full">
        <div
          onClick={() =>
            setAttachmentOpen((prevAttachmentState) => !prevAttachmentState)
          }
          className={`size-8 cursor-pointer  ${attachmentOpen ? "bg-[#1F242A]" : "bg-[#181D21] "} transition-all duration-300 rounded-full flex items-center justify-center `}
        >
          <Attachment />
        </div>

        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*, application/pdf,.doc,.docx"
          hidden
          ref={fileRef}
        />
        <div className="bg-[#1A1F20] relative p-3  rounded-xl flex items-center w-full">
          <div className="flex flex-1 items-center gap-2">
            <input
              type="text"
              value={content}
              onChange={handleInputChange}
              placeholder="Type a message"
              className="placeholder:text-xs w-full placeholder:text-[#999999] text-white outline-none"
            />
          </div>

          <div
            className="cursor-pointer"
            onClick={() =>
              setEmojiPickerOpen((prevEmojiPickerOpen) => !prevEmojiPickerOpen)
            }
          >
            <Emoji />
          </div>
        </div>

        <Mic color="#868686" />

        <div
          onClick={handleSendMessage}
          className="size-8 bg-[#181D21] cursor-pointer rounded-full flex items-center justify-center "
        >
          <Send />
        </div>
      </div>
    </div>
  );
};
