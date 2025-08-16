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
import { SelectedFiles } from "./SelectedFiles";
import { toastComponent } from "@repo/ui/toast";
import { Error as ErrorIcon } from "@repo/ui/icons/Error";
import axios, { AxiosProgressEvent } from "axios";

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
  const [images, setImages] = useState<
    {
      imageUrl: string;
      progress: number;
    }[]
  >([]);
  const [files, setFiles] = useState<
    { file: File | null; image?: string; type: string; size: number }[] | null
  >(null);
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
    if (!files) return;
    if (files.length >= 3) {
      toastComponent.error(
        "You can only send 3 images at a time",
        <ErrorIcon />,
        1500
      );

      return;
    }
    fileRef.current?.click();
  };

  const handleImageUpload = async () => {
    if (!images.length || !files?.length) return;

    try {
      let formData = new FormData();

      let currentIteration = 0;

      const config = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total!) * 100
          );

          setImages((prevImages) =>
            prevImages.map((image, index) => {
              if (index === currentIteration) {
                return { ...image, progress: progress };
              }

              return image;
            })
          );
        },
      };

      const imageUrls: {
        file: string;
        fileType: string;
        fileName: string;
        fileSize: number;
      }[] = [];
      for await (const file of files) {
        if (!file.file) continue;
        formData.append("file", file.file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_UPLOAD_PRESET as string
        );

        await axios
          .post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/upload`,
            formData,
            config
          )
          .then((response) => {
            const data = response.data["secure_url"];
            imageUrls.push({
              file: data,
              fileType: files[currentIteration].file!.type,
              fileName: files[currentIteration].file!.name,
              fileSize: files[currentIteration].file!.size,
            });
          })
          .catch((err) => {
            console.log("Error", err);
            throw new Error(err);
          });
        formData = new FormData();
        currentIteration++;
      }

      setImages([]);
      setFiles(null);

      return imageUrls;
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setFiles((prevFile) => [
        ...(prevFile ?? []),
        { file: file, image: imageUrl, type: file.type, size: file.size },
      ]);
      setImages((prevImages) => [...prevImages, { imageUrl, progress: 0 }]);
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
    if (!files || !images.length) return;

    let filesCopy = [...files];

    filesCopy = filesCopy.filter((file) => file.image !== imageUrl);
    setImages((prevImages) =>
      prevImages.filter((image) => image.imageUrl !== imageUrl)
    );
    setFiles(filesCopy);
    return;
  };

  const handleSendMessage = async () => {
    if (loading) return;
    console.log(!images.length);
    if (!content && !images.length) return;

    setLoading(true);
    if (!currentChat?._id || !user?._id) return;

    let tempImages:
      | { file: string; fileType: string; fileName: string; fileSize: number }[]
      | undefined = [];
    if (images.length) {
      tempImages = await handleImageUpload();
    }
    let tempId = uuid();
    if (tempImages?.length) {
      for (const image of tempImages) {
        console.log("image", image);
        addMessage({
          _id: tempId,
          file: image.file,
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
            const message = await sendMessage(
              currentChat?._id,

              tempId,
              content,
              image.file,
              image.fileType,
              image.fileName,
              image.fileSize
            );
            if (!message.success) {
              toast.error(message.message);
            }
          } else {
            const message = await sendGroupMessage(
              currentChat._id,
              content,
              tempId,
              image.file,
              image.fileType,
              image.fileName,
              image.fileSize
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
        tempId = uuid();
      }

      return;
    }

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
        const message = await sendMessage(currentChat?._id, tempId, content);
        if (!message.success) {
          toast.error(message.message);
        }
      } else {
        const message = await sendGroupMessage(
          currentChat._id,

          tempId,
          content
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
