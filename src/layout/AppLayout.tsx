import { AppShell, Avatar, Button, Group, NavLink, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const [opened] = useDisclosure();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppShell
      navbar={{ width: 220, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <Stack justify="space-between" h="100%">
          <Stack gap="xs">
            <Title order={4} mb="md">FinTrack</Title>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                component={Link}
                to={item.path}
                label={item.label}
                active={location.pathname === item.path}
              />
            ))}
            {isAdmin && (
              <NavLink
                component={Link}
                to="/admin"
                label="Admin"
                active={location.pathname === "/admin"}
              />
            )}
          </Stack>

          <Stack gap="xs">
            <Group>
              <Avatar radius="xl" size="sm" color="blue">K</Avatar>
              <Text size="sm" fw={500}>Kiki</Text>
            </Group>
            <Button variant="subtle" color="gray" size="xs" onClick={handleLogout}>
              Log out
            </Button>
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
