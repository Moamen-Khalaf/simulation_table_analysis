import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { processTable } from "./utils/processTable";
import { type IStore } from "./types";
import simulate from "./utils/simulate";
import useStore from "../table";

const useSIMStore = create<IStore>()(
  devtools(
    immer((set) => ({
      isLoading: false,
      error: null,
      rawTable: [],
      simulationTable: [],
      setTableData: () => {
        try {
          set(() => ({ isLoading: true, error: null }));
          const table = useStore.getState().tables;
          const rawTable = table.map((row) =>
            row.map((cell) => cell.map((cell) => cell.v))
          );

          const users = processTable(rawTable);

          const simulationTable = simulate(users);

          set((state) => {
            state.simulationTable = simulationTable;
            state.rawTable = simulationTable.map((row) =>
              row.map((cell) => cell.v)
            );
          });
        } catch (error) {
          set((state) => {
            state.error = (error as Error).message;
            state.simulationTable = [];
            state.rawTable = [];
          });
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
