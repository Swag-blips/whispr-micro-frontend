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
import { Message } from "../types/types";
import { Attachment, Emoji, Send } from "./icons";
import { AttachmentOpen } from "./AttachmentOpen";
import { SelectedImages } from "./SelectedImages";
import { toastComponent } from "@repo/ui/toast";
import { Error as ErrorIcon } from "@repo/ui/icons/Error";

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
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const debounceStopTypingRef = useRef(
    debounce(() => {
      socket?.emit("stopTyping", {
        chatId: currentChat?._id,
        userId: user?._id,
      });
    }, 500)
  );

  const handleImagePicker = () => {
    if (images.length >= 3) {
      toastComponent.error(
        "You can only send 3 images at a time",
        <ErrorIcon />,
        1500
      );

      return;
    }
    fileRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setFiles((prevFile) => [...prevFile, event.target.files![0]]);
      setImages((prevImages) => [...prevImages, imageUrl]);
    }
    setAttachmentOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContent(value);

    if (value.trim()) {
      socket?.emit("startTyping", { chatId: currentChat?._id });
      debounceStopTypingRef.current();
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setImages((prevImages) => prevImages.filter((image) => image !== imageUrl));

    return;
  };

  const handleSendMessage = async () => {
    if (loading) return;
    if (!content) return;
    setLoading(true);
    if (!currentChat?._id || !user?._id) return;
    const tempId = uuid();

    addMessage({
      _id: tempId,
      tempId,
      chatId: currentChat._id,
      content,
      senderId: user._id,
      messageType: "text",
      status: "sent",
      createdAt: new Date().toISOString(),
    });
    try {
      if (currentChat.type === "private") {
        const message = await sendMessage(currentChat?._id, content, tempId);
        if (!message.success) {
          toast.error(message.message);
        }
      } else {
        const message = await sendGroupMessage(
          currentChat._id,
          content,
          tempId
        );
        if (message.success) {
          toast.success(message.message);
        } else {
          toast.error(message.message);
        }
      }
      mutate("userChats");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
      setContent("");
    }
  };

  console.log("images", images);
  console.log("files", files);

  return (
    <div
      className={`bg-[#101516] ${images.length ? "flex-col px-4 pb-4 pt-2 " : "h-[72px] items-center p-4"} transition-all duration-300 relative flex  gap-2   w-full`}
    >
      {images.length > 0 && (
        <SelectedImages
          selectedImages={images}
          handleRemoveImages={handleRemoveImage}
        />
      )}
      {attachmentOpen && (
        <AttachmentOpen handleImagePicker={handleImagePicker} />
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
          accept="image/*"
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

          <Emoji />
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
