"use client";

import { act, useState } from "react";
import { validateSignup } from "../utils/validate";

import toast from "react-hot-toast";

import { login, register } from "../services/service";
import { useRouter } from "next/navigation";
import { Generating } from "@repo/ui/icons/Generating";
import { Error as ErrorIcon, EyeClosed, EyeOpen } from "@/app/components/icons";

type ActiveTab = "signup" | "login";
export const AuthForm = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("signup");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [authData, setAuthData] = useState({
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
      confirmPassword: authData.confirmPassword.trim().replace(/\s/g, ""),
    };

    if (validate.isValid) {
      setLoading(true);
      try {
        const response = await register(payload);

        if (response.success) { 
          toast.success(response.message);
          router.push("/verify-email");
        } else if (!response.success && response.details) {
          toast.error(response.details || "An error occured");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
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
    setLoading(true);
    const payload = {
      email: authData.email.trim().replace(/\s/g, ""),
      password: authData.password.trim().replace(/\s/g, ""),
    };
    try {
      const response = await login(payload);
      if (response.success) {
        toast.success(response.message);
        router.push("/verify-otp?email=" + authData.email);
      } else if (!response.success && response.details) {
        toast.error(response.details || "An error occured");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
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
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2 w-full ">
              <label htmlFor="username" className="text-[#A0A4A6]  ">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={(e) =>
                  setAuthData({ ...authData, username: e.target.value })
                }
                className="border-[#2D3438] outline-none bg-[#1A1F22]   placeholder:text-[#7A8288] text-[#F1F1F1] placeholder-text-sm border rounded-lg h-14 pl-3"
                placeholder="Jamie donalds"
              />
            </div>
            <div className="flex flex-col gap-2 w-full ">
              <label htmlFor="bio" className="text-[#A0A4A6] ">
                Bio
              </label>
              <input
                type="bio"
                id="bio"
                name="bio"
                className="border-[#2D3438] outline-none bg-[#1A1F22]   placeholder:text-[#7A8288] text-[#F1F1F1] placeholder-text-sm border rounded-lg h-14 pl-3"
                placeholder="Enter your bio"
                onChange={(e) =>
                  setAuthData({ ...authData, bio: e.target.value })
                }
              />
            </div>
          </div>
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
            disabled={
              !authData.email.trim() ||
              !authData.username.trim() ||
              !authData.password.trim() ||
              loading
            }
            className={` ${
              !authData.email.trim() ||
              !authData.password.trim() ||
              !authData.username.trim()
                ? "bg-[#2A3035]"
                : "bg-[#444CE7]"
            } cursor-pointer text-center disabled:cursor-not-allowed font-medium rounded-lg text-white py-6`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Generating />
              </div>
            ) : (
              "Create account"
            )}
          </button>
        ) : (
          <button
            onClick={handleLogin}
            disabled={
              !authData.email.trim() || !authData.password.trim() || loading
            }
            className={` ${
              !authData.email.trim() || !authData.password.trim()
                ? "bg-[#2A3035]"
                : "bg-[#444CE7]"
            } cursor-pointer disabled:cursor-not-allowed text-center font-medium rounded-lg text-white py-6`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Generating />
              </div>
            ) : (
              "Login"
            )}
          </button>
        )}
      </form>
    </>
  );
};
