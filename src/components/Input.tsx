import useStore from "../models/table";
import Button from "./Button";
import Preview from "./Preview";
import useSIMStore from "../models/simulationStore";
import { useRef } from "react";

function Input() {
  const setTables = useStore((state) => state.setTables);
  const isLoading = useStore((state) => state.isLoading);
  const clearTables = useStore((state) => state.clear);
  const error = useStore((state) => state.error);

  const clearMain = useSIMStore((state) => state.clear);

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="p-4 mt-5 bg-white shadow-md rounded-md mx-2 md:mx-10 lg:mx-20">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept=".xlsx"
          ref={inputRef}
          className="block w-full text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 focus:outline-none"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const buffer = e.target?.result;
                if (buffer instanceof ArrayBuffer) {
                  setTables(buffer);
                }
              };
              reader.readAsArrayBuffer(file);
            }
          }}
        />
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
