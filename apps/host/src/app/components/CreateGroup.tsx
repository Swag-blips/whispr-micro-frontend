"use client";
import { Ellipsis, Pencil } from "lucide-react";
import React, { useState } from "react";
import GroupModal from "./GroupModal";

export const CreateGroup = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className=" flex items-center border border-[#232728] size-14 justify-center  rounded-full cursor-pointer"
      >
        <Ellipsis  color="#FFFFFF" size={24} />
      </div>
      {openModal && (
        <GroupModal open={openModal} onClose={() => setOpenModal(false)} />
      )}
    </>
  );
};
