export default function PulseDot({ color }: { color: string }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        width: 10,
        height: 10,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          opacity: 0.4,
          animation: "ping 1.5s ease-in-out infinite",
        }}
      />
      <span
        style={{
          position: "relative",
          borderRadius: "50%",
          width: 10,
          height: 10,
          background: color,
        }}
      />
    </span>
  );
}
