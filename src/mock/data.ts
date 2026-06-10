export const HOURLY_ATTACKS = [
  4, 7, 3, 2, 1, 0, 1, 5, 18, 34, 42, 29, 21, 18, 24, 31, 44, 38, 27, 19, 12, 9,
  6, 5,
];
export const TOP_IPS = [
  { ip: "185.220.101.47", attempts: 847, country: "RU", blocked: true },
  { ip: "45.33.32.156", attempts: 632, country: "CN", blocked: true },
  { ip: "192.241.245.23", attempts: 419, country: "US", blocked: false },
  { ip: "89.248.167.131", attempts: 311, country: "NL", blocked: true },
  { ip: "103.99.0.122", attempts: 287, country: "ID", blocked: false },
];
export const RECENT_EVENTS = [
  {
    time: "14:32:01",
    type: "BRUTE_FORCE",
    ip: "185.220.101.47",
    user: "admin@site.com",
    status: "blocked",
  },
  {
    time: "14:31:47",
    type: "LOGIN_FAIL",
    ip: "192.241.245.23",
    user: "john@example.com",
    status: "warning",
  },
  {
    time: "14:30:12",
    type: "LOCKOUT",
    ip: "45.33.32.156",
    user: "root@site.com",
    status: "blocked",
  },
  {
    time: "14:28:55",
    type: "LOGIN_SUCCESS",
    ip: "72.14.192.1",
    user: "alice@corp.com",
    status: "ok",
  },
  {
    time: "14:27:30",
    type: "CRED_STUFFING",
    ip: "89.248.167.131",
    user: "test@test.com",
    status: "blocked",
  },
  {
    time: "14:25:11",
    type: "LOGIN_FAIL",
    ip: "103.99.0.122",
    user: "user@mail.com",
    status: "warning",
  },
  {
    time: "14:22:44",
    type: "REGISTER",
    ip: "88.99.44.12",
    user: "new@user.com",
    status: "ok",
  },
  {
    time: "14:19:03",
    type: "GEO_ANOMALY",
    ip: "198.51.100.22",
    user: "bob@corp.com",
    status: "warning",
  },
];
export const RISK_USERS = [
  {
    user: "john@example.com",
    score: 87,
    reason: "5 countries in 2h",
    last: "2 min ago",
  },
  {
    user: "user@mail.com",
    score: 74,
    reason: "Credential stuffing",
    last: "8 min ago",
  },
  {
    user: "bob@corp.com",
    score: 61,
    reason: "Geo anomaly",
    last: "19 min ago",
  },
  {
    user: "test@test.com",
    score: 55,
    reason: "Known bad IP",
    last: "25 min ago",
  },
];

export const STATS = [
  { label: "Attacks today", value: "1,284", delta: "+12%", bad: true },
  { label: "IPs blocked", value: "47", delta: "+3", bad: true },
  { label: "Lockouts active", value: "9", delta: "-2", bad: false },
  { label: "Successful logins", value: "328", delta: "+8%", bad: false },
];

// ── Helpers ───────────────────────────────────────────────────
export const statusColor: Record<string, string> = {
  blocked: "#ef4444",
  warning: "#f59e0b",
  ok: "#22c55e",
};
export const statusLabel: Record<string, string> = {
  blocked: "BLOCKED",
  warning: "WARN",
  ok: "OK",
};

export function riskColor(score: number) {
  if (score >= 80) return "#ef4444";
  if (score >= 60) return "#f59e0b";
  return "#22c55e";
}
