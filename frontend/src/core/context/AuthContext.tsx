import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const token = getCookie("auth_token");
    const userData = getCookie("user_data");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("token", token);
        }
      } catch (error) {
        deleteCookie("auth_token");
        deleteCookie("user_data");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    setCookie("auth_token", token);
    setCookie("user_data", JSON.stringify(userData));
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("token", token);
    }
    setUser(userData);
  };

  const logout = () => {
    deleteCookie("auth_token");
    deleteCookie("user_data");
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("token");
    }
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    if (typeof window === "undefined") {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: () => {},
        logout: () => {},
      };
    }
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
