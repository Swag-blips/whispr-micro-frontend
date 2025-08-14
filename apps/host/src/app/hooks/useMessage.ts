import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../context/SocketContext";
import { useChatStore } from "../store/chats.store";
import { Message } from "../types/types";

export const useMessage = (
  setAllMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  allMessages: Message[]
) => {
  const { socket } = useSocket();
  const { currentChat } = useChatStore();
  useEffect(() => {
    socket?.on(
      "messagesDelivered",
      (data: { chatId: string; messageIds: string[]; receiverId: string }) => {
        console.log("incoming data", data);
        if (data.chatId !== currentChat?._id) {
          return;
        }

        console.log("updating state");
        setAllMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg._id && data.messageIds.includes(msg._id)) {
              return {
                ...msg,
                status: "delivered",
              };
            } else if (!msg._id && msg.status === "sent" && msg.receiverId) {
              return {
                ...msg,
                status: "delivered",
              };
            } else if (
              msg.status === "sent" &&
              msg.receiverId === data.receiverId
            ) {
              return {
                ...msg,
                status: "delivered",
              };
            }

            return msg;
          })
        );
      }
    );

    return () => {
      socket?.off("messagesDelivered");
    };
  }, [socket, currentChat?._id, allMessages]);
  useEffect(() => {
    socket?.on(
      "messagesSeen",
      (data: { receiverId: string; chatId: string }) => {
        if (data.chatId !== currentChat?._id) {
          return;
        }
        setAllMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.status !== "seen" && msg.senderId !== data.receiverId) {
              return {
                ...msg,
                status: "seen",
              };
            }
            return msg;
          })
        );
      }
    );

    return () => {
      socket?.off("messagesSeen");
    };
  }, [currentChat?._id, socket]);
};
