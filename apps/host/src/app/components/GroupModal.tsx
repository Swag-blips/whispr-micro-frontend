import React, { useState } from "react";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import { getFriends } from "../services/user";
import { getAvatar } from "../utils/getUserAvatar";
import useSWRMutation from "swr/mutation";
import { createGroupChat } from "../services/chats";
import toast from "react-hot-toast";
import { User } from "../types/types";
import { AxiosError } from "axios";

interface GroupModalProps {
  open: boolean;
  onClose: () => void;
}

const GroupModal = ({ open, onClose }: GroupModalProps) => {
  const { data: friends, isLoading, error } = useSWR("friends", getFriends);
  const { trigger: createGroup, isMutating: isCreating } = useSWRMutation(
    "/chat/group",
    createGroupChat
  );
  const [groupName, setGroupName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleUserSelect = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  if (!open) return null;
  if (error) return <p>{error}</p>;

  const friendsCount = friends?.friends?.length || 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-[#8C8C8C] text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Create Group</h2>
        <div className="flex flex-col gap-4">
          <input
            className="border border-[#F2F0F0] rounded-lg px-4 py-2 outline-none bg-[#F6F6F6]"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <input
            className="border border-[#F2F0F0] rounded-lg px-4 py-2 outline-none bg-[#F6F6F6]"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <div>
            <p className="font-medium mb-2">Add Members</p>
            <div className="flex flex-col gap-3 max-h-40 overflow-y-auto">
              {!isLoading &&
                friends?.friends.length &&
                friends.friends.map((user: User) => (
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
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleUserSelect(user._id)}
                      className="accent-[#444CE7] w-4 h-4"
                    />
                  </label>
                ))}
            </div>
          </div>
          <button
            className="bg-[#444CE7] text-white rounded-lg py-2 mt-2 font-medium hover:bg-[#373fcf] transition"
            onClick={async () => {
              try {
                await createGroup({
                  bio,
                  groupName,
                  participants: selectedUsers,
                });
                mutate("userChats");
                onClose();
              } catch (error) {
                if (error instanceof AxiosError) {
                  toast.error(
                    error.response?.data.message || "Failed to add members"
                  );
                } else if (error instanceof Error) {
                  toast.error(error.message);
                }
              }
            }}
            disabled={isCreating || friendsCount < 2}
          >
            {isCreating ? "Creating..." : "Create Group"}
          </button>
          {friendsCount < 2 && (
            <p className="text-xs text-[#8C8C8C] mt-1">
              You need at least 2 friends to create a group.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
