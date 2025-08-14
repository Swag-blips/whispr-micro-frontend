import { X } from "lucide-react";
import React from "react";
import { User } from "../types/types";
import { Loading, NotFound } from "./icons";
import Users from "./Users";

type Props = {
  loading: boolean;
  users: User[] | null;
};

export const SearchResults = ({ loading, users }: Props) => {
  if (users === null) return null;
  return (
    <div className="bg-[#101516] w-[431px] h-[388px] rounded-lg flex flex-col border border-[#242424]">
      <X color="#C4C4C4" size={24} className="ml-auto m-4" strokeWidth={1.5} />

      {loading && (
        <div className="flex items-center h-full justify-center">
          <Loading width="40" height="40" />
        </div>
      )}

      {!users.length && !loading && (
        <div className="flex flex-col items-center gap-4 flex-1  justify-center h-auto">
          <NotFound />
          <p className="text-white text-2xl">User not found</p>
        </div>
      )}

      {users.length > 0 &&
        !loading &&
        users.map((user) => <Users key={user._id} user={user} />)}
    </div>
  );
};
