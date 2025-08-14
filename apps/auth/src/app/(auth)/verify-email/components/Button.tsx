"use client";

import { useEffect, useState } from "react";


const Button = () => {
  const [countDown, setCountDown] = useState(60 * 1);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | null = null;

    timerId = setInterval(() => {
      setCountDown((countDown) => countDown - 1);
    }, 1000);

    if (countDown <= 0) {
      clearInterval(timerId);
    }
    return () => {
      clearInterval(timerId);
    };
  }, [countDown]);

  const seconds = String(countDown % 60).padStart(2, "0");
  const minutes = String(Math.floor(countDown / 60)).padStart(2, "0");

  return (
    <button
      disabled={countDown !== 0}
      className={` ${
        countDown === 0
          ? " bg-[#444CE7] cursor-pointer"
          : "bg-[#2A3035] disabled:cursor-not-allowed"
      } w-[262px] text-white font-medium mt-10 h-14 rounded-lg `}
    >
      {countDown === 0 ? "Resend verification mail" : `${minutes}:${seconds}`}
    </button>
  );
};

export default Button;
