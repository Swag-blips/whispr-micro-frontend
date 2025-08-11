"use client";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center">
      <Image
        src={
          user?.avatar ||
          "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg"
        }
        alt="user-profile-img"
        width={32}
        height={32}
        quality={100}
        className="rounded-full"
      />
    </div>
  );
};

export default UserProfile;
