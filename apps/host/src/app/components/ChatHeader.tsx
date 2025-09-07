import Image from "next/image";
import { Phone, Video, Plus, EllipsisVertical, X } from "lucide-react";
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
import { GroupChatImage } from "./GroupChatImage";
import { AddMemberModal } from "./AddMemberModal";
import { UserAdd, UserRemove } from "./icons";
import { RemoveMemberModal } from "./RemoveMemberModal";
import { useAuth } from "../context/AuthContext";

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
  const [openActionDropdown, setOpenActionDropDown] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedToRemove, setSelectedToRemove] = useState<string[]>([]);
  const [isRemoving, setIsRemoving] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const { user } = useAuth();

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

  // Group members for RemoveMemberModal (exclude current user)
  const groupMembers = Array.isArray(currentChat.otherUsers)
    ? currentChat.otherUsers.filter((u: User) => u._id !== user?._id)
    : [];

  const handleRemoveMembers = async () => {
    if (selectedToRemove.length === 0) return;
    setIsRemoving(true);
    try {
      for (const memberId of selectedToRemove) {
        const data = await handleRemoveUser(memberId);
        if (data?.success) {
          toast.success("User successfully removed");
        }
      }
      setShowRemoveModal(false);
      setSelectedToRemove([]);
      mutate("userChats");
      setCurrentChat(null);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to remove members");
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsRemoving(false);
    }
  };

  useEffect(() => {
    if (currentChat.type === "private") return;
    setGroupBio(currentChat.bio);
    setGroupName(currentChat.groupName);
  }, [currentChat]);

  useEffect(() => {
    const handleUserTyping = (data: { chatId: string }) => {
      if (data.chatId !== currentChat._id || currentChat.type === "group")
        return;
      setUserIsTyping(true);
    };

    const handleStopTyping = (data: { chatId: string }) => {
      if (data.chatId !== currentChat._id || currentChat.type === "group")
        return;
      setUserIsTyping(false);
    };

    socket?.on("userTyping", handleUserTyping);
    socket?.on("stopTyping", handleStopTyping);

    return () => {
      socket?.off("userTyping", handleUserTyping);
      socket?.off("stopTyping", handleStopTyping);
    };
  }, [currentChat, socket]);

  return (
    <>
      <header className="flex items-center bg-[#101516] border-b border-[#232728] justify-between h-fit px-4 py-6">
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
              <GroupChatImage chat={currentChat} />
            )}

            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-[#F1F5F9] ">
                {currentChat.type === "private" &&
                !Array.isArray(currentChat.otherUsers)
                  ? currentChat.otherUsers.username
                  : currentChat.groupName}
              </h1>

              <p
                className={`text-xs transition-all duration-300 ${
                  userIsTyping
                    ? "text-[#00FF7F] opacity-100 translate-y-0"
                    : "text-[#A0A4A6] opacity-100 translate-y-0"
                }`}
              >
                {userIsTyping
                  ? "Typing"
                  : currentChat.type === "private" &&
                      !Array.isArray(currentChat.otherUsers)
                    ? currentChat.otherUsers.bio
                    : currentChat.bio}
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

          <div className="border  relative cursor-pointer border-[#232728] flex items-center justify-center rounded-full size-12">
            <button
              onClick={() =>
                setOpenActionDropDown(
                  (prevOpenActionDropdown) => !prevOpenActionDropdown
                )
              }
            >
              <EllipsisVertical
                color="#E2E8F0"
                size={24}
                className="cursor-pointer"
              />
            </button>

            {openActionDropdown && (
              <div className="absolute top-15 right-2 border border-[#232728] rounded-xl bg-[#1A1F21] w-[145px]  flex flex-col">
                {currentChat.type === "group" && (
                  <>
                    <div
                      onClick={() =>
                        setShowAddModal((prevAddModal) => !prevAddModal)
                      }
                      className="flex items-center rounded-t-xl  hover:bg-[#2E3235] border-b border-[#232728] p-2 gap-2"
                    >
                      <UserAdd />
                      <p className="text-xs text-[#D0D3D4]">Add user</p>
                    </div>
                    <div
                      onClick={() =>
                        setShowRemoveModal(
                          (prevRemoveModal) => !prevRemoveModal
                        )
                      }
                      className="flex items-center hover:bg-[#2E3235]  border-b border-[#232728] p-2 gap-2"
                    >
                      <UserRemove />
                      <p className="text-xs text-[#D0D3D4]">Remove user</p>
                    </div>
                  </>
                )}

                <div className="flex items-center hover:bg-[#2E3235] rounded-b-xl p-2 gap-2">
                  <X size={16} className="shrink-0" color="#D0D3D4" />
                  <p className="text-xs text-[#D0D3D4]">close chat details</p>
                </div>
              </div>
            )}
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
        <AddMemberModal
          setShowAddModal={setShowAddModal}
          addableFriends={addableFriends}
          selectedToAdd={selectedToAdd}
          setSelectedToAdd={setSelectedToAdd}
          handleAddMembers={handleAddMembers}
          isAdding={isAdding}
          loadingFriends={loadingFriends}
        />
      )}

      {showRemoveModal && (
        <RemoveMemberModal
          setShowRemoveModal={setShowRemoveModal}
          groupMembers={groupMembers}
          selectedToRemove={selectedToRemove}
          setSelectedToRemove={setSelectedToRemove}
          handleRemoveMembers={handleRemoveMembers}
          isRemoving={isRemoving}
          loadingMembers={loadingMembers}
        />
      )}
    </>
  );
};
