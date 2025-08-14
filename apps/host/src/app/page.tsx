import { Chat } from "./components/Chat";
import { Sidebar } from "./components/Sidebar";
import UserChats from "./components/UserChats";

export default function Home() {
  return (
    <div className="flex items-start h-screen">
      <Sidebar />
      <UserChats />
      <Chat />
    </div>
  );
} 
      