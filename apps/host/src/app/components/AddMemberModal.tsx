import Image from "next/image";
import React from "react";
import { getAvatar } from "../utils/getUserAvatar";

import { User } from "../types/types";
import { X } from "lucide-react";
import { Loading } from "./icons";
import { useSocket } from "../context/SocketContext";

type Props = {
  setShowAddModal: (state: boolean) => void;
  addableFriends: User[];
  selectedToAdd: string[];
  setSelectedToAdd: React.Dispatch<React.SetStateAction<string[]>>;
  handleAddMembers: () => void;
  isAdding: boolean;
  loadingFriends: boolean;
};

export const AddMemberModal = ({
  setShowAddModal,
  addableFriends,
  selectedToAdd,
  setSelectedToAdd,
  handleAddMembers,
  isAdding,
  loadingFriends,
}: Props) => {
  const { onlineUsers } = useSocket();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/5 backdrop-blur-sm">
      <div className="bg-[#101516] flex-flex-col rounded-2xl shadow-lg p-4 w-full max-w-md relative">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium text-white">Friends</h2>
          <button
            className=" ml-auto"
            onClick={() => setShowAddModal(false)}
            aria-label="Close"
          >
            <X color="#C4C4C4" className="cursor-pointer" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3  mt-4 max-h-[484px] overflow-y-auto">
            {loadingFriends ? (
              <Loading />
            ) : addableFriends.length === 0 ? (
              <p>No friends to add</p>
            ) : (
              addableFriends.map((user: User) => (
                <label
                  key={user._id}
                  className="flex items-center gap-3 cursor-pointer  rounded-lg "
                >
                  <div className="relative">
                    <Image
                      src={getAvatar(user.avatar)}
                      alt={user.username}
                      width={48}
                      height={48}
                      quality={100}
                      className="rounded-full"
                    />

                    {onlineUsers.includes(user._id) && (
                      <div className="size-2.5 bg-[#34C759] rounded-full absolute top-1 right-0" />
                    )}
                  </div>
                  <div className="flex-1 gap-1 flex flex-col">
                    <div className="font-medium text-white ">
                      {user.username}
                    </div>
                    <div className="text-xs text-[#C4C4C4]">{user.bio}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedToAdd.includes(user._id)}
                    onChange={() =>
                      setSelectedToAdd((prev) =>
                        prev.includes(user._id)
                          ? prev.filter((id) => id !== user._id)
                          : [...prev, user._id]
                      )
                    }
                    className="accent-[#444CE7] w-4 h-4"
                  />
                </label>
              ))
            )}
          </div>
          <button
            className="bg-[#444CE7] text-white rounded-lg py-2 mt-2 font-medium hover:bg-[#373fcf] transition"
            onClick={handleAddMembers}
            disabled={selectedToAdd.length === 0 || isAdding}
          >
            {isAdding ? "Adding..." : "Add Selected"}
          </button>
        </div>
      </div>
    </div>
  );
};
