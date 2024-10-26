import type { cellType } from "../models/simulation/types";
import useStore from "../models/table";

type TableProps = {
  table: cellType[][];
};

function handleCellSelection(e: React.MouseEvent, cell: cellType) {
  const element = e.target as HTMLInputElement;
  element.contentEditable = "true";
  element.style.backgroundColor = "#f3f4f6";
  element.style.outline = "1px solid #2563eb";
  useStore.getState().setCell(cell);
  if (cell.f) {
    element.textContent = "=" + cell.f;
  }
  document.addEventListener("pointerdown", function handlePointerDown(event) {
    if (
      event.target !== element &&
      (event.target as HTMLInputElement).name !== "cellValue"
    ) {
      element.contentEditable = "false";
      element.style.backgroundColor = "";
      element.style.outline = "";
      element.style.outlineOffset = "";
      element.textContent = cell.v;
      document.removeEventListener("pointerdown", handlePointerDown);
      useStore.getState().setCell(null);
    }
  });
}

import React from "react";

function generateColumnHeaders(length: number) {
  const headers = [];
  for (let i = 0; i < length; i++) {
    let header = "";
    let temp = i;
    while (temp >= 0) {
      header = String.fromCharCode((temp % 26) + 65) + header;
      temp = Math.floor(temp / 26) - 1;
    }
    headers.push(header);
  }
  return headers;
}
function splitPosition(pos: string): [string, string] {
  const match = pos.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    return ["", ""];
  }
  return [match[1], match[2]];
}
export default function Table({ table }: TableProps) {
  const columnHeaders = generateColumnHeaders(table[0].length);
  const selectedCell = useStore((state) => state.selectedCell);
  const [selectedColumn, selectedRow] = splitPosition(selectedCell?.pos || "");
  return (
    <table className="table-auto w-full border-collapse text-center select-none">
      <thead>
        <tr>
          <th className="border border-gray-400 px-4 py-2 bg-[#2563eb] text-white"></th>
          {columnHeaders.map((header, index) => (
            <th
              key={index}
              className={`border border-gray-400 px-4 py-2 bg-[#2563eb] text-white ${
                selectedColumn === header ? "bg-[#2d4e94]" : ""
              }`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            onMouseOver={(e) => {
              if (
                (e.target as HTMLTableCellElement).classList.contains(
                  "row-header"
                )
              ) {
                return;
              }
              const element = e.target as HTMLInputElement;
              element.style.backgroundColor = "#f3f4f6";
              element.style.color = "#000";
              element.addEventListener("mouseleave", () => {
                element.style.backgroundColor = "";
              });
            }}
          >
            <td
              className={`row-header border border-gray-400 px-4 py-2 bg-[#2563eb] text-white ${
                selectedRow === `${rowIndex + 1}` ? "bg-[#2d4e94]" : ""
              }`}
            >
              {rowIndex + 1}
            </td>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                onMouseDown={(e) => {
                  handleCellSelection(e, cell);
                }}
                className={`border border-gray-400 px-4 py-2 ${
                  rowIndex === 0 ? "font-bold" : ""
                }`}
              >
                {cell.v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
