"use client";

import { Search } from "lucide-react";
import Chats from "./Chats";
import { CreateGroup } from "./CreateGroup";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { ActiveUsers } from "./ActiveUsers";

const UserChats = () => {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  return (
    <aside className="w-[423px] bg-[#101516]   flex-col overflow-y-auto h-full flex  border-r border-[#232728]">
      <div className="flex items-center p-4 border-b border-[#232728] justify-between">
        <div className="flex items-center gap-2">
          {user?.avatar && (
            <div className="relative">
              <img
                src={user.avatar}
                alt="user"
                className=" size-14 rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <div className="size-2.5 bg-[#34C759] rounded-full absolute top-2 right-0" />
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="font-medium text-left text-white">{user?.username}</p>
            <p className="text-[#C4C4C4] max-w-[200px] truncate">{user?.bio}</p>
          </div>
        </div>

        <CreateGroup />
      </div>

      <div className="bg-[#1F2324] mx-4 border border-[#2A2E2F] flex items-center gap-2 rounded-lg p-4 mt-6 ">
        <Search color="#6C757D" strokeWidth={1} />
        <input
          className="outline-none text-white placeholder:text-[#A0A4A6] bg-transparent"
          type="text"
          placeholder="Search for a friend"
        />
      </div>
      <ActiveUsers />

      <Chats />
    </aside>
  );
};

export default UserChats;
