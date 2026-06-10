import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import type { Role } from "../types/auth";

interface ProtectedRouteProps {
  role?: Role;
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { role: userRole } = useAuth();

  const isAuthenticated = userRole !== undefined;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (role && userRole !== role) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
