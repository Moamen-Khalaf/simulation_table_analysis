export type cellType = { pos: string; f: string; v: string };
export type IColumnHeader =
  | "CLIENT_ID"
  | "INTERARRIVAL_TIME"
  | "ARRIVAL_TIME"
  | "ISSUE_CODE"
  | "ISSUE"
  | "TIME_SER_BEG"
  | "SERVICE_TIME"
  | "TIME_SER_ENDS"
  | "CUST_STATE"
  | "SYSTEM_STATE";
export enum ColumnHeader {
  CLIENT_ID = "CLIENT_ID",
  INTERARRIVAL_TIME = "INTERARRIVAL_TIME",
  ARRIVAL_TIME = "ARRIVAL_TIME",
  ISSUE_CODE = "ISSUE_CODE",
  ISSUE = "ISSUE",
  TIME_SER_BEG = "TIME_SER_BEG",
  SERVICE_TIME = "SERVICE_TIME",
  TIME_SER_ENDS = "TIME_SER_ENDS",
  CUST_STATE = "CUST_STATE",
  SYSTEM_STATE = "SYSTEM_STATE",
}
// how to loop through this enum?

export type UserRow = Record<IColumnHeader, cellType>;
export interface IStore {
  isLoading: boolean;
  error: null | string;
  simulationTable: cellType[][];
  rawTable: string[][];
  setTableData: (table: string[][][]) => void;
  clear: () => void;
}
