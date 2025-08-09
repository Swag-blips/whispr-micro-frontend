"use client";

import { Bell, Messages, People, Settings } from "./icons";
import { useEffect, useState } from "react";
import { Search as SearchComponent } from "./Search";
import { Notifications } from "./Notifications";
import useSWR from "swr";
import { getUnreadNotifications } from "../services/notification";
import { useNotificationStore } from "../store/notification.store";

export type NavState = "Notifications" | "Search" | null;
export default function SidebarNav() {
  const [open, setOpen] = useState<NavState>(null);

  const [notificationCount, setNotificationCount] = useState<number>(0);
  const notificationStore = useNotificationStore(
    (state) => state.notifications
  );
  const { data, isLoading } = useSWR("notifications", getUnreadNotifications);

  useEffect(() => {
    if (data && !isLoading) {
      setNotificationCount(data.notifications);
    }
  }, [data]);

  useEffect(() => {
    if (!notificationCount) return;
    const handleUpdateNotification = () => {
      setNotificationCount(
        (prevNotificationCount) => prevNotificationCount + 1
      );
    };
    handleUpdateNotification();
  }, [notificationStore]);

  return (
    <nav className="flex flex-col items-center gap-8">
      {open === "Search" && <SearchComponent setOpen={setOpen} />}
      {open === "Notifications" && <Notifications setOpen={setOpen} />}
      <div className="flex cursor-pointer items-center gap-2 bg-[#181D21] rounded-full p-3 text-white">
        <Messages />
      </div>
      <div onClick={() => setOpen("Search")} className="flex cursor-pointer ">
        <People />
      </div>
      <div className="flex cursor-pointer ">
        <Settings />
      </div>
      <div
        onClick={() => setOpen("Notifications")}
        className="flex cursor-pointer items-center "
      >
        <div className="relative ">
          <Bell />

          {notificationCount ? (
            <div className="size-3 absolute top-0 right-0 text-white text-[10px] bg-red-500 rounded-full flex items-center justify-center">
              {notificationCount}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
}
