import React from "react";
import { Doc, Picture } from "./icons";

type Props = {};

export const ChatFiles = (props: Props) => {
  return (
    <div className="px-4 mt-8 ">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-white text-2xl">Files</h2>
        <p className="text-[#CFCFCF]">see all</p>
      </div>

      <div className="flex flex-col py-3 mt-4 gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#181D21] flex items-center justify-center size-12 rounded-full">
            <Picture />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#EDEDED]">Design.png</p>
            <p className="text-[#A3A3A3] text-xs">1.2mb • Jul 22, 2025</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#181D21] flex items-center justify-center size-12 rounded-full">
            <Picture />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#EDEDED]">Swag.png</p>
            <p className="text-[#A3A3A3] text-xs">50kb • Jul 30, 2025</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#181D21] flex items-center justify-center size-12 rounded-full">
            <Doc />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#EDEDED]">Swag.docx</p>
            <p className="text-[#A3A3A3] text-xs">8kb • Jul 30, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};
