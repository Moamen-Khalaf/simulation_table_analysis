import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import parseExcel from "../utils/parseExcel";
import { subscribeWithSelector } from "zustand/middleware";

interface IStore {
  tables: string[][][];
  isLoading: boolean;
  error: string | null;
  setTables: (buffer: BufferSource) => void;
  clear: () => void;
}
const useStore = create<IStore>()(
  immer(
    subscribeWithSelector((set) => ({
      tables: [],
      isLoading: false,
      error: null,
      setTables: (buffer: BufferSource) =>
        set((state) => {
          try {
            state.isLoading = true;
            state.tables = parseExcel(buffer);
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
        }),
    }))
  )
);

export default useStore;
