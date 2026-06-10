import { Anchor, Button, Group, Title } from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./modal/AuthModal";

const routes: { path: string; name: string }[] = [{ path: "/", name: "Home" }];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Group
        justify="space-between"
        p="md"
        style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
      >
        <Group gap="lg">
          <Title order={4}>FinTrack</Title>
          {routes.map((route) => (
            <Anchor key={route.path} component={Link} to={route.path} size="sm">
              {route.name}
            </Anchor>
          ))}
        </Group>
        <Button onClick={() => setOpen(true)}>Log in / Register</Button>
      </Group>
      <AuthModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
