import { Route, Routes } from "react-router-dom";
import Dashboard from "../page/Dashboard";
import Transactions from "../page/Transactions";
import Budget from "../page/Budget";
import Settings from "../page/Settings";
import AppLayout from "../layout/AppLayout";

export default function Routing() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
