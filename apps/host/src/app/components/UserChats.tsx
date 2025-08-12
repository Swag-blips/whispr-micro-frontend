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

      <div className=" flex-col flex-1 mt-8 flex items-center justify-center  gap-6">
        <Chats />
      </div>
      {/* 
      <div className="mt-8">
        <h2 className="text-2xl font-medium">Groups</h2>
        <div className="flex items-start mt-8 justify-between">
          <div className="flex items-center gap-2 ">
            <div className="bg-[#F5F5F5] rounded-full size-12 flex items-center justify-center">
              T
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-medium">T pain Group</h1>
              <p className="text-[#8C8C8C] text-sm font-normal ">
                <span className="text-[#8C8C8C] font-medium">You:</span> Send me
                cash
              </p>
            </div>
          </div>
          <div className="flex items-center flex-col gap-1">
            <p>16:23</p>
          </div>
        </div>
        <div className="flex items-start mt-8 justify-between">
          <div className="flex items-center gap-2 ">
            <div className="bg-[#F5F5F5] rounded-full size-12 flex items-center justify-center">
              W
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-medium">Web dev community</h1>
              <p className="text-[#8C8C8C] text-sm font-normal ">
                <span className="text-[#8C8C8C] font-medium">Coolerputt:</span>{" "}
                Free my nigga harambe
              </p>
            </div>
          </div>
          <div className="flex items-center flex-col gap-1">
            <p>16:23</p>
          </div>
        </div>
        <div className="flex items-start mt-8 justify-between">
          <div className="flex items-center gap-2 ">
            <div className="bg-[#F5F5F5] rounded-full size-12 flex items-center justify-center">
              T
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-medium">DSA Study group</h1>
              <p className="text-[#8C8C8C] text-sm font-normal ">
                <span className="text-[#8C8C8C] font-medium">Swag:</span> I
                think we should use hashmaps
              </p>
            </div>
          </div>
          <div className="flex items-center flex-col gap-1">
            <p>16:23</p>
          </div>
        </div>
      </div> */}
    </aside>
  );
};

export default UserChats;
