export default function Sparkline({ data }: { data: number[] }) {
  return (
    <div>
      {data.map((v, i) => (
        <div key={i} title={`${i}:00 — ${v} attacks`} />
      ))}
    </div>
  );
}
