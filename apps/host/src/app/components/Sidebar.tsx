import Image from "next/image";
import React from "react";
import Logo from "../../../public/Logo.svg";
import SidebarNav from "./SidebarNav";
import UserProfile from "./UserProfile";

export const Sidebar = () => {
  return (
    <aside className="w-[74px] flex items-center flex-col justify-between  bg-[#101516] py-8 h-full border-r border-[#232728]">
      <div className="flex ">
        <Image src={Logo} alt="logo" />
      </div>
      <div className="flex flex-col items-center gap-10">
        <SidebarNav />
      </div>

      <UserProfile />
    </aside>
  );
};
