import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import parseExcel from "../utils/parseExcel";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import type { cellType } from "./simulation/types";

interface IStore {
  tables: cellType[][][];
  fileName: string;
  isLoading: boolean;
  error: string | null;
  selectedCell: cellType | null;
  setCell: (cell: cellType | null) => void;
  setTables: (buffer: BufferSource, fileName: string) => void;
  clear: () => void;
}
const useStore = create<IStore>()(
  immer(
    persist(
      subscribeWithSelector((set) => ({
        tables: [],
        fileName: "",
        isLoading: false,
        error: null,
        selectedCell: null,
        setTables: (buffer: BufferSource, fileName: string) =>
          set((state) => {
            try {
              state.isLoading = true;
              state.tables = parseExcel(buffer);
              state.fileName = fileName;
            } catch (error) {
              state.error = (error as Error).message;
            } finally {
              state.isLoading = false;
            }
          }),
        clear: () =>
          set((state) => {
            state.tables = [];
            state.error = null;
            state.fileName = "";
            localStorage.removeItem("tables");
          }),
        setCell: (cell) =>
          set((state) => {
            state.selectedCell = cell;
          }),
      })),
      { name: "tables", storage: createJSONStorage(() => sessionStorage) }
    )
  )
);

export default useStore;
