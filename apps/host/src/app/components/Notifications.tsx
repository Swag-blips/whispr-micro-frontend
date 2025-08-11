import React, { useEffect, useState } from "react";
import Logo from "../../../public/Logo.svg";
import { X } from "lucide-react";
import { NavState } from "./SidebarNav";
import Image from "next/image";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notification";
import toast from "react-hot-toast";
import { Notification } from "../types/types";
import { convertDate } from "../utils/convertDate";
import { acceptFriendRequest, declineFriendRequest } from "../services/friend";
import { Generating } from "@repo/ui/icons/Generating";
import { AxiosError } from "axios";
import { useSocket } from "../context/SocketContext";
type Props = {
  setOpen: (state: NavState) => void;
};

export const Notifications = ({ setOpen }: Props) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { onlineUsers } = useSocket();
  const [loading, setLoading] = useState(false);
  const fetchNotifications = async () => {
    try {
      const notifications = await getNotifications();

      console.log(notifications);
      setNotifications(notifications.data.notifications);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleMarkNotificationsAsRead = async (notificationIds: string[]) => {
    try {
      const notifications = markNotificationAsRead(notificationIds);
      return notifications;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const acceptFriendRequestWrapper = async (senderId: string) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const friendRequest = await acceptFriendRequest(senderId);

      if (friendRequest.success) {
        toast.success(friendRequest.message);
      } else if (!friendRequest.success) {
        toast.error(friendRequest.message);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const declineFriendRequestWrapper = async (friendRequestId: string) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const friendRequest = await declineFriendRequest(friendRequestId);

      if (friendRequest.success) {
        toast.success(friendRequest.message);
      } else if (!friendRequest.success) {
        toast.error(friendRequest.message);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!notifications.length) return;

    const unreadNotifications = notifications.filter(
      (notification) => !notification.read
    );

    if (unreadNotifications.length) {
      const unreadIds = unreadNotifications.map(
        (unreadNotification) => unreadNotification._id
      );
      handleMarkNotificationsAsRead(unreadIds);
    }
  }, [notifications]);

  return (
    <div className="fixed inset-0 bg-white/5 py-4 backdrop-blur-sm flex flex-col gap-6 items-center justify-center  top-0 z-50">
      <div className="bg-[#101516] h-[484px] flex flex-col w-[345px]  rounded-lg">
        <div className=" ml-auto p-4">
          <X
            color="#8C8C8C"
            size={24}
            className="cursor-pointer"
            onClick={() => setOpen(null)}
          />
        </div>

        <div className="flex flex-col gap-6">
          {notifications.map((notification) => (
            <div key={notification._id} className="flex items-start gap-2.5">
              <div>
                <Image
                  width={48}
                  height={48}
                  src={
                    notification.from.avatar ||
                    "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg"
                  }
                  alt="user"
                  className="rounded-full"
                />

                {}
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-white ">
                    {notification.from.username} sent you a request
                  </p>
                  <p className="text-[#8C8C8C] font-normal text-xs">
                    {convertDate(notification.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ">
                  <button
                    disabled={loading}
                    onClick={() =>
                      declineFriendRequestWrapper(notification._id)
                    }
                    className=" cursor-pointer border rounded-lg border-[#D9D9D9] px-4 py-2"
                  >
                    Decline
                  </button>
                  <button
                    disabled={loading}
                    onClick={() =>
                      acceptFriendRequestWrapper(notification.from._id)
                    }
                    className=" cursor-pointer flex items-center justify-center bg-[#444CE7] text-white px-4 py-2 rounded-lg"
                  >
                    {loading ? <Generating /> : "Accept"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
