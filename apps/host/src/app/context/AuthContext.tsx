"use client";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { axiosInstance } from "../api/api";
import { AxiosResponse } from "axios";
import { User } from "../types/types";
 
type AuthContextType = {
  user: User | null;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = (await axiosInstance.get(
        "/user/currentUser"
      )) as AxiosResponse<{ success: boolean; currentUser: User }>;


      if (res.data.success) {
        setUser(res.data.currentUser);
      }
    } catch (e) {
      console.log(e);
    }
  };
 
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
