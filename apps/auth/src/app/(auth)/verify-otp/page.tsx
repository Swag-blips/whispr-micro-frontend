import React from "react";

import Link from "next/link";
import { redirect } from "next/navigation";
import OtpInputs from "./components/OtpInputs";
import { ArrowLeft } from "@/app/components/icons";

const OtpPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) => {
  const email = await searchParams?.then((param) => param.email);

  if (!email) {
    redirect("/");
  }
  return (
    <div className="bg-[#0A0E0F] flex flex-col  h-screen">
      <nav className="py-4 px-3">
        <Link href={"/"}>
          <ArrowLeft />
        </Link>
      </nav>
      <main className="flex items-center justify-center flex-1  flex-col gap-2">
        <h2 className=" text-2xl text-white font-bold text-center ">
          Enter your otp code
        </h2>
        <p className="text-[#868686] text-center">
          We sent an otp to <span className="text-[#444CE7]">{email}</span>{" "}
          enter it below to continue
        </p>

        <OtpInputs email={email} />
      </main>
    </div>
  );
};

export default OtpPage;
  