import { AuthData } from "./AuthForm";

type Props = {
  setAuthData: (authData: AuthData) => void;
  authData: AuthData;
};

export const BioData = ({ setAuthData, authData }: Props) => {
  return (
    <div className="flex items-center gap-4"> 
      <div className="flex flex-col gap-2 w-full ">
        <label htmlFor="username" className="text-[#A0A4A6]  ">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={authData.username} 
          onChange={(e) =>
            setAuthData({ ...authData, username: e.target.value })
          }
          className="border-[#2D3438] outline-none bg-[#1A1F22]   placeholder:text-[#7A8288] text-[#F1F1F1] placeholder-text-sm border rounded-lg h-14 pl-3"
          placeholder="Jamie donalds"
        />
      </div> 
      <div className="flex flex-col gap-2 w-full ">
        <label htmlFor="bio" className="text-[#A0A4A6]  ">
          Bio
        </label>
        <input
          type="bio"
          id="bio" 
          name="bio"
          value={authData.bio}
          className="border-[#2D3438] outline-none bg-[#1A1F22]   placeholder:text-[#7A8288] text-[#F1F1F1] placeholder-text-sm border rounded-lg h-14 pl-3"
          placeholder="Enter your bio"
          onChange={(e) => setAuthData({ ...authData, bio: e.target.value })}
        />
      </div>
    </div>
  );
};
