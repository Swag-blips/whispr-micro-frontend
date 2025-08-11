"use client";
import { X } from "lucide-react";
import { Search as SearchIcon } from "lucide-react";
import { NavState } from "./SidebarNav";
import { useState } from "react";
import { User } from "../types/types";
import { axiosInstance } from "../api/api";
import { AxiosResponse } from "axios";
import { useGSAP } from "@gsap/react";
import Users from "./Users";
import { SearchResults } from "./SearchResults";
import gsap from "gsap";

type Props = {
  setOpen: (state: NavState) => void;
};
export const Search = ({ setOpen }: Props) => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);

  const searchUser = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    console.log("HERE");
    setLoading(true);
    if (!username.trim()) {
      return;
    }
    console.log("Hello from search user");
    try {
      const response = (await axiosInstance.get(
        `/user/${username}`
      )) as AxiosResponse<{ success: boolean; results: User[] }>;

      console.log("response", response);
      if (response.data.success) {
        setUsers(response.data.results);
      }
      return response;
    } catch (error) {
      console.error(error); 
    } finally {
      setLoading(false);
    }
  }; 
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("here");
    if (e.key === "Enter") {
      console.log("Enter");
      e.preventDefault();
      searchUser();
    }
  };

  useGSAP(() => {
    gsap.fromTo(
      "#form",
      { opacity: 0, y: 90 },
      {
        y: 0,
        opacity: 1,
        ease: "power3.out", // Smooth acceleration & deceleration
        duration: 0.5,
      }
    );
  }, []);

  return (
    <div className="fixed inset-0 bg-white/5 py-4 backdrop-blur-sm flex flex-col gap-6 items-center justify-center  top-0 z-50">
      <form id="form" className="w-[431px]">
        <div className="bg-[#101516] rounded-lg w-full  p-4 flex items-center border border-[#242424]">
          <SearchIcon color="#6C757D" size={24} />
          <input
            placeholder="Search for a user"
            className="placeholder:text-[#6C757D] flex-1 ml-2 text-white  outline-none"
            onKeyDown={handleKeyPress}
            onChange={(e) => setUsername(e.target.value)}
          />
          <X color="#C4C4C4" size={24} className="cursor-pointer" />
        </div>
      </form>

      <SearchResults loading={loading} users={users} />
      {/* {loading ? (
          <div className="flex flex-col items-center mt-4 gap-3">
            <Generating />
            <p>Fetching users</p>
          </div>
        ) : (
          <>
            {users.length > 0 &&
              users.map((user) => <Users key={user._id} user={user} />)}
          </>
        )} */}
    </div>
  );
};
