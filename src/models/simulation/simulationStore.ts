import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { processTable } from "./utils/processTable";
import { type IStore } from "./types";
import simulate from "./utils/simulate";

const useSIMStore = create<IStore>()(
  devtools(
    immer((set) => ({
      isLoading: false,
      error: null,
      rawTable: [],
      simulationTable: [],
      setTableData: (table: string[][][]) => {
        try {
          set(() => ({ isLoading: true }));
          const users = processTable(table);
          const simulationTable = simulate(users);
          set((state) => {
            state.simulationTable = simulationTable;
            state.rawTable = simulationTable.map((row) =>
              row.map((cell) => cell.v)
            );
            console.log("Processed table", state.rawTable);
          });
        } catch (error) {
          console.error(error);
          set(() => ({ error: (error as Error).message }));
        } finally {
          set(() => ({ isLoading: false }));
        }
      },
      clear: () => {
        set(() => ({
          simulationTable: [],
          users: {},
          rawTable: [],
          error: null,
        }));
      },
    }))
  )
);

export default useSIMStore;
