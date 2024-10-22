import * as XLSX from "xlsx";

export default function parseExcel(fileBuffer: BufferSource) {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
  const tables: string[][][] = [[]];

  jsonData.forEach((row) => {
    const rowDetails = Object.values(row as Record<string, unknown>);
    if (!Array.isArray(rowDetails)) {
      throw new Error("Expected row to be an array");
    }

    if (
      rowDetails.find((value) => String(value).toUpperCase() === "__TABLE__")
    ) {
      tables.push([]);
      return;
    }

    tables[tables.length - 1].push(rowDetails as string[]);
  });
  return tables;
}
export function getPosition(colIndex: number, rowIndex: number) {
  return XLSX.utils.encode_cell({ c: colIndex, r: rowIndex });
}
export function getPositionCoordinates(position: string) {
  return XLSX.utils.decode_cell(position);
}
export function getDataExcel(tables: string[][]) {
  const newFile = XLSX.utils.aoa_to_sheet(tables);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newFile, "Sheet1");

  const excelData = XLSX.write(newWorkbook, {
    bookType: "xlsx",
    type: "binary",
  });

  const arrayBuffer = new ArrayBuffer(excelData.length);
  const view = new Uint8Array(arrayBuffer);

  for (let i = 0; i < excelData.length; i++) {
    view[i] = excelData.charCodeAt(i) & 0xff;
  }

  return new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/*
[
  [
    [ 'SERVICE_ID', 'SERVICE_NAME', 'SERVICE_TIME' ],
    [ 1, 'Service 1', 0 ],
    [ 2, 'Service 2', 10 ],
    [ 3, 'Service 3', 10 ],
    [ 4, 'Service 4', 10 ],
    [ 5, 'Service 5', 10 ]
  ],
  [
    [ 'CLIENT_ID', 'INTERARRIVALE_TIME', 'SERVICE_ID' ],
    [ 1, 0, 5 ],
    [ 2, 6, 5 ],
    [ 3, 4, 1 ],
    [ 4, 1, 2 ],
    [ 5, 6, 2 ]
  ]
]
*/
