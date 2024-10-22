import { useState } from "react";
import useStore from "../models/table";
import Table from "./Table";
import Button from "./Button";
import { MdOutlineRefresh } from "react-icons/md";

export default function Preview() {
  const tables = useStore((state) => state.tables);
  const [refresh, setRefresh] = useState(false);
  const [preview, setPreview] = useState(false);
  return tables.length ? (
    <>
      <div className="flex justify-between items-center">
        <Button onClick={() => setPreview(!preview)}>
          {preview ? "Hide" : "Show"} Preview
        </Button>
        <MdOutlineRefresh
          className={`text-[2rem] cursor-pointer text-gray-500 ${
            refresh ? "animate-spin" : ""
          }`}
          onClick={() => {
            setRefresh(true);
            setTimeout(() => {
              setRefresh(false);
            }, 1500);
          }}
        />
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
