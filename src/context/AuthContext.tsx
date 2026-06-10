import { useState } from "react";
import { AuthContext, type Role } from "../types/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("guest");

  const login = (role: Role) => setRole(role);
  const logout = () => setRole("guest");

  return (
    <AuthContext.Provider
      value={{
        role,
        isAdmin: role === "admin",
        isUser: role === "user",
        isGuest: role === "guest",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
