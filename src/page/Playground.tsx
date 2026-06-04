import { FileInput, Menu } from "../components";

export default function Playground() {
  return (
    <div style={{ margin: "auto" }}>
      Playground
      <FileInput />
      <div style={{ marginTop: 6, marginBottom: 6 }} />
      <Menu />
    </div>
  );
}
