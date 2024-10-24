import { useEffect } from "react";
import useSIMStore from "../models/simulation/simulationStore";
import useStore from "../models/table";
import Table from "./Table";
import Button from "./Button";
import { getDataExcel } from "../utils/parseExcel";

function STable() {
  const rawTable = useSIMStore((state) => state.rawTable);
  const setTableData = useSIMStore((state) => state.setTableData);

  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state) => state.tables,
      (tables) => {
        if (tables.length) {
          setTableData(tables);
        }
      }
    );
    return unsubscribe;
  }, [setTableData]);
  return (
    <div
      className="scale-90 transition-opacity duration-500 ease-in-out overflow-auto"
      style={{ opacity: rawTable.length ? 1 : 0 }}
    >
      {rawTable.length ? (
        <>
          <Table table={rawTable} />
          <span className="flex justify-center gap-3">
            <Button
              onClick={() => {
                const blob = new Blob(
                  [rawTable.map((row) => row.join(",")).join("\n")],
                  { type: "text/csv" }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "simulation.csv";
                a.click();
              }}
            >
              Save as CSV
            </Button>
            <Button
              onClick={() => {
                const blob = getDataExcel(rawTable);
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "simulation.xlsx";
                a.click();
                a.remove();
              }}
            >
              Save as Excel
            </Button>
          </span>
        </>
      ) : (
        <small className="w-fit mx-auto">No data available</small>
      )}
    </div>
  );
}

export default STable;
