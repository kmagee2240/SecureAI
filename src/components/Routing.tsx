import { Route, Routes } from "react-router-dom";
import Home from "../page/Home";
import Dashboard from "../page/Dashboard";
import Transactions from "../page/Transactions";
import Budget from "../page/Budget";
import Settings from "../page/Settings";
import AppLayout from "../layout/AppLayout";

export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<div>Admin</div>} />
      </Route>
    </Routes>
  );
}
