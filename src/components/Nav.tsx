import { Button } from "@headlessui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./modal/AuthModal";

export default function Nav() {
  const [open, setOpen] = useState(false);

  const routes: { path: string; name: string }[] = [
    { path: "", name: "Home" },
    { path: "dashboard", name: "dashboard" },
    { path: "info", name: "info" },
    { path: "playground", name: "playground" },
  ];
  return (
    <>
      {routes.map((routes, key: number) => (
        <Link key={key} to={routes.path}>
          {routes.name}
        </Link>
      ))}
      <Button onClick={() => setOpen(true)}>Log In/ Register</Button>
      <AuthModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
