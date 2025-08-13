import Image from "next/image";
import { Ellipsis, Phone, Video, Plus, EllipsisVertical } from "lucide-react";
import { Chats, User } from "../types/types";
import { getAvatar } from "../utils/getUserAvatar";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import {
  removeUser,
  updateGroupDetails,
  addGroupMembers,
} from "../services/chats";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { useChatStore } from "../store/chats.store";
import useSWR from "swr";
import { getFriends } from "../services/user";
import { AxiosError } from "axios";
import { useSocket } from "../context/SocketContext";

type Props = {
  currentChat: Chats;
};

export const ChatHeader = ({ currentChat }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [groupName, setGroupName] = useState(currentChat.groupName);
  const [groupBio, setGroupBio] = useState(currentChat.bio);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
  const [userIsTyping, setUserIsTyping] = useState(false);

  const { onlineUsers, socket } = useSocket();

  const { setCurrentChat } = useChatStore();
  const { trigger: handleRemoveUser } = useSWRMutation(
    `/chat/group/remove/${currentChat._id}`,
    removeUser
  );
  const { trigger: updateGroup, isMutating: isUpdating } = useSWRMutation(
    `/chat/group/${currentChat._id}`,
    updateGroupDetails
  );
  const {
    trigger: addMembers,

    isMutating: isAdding,
  } = useSWRMutation(`/chat/group/add/${currentChat._id}`, addGroupMembers);
  const { data: friends, isLoading: loadingFriends } = useSWR(
    "friends",
    getFriends
  );

  const handleEllipsisClick = () => {
    if (currentChat.type === "group") {
      setShowDetails((prev) => !prev);
    }
  };

  const handleSaveDetails = async () => {
    try {
      const response = await updateGroup({ groupName, bio: groupBio });
      mutate("userChats");
      if (response.success) {
        toast.success(response.message);
        setCurrentChat(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      }
    }
  };

  const groupUserIds = Array.isArray(currentChat.otherUsers)
    ? currentChat.otherUsers.map((u: User) => u._id)
    : [currentChat.otherUsers._id];
  const addableFriends =
    friends?.friends?.filter((f: User) => !groupUserIds.includes(f._id)) || [];

  const handleAddMembers = async () => {
    try {
      const response = await addMembers({ participants: selectedToAdd });
      if (response.success) {
        toast.success(response.message || "Members added!");
        setShowAddModal(false);
        setSelectedToAdd([]);
        mutate("userChats");
      } else {
        toast.error(response.message || "Failed to add members");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to add members");
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (currentChat.type === "private") return;
    setGroupBio(currentChat.bio);
    setGroupName(currentChat.groupName);
  }, [currentChat]);

  useEffect(() => {
    socket?.on("userTyping", (data) => {
      console.log("DATA", data);
      if (data.chatId !== currentChat._id) return;
      setUserIsTyping(true);
    });

    socket?.on("stopTyping", () => {
      setUserIsTyping(false);
    });

    return () => {
      socket?.off("userTyping");
      socket?.off("stopTyping");
    };
  }, [currentChat, socket]);

  return (
    <>
      <header className="flex items-center bg-[#101516] border-b border-[#232728] justify-between px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 ">
            {currentChat.type === "private" &&
            !Array.isArray(currentChat.otherUsers) ? (
              <div className="relative">
                <Image
                  width={56}
                  height={56}
                  src={getAvatar(currentChat.otherUsers.avatar)}
                  alt="user"
                  className="rounded-full"
                  quality={100}
                />

                {onlineUsers.includes(currentChat.otherUsers._id) && (
                  <div className="size-2.5 bg-[#34C759] rounded-full absolute top-2 right-0" />
                )}
              </div>
            ) : (
              <div className="bg-[#F5F5F5] flex items-center justify-center size-12 rounded-full">
                {currentChat.groupName[0]}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-[#F1F5F9] ">
                {currentChat.type === "private" &&
                !Array.isArray(currentChat.otherUsers)
                  ? currentChat.otherUsers.username
                  : currentChat.groupName}
              </h1>

              {!userIsTyping && (
                <p className="text-[#A0A4A6] text-xs font-normal">
                  {currentChat.type === "private" &&
                  !Array.isArray(currentChat.otherUsers)
                    ? currentChat.otherUsers.bio
                    : currentChat.bio}
                </p>
              )}

              <p
                className={`text-[#00FF7F] text-xs transition-all duration-300 ${
                  userIsTyping
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-1 "
                }`}
              >
                Typing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="border cursor-pointer border-[#232728] flex items-center justify-center rounded-full size-12">
            <Video color="#E2E8F0" size={24} />
          </div>
          <div className="border cursor-pointer border-[#232728] flex items-center justify-center rounded-full size-12">
            <Phone color="#E2E8F0" fill="#E2E8F0" size={24} />
          </div>

          {currentChat.type === "group" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#F5F5F5] rounded-full p-2 flex items-center justify-center"
            >
              <Plus color="#E2E8F0" size={20} />
            </button>
          )}

          <div className="border cursor-pointer border-[#232728] flex items-center justify-center rounded-full size-12">
            <button onClick={handleEllipsisClick}>
              <EllipsisVertical color="#E2E8F0" size={24} />
            </button>
          </div>
        </div>
      </header>
      {showDetails && currentChat.type === "group" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white border-t border-[#F2F0F0] p-6 rounded-2xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-[#8C8C8C] text-xl"
              onClick={() => setShowDetails(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-2">Group Details</h2>
            <input
              className="border border-[#F2F0F0] rounded-lg px-4 py-2 outline-none bg-[#F6F6F6] mb-2 w-full font-semibold text-lg"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
            />
            <input
              className="border border-[#F2F0F0] rounded-lg px-4 py-2 outline-none bg-[#F6F6F6] mb-4 w-full"
              value={groupBio}
              onChange={(e) => setGroupBio(e.target.value)}
              placeholder="Group bio"
            />
            <button
              className="bg-[#444CE7] text-white rounded-lg py-2 px-4 font-medium hover:bg-[#373fcf] transition mb-4"
              onClick={handleSaveDetails}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
            <h3 className="font-medium mb-2">Members</h3>
            <div className="flex flex-col gap-3">
              {(Array.isArray(currentChat.otherUsers)
                ? currentChat.otherUsers
                : [currentChat.otherUsers]
              ).map((user: User) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F5F5]"
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
                  <button
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    title="Remove"
                    onClick={async () => {
                      try {
                        const data = await handleRemoveUser(user._id);

                        if (data?.success) {
                          toast.success("user successfully removed");
                        }

                        setCurrentChat(null);
                        mutate("userChats");
                      } catch (error) {
                        console.log(error);
                        if (error instanceof AxiosError) {
                          toast.error(
                            error.response?.data.message ||
                              "Failed to add members"
                          );
                        } else if (error instanceof Error) {
                          toast.error(error.message);
                        }
                      }
                    }}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
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
                        <div className="font-medium text-sm">
                          {user.username}
                        </div>
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
      )}
    </>
  );
};
