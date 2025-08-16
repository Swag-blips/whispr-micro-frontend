import gsap from "gsap";
import { useEffect, useRef } from "react";

export const NotSelectedChat = () => {
  const waveRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!waveRef.current) return;

    gsap.to(waveRef.current, {
      rotate: 20,
      yoyo: true,
      repeat: -1,
      duration: 0.5,
      ease: "power1.inOut",
      transformOrigin: "70% 70%",
    });
  }, []);
  return (
    <div className="bg-[#101516] h-screen flex items-center text-center text-white text-[32px] font-medium justify-center flex-1">
      <span ref={waveRef}>👋</span> Select a chat to start messaging.
    </div>
  );
};
