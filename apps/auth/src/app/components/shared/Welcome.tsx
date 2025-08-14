"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRouter } from "next/navigation";

type Props = {
  username: string;
};

export const Welcome = ({ username }: Props) => {
  const router = useRouter();
  useGSAP(() => {
    gsap.fromTo(
      "#message",
      { opacity: 0, y: 90 },
      {
        y: 0,
        opacity: 1,
        ease: "power3.out", // Smooth acceleration & deceleration
        duration: 1.2,
        delay: 0.5,
        onComplete: () => {
          router.push("/");
        },
      }
    );
  }, []);

  return (
    <div
      id="message"
      className="flex items-center justify-center text-[40px] text-white"
    >
      Welcome, {username || "User"}👋
    </div>
  );
};
