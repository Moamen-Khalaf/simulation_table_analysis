import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { getPosition } from "../utils/parseExcel";
export const tableHeaders = [
  "CLIENT_ID",
  "INTERARRIVALE_TIME",
  "ARRIVAL_TIME",
  "ISSUE_CODE",
  "ISSUE",
  "TIME_SER_BEG",
  "SERVICE_TIME",
  "TIME_SER_ENDS",
  "CUST_STATE",
  "SYSTEM_STATE",
];
interface IStore {
  isLoading: boolean;
  error: null | string;
  users: Record<string, UserRow>;
  simulationTable: string[][];
  setTableData: (table: string[][][]) => void;
  setSimulationTable: () => void;
  clear: () => void;
}
function simulate(users: UserRow[]) {
  let clock = 0;
  let lastEndTime = 0;
  const usersData = Object.values(users).map((user) => {
    clock += +user.INTERARRIVALE_TIME;
    const arrivalTime = clock;
    const serviceTime = +user.SERVICE_TIME;
    const timeServBeg = Math.max(arrivalTime, lastEndTime);
    const timeServEnds = timeServBeg + serviceTime;
    const custState =
      timeServBeg > arrivalTime ? String(timeServBeg - arrivalTime) : "SERV";
    const systemState =
      arrivalTime - lastEndTime > 0 ? arrivalTime - lastEndTime : "BUSY";
    lastEndTime = timeServEnds;
    user.ARRIVAL_TIME = arrivalTime.toString();
    user.TIME_SER_BEG = timeServBeg.toString();
    user.SERVICE_TIME = serviceTime.toString();
    user.TIME_SER_ENDS = timeServEnds.toString();
    user.CUST_STATE = custState;
    user.SYSTEM_STATE = systemState.toString();
    return user;
  });
  return usersData;
}
function processTable(table: string[][][]): UserRow[] {
  let [header, ...rows] = table[1];
  const users: Record<string, UserRow> = {};
  rows.forEach((row, rowIndex) => {
    const user: UserRow = {} as UserRow;
    header.forEach((key, index) => {
      user[key as IColumnHeader] = row[index];
    });
    user.POSITION = getPosition(0, rowIndex + 1);
    users[user.CLIENT_ID] = user;
  });
  [header, ...rows] = table[0];
  type ServiceKeys = "ISSUE_CODE" | "ISSUE" | "SERVICE_TIME";
  type service = Record<ServiceKeys, string>;
  const services: Record<string, service> = {};

  rows.forEach((row) => {
    const service: service = {} as service;
    header.forEach((key, index) => {
      service[key as ServiceKeys] = row[index];
    });
    services[service.ISSUE_CODE] = service;
  });

  const userData = Object.values(users).map((user) => {
    return { ...user, ...services[user.ISSUE_CODE] };
  });

  return Object.values(userData);
}
type IColumnHeader =
  | "CLIENT_ID"
  | "INTERARRIVALE_TIME"
  | "ARRIVAL_TIME"
  | "ISSUE_CODE"
  | "ISSUE"
  | "TIME_SER_BEG"
  | "SERVICE_TIME"
  | "TIME_SER_ENDS"
  | "CUST_STATE"
  | "SYSTEM_STATE"
  | "POSITION";

type UserRow = Record<IColumnHeader, string>;

const useSIMStore = create<IStore>()(
  devtools(
    immer((set) => ({
      isLoading: false,
      error: null,
      users: {},
      simulationTable: [],
      setSimulationTable: () => {},
      setTableData: (table: string[][][]) => {
        try {
          set(() => ({ isLoading: true }));
          let users = processTable(table);
          users = simulate(users);
          const simulationTable = [
            tableHeaders,
            ...Object.values(users).map((user) => {
              return tableHeaders.map((key) => user[key as IColumnHeader]);
            }),
          ] as string[][];
          set((state) => {
            state.simulationTable = simulationTable;
            state.users = users.reduce((acc, user) => {
              acc[user.CLIENT_ID] = user;
              return acc;
            }, {} as Record<string, UserRow>);
          });
        } catch (error) {
          set(() => ({ error: (error as Error).message }));
        } finally {
          set(() => ({ isLoading: false }));
        }
      },
      clear: () => {
        set(() => ({ simulationTable: [], users: {} }));
      },
    }))
  )
);

export default useSIMStore;
//Cust #	Interarrival tim	arrivale time	issue code 	issue	tim ser beg	ser time	time serv ends	cust state	system state
