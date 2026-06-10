import { riskColor } from "../mock/data";

export default function RiskBar({ score }: { score: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{ flex: 1, height: 6, background: "#1e293b", borderRadius: 99 }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            borderRadius: 99,
            background: riskColor(score),
            transition: "width 0.4s",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: riskColor(score),
          minWidth: 28,
        }}
      >
        {score}
      </span>
    </div>
  );
}
