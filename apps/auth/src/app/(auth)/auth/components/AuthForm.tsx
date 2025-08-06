"use client";

import { useState } from "react";
import { validateSignup } from "../utils/validate";
import toast from "react-hot-toast";
import { login, register } from "../services/service";
import { useRouter } from "next/navigation";
import {
  Error as ErrorIcon,
  EyeClosed,
  EyeOpen,
  Loading,
  Success,
} from "@/app/components/icons";
import { BioData } from "./BioData";

type ActiveTab = "signup" | "login";
export type AuthData = {
  username: string;
  bio: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export const AuthForm = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("signup");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthData>({
    username: "",
    bio: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isOpen, setIsOpen] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleSignup = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const validate = validateSignup(authData);

    const payload = {
      username: authData.username.trim(),
      email: authData.email.trim().replace(/\s/g, ""),
      password: authData.password.trim().replace(/\s/g, ""),
      ...(authData.bio.trim() && {
        bio: authData.bio.trim(),
      }),
    };

    if (validate.isValid) {
      const toastId = toast("Creating account...", {
        icon: <Loading />,
        style: {
          borderRadius: "12px",
          background: "#1E1E1E",
          color: "#EDEDED",
          padding: "16px",
          boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
        },
      });

      setLoading(true);
      try {
        const response = await register(payload);

        if (response.success) {
          toast(response.message, {
            icon: <Success />,
            style: {
              borderRadius: "12px",
              background: "#1E1E1E",
              color: "#EDEDED",
              padding: "16px",
              boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
            },
            duration: 1000,
          });

          router.push(`/verify-email?email=${payload.email}`);
        } else if (!response.success && response.details) {
          toast(response.details || "An error occured", {
            icon: <ErrorIcon />,
            style: {
              borderRadius: "12px",
              background: "#1E1E1E",
              color: "#EDEDED",
              padding: "16px",
              boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
            }, 
            duration: 1500,
          });
        } else {
          toast(response.details || "An error occured", {
            icon: <ErrorIcon />,
            style: {
              borderRadius: "12px",
              background: "#1E1E1E",
              color: "#EDEDED",
              padding: "16px",
              boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
            },
            duration: 1500,
          });
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          toast(error.message, {
            icon: <ErrorIcon />,
            style: {
              borderRadius: "12px",
              background: "#1E1E1E",
              color: "#EDEDED",
              padding: "16px",
              boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
            },
            duration: 1500,
          });
        }
      } finally {
        setLoading(false);
        toast.dismiss(toastId);
      }
    } else {
      toast(validate.error, {
        icon: <ErrorIcon />,
        style: {
          borderRadius: "12px",
          background: "#1E1E1E",
          color: "#EDEDED",
          padding: "16px",
          boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
        },
        duration: 1500,
      });
      return;
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const payload = {
      email: authData.email.trim().replace(/\s/g, ""),
      password: authData.password.trim().replace(/\s/g, ""),
    };

    const toastId = toast("logging in...", {
      icon: <Loading />,
      style: {
        borderRadius: "12px",
        background: "#1E1E1E",
        color: "#EDEDED",
        padding: "16px",
        boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
      },
    });

    try {
      setLoading(true);

      const response = await login(payload);
      if (response.success) {
        toast(response.message, {
          icon: <Success />,
          style: {
            borderRadius: "12px",
            background: "#1E1E1E",
            color: "#EDEDED",
            padding: "16px",
            boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
          },
          duration: 1000,
        });
        router.push("/verify-otp?email=" + authData.email);
      } else if (!response.success && response.details) {
        toast.error(response.details || "An error occured");
      } else {
        toast(response.message, {
          icon: <ErrorIcon />,
          style: {
            borderRadius: "12px",
            background: "#1E1E1E",
            color: "#EDEDED",
            padding: "16px",
            boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
          },
          duration: 1500,
        });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast(error.message, {
          icon: <ErrorIcon />,
          style: {
            borderRadius: "12px",
            background: "#1E1E1E",
            color: "#EDEDED",
            padding: "16px",
            boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
          },
          duration: 1500,
        });
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const handleOpenChange = (type: "password" | "confirmPassword ") => {
    const openState = { ...isOpen };

    if (type === "password") {
      openState.password = !openState.password;
    } else {
      openState.confirmPassword = !openState.confirmPassword;
    }

    setIsOpen(openState);
  };

  const isSignUpActive =
    !authData.email.trim() ||
    !authData.username.trim() ||
    !authData.password.trim() ||
    !authData.confirmPassword.trim() ||
    loading;

  const isLoginActive =
    !authData.email.trim() || !authData.password.trim() || loading;

  return (
    <>
      <div className="flex items-center sticky top-0 left-0 py-4 bg-[#101516]  ">
        <button
          onClick={() => {
            if (!loading) {
              setActiveTab("signup");
            }
          }}
          className={` ${
            activeTab === "signup"
              ? "bg-[#1E252A] text-white"
              : "text-[#7A8288] "
          }  cursor-pointer  py-2 px-4   rounded-[20px]`}
        >
          sign up
        </button>
        <button
          onClick={() => {
            if (!loading) {
              setActiveTab("login");
            }
          }}
          className={`  ${
            activeTab === "login"
              ? "bg-[#1E252A] text-white"
              : "text-[#7A8288] "
          } cursor-pointer  py-2 px-4    rounded-[20px]`}
        >
          login
        </button>
      </div>
      <form className="flex flex-col mt-8  gap-6">
        <h2 className="text-2xl font-medium text-white">
          {activeTab === "signup" ? "Create account" : "Login"}
        </h2>
        {activeTab === "signup" && (
          <BioData setAuthData={setAuthData} authData={authData} />
        )}

        <div className="flex flex-col gap-2 ">
          <label htmlFor="email" className="text-[#A0A4A6] ">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) =>
              setAuthData({ ...authData, email: e.target.value })
            }
            className="border-[#2D3438] outline-none bg-[#1A1F22]   placeholder:text-[#7A8288] text-[#F1F1F1] placeholder-text-sm border rounded-lg h-14 pl-3"
            placeholder="Enter your email"
          />
        </div>

        <div
          className={`${activeTab === "signup" && "flex items-center gap-4"}`}
        >
          <div className="flex flex-col gap-2 w-full ">
            <label htmlFor="password" className="text-[#A0A4A6] ">
              Password
            </label>

            <div className="relative ">
              <input
                type={isOpen["password"] ? "text" : "password"}
                id="password"
                name="password"
                onChange={(e) =>
                  setAuthData({ ...authData, password: e.target.value })
                }
                className="border-[#2D3438] outline-none bg-[#1A1F22] w-full  placeholder:text-[#7A8288] text-[#F1F1F1] placeholder-text-sm border rounded-lg h-14 pl-3"
                placeholder="Enter your password"
              />

              {authData.password.trim() && (
                <div
                  onClick={() => handleOpenChange("password")}
                  className="absolute right-2 cursor-pointer top-4"
                >
                  {isOpen["password"] ? <EyeOpen /> : <EyeClosed />}
                </div>
              )}
            </div>
          </div>

          {activeTab === "signup" && (
            <div className="flex flex-col gap-2 w-full ">
              <label htmlFor="confirmPassword" className="text-[#A0A4A6] ">
                Confirm password
              </label>

              <div className="relative">
                <input
                  type={isOpen["confirmPassword"] ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={(e) =>
                    setAuthData({
                      ...authData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="border-[#2D3438] outline-none bg-[#1A1F22] w-full   placeholder:text-[#7A8288] text-[#F1F1F1] placeholder-text-sm border rounded-lg h-14 pl-3"
                  placeholder="Confirm your password"
                />

                {authData.confirmPassword.trim() && (
                  <div
                    onClick={() => handleOpenChange("confirmPassword ")}
                    className="absolute right-2 cursor-pointer top-4"
                  >
                    {isOpen["confirmPassword"] ? <EyeOpen /> : <EyeClosed />}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {activeTab === "signup" ? (
          <button
            onClick={handleSignup}
            disabled={isSignUpActive}
            className={` ${
              isSignUpActive ? "bg-[#2A3035]" : "bg-[#444CE7]"
            } cursor-pointer text-center disabled:cursor-not-allowed font-medium rounded-lg text-white py-6`}
          >
            Create account
          </button>
        ) : (
          <button
            onClick={handleLogin}
            disabled={isLoginActive}
            className={` ${
              isLoginActive ? "bg-[#2A3035]" : "bg-[#444CE7]"
            } cursor-pointer disabled:cursor-not-allowed text-center font-medium rounded-lg text-white py-6`}
          >
            Login
          </button>
        )}
      </form>
    </>
  );
};
