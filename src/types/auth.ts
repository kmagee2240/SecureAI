import { createContext } from "react";

export type Role = "admin" | "user" | "guest";

export interface AuthContextType {
  role: Role;
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
