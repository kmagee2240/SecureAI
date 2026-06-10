export default function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 2,
        height: 48,
        width: "100%",
      }}
    >
      {data.map((v, i) => {
        const pct = max === 0 ? 0 : (v / max) * 100;
        const isHigh = v > 30;
        return (
          <div
            key={i}
            title={`${i}:00 — ${v} attacks`}
            style={{
              flex: 1,
              height: `${Math.max(pct, 4)}%`,
              borderRadius: 2,
              background: isHigh ? "#ef4444" : "#3b82f6",
              opacity: 0.85,
              transition: "height 0.3s",
            }}
          />
        );
      })}
    </div>
  );
}
