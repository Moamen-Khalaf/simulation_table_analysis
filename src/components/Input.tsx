import useStore from "../models/table";
import Button from "./Button";
import Preview from "./Preview";
import useSIMStore from "../models/simulation/simulationStore";
import { useRef } from "react";

function Input() {
  const setTables = useStore((state) => state.setTables);
  const isLoading = useStore((state) => state.isLoading);
  const clearTables = useStore((state) => state.clear);
  const error = useStore((state) => state.error);
  const fileName = useStore((state) => state.fileName);

  const clearMain = useSIMStore((state) => state.clear);

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="p-4 mt-5 bg-white shadow-md rounded-md mx-2 md:mx-10 lg:mx-20">
      <div className="flex items-center gap-3 justify-between">
        <label htmlFor="file">
          <Button
            disabled={isLoading}
            onClick={() => inputRef.current?.click()}
          >
            {isLoading ? "Loading..." : "Upload"}
          </Button>
        </label>
        <input
          type="file"
          accept=".xlsx"
          ref={inputRef}
          id="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const buffer = e.target?.result;
                if (buffer instanceof ArrayBuffer) {
                  setTables(buffer, file.name);
                }
              };
              reader.readAsArrayBuffer(file);
            }
          }}
        />
        <label>{fileName || "No file selected"}</label>
        <Button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = "";
              inputRef.current.files = null;
            }
            clearTables();
            clearMain();
          }}
        >
          {isLoading ? "Cancel" : "Clear"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <Preview />
    </div>
  );
}
export default Input;
