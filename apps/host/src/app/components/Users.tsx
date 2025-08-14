import Image from "next/image";
import React, { useState } from "react";
import { User } from "../types/types";
import { ChevronRight } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { UserDetails } from "./UserDetails";

type Props = {
  user: User;
};

const Users = ({ user }: Props) => {
  const [openUser, setOpenUser] = useState(false);
  const { onlineUsers } = useSocket();

  const userIsOnline = onlineUsers.includes(user._id);
  return (
    <div
      onClick={() => setOpenUser(!openUser)}
      className="flex items-center cursor-pointer justify-between mx-4 mt-4 gap-2"
    >
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Image
            src={user.avatar}
            width={48}
            height={48}
            className="rounded-full"
            alt="user"
            quality={100}
          />
          {userIsOnline && (
            <div className="size-2.5 bg-[#34C759] rounded-full absolute top-1 right-0" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-white">{user.username}</h2>
          <p className="text-sm max-w-[304px] truncate text-[#C4C4C4]">{user.bio}</p>
        </div>
      </div> 

      <ChevronRight color="#C4C4C4" size={24} />

      {openUser && <UserDetails user={user} isOnline={userIsOnline} setOpenUser={setOpenUser} />}
    </div>
  );
};

export default Users;
