import React from "react";
import { User } from "../types/types";
import { X } from "lucide-react";
import Image from "next/image";

type Props = {
  user: User;
  isOnline: boolean;
};

export const UserDetails = ({ user, isOnline }: Props) => {
  return (
    <div className="fixed inset-0 flex items-center h-screen justify-center">
      <div className="w-[496px] rounded-lg bg-[#101516] border flex flex-col border-[#242424]">
        <div className="ml-auto p-4 rounded-md ">
          <X color="#C4C4C4" />
        </div>

        <div className="relative ml-4">
          <Image
            src={user.avatar}
            alt={user.username}
            width={96}
            height={96}
            className="rounded-full"
          />

          {isOnline && (
            <div className="size-2.5 bg-[#34C759] rounded-full absolute top-3 left-20" />
          )}
        </div>
      </div>
    </div>
  );
};
