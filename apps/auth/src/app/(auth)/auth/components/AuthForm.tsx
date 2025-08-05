"use client";

import { useState } from "react";
import { validateSignup } from "../utils/validate";

import toast from "react-hot-toast";

import { login, register } from "../services/service";
import { useRouter } from "next/navigation";
import { Generating } from "@repo/ui/icons/Generating";

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

    if (validate) {
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

  return (
    <div className="py-4 relative">
      <div className="flex items-center sticky top-0 left-0 bg-[#101516]  ">
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
        <h2 className="text-2xl font-medium text-white">Create account</h2>
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
            <label htmlFor="email" className="text-[#A0A4A6] ">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) =>
                setAuthData({ ...authData, password: e.target.value })
              }
              className="border-[#2D3438] outline-none bg-[#1A1F22]   placeholder:text-[#7A8288] text-[#F1F1F1] placeholder-text-sm border rounded-lg h-14 pl-3"
              placeholder="Enter your password"
            />
          </div>

          {activeTab === "signup" && (
            <div className="flex flex-col gap-2 w-full ">
              <label htmlFor="email" className="text-[#A0A4A6] ">
                Confirm password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) =>
                  setAuthData({ ...authData, password: e.target.value })
                }
                className="border-[#2D3438] outline-none bg-[#1A1F22]   placeholder:text-[#7A8288] text-[#F1F1F1] placeholder-text-sm border rounded-lg h-14 pl-3"
                placeholder="Enter your password"
              />
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
              "login"
            )}
          </button>
        )}
      </form>
    </div>
  );
};
