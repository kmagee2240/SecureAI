import { useRef, useState, type ChangeEvent } from "react";

export default function FileInput() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChanges = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleClear = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  console.log(file);
  return (
    <>
      <label>Upload Field</label>
      <input type="file" onChange={handleFileChanges} ref={inputRef}></input>
      <button onClick={() => inputRef.current?.click()}>Upload</button>
      <button onClick={handleClear}> Clear</button>
    </>
  );
}
