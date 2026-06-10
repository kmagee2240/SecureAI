import { useState } from "react";
import { useAuth } from "../hook/useAuth";

export default function Settings() {
  const { role } = useAuth();
  const [currency, setCurrency] = useState("USD");
  const [period, setPeriod] = useState("Monthly");

  return (
    <div>
      {/* Profile */}
      <div>
        <div>
          <p>Profile</p>
          <button>Edit</button>
        </div>
        <div>
          <div>
            <label>First name</label>
            <div>Kiki</div>
          </div>
          <div>
            <label>Last name</label>
            <div>—</div>
          </div>
        </div>
        <div>
          <label>Email</label>
          <div>bgcdeveloper3@gmail.com</div>
        </div>
        <div>
          <label>Role</label>
          <div>{role}</div>
        </div>
      </div>

      {/* Security */}
      <div>
        <p>Security</p>
        <div>
          <label>Password</label>
          <div>••••••••••••</div>
        </div>
        <button>Change password</button>
      </div>

      {/* Preferences */}
      <div>
        <p>Preferences</p>
        <div>
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div>
          <label htmlFor="period">Budget period</label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>
      </div>
    </div>
  );
}
