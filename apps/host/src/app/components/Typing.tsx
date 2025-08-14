import Image from "next/image";
import React from "react";
import { User } from "../types/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Props = {
  userTyping: User;
};
export const Typing = ({ userTyping }: Props) => {
  useGSAP(() => {
    gsap.fromTo(
      ".main-container",
      { y: 10, opacity: 0 },
      { y: 0, opacity: 100, ease: "power2.in" }
    );
    gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(".dot1", { y: -10, duration: 0.5, ease: "sine.inOut" })
      .to(".dot2", { y: -10, duration: 0.5, ease: "sine.inOut" }, "<0.1")
      .to(".dot3", { y: -10, duration: 0.5, ease: "sine.inOut" }, "<0.1");
  }, []);
  return (
    <div className="flex items-center gap-2 mt-4 main-container">
      <Image
        src={userTyping.avatar}
        alt={userTyping.username}
        width={32}
        height={32}
        quality={100}
        className="rounded-full"
      />

      <div className="size-12 bg-[#1A1F21]  flex items-center gap-1 justify-center rounded-t-lg rounded-br-lg">
        <div className="bg-[#E0E0E0] size-[6px] rounded-full dot1" />
        <div className="bg-[#E0E0E0] size-[6px] rounded-full dot2" />
        <div className="bg-[#E0E0E0] size-[6px] rounded-full dot3" />
      </div>
    </div>
  );
};
