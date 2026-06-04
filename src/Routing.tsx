import { Route, Routes, type RouteObject } from "react-router-dom";
import Home from "./page/Home";
import Dashboard from "./page/Dashboard";
import Info from "./page/Info";
import Playground from "./page/Playground";

export default function Routing() {
  const routes: RouteObject[] = [
    { path: "/", element: <Home /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/info", element: <Info /> },
    { path: "/playground", element: <Playground /> },
  ];

  return (
    <>
      <Routes>
        {routes.map((routes: RouteObject, key: number) => (
          <Route key={key} path={routes.path} element={routes.element} />
        ))}
      </Routes>
    </>
  );
}
