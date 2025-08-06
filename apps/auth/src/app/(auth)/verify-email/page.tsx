import emailGif from "../../../../public/emailGif.gif";
import Link from "next/link";

import Button from "./components/Button";
import { ArrowLeft } from "@/app/components/icons";
import { redirect } from "next/navigation";

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const email = await searchParams.then((data) => {
    console.log("data here", data);
    return data.email;
  });

  if (!email.trim() || !emailRegex.test(email)) {
    redirect("/");
  }
  return (
    <div className="bg-[#0A0E0F] flex flex-col h-screen">
      <nav className="py-6 px-6">
        <Link href={"/"}>
          <ArrowLeft />
        </Link>
      </nav>
      <main className="flex items-center text-center max-w-[588px] flex-1 justify-center mx-auto flex-col gap-2">
        <img src={emailGif.src} alt="" />
        <div className="flex flex-col gap-2">
          <h2 className="text-[32px] text-white font-medium">
            Verify email address
          </h2>
          <p className="text-[#A0A4A6] leading-[150%] ">
            You entered <span className="text-[#444CE7]">{email}</span> as the
            email address for your account Please verify this email address by
            clicking the link we sent to your inbox.If you don’t see it, be sure
            to check your spam or junk folder.
          </p>
        </div>
        <Button />
      </main>
    </div>
  );
};

export default VerifyEmailPage;
