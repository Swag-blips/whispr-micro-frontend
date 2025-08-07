"use client";

import React, { useEffect, useRef, useState } from "react";
import { resendOtp, verifyOtp } from "../services/service";
import toast, { ErrorIcon } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { toastComponent } from "../../auth/utils/toast";
import {
  Error as ErrorIconComponent,
  Loading,
  Success,
} from "@/app/components/icons";

type Props = {
  email: string | string[] | undefined;
};
const OtpInputs = ({ email }: Props) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const otpBoxReference = useRef<HTMLInputElement[]>([]);

  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    const parsedValue = parseInt(value);
    if (parsedValue > 9) return;
    const newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < 6 - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  };

  const handleChangeCharacter = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.currentTarget.value && index < 6 - 1) {
      otpBoxReference.current[index + 1].focus();
    }
    if (e.key === "ArrowRight" && e.currentTarget.value && index < 6 - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  };

  const handleSubmit = async (email: string, otp: string) => {
    setLoading(true);
    const toastId = toastComponent.loading("verifying otp", <Loading />);
    try {
      const response = await verifyOtp(email, otp);

      console.log("response", response)

      if (response.success) {
        toastComponent.success(response.message, <Success />);
        router.push("/");
      } else if (!response.success && response.details) {
        toastComponent.error(
          response.details || "An error occured",
          <ErrorIconComponent />
        );
      } else {
        toastComponent.error(response.message, <ErrorIconComponent />);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toastComponent.error(error.message, <ErrorIconComponent />);
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const handleResendOtp = async (email: string) => {
    if (!loading) {
      setLoading(true);
    }
    const toastId = toastComponent.loading("Resending otp", <Loading />);

    try {
      const response = await resendOtp(email);
      

      if (response.success) {
        toastComponent.success(response.message, <Success />);
        router.push("/");
      } else if (!response.success && response.details) {
        toastComponent.error(
          response.details || "An error occured",
          <ErrorIconComponent />
        );
      } else {
        toastComponent.error(response.message, <ErrorIconComponent />);
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toastComponent.error(error.message, <ErrorIconComponent />);
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (otp.some((digit) => digit === "")) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, [otp]);

  return (
    <div className="mt-10">
      <div className="flex items-center gap-4">
        {otp.map((value: number, index: number) => (
          <input
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyUp={(e) => handleChangeCharacter(e, index)}
            id={`otp-${index}`}
            key={index}
            type="number"
            min="0"
            max="9"
            step="1"
            ref={(el) => {
              if (el) {
                otpBoxReference.current[index] = el;
              }
            }}
            className="outline-none focus:border-[#444CE7] text-white text-2xl font-medium text-center border rounded-lg border-[#2D3438] h-16 w-[71px] [&::-webkit-inner-spin-button]:appearance-none"
          />
        ))}
      </div>
      <button
        onClick={() => handleSubmit(email as string, otp.join(""))}
        disabled={!enabled || loading}
        className={`mt-10 h-14 rounded-lg ${
          enabled ? "bg-[#444CE7] " : "bg-[#2A3035]"
        } text-white font-medium  cursor-pointer
         disabled:cursor-not-allowed  w-full`}
      >
        Verify
      </button>
      <button
        disabled={loading}
        onClick={() => handleResendOtp(email as string)}
        className="underline cursor-pointer flex w-full items-center justify-center mt-8 text-[#444CE7]"
      >
        Resend otp
      </button>
    </div>
  );
};

export default OtpInputs;
