import React from "react";
import { redirect } from "next/navigation";
import emailGif from "../../../../../public/emailGif.gif";
import Link from "next/link";
import { decodeJwt } from "./utils/decodeToken";
import { verifyEmail } from "./services/service";
import { ArrowLeft, Error, Success } from "@/app/components/icons";

const CallbackVerification = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  const token = await searchParams?.then((param) => param.token);

  const email = decodeJwt(token as string);

  if (!token) {
    redirect("/auth");
  }

  const verify = await verifyEmail(token);

  return (
    <main className="text-black flex flex-col h-screen bg-[#0A0E0F] ">
      <Link href={"/"} className="p-4">
        <ArrowLeft />
      </Link>
      <div className="flex-1 flex items-center justify-center">
        {verify?.success ? (
          <div className="flex flex-col gap-6 justify-center items-center">
            <Success width="40" height="40" />
            <p className="text-white font-medium text-2xl">{verify.message}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 items-center">
            <Error width="40" height="40" />
            <h2 className="text-2xl text-white font-medium">
              {verify?.message}
            </h2>
          </div>
        )}
      </div>
    </main>
  );
};

export default CallbackVerification;
