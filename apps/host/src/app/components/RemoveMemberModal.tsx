import Image from "next/image";
import React from "react";
import { getAvatar } from "../utils/getUserAvatar";
import { User } from "../types/types";
import { Loading } from "./icons";
import { useSocket } from "../context/SocketContext";

interface Props {
  setShowRemoveModal: (state: boolean) => void;
  groupMembers: User[];
  selectedToRemove: string[];
  setSelectedToRemove: React.Dispatch<React.SetStateAction<string[]>>;
  handleRemoveMembers: () => void;
  isRemoving: boolean;
  loadingMembers: boolean;
}

export const RemoveMemberModal = ({
  setShowRemoveModal,
  groupMembers,
  selectedToRemove,
  setSelectedToRemove,
  handleRemoveMembers,
  isRemoving,
  loadingMembers,
}: Props) => {
  const { onlineUsers } = useSocket();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/5 backdrop-blur-sm">
      <div className="bg-[#101516] flex-flex-col rounded-2xl shadow-lg p-4 w-full max-w-md relative">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium text-white">Group Members</h2>
          <button
            className="ml-auto"
            onClick={() => setShowRemoveModal(false)}
            aria-label="Close"
          >
            <span className="text-2xl text-[#C4C4C4]">×</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 mt-4 max-h-[484px] overflow-y-auto">
            {loadingMembers ? (
              <Loading />
            ) : groupMembers.length === 0 ? (
              <p>No members to remove</p>
            ) : (
              groupMembers.map((user: User) => (
                <label
                  key={user._id}
                  className="flex items-center gap-3 cursor-pointer rounded-lg"
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
                    checked={selectedToRemove.includes(user._id)}
                    onChange={() =>
                      setSelectedToRemove((prev) =>
                        prev.includes(user._id)
                          ? prev.filter((id) => id !== user._id)
                          : [...prev, user._id]
                      )
                    }
                    className="accent-[#FF3B30] w-4 h-4"
                  />
                </label>
              ))
            )}
          </div>
          <button
            className="bg-[#FF3B30] text-white rounded-lg py-2 mt-2 font-medium hover:bg-[#d32f2f] transition"
            onClick={handleRemoveMembers}
            disabled={selectedToRemove.length === 0 || isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove Selected"}
          </button>
        </div>
      </div>
    </div>
  );
};
