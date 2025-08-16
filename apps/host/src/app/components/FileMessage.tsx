import React from "react";
import { Message } from "../types/types";
import { DocumentAlt } from "./icons";
import { bytesToMegabytes } from "./SelectedFiles";
import { ArrowDownToLine } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type Props = {
  msg: Message;
};

export const FileMessage = ({ msg }: Props) => {
  const { user } = useAuth();
  return (
    <>
      {msg.fileType?.startsWith("image/") && (
        <div className="w-[126px] h-[107px]">
          <img
            src={msg.file}
            alt="image"
            className="rounded-xl w-full h-full object-cover"
          />
        </div>
      )}
      {msg.fileType?.startsWith("application/") && (
        <div
          className={`p-2.5 rounded-xl flex items-end justify-between 
                                        ${
                                          msg.senderId === user?._id
                                            ? "bg-[#1E2D38]"
                                            : "bg-[#2A2F32]"
                                        }`}
        >
          <div className="flex items-center gap-2">
            <DocumentAlt />

            <div className="flex flex-col gap-1">
              <h2 className="max-w-[400px] text-sm font-medium truncate">
                {msg.fileName}
              </h2>
              <p className="text-[#868686] text-xs">
                {bytesToMegabytes(msg.fileSize)} mb
              </p>
            </div>
          </div>
          <ArrowDownToLine size={16} className="shrink-0 cursor-pointer" />
        </div>
      )}
    </>
  );
};
