import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/transactions", label: "Transactions" },
  { path: "/budget", label: "Budget" },
  { path: "/settings", label: "Settings" },
];

export default function AppLayout() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {/* Sidebar */}
      <aside>
        <div>
          <span>FinTrack</span>
        </div>

        <nav>
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
          {isAdmin && <Link to="/admin">Admin</Link>}
        </nav>

        <div>
          <span>Kiki</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </aside>

      {/* Main content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
