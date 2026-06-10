import { useEffect, useState } from "react";
import RiskBar from "../components/RiskBar";
import {
  HOURLY_ATTACKS,
  RECENT_EVENTS,
  RISK_USERS,
  STATS,
  statusLabel,
  TOP_IPS,
} from "../mock/data";
import PulseDot from "../components/PulseDot";
import Sparkline from "../components/Sparkline";
import type { TabId } from "../types/auth";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setLiveCount((c) => (c % 7) + 1);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "events", label: "Events" },
    { id: "ips", label: "IPs" },
    { id: "risk", label: "Risk" },
  ];

  return (
    <div>
      <div>
        <div>
          <span>🛡️</span>
          <h1>Security Operations</h1>
        </div>
        <p>Admin-only · Real-time threat monitoring</p>
      </div>
      <div>
        <PulseDot color="#22c55e" />
        <span>
          <span>{liveCount}</span> live sessions
        </span>
      </div>

      <div>
        {STATS.map((s) => (
          <div key={s.label}>
            <p>{s.label}</p>
            <div>
              <span>{s.value}</span>
              <span>{s.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div>
          <div>
            <p>Attacks — last 24h</p>
            <p>Each bar = 1 hour · Red = spike (&gt;30)</p>
            <Sparkline data={HOURLY_ATTACKS} />
            <div>
              <span>00:00</span>
              <span>12:00</span>
              <span>23:00</span>
            </div>
          </div>

          <div>
            <p>Attack breakdown</p>
            {[
              { label: "Brute force", pct: 44 },
              { label: "Credential stuff.", pct: 28 },
              { label: "Geo anomaly", pct: 16 },
              { label: "Other", pct: 12 },
            ].map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <span>{item.pct}%</span>
              </div>
            ))}
          </div>

          <div>
            <p>Active policy</p>
            {[
              { label: "Max login attempts", value: "5" },
              { label: "Lockout duration", value: "15 min" },
              { label: "Min password length", value: "8 chars" },
              { label: "2FA enforcement", value: "Admins only" },
              { label: "CSRF protection", value: "Enabled" },
              { label: "JWT storage", value: "Memory only" },
            ].map((row) => (
              <div key={row.label}>
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>

          <div>
            <p>Highest risk users</p>
            {RISK_USERS.map((u) => (
              <div key={u.user}>
                <div>
                  <span>{u.user}</span>
                  <span>{u.last}</span>
                </div>
                <RiskBar score={u.score} />
                <span>{u.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div>
          <div>
            {["Time", "Type", "IP", "User", "Status"].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          {RECENT_EVENTS.map((ev, i) => (
            <div key={i}>
              <span>{ev.time}</span>
              <span>{ev.type}</span>
              <span>{ev.ip}</span>
              <span>{ev.user}</span>
              <span>{statusLabel[ev.status]}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "ips" && (
        <div>
          <div>
            {["IP Address", "Country", "Attempts", "Status"].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          {TOP_IPS.map((ip, i) => (
            <div key={i}>
              <span>{ip.ip}</span>
              <span>{ip.country}</span>
              <span>{ip.attempts.toLocaleString()}</span>
              <span>{ip.blocked ? "BLOCKED" : "MONITORING"}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "risk" && (
        <div>
          {RISK_USERS.map((u) => (
            <div key={u.user}>
              <div>
                <p>{u.user}</p>
                <p>
                  {u.reason} · {u.last}
                </p>
              </div>
              <span>{u.score}</span>
              <RiskBar score={u.score} />
            </div>
          ))}
        </div>
      )}

      <p>Placeholder data · Connect to your n8n webhooks to go live</p>
    </div>
  );
}
