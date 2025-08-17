import Image from "next/image";
import React from "react";
import { getAvatar } from "../utils/getUserAvatar";

import { User } from "../types/types";

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-[#8C8C8C] text-xl"
          onClick={() => setShowAddModal(false)}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Members</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 max-h-40 overflow-y-auto">
            {loadingFriends ? (
              <p>Loading...</p>
            ) : addableFriends.length === 0 ? (
              <p>No friends to add</p>
            ) : (
              addableFriends.map((user: User) => (
                <label
                  key={user._id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#F5F5F5]"
                >
                  <Image
                    src={getAvatar(user.avatar)}
                    alt={user.username}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{user.username}</div>
                    <div className="text-xs text-[#8C8C8C]">{user.bio}</div>
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
