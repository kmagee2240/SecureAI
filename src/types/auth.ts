import { createContext } from "react";

export type Role = "admin" | "user";
export type Tab = "login" | "register";

export interface AuthContextType {
  role: Role;
  isAdmin: boolean;
  isUser: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
