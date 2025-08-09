"use client";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();

  
  return (
    <div className="flex items-center gap-2">
      <Image
        src={
          user?.avatar ||
          "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg"
        }
        alt="user-profile-img"
        width={48}
        height={48}
        quality={100}
        className="rounded-full"
      /> 

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{user?.username}</span>
        <span className="text-xs text-[#D9D9D9]">Logout</span>
      </div>
    </div>
  );
};

export default UserProfile;
