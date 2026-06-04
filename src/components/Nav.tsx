import { Link } from "react-router-dom";

export default function Nav() {
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
    </>
  );
}
