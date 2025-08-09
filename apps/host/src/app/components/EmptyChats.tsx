import { Messages } from "./icons";

export const EmptyChats = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="size-14 flex items-center justify-center bg-[#181D21] rounded-lg">
        <Messages width="24" height="24" />
      </div>

      <div className="mt-4 gap-2 flex flex-col items-center">
        <h2 className="text-[#EDEDED] font-medium text-2xl">
          Your chats will appear here
        </h2>
        <p className="text-[#A0A4A6]">start a chat with your friends </p>
      </div>

      <button className=" cursor-pointer bg-[#181D21] h-12 w-[141px] text-white mt-4 rounded-3xl">
        Start a chat
      </button>
    </div>
  );
};
