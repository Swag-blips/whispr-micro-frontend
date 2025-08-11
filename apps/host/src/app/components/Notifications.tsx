import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import { X } from "lucide-react";
import { NavState } from "./SidebarNav";
import Image from "next/image";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notification";
import toast from "react-hot-toast";
import { Notification, User } from "../types/types";
import en from "javascript-time-ago/locale/en";
import { acceptFriendRequest, declineFriendRequest } from "../services/friend";
import { AxiosError } from "axios";
import { useSocket } from "../context/SocketContext";
import { toastComponent } from "@repo/ui";
import { Loading } from "./icons";
import { Error as ErrorIcon } from "@repo/ui/icons/Error";
import { Success } from "@repo/ui/icons/Success";
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

  const acceptFriendRequestWrapper = async (sender: User) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const toastId = toastComponent.loading(
      `accepting ${sender.username} request `,
      <Loading />
    );
    try {
      const friendRequest = await acceptFriendRequest(sender._id);

      if (friendRequest.success) {
        toast.custom((t) => (
          <div
            className={`p-4 rounded-xl flex items-center gap-2  bg-[#1E1E1E] text-[#EDEDED]  shadow-[0px_4px_12px_rgba(0,0,0,0.3)] ${
              t.visible ? "animate-enter" : "animate-leave"
            }`}
          >
            <img
              src={sender.avatar}
              alt={sender.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <p>You accepted {sender.username} friend request</p>

            <Success width="24" height="24" />
          </div>
        ));
      } else if (!friendRequest.success) {
        toastComponent.error(friendRequest.message, <ErrorIcon />);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toastComponent.error(error.message, <ErrorIcon />);
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const declineFriendRequestWrapper = async (
    friendRequestId: string,
    sender: User
  ) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const toastId = toastComponent.loading(
      `accepting ${sender.username} request `,
      <Loading />
    );
    try {
      const friendRequest = await declineFriendRequest(friendRequestId);

      if (friendRequest.success) {
        toast.custom((t) => (
          <div
            className={`p-4 rounded-xl flex items-center gap-2  bg-[#1E1E1E] text-[#EDEDED]  shadow-[0px_4px_12px_rgba(0,0,0,0.3)] ${
              t.visible ? "animate-enter" : "animate-leave"
            }`}
          >
            <img
              src={sender.avatar}
              alt={sender.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <p>You declined {sender.username} friend request</p>

            <Success width="24" height="24" />
          </div>
        ));
      } else if (!friendRequest.success) {
        toastComponent.error(friendRequest.message, <ErrorIcon />);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toastComponent.error(error.message, <ErrorIcon />);
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
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

  TimeAgo.addLocale(en);

  const timeAgo = new TimeAgo("en-US");
  return (
    <div className="fixed inset-0 bg-white/5 py-4 backdrop-blur-sm flex flex-col gap-6 items-center justify-center  top-0 z-50">
      <div className="bg-[#101516] h-[484px] flex flex-col min-w-[389px] px-4 gap-6 py-4 rounded-lg">
        <div className=" flex items-center justify-between ">
          <h2 className="text-white text-2xl font-medium">Notifications</h2>
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
              <div className="relative">
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

                {onlineUsers.includes(notification.from._id) && (
                  <div className="size-2.5 bg-[#34C759] rounded-full absolute top-1 right-0" />
                )}
              </div>

              <div className="flex items-center w-full justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-white ">
                      {notification.from.username} sent you a friend request
                    </p>

                    <div className="flex items-center text-[#C4C4C4]">
                      <p className=" font-normal text-sm">
                        {timeAgo.format(new Date(notification.createdAt))}
                      </p>
                      &nbsp; •&nbsp;
                      <p>
                        {notification.type == "Pending"
                          ? "new request"
                          : notification.type === "Accepted"
                            ? "Accepted request"
                            : ""}
                      </p>
                    </div>
                  </div>
                  {notification.type === "Pending" && (
                    <div className="flex items-center gap-2 ">
                      <button
                        disabled={loading}
                        onClick={() =>
                          declineFriendRequestWrapper(
                            notification._id,
                            notification.from
                          )
                        }
                        className=" cursor-pointer border rounded-lg border-[#2A2E2F] text-white px-4 py-2"
                      >
                        Decline
                      </button>
                      <button
                        disabled={loading}
                        onClick={() =>
                          acceptFriendRequestWrapper(notification.from)
                        }
                        className=" cursor-pointer flex items-center justify-center bg-[#444CE7] text-white px-4 py-2 rounded-lg"
                      >
                        Accept
                      </button>
                    </div>
                  )}
                </div>

                {!notification.read && (
                  <div className="bg-[#444CE7] size-2 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
