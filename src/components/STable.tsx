import { useEffect } from "react";
import useSIMStore from "../models/simulation/simulationStore";
import useStore from "../models/table";
import Table from "./Table";
import Button from "./Button";
import { getDataExcel } from "../utils/parseExcel";

function STable() {
  const simulationTable = useSIMStore((state) => state.simulationTable);
  const setTableData = useSIMStore((state) => state.setTableData);
  const isLoading = useSIMStore((state) => state.isLoading);

  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state) => state.tables,
      (tables) => {
        if (tables.length) {
          setTableData();
        }
      }
    );
    return unsubscribe;
  }, [setTableData]);
  return (
    <div
      className="transition-opacity duration-500 ease-in-out overflow-auto w-full mx-2 md:w-[95%] md:mx-auto my-5"
      style={{ opacity: simulationTable.length ? 1 : 0 }}
    >
      {isLoading && <div className="text-center">Loading...</div>}

      {simulationTable.length ? (
        <>
          <Table table={simulationTable} />
          <span className="w-fit mx-auto block">
            <Button
              onClick={() => {
                const blob = getDataExcel(simulationTable);
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
