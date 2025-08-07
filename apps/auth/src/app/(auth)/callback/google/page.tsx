import { authenticateWithGoogle } from "./services/service";
import { redirect } from "next/navigation";

const GoogleCallback = async ({
  searchParams,
}: {
  searchParams: Promise<{ code: string }>;
}) => {
  const code = await searchParams.then((data) => data.code);

  if (!code) {
    redirect("/");
  }

  const response = await authenticateWithGoogle(code);

  if (response.success) {
    redirect("/")   
  }   
     
  return (
    <main className="flex items-center flex-col gap-2 justify-center h-screen"></main>
  );
};

export default GoogleCallback;
