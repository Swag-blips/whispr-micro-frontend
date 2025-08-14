import React, { useState } from "react";
import { User } from "../types/types";
import { X } from "lucide-react";
import Image from "next/image";
import { sendFriendRequest } from "../services/friend";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { toastComponent } from "@repo/ui/toast";
import { Success } from "@repo/ui/icons/Success";
import { Error as ErrorIcon } from "@repo/ui/icons/Error";
import { Loading } from "./icons";

type Props = {
  user: User;
  isOnline: boolean;
  setOpenUser: (state: boolean) => void;
};

export const UserDetails = ({ user, isOnline, setOpenUser }: Props) => {
  const [loading, setLoading] = useState(false);
  const handleSendRequest = async () => {
    if (loading) return;
    setLoading(true);

    const toastId = toastComponent.loading(
      ` sending a request to ${user.username}`,
      <Loading />
    );
    try {
      const request = await sendFriendRequest(user._id);

      if (request.success) {
        toastComponent.success(request.message, <Success />);
      } else {
        console.log("ELSE BLOCK");
        toastComponent.error(request.message, <ErrorIcon />);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toastComponent.error(
          error.response?.data.message || "Failed to add members",
          <ErrorIcon />
        );
      } else if (error instanceof Error) {
        toastComponent.error(error.message, <ErrorIcon />);
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  useGSAP(() => {
    gsap.fromTo(
      "#details",
      { opacity: 0, y: 90 },
      {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        duration: 0.5,
      }
    );
  }, [user]);
  return (
    <div
      id="details"
      className="fixed inset-0 flex items-center h-screen justify-center"
    >
      <div className="w-[496px] rounded-lg bg-[#101516] h-[364px] border flex flex-col border-[#242424]">
        <div
          onClick={() => setOpenUser(false)}
          className="ml-auto p-4 rounded-md "
        >
          <X color="#C4C4C4" />
        </div>

        <div className="relative ml-4">
          <Image
            src={user.avatar}
            alt={user.username}
            width={96}
            height={96}
            className="rounded-full"
            quality={100}
          />

          {isOnline && (
            <div className="size-2.5 bg-[#34C759] rounded-full absolute top-3 left-20" />
          )}

          <div className="flex items-center  justify-between">
            <div className="flex flex-col gap-1 mt-4">
              <h2 className="text-2xl font-semibold text-white">
                {user.username}
              </h2>
              <p className=" max-w-[304px] truncate text-[#C4C4C4]">
                {user.bio}
              </p>
            </div>

            <button
              disabled={loading}
              onClick={handleSendRequest}
              className="bg-[#444CE7] cursor-pointer px-4 py-3 mr-4 text-white rounded-lg"
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
