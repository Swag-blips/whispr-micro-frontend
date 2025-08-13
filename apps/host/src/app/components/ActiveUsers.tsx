import { ChevronRight } from "lucide-react";
import React from "react";

import { useOnlineFriends } from "../hooks/useOnlineFriends";
import Image from "next/image";

export const ActiveUsers = () => {
  const { onlineFriends, registerFriendRef } = useOnlineFriends();

  if (!onlineFriends.length) return null;
  return (
    <div className="flex flex-col gap-6 mt-6 justify-between mx-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-white font-medium">Active now</h2>

        <div className="flex gap-2 items-center cursor-pointer">
          <p className="text-[#CFCFCF]">see more</p>
          <ChevronRight color="#CFCFCF" size={16} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onlineFriends.map((friend) => (
          <div
            key={friend._id}
            ref={(el) => registerFriendRef(friend._id, el)}
            className="flex-col flex items-center justify-center  gap-2 "
          >
            <div className="relative">
              <Image
                src={friend.avatar}
                alt="user-profile"
                width={56}
                height={56}
                className="rounded-full"
                quality={100}
              />
              <div className="size-2.5 bg-[#34C759] rounded-full absolute top-2 right-0" />
            </div>

            <p className="text-xs text-[#D0D3D4]">{friend.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
