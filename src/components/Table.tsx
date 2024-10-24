import type { cellType } from "../models/simulation/types";

type TableProps = {
  table: cellType[][];
};

export default function Table({ table }: TableProps) {
  return (
    <table className="table-auto w-full border-collapse text-center">
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
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="border border-gray-400 px-4 py-2">
                {cell.v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
