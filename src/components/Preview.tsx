import { useState } from "react";
import useStore from "../models/table";
import Table from "./Table";
import Button from "./Button";
import { MdOutlineRefresh } from "react-icons/md";
import useSIMStore from "../models/simulation/simulationStore";
import type { cellType } from "../models/simulation/types";

export default function Preview() {
  const tables: cellType[][][] = useStore((state) => state.tables);
  const [refresh, setRefresh] = useState(false);
  const [preview, setPreview] = useState(false);
  return tables.length ? (
    <>
      <div className="flex justify-between items-center">
        <Button onClick={() => setPreview(!preview)}>
          {preview ? "Hide" : "Show"} Preview
        </Button>
        <input
          type="text"
          name="cellValue"
          className="flex-grow px-2 py-1 border border-gray-400 rounded-md mx-5 outline-none"
        />
        <Button
          disabled={refresh}
          onClick={() => {
            setRefresh(true);
            useSIMStore.getState().setTableData();
            setTimeout(() => {
              setRefresh(false);
            }, 2500);
          }}
        >
          <MdOutlineRefresh
            className={`text-[1.5rem] cursor-pointer text-white ${
              refresh ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out transform ${
          preview
            ? "max-h-screen opacity-100 scale-100"
            : "max-h-0 opacity-0 scale-95"
        } overflow-hidden`}
      >
        <div className="flex gap-3">
          {tables.map((table, index) => (
            <Table key={index} table={table} />
          ))}
        </div>
      </div>
    </>
  ) : (
    <div className="text-center">There are no tables.</div>
  );
}
