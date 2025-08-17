import React from "react";
import { Star } from "./icons";

export const StarredMessages = () => {
  return (
    <div className="mt-8 mx-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-white text-2xl">Starred messages</h2>
        <p className="text-[#CFCFCF]">see all</p>
      </div>

      <div className="flex flex-col mt-4 gap-4">
        <div className="flex flex-col gap-2">
          <div className="bg-[#14222B] flex items-center gap-2 rounded-t-lg rounded-bl-lg  px-4 py-3">
            <Star />
            <p className="text-white text-xs leading-[150%]  ">
              Alright, I’ll look in the Trash first. If it’s really gone, I’ll
              let you know. Appreciate the help
            </p>
          </div>

          <p className="text-[10px] ml-auto text-[#A0A4A6]">10:00pm</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#1A1F21] flex items-center gap-2 rounded-t-lg rounded-bl-lg  px-4 py-3">
            <Star />

            <p className="text-white text-xs leading-[150%]  ">
              Thanks for checking. Could you please share the name of the file,
              the folder it was in....
            </p>
          </div>
          <p className="text-[10px] ml-auto text-[#A0A4A6]">10:00pm</p>
        </div>
      </div>
    </div>
  );
};
