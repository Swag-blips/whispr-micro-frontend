"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

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

  useEffect(() => {
    if (user) {
      const socket = io("http://localhost:3005", {
        query: {
          userId: user._id,
        },
      });

      socketRef.current = socket;
      setConnected(true);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

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
      console.log("incoming users", data);
      const parsedData = JSON.parse(data);
      setOnlineUsers(parsedData || []);
    });
  }, [user, socketRef]);

  return (
    <SocketContext.Provider
      value={{ onlineUsers, socket: socketRef.current, connected }}
    >
      {children}
    </SocketContext.Provider>
  );
};
