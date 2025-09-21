"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useChatStore } from "../store/chats.store";

interface SocketContext {
  socket: Socket | null;
  onlineUsers: Array<string>;
  connected: boolean;
}

export const SocketContext = createContext<SocketContext>({
  socket: null,
  onlineUsers: [],
  connected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const { user } = useAuth();
  const { currentChat } = useChatStore();
  console.log("CURRENTCHAT", currentChat);

  useEffect(() => {
    if (user) {
      const socket = io("http://localhost:3005", {
        query: {
          userId: user._id,
        },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      socketRef.current = socket;
      setConnected(true);

     

      socket.on("connect_error", (err: Error) => {
        console.log(err.message);
      });

      return () => {
        socket.disconnect();
        setConnected(false);
        socketRef.current = null;
      };
    } else {
      socketRef.current?.disconnect();
      setConnected(false);
      socketRef.current = null; 
    }
  }, [user]);

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("onlineUsers", (data) => {
      const parsedData = JSON.parse(data);
      setOnlineUsers(parsedData || []);
    });
  }, [user, socketRef]);

  console.log("onlineUsers", onlineUsers);

  return (
    <SocketContext.Provider
      value={{ onlineUsers, socket: socketRef.current, connected }}
    >
      {children}
    </SocketContext.Provider>
  );
};
