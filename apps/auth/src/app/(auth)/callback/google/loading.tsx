import { Loading } from "@/app/components/icons";

const loading = () => {
  return (
    <div className="bg-[#0A0E0F] h-screen flex items-center flex-col gap-6 justify-center">
      <Loading width="40" height="40" />

      <h1 className="text-white text-2xl">Hang tight, we are logging you in</h1>
    </div>
  );
};

export default loading;
