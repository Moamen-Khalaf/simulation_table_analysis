type TableProps = {
  table: string[][];
};

export default function Table({ table }: TableProps) {
  return (
    <table className="table-auto w-full border-collapse">
      <thead>
        <tr>
          {table[0].map((header, index) => (
            <th
              key={index}
              className="border border-gray-300 p-2 bg-gray-200 text-center"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.slice(1).map((row, index) => (
          <tr key={index}>
            {row.map((cell, index) => (
              <td
                key={index}
                className="border border-gray-300 p-2 text-center"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
