import type { cellType } from "../models/simulation/types";

type TableProps = {
  table: cellType[][];
};

function handleCellSelection(e: React.MouseEvent, cell: cellType) {
  const element = e.target as HTMLInputElement;
  element.contentEditable = "true";
  element.style.backgroundColor = "#f3f4f6";
  element.style.outline = "1px solid #2563eb";
  if (cell.f) {
    element.textContent = "=" + cell.f;
  }
  document.addEventListener("pointerdown", function handlePointerDown(event) {
    if (
      event.target !== element &&
      (event.target as HTMLInputElement).name !== "cellValue"
    ) {
      console.log("pointerdown");
      element.contentEditable = "false";
      element.style.backgroundColor = "";
      element.style.outline = "";
      element.style.outlineOffset = "";
      element.textContent = cell.v;
      document.removeEventListener("pointerdown", handlePointerDown);
    }
  });
}

export default function Table({ table }: TableProps) {
  return (
    <table className="table-auto w-full border-collapse text-center select-none">
      <thead>
        <tr>
          {table[0].map((cell, index) => (
            <th
              key={index}
              className="border border-gray-400 px-4 py-2 bg-[#2563eb] text-white"
            >
              {cell.v}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.slice(1).map((row, rowIndex) => (
          <tr
            key={rowIndex}
            onMouseOver={(e) => {
              const element = e.target as HTMLInputElement;
              element.style.backgroundColor = "#f3f4f6";
              element.addEventListener("mouseleave", () => {
                element.style.backgroundColor = "";
              });
            }}
          >
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                onMouseDown={(e) => handleCellSelection(e, cell)}
                className="border border-gray-400 px-4 py-2"
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
