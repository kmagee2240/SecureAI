import { useState } from "react";
import { AuthContext, type Role } from "../types/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("user");

  const login = (role: Role) => setRole(role);
  const logout = () => setRole("user");

  return (
    <AuthContext.Provider
      value={{
        role,
        isAdmin: role === "admin",
        isUser: role === "user",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
